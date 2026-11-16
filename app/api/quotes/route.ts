import { env } from "cloudflare:workers";
import { handleQuoteRequest } from "../../../lib/quote-service";

export async function POST(request: Request) {
  return handleQuoteRequest(request, { DB: env.DB, RATE_LIMIT_SECRET: env.RATE_LIMIT_SECRET });
}
