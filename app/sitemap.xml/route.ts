import { getPublishedProducts } from "@/lib/published-catalogue";
import { productPage } from "@/lib/product-catalogue";
import { pages } from "@/content/site";
import { siteSettings } from "@/lib/site-settings";
import { siteSitemap } from "@/lib/page-seo";
export function GET() {
  return new Response(siteSitemap([...pages,...getPublishedProducts().map(productPage)],siteSettings()), { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=300" } });
}
