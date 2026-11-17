import type { Lang } from "../content/site";
import { productQuoteMessage, type PublicProduct } from "./product-catalogue.ts";
import { comparisonQuery, readComparison, type ComparisonState } from "./sauna-comparison.ts";

type Search = Record<string, string | string[] | undefined>;
export const modelSlots = ["model1", "model2", "model3"] as const;

/** URL values resolve only against the current public projection. Never echo a rejected ID. */
export function readModelSelection(search: Search, catalogue: readonly PublicProduct[]) {
  const products: PublicProduct[] = [];
  let adjusted = false;
  for (const key of modelSlots) {
    const value = search[key];
    if (value === undefined || value === "") continue;
    const product = typeof value === "string" && value.length <= 80 ? catalogue.find(p => p.id === value) : undefined;
    if (!product || products.some(p => p.id === product.id)) { adjusted = true; continue; }
    products.push(product);
  }
  return { products, adjusted };
}

export function modelSelectionQuery(products: readonly PublicProduct[], state: ComparisonState) {
  const query = new URLSearchParams(comparisonQuery(state));
  products.slice(0, 3).forEach((product, i) => query.set(modelSlots[i], product.id));
  return query.toString();
}

export function modelComparisonQuoteQuery(products: readonly PublicProduct[], state: ComparisonState, source: string) {
  const query = new URLSearchParams(modelSelectionQuery(products, state));
  query.delete("compare");
  const common = (key: "category" | "placement" | "heat") => products.length && products.every(p => p[key] === products[0][key]) ? products[0][key] : "unsure";
  query.set("interest", common("category")); query.set("placement", common("placement")); query.set("heat", common("heat"));
  query.set("source", source);
  return query.toString();
}

export function readQuoteModels(search: Search, catalogue: readonly PublicProduct[]) {
  const product = typeof search.product === "string" ? catalogue.find(p => p.id === search.product) : undefined;
  // A direct model CTA takes precedence over an unrelated comparison query.
  if (product) return { products: [product], adjusted: false, direct: true };
  return { ...readModelSelection(search, catalogue), direct: false };
}

export function modelQuoteMessage(products: readonly PublicProduct[], lang: Lang) {
  if (!products.length) return "";
  if (products.length === 1) return productQuoteMessage(products[0], lang);
  // Bounded schema fields keep all three exact IDs/configurations within the
  // existing 2,000-character message limit, even at their maximum lengths.
  const title = lang === "fr" ? "Modèles à comparer pour mon projet :" : "Models to compare for my project:";
  return title + "\n\n" + products.slice(0, 3).map((product, i) => `${i + 1}. ${product.manufacturer} — ${product.model}\nConfiguration: ${product.copy[lang].configuration}\nBestSauna: ${product.id}`).join("\n\n");
}

export function modelDraftContext(products: readonly PublicProduct[]) {
  if (products.length === 1) return products[0].id;
  return products.length ? "models:" + products.map(p => p.id).sort().join(",") : "";
}

/** Language links preserve only eligible IDs, plus existing approach/project choices. */
export function pairedComparisonQuery(search: Search, catalogue: readonly PublicProduct[]) {
  return modelSelectionQuery(readModelSelection(search, catalogue).products, readComparison(search));
}
