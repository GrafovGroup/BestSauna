import { env } from "cloudflare:workers";

export function siteSettings() {
  const configured = env.PUBLIC_SITE_URL || "https://bestsauna.dimagrafov.chatgpt.site";
  const origin = new URL(configured).origin;
  return { origin, indexable: env.PUBLIC_INDEXABLE === "true" };
}

export const contacts = { phone: "(833) 696-9996", tel: "+18336969996", email: "info@bestsauna.ca" };
