import { z } from "zod";
import type { Lang, SitePage } from "../content/site";

const text = z.string().trim().min(1).max(2000);
const short = text.max(160);
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(80);
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value => {
  const parsed = new Date(value + "T00:00:00Z");
  return Number.isFinite(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}, "Use a real calendar date (YYYY-MM-DD).");
const bilingual = <T extends z.ZodTypeAny>(schema: T) => z.object({ en: schema, fr: schema }).strict();
const httpsUrl = z.string().url().max(500).refine(value => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch { return false; }
}, "Use a public HTTPS document URL without credentials.");

export const specificationKeys = ["dimensions", "seating", "materials", "heaterControls", "connections", "requiredComponents", "installation"] as const;
export const evidenceKeys = ["identity", "imageAndCopyRights", "specifications", "scope", "commercialTerms", "warrantyAndUse", "translations"] as const;
const specifications = z.object(Object.fromEntries(specificationKeys.map(key => [key, text])) as Record<typeof specificationKeys[number], typeof text>).strict();
const copy = z.object({
  name: short, slug, title: short, description: text.max(320), intro: text,
  configuration: short, specifications,
  included: z.array(text).min(1).max(20), excluded: z.array(text).min(1).max(20),
  delivery: text, orderTerms: text, leadTime: text, availability: text, warranty: text, permittedUse: text,
}).strict();

export const productDetailsSchema = z.object({
  manufacturer: short, model: short,
  category: z.enum(["outdoor", "indoor", "infrared", "heaters"]),
  placement: z.enum(["indoor", "outdoor"]), heat: z.enum(["electric", "wood", "infrared"]),
  uses: z.array(z.enum(["home", "cottage", "commercial"])).min(1).max(3),
  pricing: z.literal("quotation-only"),
  image: z.object({
    src: z.string().regex(/^\/products\/[a-z0-9-]+(?:\/[a-z0-9-]+)*\.(?:webp|png|jpg|jpeg)$/),
    width: z.number().int().positive().max(10000), height: z.number().int().positive().max(10000), alt: bilingual(text.max(300)),
  }).strict(),
  manual: z.object({ url: httpsUrl, version: short }).strict(),
  copy: bilingual(copy),
}).strict();

const evidence = z.object({ source: text, version: short, verifiedAt: date, verifiedBy: short }).strict();
export const productApprovalSchema = z.object({
  approvedBy: short, approvedAt: date, reviewBy: date,
  evidence: z.object(Object.fromEntries(evidenceKeys.map(key => [key, evidence])) as Record<typeof evidenceKeys[number], typeof evidence>).strict(),
}).strict();

export type ProductDetails = z.infer<typeof productDetailsSchema>;
export type ProductApproval = z.infer<typeof productApprovalSchema>;
export type ProductRecord = {
  id: string; status: "draft" | "published" | "archived";
  details?: Partial<ProductDetails>; approval?: Partial<ProductApproval>;
};
/** Only this projection may reach page components, routes, sitemap or quote prefills. */
export type PublicProduct = ProductDetails & { id: string; paths: Record<Lang, string> };
type Inspection = { id: string; status: string; issues: string[]; blocking: boolean; product?: PublicProduct };
const envelope = z.object({ id: slug, status: z.enum(["draft", "published", "archived"]), details: z.unknown().optional(), approval: z.unknown().optional() }).strict();
const issues = (result: z.SafeParseReturnType<unknown, unknown>, prefix: string) => result.success ? [] : result.error.issues.map(issue => `${prefix}.${issue.path.join(".")}: ${issue.message}`);

export function productPaths(details: ProductDetails): Record<Lang, string> {
  return { en: `/en/saunas/models/${details.copy.en.slug}/`, fr: `/fr/saunas/modeles/${details.copy.fr.slug}/` };
}

/** Invalid, expired, conflicting and unpublished records are excluded at every entry point. */
export function inspectCatalogue(records: readonly unknown[], today = new Date().toISOString().slice(0, 10)): Inspection[] {
  const parsed = records.map(record => envelope.safeParse(record));
  const reserved = new Map<string, number[]>();
  parsed.forEach((result, index) => {
    if (!result.success) return;
    const candidate = result.data.details as { copy?: Partial<Record<Lang, { slug?: unknown }>> } | undefined;
    const keys = [`id:${result.data.id}`, ...(["en", "fr"] as const).flatMap(lang => typeof candidate?.copy?.[lang]?.slug === "string" ? [`${lang}:${candidate.copy[lang]!.slug}`] : [])];
    for (const key of keys) reserved.set(key, [...(reserved.get(key) ?? []), index]);
  });
  return parsed.map((result, index) => {
    if (!result.success) return { id: `record-${index + 1}`, status: "invalid", issues: issues(result, "record"), blocking: true };
    const record = result.data;
    const details = productDetailsSchema.safeParse(record.details);
    const approval = productApprovalSchema.safeParse(record.approval);
    const conflicts = [...reserved.entries()].filter(([, indexes]) => indexes.length > 1 && indexes.includes(index)).map(([key]) => `Duplicate ${key}; every conflicting record is withheld.`);
    const problems = [...conflicts, ...issues(details, "details"), ...issues(approval, "approval")];
    if (approval.success) {
      if (approval.data.approvedAt > today) problems.push("approval.approvedAt: approval cannot be in the future.");
      if (approval.data.reviewBy < today || approval.data.reviewBy < approval.data.approvedAt) problems.push("approval.reviewBy: approval has expired or precedes approval date.");
      for (const [key, item] of Object.entries(approval.data.evidence)) {
        if (item.verifiedAt > approval.data.approvedAt) problems.push(`approval.evidence.${key}.verifiedAt: evidence must be verified by the approval date.`);
      }
    }
    const published = record.status === "published" && problems.length === 0 && details.success;
    return {
      id: record.id, status: record.status, issues: problems,
      blocking: conflicts.length > 0 || (record.status === "published" && problems.length > 0),
      ...(published ? { product: { id: record.id, ...details.data, paths: productPaths(details.data) } } : {}),
    };
  });
}

export function publishedProducts(records: readonly unknown[], today?: string): PublicProduct[] {
  return inspectCatalogue(records, today).flatMap(result => result.product ? [result.product] : []);
}
export function findProduct(products: readonly PublicProduct[], lang: Lang, path: string) {
  return products.find(product => product.paths[lang] === path);
}
export function categoryProducts(products: readonly PublicProduct[], category: string) {
  return products.filter(product => category === "saunas" || product.category === category || product.uses.includes(category as ProductDetails["uses"][number]));
}
export function productQuoteQuery(product: PublicProduct, lang: Lang) {
  return new URLSearchParams({ product: product.id, interest: product.category, placement: product.placement, heat: product.heat, source: product.paths[lang] }).toString();
}
export function productQuoteMessage(product: PublicProduct, lang: Lang) {
  const c = product.copy[lang];
  return `${lang === "fr" ? "Modèle demandé" : "Requested model"}: ${product.manufacturer} — ${c.name}\n${lang === "fr" ? "Référence du fabricant" : "Manufacturer model"}: ${product.model}\nConfiguration: ${c.configuration}\n${lang === "fr" ? "Référence BestSauna" : "BestSauna reference"}: ${product.id}`;
}
export function productPage(product: PublicProduct): SitePage {
  const localized = (lang: Lang) => {
    const c = product.copy[lang];
    return { title: c.title, description: c.description, eyebrow: c.name, heading: c.name, intro: c.intro, image: product.image.src, imageAlt: product.image.alt[lang], sections: [], related: [] };
  };
  return { key: `model-${product.id}`, kind: "category", paths: product.paths, copy: { en: localized("en"), fr: localized("fr") } };
}
