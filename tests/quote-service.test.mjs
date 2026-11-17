import test from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { handleQuoteRequest, MAX_QUOTE_BODY_BYTES, NOTIFICATION_TIMEOUT_MS } from "../lib/quote-service.ts";
import { publishedProducts, productQuoteMessage } from "../lib/product-catalogue.ts";
import { catalogueFixture } from "./fixtures/catalogue.mjs";
import { modelQuoteMessage } from "../lib/model-comparison.ts";
import { readServicePlan, servicePlanMessage } from "../lib/service-planner.ts";

const ORIGIN = "https://bestsauna.ca";
const SECRET = "test-only-rate-limit-secret-with-more-than-32-characters";
const NOW = Date.parse("2026-11-16T15:15:00Z");

function payload(overrides = {}) {
  return {
    name: "Élodie Test", email: "elodie@example.test", location: "Montréal H2X 1Y4",
    intendedUse: "home", placement: "outdoor", interest: "outdoor", service: "assembly",
    timeframe: "three-six", language: "fr", sourcePath: "/fr/demande-de-soumission/",
    privacyAccepted: true, website: "", ...overrides,
  };
}

function request(data = payload(), options = {}) {
  const headers = {
    Origin: ORIGIN, "Content-Type": "application/json", "CF-Connecting-IP": "192.0.2.10",
    "Idempotency-Key": options.key ?? crypto.randomUUID(), ...options.headers,
  };
  return new Request(`${ORIGIN}/api/quotes`, {
    method: "POST", headers, body: options.raw ?? JSON.stringify(data),
  });
}

function database(t) {
  const sqlite = new DatabaseSync(":memory:");
  // Exercise the actual generated production migrations, not a hand-copied test schema.
  const directory = fileURLToPath(new URL("../drizzle/", import.meta.url));
  const migrations = readdirSync(directory).filter(name => name.endsWith(".sql")).sort();
  assert.ok(migrations.length, "Generate the Drizzle migration before running intake tests");
  for (const migration of migrations) sqlite.exec(readFileSync(`${directory}/${migration}`, "utf8"));
  t.after(() => sqlite.close());

  function prepare(sql, values = []) {
    return {
      bind(...nextValues) { return prepare(sql, nextValues); },
      async first() { return sqlite.prepare(sql).get(...values) ?? null; },
      async run() { sqlite.prepare(sql).run(...values); return { success: true }; },
    };
  }
  return { sqlite, DB: { prepare }, count: () => sqlite.prepare("SELECT count(*) AS count FROM quote_enquiries").get().count };
}

function environment(store) { return { DB: store.DB, RATE_LIMIT_SECRET: SECRET }; }
async function submit(store, data = payload(), options = {}, time = NOW) {
  return handleQuoteRequest(request(data, options), environment(store), () => time);
}

test("a successful French enquiry is committed with a reference and private operational fields", async t => {
  const store = database(t);
  const response = await submit(store, payload({ message: "Un sauna pour notre chalet — merci." }));
  assert.equal(response.status, 201);
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  const result = await response.json();
  assert.deepEqual(Object.keys(result).sort(), ["notification", "ok", "reference"]);
  assert.equal(result.ok, true);
  assert.match(result.reference, /^BS-20261116-[A-F0-9]{12}$/);
  const saved = store.sqlite.prepare("SELECT * FROM quote_enquiries").get();
  assert.equal(saved.reference, result.reference);
  assert.equal(saved.name, "Élodie Test");
  assert.equal(saved.language, "fr");
  assert.equal(saved.privacy_accepted, 1);
  assert.equal(saved.status, "new");
  assert.equal(saved.contact_method, "email");
  assert.equal(saved.message, "Un sauna pour notre chalet — merci.");
  const limiter = store.sqlite.prepare("SELECT * FROM quote_rate_limits").get();
  assert.match(limiter.bucket_key, /^[a-f0-9]{64}$/);
  assert.equal(JSON.stringify(limiter).includes("192.0.2.10"), false);
});

test("server validation rejects malformed fields, unaccepted privacy and the honeypot without saving", async t => {
  const store = database(t);
  const cases = [
    [{ name: " " }, "name", "required"], [{ email: "not-an-email" }, "email", "invalid"],
    [{ location: [] }, "location", "invalid"], [{ intendedUse: "factory" }, "intendedUse", "invalid"],
    [{ placement: "roof" }, "placement", "invalid"], [{ interest: "invented-product" }, "interest", "invalid"],
    [{ service: "instant" }, "service", "invalid"], [{ timeframe: "yesterday" }, "timeframe", "invalid"],
    [{ language: "de" }, "language", "invalid"], [{ message: "a".repeat(2001) }, "message", "too_long"],
    [{ contactMethod: "phone" }, "phone", "required"], [{ phone: "hello" }, "phone", "invalid"],
    [{ sourcePath: "https://attacker.test/" }, "sourcePath", "invalid"],
    [{ sourcePath: "/fr/?email=private@example.test" }, "sourcePath", "invalid"],
    [{ privacyAccepted: 1 }, "privacyAccepted", "required"], [{ website: "https://spam.test" }, "website", "invalid"],
  ];
  for (const [overrides, field, code] of cases) {
    const response = await submit(store, payload(overrides));
    assert.equal(response.status, 422, field);
    const result = await response.json();
    assert.equal(result.error, "validation");
    assert.equal(result.fields[field], code, field);
  }
  assert.equal(store.count(), 0);
  assert.equal(store.sqlite.prepare("SELECT count(*) AS count FROM quote_rate_limits").get().count, 0);
});

test("transport rejects wrong origin, type, missing idempotency, malformed JSON and oversized bodies", async t => {
  const store = database(t);
  for (const [options, status] of [
    [{ headers: { Origin: "https://other.test" } }, 403],
    [{ headers: { "Content-Type": "text/plain" } }, 415],
    [{ headers: { "Idempotency-Key": "bad-key" } }, 400],
    [{ raw: "{" }, 400],
    [{ raw: " ".repeat(MAX_QUOTE_BODY_BYTES + 1) }, 413],
  ]) assert.equal((await submit(store, payload(), options)).status, status);
  const get = await handleQuoteRequest(new Request(`${ORIGIN}/api/quotes`), environment(store));
  assert.equal(get.status, 405);
  assert.equal(get.headers.get("Allow"), "POST");
  assert.equal(store.count(), 0);
});

test("streaming body limit works without a Content-Length header", async t => {
  const store = database(t);
  const body = new ReadableStream({ start(controller) { controller.enqueue(new Uint8Array(MAX_QUOTE_BODY_BYTES + 1)); controller.close(); } });
  const streamed = new Request(`${ORIGIN}/api/quotes`, {
    method: "POST", headers: { Origin: ORIGIN, "Content-Type": "application/json", "Idempotency-Key": crypto.randomUUID() },
    body, duplex: "half",
  });
  assert.equal((await handleQuoteRequest(streamed, environment(store))).status, 413);
  assert.equal(store.count(), 0);
});

test("a retry returns the original reference and a changed payload conflicts", async t => {
  const store = database(t);
  const key = crypto.randomUUID();
  const first = await submit(store, payload(), { key });
  const original = await first.json();
  const retry = await submit(store, payload(), { key });
  assert.equal(retry.status, 200);
  assert.deepEqual(await retry.json(), original);
  const conflict = await submit(store, payload({ service: "supply" }), { key });
  assert.equal(conflict.status, 409);
  assert.deepEqual(await conflict.json(), { ok: false, error: "conflict" });
  assert.equal(store.count(), 1);
});

test("parallel duplicate requests cannot create multiple enquiries", async t => {
  const store = database(t);
  const key = crypto.randomUUID();
  const responses = await Promise.all([submit(store, payload(), { key }), submit(store, payload(), { key })]);
  assert.deepEqual(responses.map(response => response.status).sort(), [200, 201]);
  const results = await Promise.all(responses.map(response => response.json()));
  assert.equal(results[0].reference, results[1].reference);
  assert.equal(store.count(), 1);
});

test("atomic per-IP limiter allows five, rejects the sixth, preserves replay and resets next hour", async t => {
  const store = database(t);
  const key = crypto.randomUUID();
  assert.equal((await submit(store, payload(), { key })).status, 201);
  const responses = await Promise.all(Array.from({ length: 5 }, () => submit(store)));
  assert.equal(responses.filter(response => response.status === 201).length, 4);
  const blocked = responses.find(response => response.status === 429);
  assert.ok(blocked);
  assert.equal(blocked.headers.get("Retry-After"), "2700");
  assert.equal(store.count(), 5);
  assert.equal((await submit(store, payload(), { key })).status, 200);
  assert.equal((await submit(store, payload(), { headers: { "CF-Connecting-IP": "192.0.2.11" } })).status, 201);
  assert.equal((await submit(store, payload(), {}, NOW + 3_600_000)).status, 201);
  assert.equal(store.count(), 7);
  assert.equal(store.sqlite.prepare("SELECT count(*) AS count FROM quote_rate_limits WHERE expires_at <= ?").get(Math.floor((NOW + 3_600_000) / 1000)).count, 0);
});

test("missing configuration, untrusted missing IP and failed database writes never report saved", async t => {
  const store = database(t);
  assert.equal((await handleQuoteRequest(request(), {})).status, 503);
  assert.equal((await handleQuoteRequest(request(), { DB: store.DB, RATE_LIMIT_SECRET: "short" })).status, 503);
  const noIp = request();
  noIp.headers.delete("CF-Connecting-IP");
  assert.equal((await handleQuoteRequest(noIp, environment(store))).status, 503);
  const failing = {
    ...environment(store),
    DB: { prepare(sql) { if (sql.includes("INSERT INTO quote_enquiries")) throw new Error("Sensitive provider error containing SQL"); return store.DB.prepare(sql); } },
  };
  const response = await handleQuoteRequest(request(), failing, () => NOW);
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { ok: false, error: "unavailable" });
  assert.equal(store.count(), 0);
});

test("SQL-looking user text is stored as data and cleanup failures cannot undo committed success", async t => {
  const store = database(t);
  const env = {
    ...environment(store),
    DB: { prepare(sql) { if (sql.startsWith("DELETE FROM quote_rate_limits")) throw new Error("Cleanup unavailable"); return store.DB.prepare(sql); } },
  };
  const message = "'); DROP TABLE quote_enquiries; --";
  const response = await handleQuoteRequest(request(payload({ message })), env, () => NOW);
  assert.equal(response.status, 201);
  assert.equal(store.count(), 1);
  assert.equal(store.sqlite.prepare("SELECT message FROM quote_enquiries").get().message, message);
});

function notificationEnvironment(store) { return { ...environment(store), QUOTE_EMAIL_ENABLED: "true" }; }
const acceptedByFormspree = () => new Response(JSON.stringify({ ok: true, next: '/thanks' }), { status: 200 });

test("delivery-planning responsibilities are stored and included in one mocked notification", async t => {
  const store = database(t);
  const plan = readServicePlan({ service: "managed", use: "cottage", placement: "outdoor", access: "remote", preparation: "arranged", handling: "request", connections: "unsure" });
  const message = servicePlanMessage(plan, "fr");
  const data = payload({ message, sourcePath: "/fr/livraison-installation/", intendedUse: plan.use, placement: plan.placement, service: plan.service, heat: "unsure", interest: "unsure" });
  const sent = [];
  const transport = async (_url, init) => { sent.push(JSON.parse(init.body)); return acceptedByFormspree(); };
  const response = await handleQuoteRequest(request(data), notificationEnvironment(store), () => NOW, transport);
  assert.equal(response.status, 201); assert.equal(store.count(), 1); assert.equal(sent.length, 1);
  const saved = store.sqlite.prepare("SELECT message, source_path, service FROM quote_enquiries").get();
  assert.equal(saved.message, message); assert.equal(saved.source_path, data.sourcePath); assert.equal(saved.service, "managed");
  assert.ok(sent[0].message.includes(message));
});

test("model context is saved and included in the mocked notification without new database fields", async t => {
  const store = database(t);
  const [product] = publishedProducts([catalogueFixture()], "2026-11-16");
  const message = productQuoteMessage(product, "fr");
  const data = payload({ message, sourcePath: product.paths.fr, interest: product.category, placement: product.placement, heat: product.heat });
  let notification;
  const transport = async (_url, init) => { notification = JSON.parse(init.body); return acceptedByFormspree(); };
  const response = await handleQuoteRequest(request(data), notificationEnvironment(store), () => NOW, transport);
  assert.equal(response.status, 201);
  const saved = store.sqlite.prepare("SELECT message, source_path FROM quote_enquiries").get();
  assert.equal(saved.message, message); assert.equal(saved.source_path, product.paths.fr);
  assert.ok(notification.message.includes(message));
  assert.ok(notification.message.includes(product.paths.fr));
});

test("a three-model comparison is saved and sent through the mocked notification as one enquiry", async t => {
  const store = database(t);
  const products = publishedProducts(["internal-qa-a", "internal-qa-b", "internal-qa-c"].map(catalogueFixture), "2026-11-16");
  const message = modelQuoteMessage(products, "fr");
  const data = payload({ message, sourcePath: "/fr/comparer-les-saunas/", heat: "unsure", interest: "unsure", placement: "unsure" });
  const sent = [];
  const transport = async (_url, init) => { sent.push(JSON.parse(init.body)); return acceptedByFormspree(); };
  const response = await handleQuoteRequest(request(data), notificationEnvironment(store), () => NOW, transport);
  assert.equal(response.status, 201); assert.equal(store.count(), 1); assert.equal(sent.length, 1);
  assert.equal(store.sqlite.prepare("SELECT message FROM quote_enquiries").get().message, message);
  for (const product of products) assert.ok(sent[0].message.includes(product.id));
});

test("Formspree receives one committed, readable quotation with reply-to and reference", async t => {
  const store = database(t);
  const calls = [];
  const transport = async (url, init) => {
    assert.equal(store.count(), 1, "save before notifying");
    calls.push({ url, init });
    return acceptedByFormspree();
  };
  const key = crypto.randomUUID();
  const data = payload({ intendedUse: "commercial", commercialDetails: "Hôtel — quatre utilisateurs", message: "Un sauna, merci.", budget: "20,000", heat: "electric", contactMethod: "phone", phone: "4165550100" });
  const result = await (await handleQuoteRequest(request(data, { key }), notificationEnvironment(store), () => NOW, transport)).json();
  assert.equal(result.notification, "accepted");
  const retry = await (await handleQuoteRequest(request(data, { key }), notificationEnvironment(store), () => NOW, transport)).json();
  assert.equal(retry.reference, result.reference);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, "https://formspree.io/f/mljbjqwy");
  assert.equal(calls[0].init.headers.Accept, "application/json");
  assert.equal(calls[0].init.redirect, "manual");
  assert.equal(calls[0].init.headers.Origin, ORIGIN);
  assert.equal(calls[0].init.headers.Referer, `${ORIGIN}${data.sourcePath}`);
  assert.deepEqual(Object.keys(calls[0].init.headers).sort(), ["Accept", "Content-Type", "Origin", "Referer"]);
  const outgoing = JSON.parse(calls[0].init.body);
  assert.equal(outgoing.email, data.email);
  assert.equal(outgoing.reference, result.reference);
  assert.equal(outgoing.language, "French / Français");
  assert.match(outgoing.subject, /New quote request BS-/);
  assert.match(outgoing.message, /Supply, delivery & assembly/);
  assert.match(outgoing.message, /Hôtel — quatre utilisateurs/);
  assert.match(outgoing.message, /Reply preference: Phone/);
  assert.match(outgoing.message, /Privacy notice acknowledged: 2026-11-16.4/);
  assert.doesNotMatch(calls[0].init.body, /192\.0\.2\.10|payload_hash|idempotency_key|rate_limit/);
  const saved = store.sqlite.prepare('SELECT notification_status, notification_accepted_at, notification_error FROM quote_enquiries').get();
  assert.equal(saved.notification_status, 'accepted');
  assert.equal(saved.notification_accepted_at, new Date(NOW).toISOString());
  assert.equal(saved.notification_error, null);
});

test("simultaneous retries claim only one external notification", async t => {
  const store = database(t);
  const key = crypto.randomUUID();
  let calls = 0;
  let finish;
  const transport = async () => { calls++; await new Promise(resolve => { finish = resolve; }); return acceptedByFormspree(); };
  const first = handleQuoteRequest(request(payload(), { key }), notificationEnvironment(store), () => NOW, transport);
  // Wait for the first transport to hold the database claim.
  while (!finish) await new Promise(resolve => setImmediate(resolve));
  const other = await handleQuoteRequest(request(payload(), { key }), notificationEnvironment(store), () => NOW, transport);
  assert.equal((await other.json()).notification, 'sending');
  finish();
  assert.equal((await (await first).json()).notification, 'accepted');
  assert.equal(calls, 1);
  assert.equal(store.count(), 1);
});

test("provider rejection or an uncertain response preserves the enquiry and never blindly resends", async t => {
  for (const [response, state, code] of [
    [() => new Response('', { status: 307, headers: { Location: 'https://example.com/unexpected' } }), 'failed', 'provider_redirect'],
    [() => new Response('{}', { status: 422 }), 'failed', 'provider_rejected'],
    [() => new Response('{}', { status: 429 }), 'failed', 'provider_rate_limit'],
    [() => new Response('{}', { status: 503 }), 'unknown', 'provider_unavailable'],
    [() => new Response(JSON.stringify({ ok: false })), 'unknown', 'unexpected_response'],
    [() => new Response('<html>not JSON</html>'), 'unknown', 'unexpected_response'],
    [() => { throw new DOMException('private upstream data', 'AbortError'); }, 'unknown', 'network_or_timeout'],
  ]) {
    const store = database(t);
    let calls = 0;
    const transport = async () => { calls++; return response(); };
    const key = crypto.randomUUID();
    const first = await handleQuoteRequest(request(payload(), { key }), notificationEnvironment(store), () => NOW, transport);
    assert.equal(first.status, 201);
    const body = await first.json();
    assert.equal(body.ok, true);
    assert.equal(body.notification, state);
    assert.equal(store.count(), 1);
    assert.equal(store.sqlite.prepare('SELECT notification_error FROM quote_enquiries').get().notification_error, code);
    await handleQuoteRequest(request(payload(), { key }), notificationEnvironment(store), () => NOW, transport);
    assert.equal(calls, 1);
    assert.doesNotMatch(JSON.stringify(body), /private upstream/);
  }
});

test("an outcome-write failure cannot erase the save or send a duplicate", async t => {
  const store = database(t);
  const env = { ...notificationEnvironment(store), DB: { prepare(sql) {
    if (sql.includes('SET notification_status = ?')) throw new Error('database offline');
    return store.DB.prepare(sql);
  } } };
  let calls = 0;
  const transport = async () => { calls++; return acceptedByFormspree(); };
  const key = crypto.randomUUID();
  const first = await handleQuoteRequest(request(payload(), { key }), env, () => NOW, transport);
  assert.equal(first.status, 201);
  assert.equal((await first.json()).notification, 'unknown');
  await handleQuoteRequest(request(payload(), { key }), notificationEnvironment(store), () => NOW, transport);
  assert.equal(calls, 1);
  assert.equal(store.count(), 1);
  assert.equal(store.sqlite.prepare('SELECT notification_status FROM quote_enquiries').get().notification_status, 'sending');
});

test("disabled notifications, old enquiries and invalid submissions never contact Formspree", async t => {
  const store = database(t);
  let calls = 0;
  const transport = async () => { calls++; return acceptedByFormspree(); };
  const key = crypto.randomUUID();
  const old = await handleQuoteRequest(request(payload(), { key }), environment(store), () => NOW, transport);
  assert.equal((await old.json()).notification, 'not_requested');
  const replay = await handleQuoteRequest(request(payload(), { key }), notificationEnvironment(store), () => NOW, transport);
  assert.equal((await replay.json()).notification, 'not_requested');
  const invalid = await handleQuoteRequest(request(payload({ website: 'bot' })), notificationEnvironment(store), () => NOW, transport);
  assert.equal(invalid.status, 422);
  assert.equal(calls, 0);
});

test("an unresponsive notification is aborted at its deadline without losing the saved request", async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const store = database(t);
  let signal;
  const transport = async (_url, init) => {
    signal = init.signal;
    return new Promise((_resolve, reject) => signal.addEventListener('abort', () => reject(new DOMException('Timed out', 'AbortError')), { once: true }));
  };
  const pending = handleQuoteRequest(request(), notificationEnvironment(store), () => NOW, transport);
  while (!signal) await new Promise(resolve => setImmediate(resolve));
  t.mock.timers.tick(NOTIFICATION_TIMEOUT_MS);
  const result = await pending;
  assert.equal(signal.aborted, true);
  assert.equal(result.status, 201);
  assert.equal((await result.json()).notification, 'unknown');
  assert.equal(store.count(), 1);
});

test("a failed enquiry insert never triggers an email even when notifications are enabled", async t => {
  const store = database(t);
  const env = { ...notificationEnvironment(store), DB: { prepare(sql) {
    if (sql.includes('INSERT INTO quote_enquiries')) throw new Error('database offline');
    return store.DB.prepare(sql);
  } } };
  let calls = 0;
  const response = await handleQuoteRequest(request(), env, () => NOW, async () => { calls++; return acceptedByFormspree(); });
  assert.equal(response.status, 503);
  assert.equal(calls, 0);
  assert.equal(store.count(), 0);
});
