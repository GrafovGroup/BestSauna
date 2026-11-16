import test from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { handleQuoteRequest, MAX_QUOTE_BODY_BYTES } from "../lib/quote-service.ts";

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
  assert.deepEqual(Object.keys(result).sort(), ["ok", "reference"]);
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
