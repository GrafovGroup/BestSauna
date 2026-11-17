import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";

export class OperationsError extends Error {
  constructor(code, message) { super(message); this.code = code; }
}
function reject(code, message) { throw new OperationsError(code, message); }
const statuses = ["new", "in_progress", "closed"];
const attention = "q.notification_status IN ('pending', 'sending', 'failed', 'unknown')";
const joined = "FROM quote_enquiries q LEFT JOIN enquiry_workflow w ON w.enquiry_id = q.id";
const overview = `q.reference, q.created_at AS createdAt, q.status, q.language,
  q.intended_use AS intendedUse, q.service, q.notification_status AS notificationStatus,
  COALESCE(w.assigned_to, '') AS assignedTo, w.follow_up_at AS followUpAt,
  w.updated_at AS updatedAt, COALESCE(w.revision, 0) AS revision`;

function reference(value) {
  if (typeof value !== "string" || !/^BS-\d{8}-[A-F0-9]{12}$/.test(value)) reject("invalid_reference", "Use the complete BS enquiry reference.");
  return value;
}
function boundedText(value, max, required = false) {
  if (typeof value !== "string" || value.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value) || (required && !value.trim())) {
    reject("invalid_update", "Operator, assignee or note is missing, invalid or too long.");
  }
  return value.trim();
}
function date(value) {
  if (value === null) return null;
  // One unambiguous UTC representation keeps ordering and due-date comparisons reliable.
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value)) {
    reject("invalid_update", "followUpAt must be a UTC ISO date-time ending in Z, or null.");
  }
  const parsed = new Date(value);
  if (!Number.isFinite(parsed.getTime()) || parsed.toISOString() !== (value.length === 20 ? value.slice(0, -1) + ".000Z" : value)) {
    reject("invalid_update", "followUpAt is not a valid calendar date-time.");
  }
  return parsed.toISOString();
}
function updateInput(input) {
  const allowed = ["expectedRevision", "operator", "status", "assignedTo", "followUpAt", "note"];
  if (!input || typeof input !== "object" || Array.isArray(input) || Object.keys(input).some(key => !allowed.includes(key))) reject("invalid_update", "Only documented workflow fields are accepted.");
  if (!Number.isSafeInteger(input.expectedRevision) || input.expectedRevision < 0) reject("invalid_update", "Supply the expectedRevision shown by list or show.");
  const result = { expectedRevision: input.expectedRevision, operator: boundedText(input.operator, 80, true) };
  if (Object.hasOwn(input, "status")) {
    if (!statuses.includes(input.status)) reject("invalid_update", "status must be new, in_progress or closed.");
    result.status = input.status;
  }
  if (Object.hasOwn(input, "assignedTo")) result.assignedTo = boundedText(input.assignedTo, 80);
  if (Object.hasOwn(input, "followUpAt")) result.followUpAt = date(input.followUpAt);
  result.note = Object.hasOwn(input, "note") ? boundedText(input.note, 2000) : "";
  return result;
}

/** Local authenticated operator access only. No HTTP handler, network calls or email delivery. */
export function openEnquiryOperations(filename, { writable = false, now = () => new Date().toISOString() } = {}) {
  if (!existsSync(filename)) reject("database_missing", "The initialized private quote database is required.");
  const db = new DatabaseSync(filename, { readOnly: !writable });
  try {
    db.exec("PRAGMA busy_timeout = 5000; PRAGMA foreign_keys = ON;");
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name IN ('quote_enquiries', 'enquiry_workflow', 'enquiry_events')").all();
    if (tables.length !== 3) reject("migration_required", "Deploy and initialize the current application migrations before using enquiry operations.");
  } catch (error) { db.close(); throw error; }

  function list({ queue = "new", limit = 20, offset = 0 } = {}) {
    if (!Number.isInteger(limit) || limit < 1 || limit > 100 || !Number.isSafeInteger(offset) || offset < 0) reject("invalid_list", "Use a limit from 1 to 100 and a nonnegative offset.");
    const filters = {
      new: "q.status = 'new'", active: "q.status != 'closed'", all: "1 = 1",
      due: "q.status != 'closed' AND w.follow_up_at <= ?",
      unassigned: "q.status != 'closed' AND COALESCE(w.assigned_to, '') = ''",
      notifications: attention,
    };
    if (!Object.hasOwn(filters, queue)) reject("invalid_list", "Unknown queue. Use new, active, due, unassigned, notifications or all.");
    const params = queue === "due" ? [now()] : [];
    const where = `WHERE ${filters[queue]}`;
    const order = queue === "due" ? "w.follow_up_at, q.created_at, q.reference" : "q.created_at, q.reference";
    // Customer names, addresses, messages and contact details are intentionally absent from queues.
    const total = db.prepare(`SELECT COUNT(*) AS count ${joined} ${where}`).get(...params).count;
    const items = db.prepare(`SELECT ${overview} ${joined} ${where} ORDER BY ${order} LIMIT ? OFFSET ?`).all(...params, limit, offset);
    return { queue, total, offset, items, nextOffset: offset + items.length < total ? offset + items.length : null };
  }
  function show(value) {
    const ref = reference(value);
    const row = db.prepare(`SELECT q.id, ${overview}, q.name, q.email, q.phone, q.location,
      q.placement, q.interest, q.timeframe, q.contact_method AS contactMethod,
      q.capacity, q.heat, q.budget, q.message, q.commercial_details AS commercialDetails,
      q.source_path AS sourcePath, q.privacy_version AS privacyVersion,
      q.notification_attempted_at AS notificationAttemptedAt,
      q.notification_accepted_at AS notificationAcceptedAt, q.notification_error AS notificationError
      ${joined} WHERE q.reference = ?`).get(ref);
    if (!row) reject("not_found", "No saved enquiry matches that reference.");
    const { id, ...enquiry } = row;
    const history = db.prepare("SELECT revision, recorded_at AS recordedAt, operator, changes, note FROM enquiry_events WHERE enquiry_id = ? ORDER BY revision DESC LIMIT 50").all(id).map(event => ({ ...event, changes: JSON.parse(event.changes) }));
    const historyTotal = db.prepare("SELECT COUNT(*) AS count FROM enquiry_events WHERE enquiry_id = ?").get(id).count;
    return { enquiry, history, historyTotal, historyTruncated: historyTotal > history.length };
  }
  function update(value, input) {
    if (!writable) reject("read_only", "Open explicitly for an update before changing an enquiry.");
    const ref = reference(value), patch = updateInput(input);
    db.exec("BEGIN IMMEDIATE");
    try {
      const row = db.prepare(`SELECT q.id, ${overview} ${joined} WHERE q.reference = ?`).get(ref);
      if (!row) reject("not_found", "No saved enquiry matches that reference.");
      if (patch.expectedRevision !== row.revision) reject("revision_conflict", "The enquiry changed. Read it again and review the latest revision before updating.");
      const next = {
        status: patch.status ?? row.status,
        assignedTo: patch.assignedTo ?? row.assignedTo,
        followUpAt: Object.hasOwn(patch, "followUpAt") ? patch.followUpAt : row.followUpAt,
      };
      if (next.status === "closed") {
        if (patch.followUpAt) reject("invalid_update", "A closed enquiry cannot have a follow-up date. Reopen it first.");
        next.followUpAt = null;
      }
      const changes = Object.fromEntries(Object.entries(next).filter(([key, after]) => after !== row[key]).map(([key, after]) => [key, { before: row[key], after }]));
      if (!Object.keys(changes).length && !patch.note) reject("no_change", "No changed fields or nonempty note were supplied.");
      const revision = row.revision + 1, recordedAt = now();
      db.prepare("UPDATE quote_enquiries SET status = ? WHERE id = ?").run(next.status, row.id);
      db.prepare(`INSERT INTO enquiry_workflow (enquiry_id, assigned_to, follow_up_at, updated_at, revision) VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(enquiry_id) DO UPDATE SET assigned_to = excluded.assigned_to, follow_up_at = excluded.follow_up_at, updated_at = excluded.updated_at, revision = excluded.revision`).run(row.id, next.assignedTo, next.followUpAt, recordedAt, revision);
      db.prepare("INSERT INTO enquiry_events (id, enquiry_id, revision, recorded_at, operator, changes, note) VALUES (?, ?, ?, ?, ?, ?, ?)").run(randomUUID(), row.id, revision, recordedAt, patch.operator, JSON.stringify(changes), patch.note);
      db.exec("COMMIT");
      return { reference: ref, revision, recordedAt, ...next, changes, noteRecorded: Boolean(patch.note) };
    } catch (error) { db.exec("ROLLBACK"); throw error; }
  }
  return {
    close: () => db.close(), list, show, update,
    summary() {
      const byStatus = Object.fromEntries(statuses.map(status => [status, 0]));
      for (const row of db.prepare("SELECT status, COUNT(*) AS count FROM quote_enquiries GROUP BY status").all()) byStatus[row.status] = row.count;
      const count = condition => db.prepare(`SELECT COUNT(*) AS count ${joined} WHERE ${condition}`).get().count;
      return { asOf: now(), byStatus, unassigned: count("q.status != 'closed' AND COALESCE(w.assigned_to, '') = ''"), due: db.prepare(`SELECT COUNT(*) AS count ${joined} WHERE q.status != 'closed' AND w.follow_up_at <= ?`).get(now()).count, notificationAttention: count(attention) };
    },
  };
}
