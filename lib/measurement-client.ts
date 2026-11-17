import { MEASUREMENT_TTL, validEvent, type MeasurementContext, type MeasurementEvent } from "./measurement-protocol.ts";

const key = "bestsauna.measurement.v1";
type Visit = { entryPath: string; expiresAt: number; stages: string[] };
let memory: Visit | null = null;

export function measurementAllowed() {
  return typeof window !== "undefined" && document.documentElement.dataset.measurement === "on" &&
    navigator.doNotTrack !== "1" && !(navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl;
}
function visit(): Visit {
  const now = Date.now();
  try {
    const raw = window.sessionStorage.getItem(key);
    const saved = raw ? JSON.parse(raw) : null;
    if (saved && typeof saved.entryPath === "string" && /^\/(en|fr)\/[a-z0-9/-]*$/.test(saved.entryPath) && saved.entryPath.length <= 180 &&
      Number.isFinite(saved.expiresAt) && saved.expiresAt > now && saved.expiresAt <= now + MEASUREMENT_TTL &&
      Array.isArray(saved.stages) && saved.stages.every((stage: unknown) => ["quote_view", "quote_start", "quote_review"].includes(stage as string))) memory = saved;
  } catch { /* Storage is optional; keep a page-local fallback. */ }
  if (!memory || memory.expiresAt <= now) memory = { entryPath: window.location.pathname.slice(0, 180), expiresAt: now + MEASUREMENT_TTL, stages: [] };
  return memory;
}
function save(value: Visit) {
  memory = value;
  try { window.sessionStorage.setItem(key, JSON.stringify(value)); } catch { /* No persistent visitor identifier is required. */ }
}
export function captureMeasurementEntry() {
  if (!measurementAllowed()) {
    memory = null;
    try { window.sessionStorage.removeItem(key); } catch { /* Privacy signals still stop collection. */ }
    return;
  }
  save(visit());
}
export function measurementContext(language: "en" | "fr"): MeasurementContext | undefined {
  if (!measurementAllowed()) return undefined;
  const value = visit(); save(value);
  return { entryPath: value.entryPath, language, device: window.innerWidth < 700 ? "small" : window.innerWidth < 1100 ? "medium" : "large" };
}
export function trackMeasurement(language: "en" | "fr", event: MeasurementEvent, details: string[] = [""]) {
  try {
  const context = measurementContext(language);
  if (!context) return;
  const value = visit();
  const once = ["quote_view", "quote_start", "quote_review"].includes(event);
  if (once && value.stages.includes(event)) return;
  const entries = [...new Set(details)].filter(detail => validEvent(event, detail)).slice(0, 24).map(detail => ({ id: crypto.randomUUID(), event, detail }));
  if (!entries.length) return;
  if (once) save({ ...value, stages: [...value.stages, event] });
  // Collection is best-effort and never awaited by the customer's form interaction.
  void fetch("/api/measurement/", { method: "POST", credentials: "omit", referrerPolicy: "no-referrer", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ context, events: entries }), keepalive: true }).catch(() => {});
  } catch { /* Measurement must never interrupt form use, even in a restricted browser. */ }
}
