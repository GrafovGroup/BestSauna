import { siteSettings } from "@/lib/site-settings";
export function GET() {
  return Response.redirect(new URL("/en/", siteSettings().origin), 308);
}
