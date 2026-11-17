import { getQuoteDatabase } from "../whc/database.mjs";
import { currentClientAddress } from "../whc/request-context.mjs";
import type { QuoteEnvironment } from "./quote-service";

// The Worker build aliases this module to runtime-environment.cloudflare.ts.
export function runtimeEnvironment() { return process.env; }
export function storageProvider() { return "Web Hosting Canada (WHC)"; }
export function quoteEnvironment(): QuoteEnvironment {
  return {
    DB: getQuoteDatabase(),
    RATE_LIMIT_SECRET: process.env.RATE_LIMIT_SECRET,
    QUOTE_EMAIL_ENABLED: process.env.QUOTE_EMAIL_ENABLED,
    MEASUREMENT_ENABLED: process.env.MEASUREMENT_ENABLED,
    // Only the HTTP server supplies this context. Client-supplied forwarding
    // headers cannot select a different rate-limit bucket on WHC.
    CLIENT_IP: currentClientAddress(),
    SITE_ORIGIN: process.env.PUBLIC_SITE_URL ? new URL(process.env.PUBLIC_SITE_URL).origin : undefined,
  };
}
