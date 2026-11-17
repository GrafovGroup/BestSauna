import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

// Customer enquiries are private operational records, never public site content.
export const quoteEnquiries = sqliteTable("quote_enquiries", {
  id: text("id").primaryKey(),
  reference: text("reference").notNull().unique(),
  idempotencyKey: text("idempotency_key").notNull().unique(),
  payloadHash: text("payload_hash").notNull(),
  createdAt: text("created_at").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull().default(""),
  location: text("location").notNull(),
  intendedUse: text("intended_use", { enum: ["home", "cottage", "commercial"] }).notNull(),
  placement: text("placement", { enum: ["indoor", "outdoor", "unsure"] }).notNull(),
  interest: text("interest", { enum: ["outdoor", "indoor", "infrared", "cottage", "commercial", "heaters", "unsure"] }).notNull(),
  service: text("service", { enum: ["supply", "assembly", "managed", "unsure"] }).notNull(),
  timeframe: text("timeframe", { enum: ["soon", "three-six", "six-plus", "exploring"] }).notNull(),
  contactMethod: text("contact_method", { enum: ["email", "phone"] }).notNull().default("email"),
  capacity: text("capacity").notNull().default(""),
  heat: text("heat").notNull().default(""),
  budget: text("budget").notNull().default(""),
  message: text("message").notNull().default(""),
  commercialDetails: text("commercial_details").notNull().default(""),
  language: text("language", { enum: ["en", "fr"] }).notNull(),
  sourcePath: text("source_path").notNull(),
  privacyAccepted: integer("privacy_accepted", { mode: "boolean" }).notNull(),
  privacyVersion: text("privacy_version").notNull(),
  status: text("status", { enum: ["new", "in_progress", "closed"] }).notNull().default("new"),
  notificationStatus: text("notification_status", { enum: ["not_requested", "pending", "sending", "accepted", "failed", "unknown"] }).notNull().default("not_requested"),
  notificationAttemptedAt: text("notification_attempted_at"),
  notificationAcceptedAt: text("notification_accepted_at"),
  notificationError: text("notification_error"),
}, (table) => [index("quote_enquiries_created_at_idx").on(table.createdAt)]);

// Only HMAC-derived keys are stored. No raw IP address is written to D1.
export const quoteRateLimits = sqliteTable("quote_rate_limits", {
  bucketKey: text("bucket_key").primaryKey(),
  count: integer("count").notNull(),
  expiresAt: integer("expires_at").notNull(),
}, (table) => [index("quote_rate_limits_expires_at_idx").on(table.expiresAt)]);

// Private operator records. These are never included in public API responses or notifications.
export const enquiryWorkflow = sqliteTable("enquiry_workflow", {
  enquiryId: text("enquiry_id").primaryKey().references(() => quoteEnquiries.id, { onDelete: "cascade" }),
  assignedTo: text("assigned_to").notNull().default(""),
  followUpAt: text("follow_up_at"),
  updatedAt: text("updated_at").notNull(),
  revision: integer("revision").notNull(),
}, table => [index("enquiry_workflow_follow_up_idx").on(table.followUpAt)]);

export const enquiryEvents = sqliteTable("enquiry_events", {
  id: text("id").primaryKey(),
  enquiryId: text("enquiry_id").notNull().references(() => quoteEnquiries.id, { onDelete: "cascade" }),
  revision: integer("revision").notNull(),
  recordedAt: text("recorded_at").notNull(),
  operator: text("operator").notNull(),
  changes: text("changes").notNull(),
  note: text("note").notNull().default(""),
}, table => [uniqueIndex("enquiry_events_revision_idx").on(table.enquiryId, table.revision)]);

// Aggregate first-party funnel counts. No customer identifiers, form values or URLs with queries.
export const measurementDaily = sqliteTable("measurement_daily", {
  day: text("day").notNull(), event: text("event").notNull(), entryPath: text("entry_path").notNull(),
  language: text("language").notNull(), device: text("device").notNull(), detail: text("detail").notNull(),
  count: integer("count").notNull().default(0),
}, table => [uniqueIndex("measurement_daily_dimensions_idx").on(table.day, table.event, table.entryPath, table.language, table.device, table.detail)]);

// Short-lived deduplication receipts use hashes of random event IDs, never enquiry/visitor IDs.
export const measurementReceipts = sqliteTable("measurement_receipts", {
  token: text("token").primaryKey(), day: text("day").notNull(), event: text("event").notNull(),
  entryPath: text("entry_path").notNull(), language: text("language").notNull(), device: text("device").notNull(),
  detail: text("detail").notNull(), expiresAt: integer("expires_at").notNull(),
}, table => [index("measurement_receipts_expires_idx").on(table.expiresAt)]);
