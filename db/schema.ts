import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

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
}, (table) => [index("quote_enquiries_created_at_idx").on(table.createdAt)]);

// Only HMAC-derived keys are stored. No raw IP address is written to D1.
export const quoteRateLimits = sqliteTable("quote_rate_limits", {
  bucketKey: text("bucket_key").primaryKey(),
  count: integer("count").notNull(),
  expiresAt: integer("expires_at").notNull(),
}, (table) => [index("quote_rate_limits_expires_at_idx").on(table.expiresAt)]);
