/** Short-lived, tab-scoped drafts. Never store consent or the spam-trap field. */
export const QUOTE_DRAFT_KEY = "bestsauna.quote-draft.v1";
export const QUOTE_DRAFT_TTL = 30 * 60 * 1000;

export const quoteFieldLimits: Record<string, number> = {
  name: 120, email: 254, phone: 40, location: 150, intendedUse: 30,
  placement: 30, interest: 30, service: 30, timeframe: 30, contactMethod: 30,
  capacity: 60, heat: 30, budget: 100, message: 2000, commercialDetails: 1500,
};

export type QuoteFields = Record<string, string>;
export type QuoteAttempt = { fingerprint: string; key: string };
type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;
type Draft = { version: 1; context: string; savedAt: number; fields: QuoteFields; attempt: QuoteAttempt };

export function clearQuoteDraft(storage: StorageLike) {
  try { storage.removeItem(QUOTE_DRAFT_KEY); } catch { /* Form works without storage. */ }
}

export function saveQuoteDraft(storage: StorageLike, context: string, fields: QuoteFields, attempt: QuoteAttempt, now = Date.now()) {
  try {
    const safeFields = Object.fromEntries(Object.entries(quoteFieldLimits).map(([key, limit]) => [key, (fields[key] || "").slice(0, limit)]));
    storage.setItem(QUOTE_DRAFT_KEY, JSON.stringify({ version: 1, context, savedAt: now, fields: safeFields, attempt } satisfies Draft));
    return true;
  } catch { return false; }
}

export function readQuoteDraft(storage: StorageLike, context: string, now = Date.now()): Draft | null {
  try {
    const raw = storage.getItem(QUOTE_DRAFT_KEY);
    if (!raw) return null;
    const draft = JSON.parse(raw) as Draft;
    if (draft.version !== 1 || !Number.isFinite(draft.savedAt) || draft.savedAt > now || now - draft.savedAt >= QUOTE_DRAFT_TTL || typeof draft.context !== "string") throw new Error("Expired or invalid draft");
    if (!draft.fields || typeof draft.fields !== "object" || Array.isArray(draft.fields)) throw new Error("Invalid fields");
    const fields: QuoteFields = {};
    for (const [key, limit] of Object.entries(quoteFieldLimits)) {
      const value = draft.fields[key];
      if (typeof value !== "string" || value.length > limit) throw new Error("Invalid field");
      fields[key] = value;
    }
    // A new finder/service selection starts a separate brief. EN/FR share a context.
    if (draft.context !== context) return null;
    const attempt = draft.attempt;
    const validAttempt = attempt && typeof attempt.fingerprint === "string" && /^[0-9a-f]{64}$/.test(attempt.fingerprint) && typeof attempt.key === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(attempt.key);
    return { ...draft, fields, attempt: validAttempt ? attempt : { fingerprint: "", key: "" } };
  } catch {
    clearQuoteDraft(storage);
    return null;
  }
}
