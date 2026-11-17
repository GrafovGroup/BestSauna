import { quoteEnvironment } from "@/lib/runtime-environment";
import { handleQuoteRequest } from "../../../lib/quote-service";

export async function POST(request: Request) {
  try {
    return await handleQuoteRequest(request, quoteEnvironment());
  } catch {
    // Database configuration errors must not disclose paths or contact details.
    return Response.json({ ok: false, error: "unavailable" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
