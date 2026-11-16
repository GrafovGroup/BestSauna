import type { Metadata } from "next";
import type { Lang, SitePage } from "../content/site";
import type { GuideSummary } from "../content/guide-summaries";

type Settings = { origin: string; indexable: boolean };
type SchemaNode = Record<string, unknown>;

/** Shared by visible breadcrumbs and JSON-LD so the two cannot drift. */
export function pageBreadcrumbs(page: SitePage, lang: Lang, allPages: SitePage[]) {
  const home = { name: lang === "fr" ? "Accueil" : "Home", path: `/${lang}/` };
  if (page.key === "home") return [home];
  const parentKey = page.kind === "guide" ? "guides" : page.key !== "saunas" && page.paths[lang].startsWith(`/${lang}/saunas/`) ? "saunas" : undefined;
  const parent = allPages.find(p => p.key === parentKey);
  return [home, ...(parent ? [{ name: parent.copy[lang].eyebrow, path: parent.paths[lang] }] : []), { name: page.copy[lang].eyebrow, path: page.paths[lang] }];
}

export function pageMetadata(page: SitePage, lang: Lang, { origin, indexable }: Settings): Metadata {
  const copy = page.copy[lang];
  const image = origin + (copy.image || "/images/hero-sauna.webp");
  return {
    title: copy.title, description: copy.description, metadataBase: new URL(origin),
    alternates: { canonical: page.paths[lang], languages: { "en-CA": page.paths.en, "fr-CA": page.paths.fr, "x-default": page.paths.en } },
    robots: { index: indexable, follow: indexable },
    openGraph: { type: page.kind === "guide" ? "article" : "website", siteName: "BestSauna.ca", title: copy.title, description: copy.description, url: origin + page.paths[lang], locale: lang === "fr" ? "fr_CA" : "en_CA", alternateLocale: [lang === "fr" ? "en_CA" : "fr_CA"], images: [{ url: image, width: 1672, height: 941, alt: copy.imageAlt || "BestSauna.ca" }] },
    twitter: { card: "summary_large_image", title: copy.title, description: copy.description, images: [image] },
  };
}

export function pageStructuredData(page: SitePage, lang: Lang, origin: string, allPages: SitePage[], summary?: GuideSummary) {
  const copy = page.copy[lang];
  const url = origin + page.paths[lang];
  const organization = { "@id": origin + "/#organization" };
  const website = { "@id": origin + "/#website" };
  const webpage = { "@id": url + "#webpage" };
  const collection = page.kind === "guide-index" || page.key === "saunas";
  const graph: SchemaNode[] = [
    { "@type": "Organization", ...organization, name: "BestSauna.ca", url: origin, logo: origin + "/brand/bestsauna-wordmark-en-light.png" },
    { "@type": "WebSite", ...website, name: "BestSauna.ca", url: origin, inLanguage: ["en-CA", "fr-CA"], publisher: organization },
    {
      "@type": collection ? "CollectionPage" : page.kind === "about" ? "AboutPage" : page.kind === "support" ? "ContactPage" : "WebPage",
      ...webpage, url, name: copy.heading, description: copy.description, inLanguage: lang === "fr" ? "fr-CA" : "en-CA", isPartOf: website,
      ...(page.key !== "home" ? { breadcrumb: { "@id": url + "#breadcrumbs" } } : {}),
      ...(copy.image ? { primaryImageOfPage: { "@id": url + "#image" } } : {}),
      ...(page.kind === "guide" ? { mainEntity: { "@id": url + "#article" } } : collection ? { mainEntity: { "@id": url + "#collection" } } : {}),
    },
  ];
  if (copy.image) graph.push({ "@type": "ImageObject", "@id": url + "#image", contentUrl: origin + copy.image, caption: copy.imageAlt });
  if (page.key !== "home") graph.push({
    "@type": "BreadcrumbList", "@id": url + "#breadcrumbs",
    itemListElement: pageBreadcrumbs(page, lang, allPages).map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, item: origin + item.path })),
  });
  if (page.kind === "guide") graph.push({
    "@type": "Article", "@id": url + "#article", url, headline: copy.heading, description: copy.description,
    inLanguage: lang === "fr" ? "fr-CA" : "en-CA", mainEntityOfPage: webpage, publisher: organization,
    image: { "@id": url + "#image" }, articleSection: copy.eyebrow,
    ...(summary ? { abstract: summary.answer } : {}),
    hasPart: copy.sections.map((section, index) => ({ "@type": "WebPageElement", "@id": url + `#section-${index + 1}`, name: section.title, url: url + `#section-${index + 1}` })),
  });
  if (collection) {
    const keys = page.kind === "guide-index" ? allPages.filter(p => p.kind === "guide").map(p => p.key) : ["outdoor", "indoor", "infrared", "cottage", "commercial", "heaters"];
    const items = keys.map(key => allPages.find(p => p.key === key)).filter((p): p is SitePage => Boolean(p));
    graph.push({ "@type": "ItemList", "@id": url + "#collection", numberOfItems: items.length, itemListElement: items.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: p.copy[lang].heading, url: origin + p.paths[lang] })) });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}

export function serializeStructuredData(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}

function xml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

export function siteSitemap(allPages: SitePage[], { origin, indexable }: Settings) {
  const entries = indexable ? allPages.flatMap(page => (["en", "fr"] as const).map(lang => `<url><loc>${xml(origin + page.paths[lang])}</loc><xhtml:link rel="alternate" hreflang="en-CA" href="${xml(origin + page.paths.en)}"/><xhtml:link rel="alternate" hreflang="fr-CA" href="${xml(origin + page.paths.fr)}"/><xhtml:link rel="alternate" hreflang="x-default" href="${xml(origin + page.paths.en)}"/></url>`)).join("") : "";
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${entries}</urlset>`;
}

export function siteRobots({ origin, indexable }: Settings) {
  return indexable ? `User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${origin}/sitemap.xml\n` : "User-agent: *\nDisallow: /\n";
}
