import { siteSettings } from "@/lib/site-settings";
import { siteRobots } from "@/lib/page-seo";
export function GET() {
  return new Response(siteRobots(siteSettings()), { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=300" } });
}
