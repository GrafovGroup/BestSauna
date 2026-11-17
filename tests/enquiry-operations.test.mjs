import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync, cpSync, existsSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { DatabaseSync } from "node:sqlite";
import { openQuoteDatabase } from "../whc/database.mjs";
import { openEnquiryOperations } from "../whc/enquiry-operations.mjs";
import { handleQuoteRequest } from "../lib/quote-service.ts";

const migrations = fileURLToPath(new URL("../drizzle", import.meta.url));
const cli = fileURLToPath(new URL("../whc/enquiries.mjs", import.meta.url));
const now = () => "2026-11-17T12:00:00.000Z";
const secret = "operations-test-only-secret-at-least-thirty-two-characters";
const brief = { name: "Private test customer", email: "operator-test@example.test", location: "Toronto", intendedUse: "home", placement: "outdoor", interest: "outdoor", service: "supply", timeframe: "exploring", language: "en", sourcePath: "/en/request-a-quote/", privacyAccepted: true };
const request = (key = crypto.randomUUID()) => new Request("https://bestsauna.ca/api/quotes/", { method: "POST", headers: { Origin: "https://bestsauna.ca", "Content-Type": "application/json", "Idempotency-Key": key }, body: JSON.stringify(brief) });
function folder(t) {
  const path = mkdtempSync(join(tmpdir(), "bestsauna-operations-test-"));
  t.after(() => rmSync(path, { recursive: true, force: true }));
  return path;
}
async function fixture(t, count = 1) {
  const directory = folder(t), file = join(directory, "quotes.sqlite");
  const DB = openQuoteDatabase(file, migrations); t.after(() => DB.close());
  const refs = [], keys = [];
  for (let i = 0; i < count; i++) {
    const key = crypto.randomUUID(); keys.push(key);
    const response = await handleQuoteRequest(request(key), { DB, RATE_LIMIT_SECRET: secret, CLIENT_IP: `192.0.2.${i + 1}` });
    assert.equal(response.status, 201); refs.push((await response.json()).reference);
  }
  const store = openEnquiryOperations(file, { writable: true, now }); t.after(() => store.close());
  return { directory, file, DB, refs, keys, store };
}
const patch = (expectedRevision = 0, extra = {}) => ({ expectedRevision, operator: "Test operator", ...extra });
const hasCode = code => error => error.code === code;

test("additive workflow migration preserves an existing enquiry and starts at revision zero", async t => {
  const directory = folder(t), old = join(directory, "old-migrations"), file = join(directory, "quotes.sqlite");
  cpSync(migrations, old, { recursive: true, filter: path => !path.endsWith("0002_sloppy_glorian.sql") });
  let DB = openQuoteDatabase(file, old);
  const response = await handleQuoteRequest(request(), { DB, RATE_LIMIT_SECRET: secret, CLIENT_IP: "192.0.2.1" });
  const ref = (await response.json()).reference;
  const before = await DB.prepare("SELECT * FROM quote_enquiries").first(); DB.close();
  assert.throws(() => openEnquiryOperations(file), hasCode("migration_required"));
  DB = openQuoteDatabase(file, migrations); t.after(() => DB.close());
  assert.deepEqual(await DB.prepare("SELECT * FROM quote_enquiries").first(), before);
  const store = openEnquiryOperations(file); t.after(() => store.close());
  assert.equal(store.show(ref).enquiry.revision, 0);
  assert.equal(store.show(ref).historyTotal, 0);
});

test("queues prioritize due work, paginate deterministically and omit customer details", async t => {
  const { store, refs, DB } = await fixture(t, 3);
  store.update(refs[0], patch(0, { assignedTo: "Operator A", followUpAt: "2026-11-17T11:00:00Z", status: "in_progress" }));
  store.update(refs[1], patch(0, { followUpAt: "2026-11-18T09:00:00Z" }));
  store.update(refs[2], patch(0, { status: "closed" }));
  await DB.prepare("UPDATE quote_enquiries SET notification_status = 'unknown' WHERE reference = ?").bind(refs[2]).run();
  assert.deepEqual(store.summary(), { asOf: now(), byStatus: { new: 1, in_progress: 1, closed: 1 }, unassigned: 1, due: 1, notificationAttention: 1 });
  assert.equal(store.list({ queue: "due" }).items[0].reference, refs[0]);
  assert.equal(store.list({ queue: "notifications" }).items[0].reference, refs[2]);
  assert.equal(store.list({ queue: "unassigned" }).items[0].reference, refs[1]);
  const first = store.list({ queue: "all", limit: 2 });
  const last = store.list({ queue: "all", limit: 2, offset: first.nextOffset });
  assert.equal(new Set([...first.items, ...last.items].map(item => item.reference)).size, 3);
  assert.equal(last.nextOffset, null);
  for (const field of ["email", "phone", "name", "location", "message", "idempotencyKey", "payloadHash"]) assert.equal(Object.hasOwn(first.items[0], field), false);
  for (const options of [{ queue: "toString" }, { queue: "invalid" }, { limit: 0 }, { limit: 101 }, { offset: -1 }]) assert.throws(() => store.list(options), hasCode("invalid_list"));
});

test("assignment, closure and reopening record before/after history without editing the brief", async t => {
  const { store, refs: [ref], DB } = await fixture(t);
  const original = await DB.prepare("SELECT * FROM quote_enquiries WHERE reference = ?").bind(ref).first();
  const first = store.update(ref, patch(0, { assignedTo: "Operator A", followUpAt: "2026-11-18T12:00:00Z", status: "in_progress", note: "Requested site measurements; no supplier promise." }));
  assert.equal(first.revision, 1);
  assert.equal(first.followUpAt, "2026-11-18T12:00:00.000Z");
  assert.equal(store.update(ref, patch(1, { status: "closed" })).followUpAt, null);
  assert.throws(() => store.update(ref, patch(2, { followUpAt: "2026-11-18T12:00:00Z" })), hasCode("invalid_update"));
  store.update(ref, patch(2, { status: "in_progress", followUpAt: "2026-11-20T12:00:00Z" }));
  store.update(ref, patch(3, { note: "Customer's question: '); DROP TABLE quote_enquiries; --" }));
  const { enquiry, history, historyTotal } = store.show(ref);
  assert.equal(historyTotal, 4);
  assert.deepEqual(history[2].changes.followUpAt, { before: "2026-11-18T12:00:00.000Z", after: null });
  assert.deepEqual(history[0].changes, {});
  assert.equal(enquiry.email, brief.email);
  const after = await DB.prepare("SELECT * FROM quote_enquiries WHERE reference = ?").bind(ref).first();
  assert.deepEqual({ ...after, status: original.status }, { ...original });
  assert.equal(JSON.stringify(store.show(ref)).includes(original.idempotency_key), false);
  assert.equal(JSON.stringify(store.show(ref)).includes(original.payload_hash), false);
});

test("two operators cannot overwrite a revision and duplicate updates add no second event", async t => {
  const { store, file, refs: [ref] } = await fixture(t);
  const other = openEnquiryOperations(file, { writable: true, now }); t.after(() => other.close());
  assert.equal(other.show(ref).enquiry.revision, 0);
  const change = patch(0, { assignedTo: "Operator A", note: "First review" });
  store.update(ref, change);
  assert.throws(() => other.update(ref, patch(0, { assignedTo: "Operator B" })), hasCode("revision_conflict"));
  assert.throws(() => store.update(ref, change), hasCode("revision_conflict"));
  assert.equal(other.show(ref).enquiry.assignedTo, "Operator A");
  assert.equal(other.show(ref).historyTotal, 1);
  const reader = openEnquiryOperations(file); t.after(() => reader.close());
  assert.throws(() => reader.update(ref, patch(1, { note: "Denied" })), hasCode("read_only"));
});

test("invalid dates, unsupported fields and empty updates leave the record untouched", async t => {
  const { store, refs: [ref] } = await fixture(t);
  for (const input of [null, [], {}, patch(-1), patch(0, { operator: "" }), patch(0, { status: "paid" }), patch(0, { email: "changed@example.test" }), patch(0, { note: "x".repeat(2001) }), patch(0, { assignedTo: null }), ...["2026-02-30T10:00:00Z", "2026-11-18", "2026-11-18T10:00:00-05:00", "invalid"].map(followUpAt => patch(0, { followUpAt }))]) {
    assert.throws(() => store.update(ref, input), hasCode("invalid_update"));
  }
  assert.throws(() => store.update(ref, patch(0)), hasCode("no_change"));
  assert.equal(store.show(ref).historyTotal, 0);
  assert.throws(() => store.show("' OR 1=1 --"), hasCode("invalid_reference"));
  assert.throws(() => store.show("BS-20261117-FFFFFFFFFFFF"), hasCode("not_found"));
});

test("an audit write failure rolls back every workflow change", async t => {
  const { store, file, refs: [ref] } = await fixture(t);
  const raw = new DatabaseSync(file); t.after(() => raw.close());
  raw.exec("CREATE TRIGGER reject_event BEFORE INSERT ON enquiry_events BEGIN SELECT RAISE(ABORT, 'test failure'); END;");
  assert.throws(() => store.update(ref, patch(0, { status: "closed", assignedTo: "Operator A", note: "Must roll back" })));
  assert.equal(store.show(ref).enquiry.status, "new");
  assert.equal(store.show(ref).enquiry.revision, 0);
  assert.equal(store.show(ref).historyTotal, 0);
  raw.exec("DROP TRIGGER reject_event;");
  assert.equal(store.update(ref, patch(0, { note: "Retry after recovery" })).revision, 1);
});

test("customer retries retain the same reference and cannot retrieve operator notes", async t => {
  const { store, DB, refs: [ref], keys: [key] } = await fixture(t);
  store.update(ref, patch(0, { note: "PRIVATE OPERATOR NOTE", status: "in_progress" }));
  const retry = await handleQuoteRequest(request(key), { DB, RATE_LIMIT_SECRET: secret, CLIENT_IP: "192.0.2.1" });
  assert.equal(retry.status, 200);
  const result = await retry.json();
  assert.equal(result.reference, ref);
  assert.equal(JSON.stringify(result).includes("PRIVATE"), false);
  assert.equal(store.show(ref).enquiry.status, "in_progress");
  await DB.prepare("DELETE FROM quote_enquiries WHERE reference = ?").bind(ref).run();
  assert.equal((await DB.prepare("SELECT count(*) AS count FROM enquiry_workflow").first()).count, 0);
  assert.equal((await DB.prepare("SELECT count(*) AS count FROM enquiry_events").first()).count, 0);
});

test("a pending notification retry never includes private workflow notes", async t => {
  const { store, DB, refs: [ref], keys: [key] } = await fixture(t);
  // Model a saved request whose process stopped before claiming its initial notification.
  await DB.prepare("UPDATE quote_enquiries SET notification_status = 'pending' WHERE reference = ?").bind(ref).run();
  store.update(ref, patch(0, { assignedTo: "PRIVATE ASSIGNEE", note: "PRIVATE INTERNAL NOTE" }));
  let sent = 0, outgoing;
  const transport = async (_url, init) => { sent++; outgoing = init.body; return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } }); };
  const env = { DB, RATE_LIMIT_SECRET: secret, CLIENT_IP: "192.0.2.1", QUOTE_EMAIL_ENABLED: "true" };
  const response = await handleQuoteRequest(request(key), env, Date.now, transport);
  assert.equal((await response.json()).notification, "accepted");
  assert.equal(outgoing.includes("PRIVATE"), false);
  store.update(ref, patch(1, { note: "Private follow-up" }));
  await handleQuoteRequest(request(key), env, Date.now, transport);
  assert.equal(sent, 1);
});

test("CLI bounds stdin, rejects malformed arguments and hides configuration failures", async t => {
  const { directory, refs: [ref], store } = await fixture(t);
  const env = { ...process.env, BESTSAUNA_CONFIG_FILE: "", BESTSAUNA_DATA_DIR: directory };
  const run = (args, input) => spawnSync(process.execPath, [cli, ...args], { env, input, encoding: "utf8" });
  assert.equal(run(["summary"]).status, 0);
  assert.equal(JSON.parse(run(["list"]).stdout).items.length, 1);
  const content = JSON.stringify(patch(0, { note: "CLI private note" }));
  const updated = run(["update", ref], content);
  assert.equal(updated.status, 0, updated.stderr);
  assert.equal(JSON.parse(updated.stdout).revision, 1);
  assert.equal(run(["update", ref], content).status, 2);
  assert.equal(run(["update", ref], "x".repeat(8193)).status, 1);
  assert.equal(run(["update", ref], "{").status, 1);
  assert.equal(run(["list", "--limit", "1e2"]).status, 1);
  assert.equal(run(["list", "toString", "1"]).status, 1);
  assert.equal(run(["show", ref, "--unexpected"]).status, 1);
  assert.equal(store.show(ref).historyTotal, 1);
  const missing = spawnSync(process.execPath, [cli, "summary"], { env: { ...env, BESTSAUNA_CONFIG_FILE: "/private/SECRET-RUNTIME-PATH" }, encoding: "utf8" });
  assert.equal(missing.status, 1);
  assert.equal(missing.stderr.includes("SECRET-RUNTIME-PATH"), false);
  assert.equal(run(["--help"]).status, 0);
});

test("private CLI refuses missing databases and symbolic links without creating storage", async t => {
  const empty = folder(t);
  const run = directory => spawnSync(process.execPath, [cli, "summary"], { env: { ...process.env, BESTSAUNA_CONFIG_FILE: "", BESTSAUNA_DATA_DIR: directory }, encoding: "utf8" });
  assert.equal(run(empty).status, 1);
  assert.equal(existsSync(join(empty, "quotes.sqlite")), false);
  const { file } = await fixture(t);
  symlinkSync(file, join(empty, "quotes.sqlite"));
  assert.equal(run(empty).status, 1);
});
