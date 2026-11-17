import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync, cpSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { openQuoteDatabase } from "../whc/database.mjs";
import { currentClientAddress, withClientAddress, clientAddressFromRequest } from "../whc/request-context.mjs";
import { handleQuoteRequest } from "../lib/quote-service.ts";

const migrations = fileURLToPath(new URL("../drizzle", import.meta.url));
const origin = "https://bestsauna.ca";
const secret = "WHC-test-only-secret-more-than-thirty-two-characters";
const data = { name: "WHC Test", email: "whc@example.test", location: "Toronto", intendedUse: "home", placement: "outdoor", interest: "outdoor", service: "supply", timeframe: "exploring", language: "en", sourcePath: "/en/request-a-quote/", privacyAccepted: true };
function request(key = crypto.randomUUID(), ip = "198.51.100.7") {
  return new Request(origin + "/api/quotes", { method: "POST", headers: { Origin: origin, "Content-Type": "application/json", "Idempotency-Key": key, "CF-Connecting-IP": ip, "X-Forwarded-For": ip }, body: JSON.stringify(data) });
}
function directory(t) {
  const folder = mkdtempSync(join(tmpdir(), "bestsauna-whc-test-"));
  t.after(() => rmSync(folder, { recursive: true, force: true }));
  return folder;
}

test("WHC storage survives restart and applies migrations once", async t => {
  const file = join(directory(t), "quotes.sqlite");
  let DB = openQuoteDatabase(file, migrations);
  const key = crypto.randomUUID();
  const first = await handleQuoteRequest(request(key), { DB, RATE_LIMIT_SECRET: secret, CLIENT_IP: "192.0.2.9" });
  assert.equal(first.status, 201);
  const saved = await first.json();
  DB.close();
  DB = openQuoteDatabase(file, migrations);
  t.after(() => DB.close());
  const retry = await handleQuoteRequest(request(key), { DB, RATE_LIMIT_SECRET: secret, CLIENT_IP: "192.0.2.9" });
  assert.equal(retry.status, 200);
  assert.deepEqual(await retry.json(), saved);
  assert.equal((await DB.prepare("SELECT count(*) AS count FROM quote_enquiries").first()).count, 1);
  assert.equal((await DB.prepare("SELECT count(*) AS count FROM bestsauna_migrations").first()).count, 2);
});

test("WHC refuses changed historical migrations without damaging saved data", async t => {
  const folder = directory(t), copy = join(folder, "migrations"), file = join(folder, "quotes.sqlite");
  cpSync(migrations, copy, { recursive: true });
  const DB = openQuoteDatabase(file, copy); DB.close();
  writeFileSync(join(copy, "0000_purple_scarlet_spider.sql"), "DROP TABLE quote_enquiries;");
  assert.throws(() => openQuoteDatabase(file, copy), /migration has changed/);
  const reopened = openQuoteDatabase(file, migrations); t.after(() => reopened.close());
  assert.equal((await reopened.prepare("SELECT count(*) AS count FROM quote_enquiries").first()).count, 0);
});

test("WHC socket identity defeats forged forwarding headers and requires server context", async t => {
  const DB = openQuoteDatabase(join(directory(t), "quotes.sqlite"), migrations); t.after(() => DB.close());
  const env = { DB, RATE_LIMIT_SECRET: secret, CLIENT_IP: "192.0.2.9" };
  for (let index = 0; index < 5; index++) assert.equal((await handleQuoteRequest(request(undefined, `198.51.100.${index}`), env)).status, 201);
  assert.equal((await handleQuoteRequest(request(undefined, "198.51.100.200"), env)).status, 429);
  assert.equal((await handleQuoteRequest(request(), { ...env, CLIENT_IP: null })).status, 503);
});

test("WHC request context remains isolated across simultaneous requests", async () => {
  assert.equal(currentClientAddress(), null);
  const values = await Promise.all(["192.0.2.1", "192.0.2.2"].map(address => withClientAddress(address, async () => {
    await new Promise(resolve => setTimeout(resolve, 5));
    return currentClientAddress();
  })));
  assert.deepEqual(values, ["192.0.2.1", "192.0.2.2"]);
  assert.equal(currentClientAddress(), null);
});

test("Passenger uses its protected client-address header and direct servers ignore it", () => {
  const request = { headers: { "!~passenger-client-address": "192.0.2.50", "x-forwarded-for": "198.51.100.7" }, socket: { remoteAddress: "127.0.0.1" } };
  assert.equal(clientAddressFromRequest(request, true), "192.0.2.50");
  assert.equal(clientAddressFromRequest(request, false), "127.0.0.1");
  delete request.headers["!~passenger-client-address"];
  assert.equal(clientAddressFromRequest(request, true), null);
});

test("WHC validates Origin against its configured public URL behind the proxy", async t => {
  const DB = openQuoteDatabase(join(directory(t), "quotes.sqlite"), migrations); t.after(() => DB.close());
  const publicRequest = request();
  const internalRequest = new Request("http://localhost:5173/api/quotes/", publicRequest);
  const env = { DB, RATE_LIMIT_SECRET: secret, CLIENT_IP: "192.0.2.9", SITE_ORIGIN: origin };
  assert.equal((await handleQuoteRequest(internalRequest, env)).status, 201);
  const hostile = request(); hostile.headers.set("Origin", "https://other.example");
  assert.equal((await handleQuoteRequest(hostile, env)).status, 403);
});

test("LiteSpeed uses only its appended peer and spoofed prefixes cannot evade limits", async t => {
  const DB = openQuoteDatabase(join(directory(t), "quotes.sqlite"), migrations); t.after(() => DB.close());
  for (let index = 0; index < 6; index++) {
    const incoming = { headers: { "x-forwarded-for": `198.51.100.${index}, 198.51.100.${index},192.0.2.9`, "x-real-ip": "198.51.100.200" }, socket: { remoteAddress: "127.0.0.1" } };
    const address = clientAddressFromRequest(incoming, false, true);
    assert.equal(address, "192.0.2.9");
    const result = await handleQuoteRequest(request(), { DB, RATE_LIMIT_SECRET: secret, CLIENT_IP: address });
    assert.equal(result.status, index < 5 ? 201 : 429);
  }
  const otherVisitor = clientAddressFromRequest({ headers: { "x-forwarded-for": "192.0.2.10" }, socket: { remoteAddress: "127.0.0.1" } }, false, true);
  assert.equal((await handleQuoteRequest(request(), { DB, RATE_LIMIT_SECRET: secret, CLIENT_IP: otherVisitor })).status, 201);
});

test("LiteSpeed fails closed without a valid appended peer; direct Node ignores forwarding", () => {
  for (const value of [undefined, "", "192.0.2.1,", "192.0.2.1, invalid", ["192.0.2.1"], "1.2.3.999"]) {
    const incoming = { headers: { "x-forwarded-for": value }, socket: { remoteAddress: "127.0.0.1" } };
    assert.equal(clientAddressFromRequest(incoming, false, true), null);
    assert.equal(clientAddressFromRequest(incoming, false, false), "127.0.0.1");
  }
  assert.equal(clientAddressFromRequest({ headers: { "x-forwarded-for": "forged, 2001:DB8::1" }, socket: {} }, false, true), "2001:db8::1");
});
