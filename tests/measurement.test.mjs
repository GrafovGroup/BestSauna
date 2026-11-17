import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";
import { openQuoteDatabase } from "../whc/database.mjs";
import { measurementReport } from "../whc/measurement.mjs";
import { handleMeasurementRequest, normalizeMeasurementContext, cleanupMeasurement } from "../lib/measurement-service.ts";
import { handleQuoteRequest } from "../lib/quote-service.ts";

const origin = "https://bestsauna.ca", timestamp = Date.parse("2026-11-17T12:00:00Z"), now = () => timestamp;
const context = { entryPath: "/en/saunas/", language: "en", device: "small" };
const event = (name = "quote_view", detail = "", id = crypto.randomUUID()) => ({ id, event: name, detail });
const request = (events = [event()], change = {}) => new Request(origin + "/api/measurement/", { method: "POST", headers: { Origin: origin, "Content-Type": "application/json" }, body: JSON.stringify({ context, events, ...change }) });
function fixture(t) {
  const directory = mkdtempSync(join(tmpdir(), "bestsauna-measurement-")), file = join(directory, "quotes.sqlite");
  const DB = openQuoteDatabase(file, fileURLToPath(new URL("../drizzle", import.meta.url))), raw = new DatabaseSync(file);
  t.after(() => { raw.close(); DB.close(); rmSync(directory, { recursive: true, force: true }); });
  return { DB, raw, env: { DB, RATE_LIMIT_SECRET: "measurement-tests-private-secret-at-least-thirty-two", CLIENT_IP: "192.0.2.1", MEASUREMENT_ENABLED: "true" } };
}
const count = raw => raw.prepare("SELECT COALESCE(SUM(count),0) AS n FROM measurement_daily").get().n;

test("fixed-label events aggregate atomically and a receipt retry counts once", async t => {
  const { env, raw } = fixture(t), item = event();
  assert.equal((await handleMeasurementRequest(request([item]), env, now)).status, 204);
  assert.equal((await handleMeasurementRequest(request([{ ...item, id: item.id.toUpperCase() }]), env, now)).status, 204);
  assert.equal(count(raw), 1);
  await handleMeasurementRequest(request([event("validation_client", "email"), event("validation_client", "location")]), env, now);
  assert.equal(count(raw), 3);
  const rows = JSON.stringify(raw.prepare("SELECT * FROM measurement_receipts").all());
  assert.equal(rows.includes(item.id), false);
  assert.equal(rows.includes("192.0.2.1"), false);
  assert.equal(rows.includes("@"), false);
});

test("measurement refuses personal values, arbitrary URLs, query strings and forged success", async t => {
  const { env, raw } = fixture(t);
  for (const change of [{ email: "private@example.test" }, { context: { ...context, entryPath: "/en/?email=private@example.test" } }, { context: { ...context, entryPath: "https://other.test/" } }, { context: { ...context, referrer: "https://other.test/" } }, { context: { ...context, device: "a unique device" } }]) {
    assert.equal((await handleMeasurementRequest(request([event()], change), env, now)).status, 422);
  }
  for (const events of [[event("quote_saved")], [event("validation_client", "private@example.test")], [{ ...event(), name: "Private name" }], [{ ...event(), id: "customer-id" }], Array.from({ length: 25 }, () => event())]) assert.equal((await handleMeasurementRequest(request(events), env, now)).status, 422);
  assert.equal(normalizeMeasurementContext(null), null);
  assert.equal(count(raw), 0);
});

test("collection enforces origin, privacy signals, configuration and bounded streaming input", async t => {
  const { env, raw } = fixture(t);
  for (const header of ["DNT", "Sec-GPC"]) { const req = request(); req.headers.set(header, "1"); assert.equal((await handleMeasurementRequest(req, env, now)).status, 204); }
  assert.equal((await handleMeasurementRequest(request(), { ...env, MEASUREMENT_ENABLED: "false" }, now)).status, 204);
  const hostile = request(); hostile.headers.set("Origin", "https://other.test");
  assert.equal((await handleMeasurementRequest(hostile, env, now)).status, 403);
  const oversized = new Request(origin + "/api/measurement/", { method: "POST", headers: { Origin: origin, "Content-Type": "application/json" }, body: "x".repeat(8193) });
  assert.equal((await handleMeasurementRequest(oversized, env, now)).status, 413);
  assert.equal((await handleMeasurementRequest(new Request(origin), env, now)).status, 405);
  assert.equal((await handleMeasurementRequest(request(), { ...env, CLIENT_IP: null }, now)).status, 503);
  assert.equal(count(raw), 0);
});

test("measurement rate limits are capped and independent from quote intake", async t => {
  const { env, raw } = fixture(t);
  for (let i = 0; i < 121; i++) {
    const req = request(); req.headers.set("X-Forwarded-For", `198.51.100.${i}`);
    assert.equal((await handleMeasurementRequest(req, env, now)).status, i < 120 ? 204 : 429);
  }
  assert.equal(count(raw), 120);
  assert.equal(raw.prepare("SELECT count FROM quote_rate_limits").get().count, 120);
  assert.equal((await handleQuoteRequest(quoteRequest(), env, now)).status, 201);
});

const brief = { name: "Measurement QA", email: "qa@example.test", location: "Toronto", intendedUse: "home", placement: "outdoor", interest: "outdoor", service: "supply", timeframe: "exploring", language: "en", sourcePath: "/en/request-a-quote/", privacyAccepted: true };
function quoteRequest(key = crypto.randomUUID(), measurement = context) {
  return new Request(origin + "/api/quotes/", { method: "POST", headers: { Origin: origin, "Content-Type": "application/json", "Idempotency-Key": key }, body: JSON.stringify({ ...brief, measurement }) });
}
test("only a new saved request counts; attribution changes cannot defeat quote idempotency", async t => {
  const { env, raw } = fixture(t), key = crypto.randomUUID();
  const first = await handleQuoteRequest(quoteRequest(key), env, now);
  assert.equal(first.status, 201);
  const retry = await handleQuoteRequest(quoteRequest(key, { ...context, device: "large" }), env, now);
  assert.equal(retry.status, 200);
  assert.equal((await first.json()).reference, (await retry.json()).reference);
  assert.equal(count(raw), 1);
  assert.equal(raw.prepare("SELECT event FROM measurement_daily").get().event, "quote_saved");
  const optedOut = quoteRequest(); optedOut.headers.set("DNT", "1");
  assert.equal((await handleQuoteRequest(optedOut, env, now)).status, 201);
  assert.equal((await handleQuoteRequest(quoteRequest(undefined, { ...context, email: "private@example.test" }), env, now)).status, 201);
  assert.equal(count(raw), 1);
  assert.equal(JSON.stringify(raw.prepare("SELECT * FROM quote_enquiries").all()).includes('"entryPath"'), false);
});

test("failed aggregate writes roll back their receipts and never fail a saved enquiry", async t => {
  const { env, raw } = fixture(t);
  raw.exec("CREATE TRIGGER fail_measurement BEFORE INSERT ON measurement_daily BEGIN SELECT RAISE(ABORT, 'test failure'); END;");
  assert.equal((await handleMeasurementRequest(request(), env, now)).status, 503);
  assert.equal(raw.prepare("SELECT COUNT(*) AS n FROM measurement_receipts").get().n, 0);
  assert.equal((await handleQuoteRequest(quoteRequest(), env, now)).status, 201);
  assert.equal(raw.prepare("SELECT COUNT(*) AS n FROM quote_enquiries").get().n, 1);
});

test("receipt and aggregate retention clean up independently while preserving current counts", async t => {
  const { env, raw, DB } = fixture(t);
  await handleMeasurementRequest(request(), env, now);
  await cleanupMeasurement(DB, timestamp + 2 * 86400000);
  assert.equal(raw.prepare("SELECT COUNT(*) AS n FROM measurement_receipts").get().n, 0);
  assert.equal(count(raw), 1);
  await cleanupMeasurement(DB, timestamp + 92 * 86400000);
  assert.equal(count(raw), 0);
});

test("private reporting groups only aggregate dimensions and validates its date range", async t => {
  const { env, raw } = fixture(t);
  await handleMeasurementRequest(request([event("quote_start"), event("validation_client", "email")]), env, now);
  const result = measurementReport(raw, { days: 7, by: "field", now: timestamp });
  assert.equal(result.from, "2026-11-11");
  assert.deepEqual(result.breakdown.map(row => ({ ...row })), [{ dimension: "email", event: "validation_client", count: 1 }]);
  assert.throws(() => measurementReport(raw, { days: 91 }));
  assert.throws(() => measurementReport(raw, { by: "email" }));
});

test("browser measurement excludes query/values, deduplicates stages and respects privacy signals", async t => {
  const originals = Object.fromEntries(["window", "document", "navigator", "fetch"].map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  t.after(() => { for (const [key, descriptor] of Object.entries(originals)) { if (descriptor) Object.defineProperty(globalThis, key, descriptor); else delete globalThis[key]; } });
  const items = new Map(), sent = [];
  Object.defineProperty(globalThis, "window", { configurable: true, value: { location: { pathname: "/en/saunas/", search: "?email=private@example.test" }, innerWidth: 390, sessionStorage: { getItem: key => items.get(key) || null, setItem: (key, value) => items.set(key, value), removeItem: key => items.delete(key) } } });
  Object.defineProperty(globalThis, "document", { configurable: true, value: { documentElement: { dataset: { measurement: "on" } } } });
  Object.defineProperty(globalThis, "navigator", { configurable: true, value: { doNotTrack: "0", globalPrivacyControl: false } });
  globalThis.fetch = async (_url, init) => { sent.push(JSON.parse(init.body)); return new Response(null, { status: 204 }); };
  const client = await import("../lib/measurement-client.ts");
  client.captureMeasurementEntry(); client.trackMeasurement("en", "quote_view"); client.trackMeasurement("fr", "quote_view");
  assert.equal(sent.length, 1);
  assert.equal(sent[0].context.device, "small");
  assert.equal(sent[0].context.entryPath, "/en/saunas/");
  assert.equal(JSON.stringify([...items]).includes("private@"), false);
  client.trackMeasurement("en", "validation_client", ["email", "private@example.test"]);
  assert.equal(sent[1].events.length, 1);
  navigator.globalPrivacyControl = true;
  client.captureMeasurementEntry(); client.trackMeasurement("en", "quote_start");
  assert.equal(sent.length, 2); assert.equal(items.size, 0);
  navigator.globalPrivacyControl = false; navigator.doNotTrack = "1";
  assert.equal(client.measurementContext("en"), undefined);
});
