/** Private quotation intake. Success means committed storage, never email delivery. */
export const MAX_QUOTE_BODY_BYTES = 16 * 1024;
export const QUOTE_RATE_LIMIT = 5;
export const PRIVACY_NOTICE_VERSION = "2026-11-16.2";

const VALUES = {
  intendedUse: ["home", "cottage", "commercial"],
  placement: ["indoor", "outdoor", "unsure"],
  interest: ["outdoor", "indoor", "infrared", "cottage", "commercial", "heaters", "unsure"],
  service: ["supply", "assembly", "managed", "unsure"],
  timeframe: ["soon", "three-six", "six-plus", "exploring"],
  contactMethod: ["email", "phone"],
  language: ["en", "fr"],
} as const;

type SqlValue = string | number | null;
export interface QuoteStatement {
  bind(...values: SqlValue[]): QuoteStatement;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  run(): Promise<{ success: boolean }>;
}
export interface QuoteDatabase {
  prepare(query: string): QuoteStatement;
}
export interface QuoteEnvironment {
  DB?: QuoteDatabase;
  RATE_LIMIT_SECRET?: string;
}
interface SavedKey { reference: string; payload_hash: string }
type FieldErrors = Record<string, string>;

function json(body: Record<string, unknown>, status: number, extraHeaders: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...extraHeaders,
    },
  });
}

function error(code: string, status: number, headers?: Record<string, string>) {
  return json({ ok: false, error: code }, status, headers);
}

function validate(raw: unknown) {
  const fields: FieldErrors = {};
  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) {
    return { fields: { form: "invalid" } };
  }
  const input = raw as Record<string, unknown>;
  const text = (key: string, max: number, required = false) => {
    const value = input[key];
    if (value === undefined || value === null || value === "") {
      if (required) fields[key] = "required";
      return "";
    }
    if (typeof value !== "string") {
      fields[key] = "invalid";
      return "";
    }
    const result = value.trim();
    if (required && !result) fields[key] = "required";
    if (result.length > max) fields[key] = "too_long";
    if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(result)) fields[key] = "invalid";
    return result;
  };
  const choice = <T extends readonly string[]>(key: string, choices: T, defaultValue?: T[number]): T[number] => {
    const value = input[key] === undefined || input[key] === "" ? defaultValue : input[key];
    if (typeof value !== "string" || !choices.includes(value)) {
      fields[key] = value === undefined || value === "" ? "required" : "invalid";
      return choices[0];
    }
    return value;
  };

  const data = {
    name: text("name", 120, true),
    email: text("email", 254, true),
    phone: text("phone", 40),
    location: text("location", 160, true),
    intendedUse: choice("intendedUse", VALUES.intendedUse),
    placement: choice("placement", VALUES.placement),
    interest: choice("interest", VALUES.interest),
    service: choice("service", VALUES.service),
    timeframe: choice("timeframe", VALUES.timeframe),
    contactMethod: choice("contactMethod", VALUES.contactMethod, "email"),
    capacity: text("capacity", 80),
    heat: text("heat", 80),
    budget: text("budget", 120),
    message: text("message", 2000),
    commercialDetails: text("commercialDetails", 1500),
    language: choice("language", VALUES.language),
    sourcePath: text("sourcePath", 240, true),
    privacyAccepted: input.privacyAccepted === true,
  };

  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) fields.email = "invalid";
  if (data.phone && (!/^[+\d\s().xext#-]+$/i.test(data.phone) || data.phone.replace(/\D/g, "").length < 7)) fields.phone = "invalid";
  if (data.contactMethod === "phone" && !data.phone) fields.phone = "required";
  if (!data.privacyAccepted) fields.privacyAccepted = "required";
  if (data.sourcePath && data.sourcePath !== "/" && !/^\/(?:en|fr)(?:\/[a-z0-9-]+)*\/?$/.test(data.sourcePath)) fields.sourcePath = "invalid";
  // A honeypot is one signal, not the rate limiter. Rejected submissions never get false success.
  if (input.website !== undefined && input.website !== "") fields.website = "invalid";
  return { fields, data };
}

async function readBody(request: Request): Promise<{ value?: unknown; failure?: Response }> {
  const declaredSize = Number(request.headers.get("Content-Length"));
  if (Number.isFinite(declaredSize) && declaredSize > MAX_QUOTE_BODY_BYTES) return { failure: error("too_large", 413) };
  if (!request.body) return { failure: error("invalid_json", 400) };
  const reader = request.body.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let byteLength = 0;
  let body = "";
  try {
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      byteLength += part.value.byteLength;
      if (byteLength > MAX_QUOTE_BODY_BYTES) {
        await reader.cancel();
        return { failure: error("too_large", 413) };
      }
      body += decoder.decode(part.value, { stream: true });
    }
    body += decoder.decode();
    return { value: JSON.parse(body) };
  } catch {
    return { failure: error("invalid_json", 400) };
  } finally {
    reader.releaseLock();
  }
}

function hex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer), byte => byte.toString(16).padStart(2, "0")).join("");
}

async function hashPayload(value: unknown) {
  return hex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(JSON.stringify(value))));
}

async function rateKey(ip: string, hour: number, secret: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return hex(await crypto.subtle.sign("HMAC", key, encoder.encode(`${hour}:${ip}`)));
}

function clientIp(request: Request) {
  const trustedIp = request.headers.get("CF-Connecting-IP");
  if (trustedIp && trustedIp.length <= 64 && /^[a-f\d:.]+$/i.test(trustedIp)) return trustedIp;
  // A local-only fallback makes preview testing possible without trusting forwarded headers.
  const hostname = new URL(request.url).hostname;
  if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]") return "127.0.0.1";
  return null;
}

function replay(row: SavedKey, payloadHash: string) {
  return row.payload_hash === payloadHash
    ? json({ ok: true, reference: row.reference }, 200)
    : error("conflict", 409);
}

export async function handleQuoteRequest(request: Request, environment: QuoteEnvironment, now: () => number = Date.now): Promise<Response> {
  if (request.method !== "POST") return error("method", 405, { Allow: "POST" });
  if (request.headers.get("Origin") !== new URL(request.url).origin) return error("origin", 403);
  if (request.headers.get("Content-Type")?.split(";")[0].trim().toLowerCase() !== "application/json") return error("content_type", 415);
  const idempotencyKey = request.headers.get("Idempotency-Key")?.toLowerCase() ?? "";
  if (!/^[a-f\d]{8}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{12}$/.test(idempotencyKey)) return error("idempotency", 400);

  const parsed = await readBody(request);
  if (parsed.failure) return parsed.failure;
  const validated = validate(parsed.value);
  if (Object.keys(validated.fields).length || !validated.data) return json({ ok: false, error: "validation", fields: validated.fields }, 422);
  const data = validated.data;
  const { DB, RATE_LIMIT_SECRET } = environment;
  const ip = clientIp(request);
  if (!DB || !RATE_LIMIT_SECRET || RATE_LIMIT_SECRET.length < 32 || !ip) return error("unavailable", 503);

  try {
    const payloadHash = await hashPayload(data);
    const previous = await DB.prepare("SELECT reference, payload_hash FROM quote_enquiries WHERE idempotency_key = ?").bind(idempotencyKey).first<SavedKey>();
    if (previous) return replay(previous, payloadHash);

    const timestamp = now();
    const hour = Math.floor(timestamp / 3_600_000);
    const expiresAt = (hour + 1) * 3600;
    const bucketKey = await rateKey(ip, hour, RATE_LIMIT_SECRET);
    // Atomic SQL increment; a full bucket remains capped rather than growing indefinitely.
    const allowance = await DB.prepare(`INSERT INTO quote_rate_limits (bucket_key, count, expires_at)
      VALUES (?, 1, ?) ON CONFLICT(bucket_key) DO UPDATE SET count = count + 1
      WHERE count < ? RETURNING count`).bind(bucketKey, expiresAt, QUOTE_RATE_LIMIT).first<{ count: number }>();
    if (!allowance) {
      const savedDuringRetry = await DB.prepare("SELECT reference, payload_hash FROM quote_enquiries WHERE idempotency_key = ?").bind(idempotencyKey).first<SavedKey>();
      if (savedDuringRetry) return replay(savedDuringRetry, payloadHash);
      return error("rate_limit", 429, { "Retry-After": String(Math.max(1, expiresAt - Math.floor(timestamp / 1000))) });
    }

    const id = crypto.randomUUID();
    const createdAt = new Date(timestamp).toISOString();
    const reference = `BS-${createdAt.slice(0, 10).replaceAll("-", "")}-${id.replaceAll("-", "").slice(0, 12).toUpperCase()}`;
    const saved = await DB.prepare(`INSERT INTO quote_enquiries (
      id, reference, idempotency_key, payload_hash, created_at, name, email, phone, location,
      intended_use, placement, interest, service, timeframe, contact_method, capacity, heat, budget,
      message, commercial_details, language, source_path, privacy_accepted, privacy_version, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, 'new')
      ON CONFLICT(idempotency_key) DO NOTHING RETURNING reference, payload_hash`).bind(
      id, reference, idempotencyKey, payloadHash, createdAt, data.name, data.email, data.phone, data.location,
      data.intendedUse, data.placement, data.interest, data.service, data.timeframe, data.contactMethod,
      data.capacity, data.heat, data.budget, data.message, data.commercialDetails, data.language,
      data.sourcePath, PRIVACY_NOTICE_VERSION,
    ).first<SavedKey>();

    if (!saved) {
      const competing = await DB.prepare("SELECT reference, payload_hash FROM quote_enquiries WHERE idempotency_key = ?").bind(idempotencyKey).first<SavedKey>();
      return competing ? replay(competing, payloadHash) : error("unavailable", 503);
    }

    // Best-effort expiry cleanup must never change a committed enquiry into a failed submission.
    try { await DB.prepare("DELETE FROM quote_rate_limits WHERE expires_at <= ?").bind(Math.floor(timestamp / 1000)).run(); } catch { /* Next accepted submission retries cleanup. */ }
    return json({ ok: true, reference: saved.reference }, 201);
  } catch {
    // Do not expose provider traces or log names, emails, IPs or submission bodies.
    return error("unavailable", 503);
  }
}
