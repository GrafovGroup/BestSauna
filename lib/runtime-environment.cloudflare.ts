import { env } from "cloudflare:workers";

export function runtimeEnvironment() { return env; }
export function storageProvider() { return "Cloudflare"; }
export function quoteEnvironment() {
  return { DB: env.DB, RATE_LIMIT_SECRET: env.RATE_LIMIT_SECRET, QUOTE_EMAIL_ENABLED: env.QUOTE_EMAIL_ENABLED, MEASUREMENT_ENABLED: env.MEASUREMENT_ENABLED };
}
