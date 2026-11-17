import { quoteEnvironment } from "@/lib/runtime-environment";
import { handleMeasurementRequest } from "../../../lib/measurement-service";

export async function POST(request: Request) {
  try { return await handleMeasurementRequest(request, quoteEnvironment()); }
  catch { return new Response(null, { status: 503, headers: { "Cache-Control": "no-store" } }); }
}
