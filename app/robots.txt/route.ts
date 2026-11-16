import { siteSettings } from "@/lib/site-settings";
export function GET(){const {origin,indexable}=siteSettings();return new Response(indexable?`User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${origin}/sitemap.xml\n`:"User-agent: *\nDisallow: /\n",{headers:{"Content-Type":"text/plain; charset=utf-8","Cache-Control":"public, max-age=300"}});}
