declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    RATE_LIMIT_SECRET?: string;
    QUOTE_EMAIL_ENABLED?: string;
    MEASUREMENT_ENABLED?: string;
    PUBLIC_SITE_URL?: string;
    PUBLIC_INDEXABLE?: string;
    BUCKET?: R2Bucket;
  }
}
