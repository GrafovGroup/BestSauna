import type { Lang, SitePage } from "../content/site";
import { categoryProducts, productPage, type PublicProduct } from "./product-catalogue.ts";
import { pageMetadata, pageStructuredData } from "./page-seo.ts";

export function productMetadata(product: PublicProduct, lang: Lang, settings: { origin: string; indexable: boolean }) {
  const metadata = pageMetadata(productPage(product), lang, settings);
  return { ...metadata, openGraph: { ...metadata.openGraph, images: [{ url: settings.origin + product.image.src, width: product.image.width, height: product.image.height, alt: product.image.alt[lang] }] } };
}
// Quotation-only pages use supported page/image/breadcrumb data. Commercial
// rich-result types remain gated until an approved offer implementation exists.
export function productStructuredData(product: PublicProduct, lang: Lang, origin: string, pages: SitePage[]) {
  return pageStructuredData(productPage(product), lang, origin, pages);
}
export function catalogueCollectionData(page: SitePage, products: readonly PublicProduct[], lang: Lang, origin: string) {
  const models = page.kind === "category" ? categoryProducts(products, page.key) : [];
  if (!models.length) return undefined;
  return { "@type": "ItemList", "@id": origin + page.paths[lang] + "#models", numberOfItems: models.length, itemListElement: models.map((product, index) => ({ "@type": "ListItem", position: index + 1, name: product.copy[lang].name, url: origin + product.paths[lang] })) };
}
