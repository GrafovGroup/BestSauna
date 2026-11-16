import { pages } from "@/content/site";
import { siteSettings } from "@/lib/site-settings";
import { siteSitemap } from "@/lib/page-seo";
export function GET() {
  return new Response(siteSitemap(pages,siteSettings()), { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=300" } });
}
