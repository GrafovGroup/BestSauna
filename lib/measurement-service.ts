import { pages } from "../content/site.ts";
import { validEvent, type MeasurementContext } from "./measurement-protocol.ts";
import type { QuoteDatabase, QuoteEnvironment } from "./quote-service.ts";

const paths = new Set(pages.flatMap(page => [page.paths.en, page.paths.fr]));
const uuid = /^[a-f\d]{8}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{12}$/i;
const dayMs = 86_400_000;
export function normalizeMeasurementContext(raw: unknown): MeasurementContext | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const value = raw as Record<string, unknown>;
  if (Object.keys(value).some(key => !["entryPath", "language", "device"].includes(key)) || !paths.has(value.entryPath as string) ||
    !["en", "fr"].includes(value.language as string) || !["small", "medium", "large"].includes(value.device as string)) return null;
  return { entryPath: value.entryPath as string, language: value.language as "en" | "fr", device: value.device as MeasurementContext["device"] };
}
const hex = (buffer: ArrayBuffer) => Array.from(new Uint8Array(buffer), byte => byte.toString(16).padStart(2, "0")).join("");
export async function recordMeasurement(DB: QuoteDatabase, context: MeasurementContext, event: string, detail: string, id: string, timestamp: number) {
  const token = hex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(id)));
  // A SQLite trigger atomically increments the daily aggregate only for a new receipt.
  await DB.prepare(`INSERT INTO measurement_receipts (token, day, event, entry_path, language, device, detail, expires_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(token) DO NOTHING`).bind(token, new Date(timestamp).toISOString().slice(0, 10), event, context.entryPath, context.language, context.device, detail, Math.floor((timestamp + dayMs) / 1000)).run();
}
export async function cleanupMeasurement(DB: QuoteDatabase, timestamp: number) {
  await DB.prepare("DELETE FROM measurement_receipts WHERE expires_at <= ?").bind(Math.floor(timestamp / 1000)).run();
  await DB.prepare("DELETE FROM measurement_daily WHERE day < ?").bind(new Date(timestamp - 90 * dayMs).toISOString().slice(0, 10)).run();
}
export function measurementOptOut(request: Request) { return request.headers.get("DNT") === "1" || request.headers.get("Sec-GPC") === "1"; }
function response(status: number) { return new Response(null, { status, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } }); }

export async function handleMeasurementRequest(request: Request, environment: QuoteEnvironment, now = Date.now): Promise<Response> {
  if (request.method !== "POST") return response(405);
  if (request.headers.get("Origin") !== (environment.SITE_ORIGIN || new URL(request.url).origin)) return response(403);
  if (environment.MEASUREMENT_ENABLED !== "true" || measurementOptOut(request)) return response(204);
  if (request.headers.get("Content-Type")?.split(";")[0].trim().toLowerCase() !== "application/json") return response(415);
  if (Number(request.headers.get("Content-Length")) > 8192) return response(413);
  let input: { context?: unknown; events?: unknown };
  const reader = request.body?.getReader();
  if (!reader) return response(400);
  try {
    let length = 0, body = ""; const decoder = new TextDecoder();
    while (true) {
      const part = await reader.read(); if (part.done) break;
      length += part.value.byteLength;
      if (length > 8192) { await reader.cancel(); return response(413); }
      body += decoder.decode(part.value, { stream: true });
    }
    input = JSON.parse(body + decoder.decode());
  } catch { return response(400); }
  finally { reader.releaseLock(); }
  if (!input || typeof input !== "object" || Array.isArray(input) || Object.keys(input).some(key => !["context", "events"].includes(key))) return response(422);
  const context = normalizeMeasurementContext(input.context);
  if (!context || !Array.isArray(input.events) || !input.events.length || input.events.length > 24) return response(422);
  const events: { id: string; event: string; detail: string }[] = [];
  for (const item of input.events) {
    if (!item || typeof item !== "object" || Array.isArray(item) || Object.keys(item).some(key => !["id", "event", "detail"].includes(key)) ||
      typeof item.id !== "string" || !uuid.test(item.id) || !validEvent(item.event, item.detail)) return response(422);
    events.push({ id: item.id.toLowerCase(), event: item.event, detail: item.detail });
  }
  const { DB, RATE_LIMIT_SECRET } = environment;
  const ip = environment.CLIENT_IP !== undefined ? environment.CLIENT_IP : request.headers.get("CF-Connecting-IP");
  if (!DB || !RATE_LIMIT_SECRET || RATE_LIMIT_SECRET.length < 32 || !ip || ip.length > 64 || !/^[a-f\d:.]+$/i.test(ip)) return response(503);
  try {
    const timestamp = now(), hour = Math.floor(timestamp / 3_600_000);
    const encoder = new TextEncoder();
    const secret = await crypto.subtle.importKey("raw", encoder.encode(RATE_LIMIT_SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const bucket = hex(await crypto.subtle.sign("HMAC", secret, encoder.encode(`measurement:${hour}:${ip}`)));
    const allowed = await DB.prepare(`INSERT INTO quote_rate_limits (bucket_key, count, expires_at) VALUES (?, 1, ?)
      ON CONFLICT(bucket_key) DO UPDATE SET count = count + 1 WHERE count < 120 RETURNING count`).bind(bucket, (hour + 1) * 3600).first();
    if (!allowed) return response(429);
    for (const event of events) await recordMeasurement(DB, context, event.event, event.detail, event.id, timestamp);
    await cleanupMeasurement(DB, timestamp);
    await DB.prepare("DELETE FROM quote_rate_limits WHERE expires_at <= ?").bind(Math.floor(timestamp / 1000)).run();
    return response(204);
  } catch { return response(503); }
}
