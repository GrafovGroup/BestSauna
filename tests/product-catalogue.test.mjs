import test from "node:test";
import assert from "node:assert/strict";
import { inspectCatalogue, publishedProducts, productPage, findProduct, categoryProducts, productQuoteQuery, productQuoteMessage, evidenceKeys, specificationKeys } from "../lib/product-catalogue.ts";
import { productMetadata, productStructuredData, catalogueCollectionData } from "../lib/product-seo.ts";
import { siteSitemap } from "../lib/page-seo.ts";
import { pages } from "../content/site.ts";
import { productRecords } from "../content/products.ts";
import { catalogueFixture } from "./fixtures/catalogue.mjs";
const today = "2026-11-16", origin = "https://bestsauna.example";
const visible = records => publishedProducts(records, today);

test("source catalogue passes release checks and contains no synthetic fixtures", () => {
  assert.ok(inspectCatalogue(productRecords).every(record => !record.blocking));
  assert.equal(JSON.stringify(productRecords).includes("INTERNAL QA"), false);
  assert.equal(productRecords.some(record => record.id.startsWith("internal-qa")), false);
});
test("only explicitly published, complete models reach the public projection", () => {
  const draft = { ...catalogueFixture("draft"), status: "draft" };
  const archived = { ...catalogueFixture("archived"), status: "archived" };
  const products = visible([draft, archived, catalogueFixture()]);
  assert.equal(products.length, 1);
  assert.equal("approval" in products[0], false);
  assert.equal("status" in products[0], false);
  assert.equal(JSON.stringify(products).includes("Synthetic test reviewer"), false);
  assert.equal(findProduct(products, "en", "/en/saunas/models/draft/"), undefined);
  assert.equal(findProduct(products, "fr", "/fr/saunas/modeles/archived-fr/"), undefined);
});
test("every evidence group and each localized specification is required", () => {
  for (const key of evidenceKeys) {
    const record = catalogueFixture(); delete record.approval.evidence[key];
    assert.equal(visible([record]).length, 0, key);
  }
  for (const lang of ["en", "fr"]) for (const key of specificationKeys) {
    const record = catalogueFixture(); record.details.copy[lang].specifications[key] = " ";
    assert.equal(visible([record]).length, 0, `${lang}/${key}`);
  }
  const record = catalogueFixture(); delete record.details.copy.fr;
  assert.equal(visible([record]).length, 0);
});
test("duplicate identities and either language slug withhold all conflicting records", () => {
  for (const duplicate of ["id", "en", "fr"]) {
    const first = catalogueFixture(), second = catalogueFixture("second");
    if (duplicate === "id") second.id = first.id;
    else second.details.copy[duplicate].slug = first.details.copy[duplicate].slug;
    assert.equal(visible([first, second]).length, 0);
    assert.ok(inspectCatalogue([first, second], today).every(result => result.blocking));
    second.status = "draft";
    assert.equal(visible([first, second]).length, 0);
  }
});
test("expiry, impossible dates, future approvals and unreviewed evidence fail closed", () => {
  for (const mutate of [
    r => r.approval.reviewBy = "2026-11-15",
    r => r.approval.reviewBy = "2026-02-30",
    r => r.approval.approvedAt = "2026-11-17",
    r => r.approval.evidence.identity.verifiedAt = "2026-11-02",
  ]) { const record = catalogueFixture(); mutate(record); assert.equal(visible([record]).length, 0); }
  const record = catalogueFixture(); record.approval.reviewBy = today;
  assert.equal(visible([record]).length, 1);
  assert.equal(publishedProducts([record], "2026-11-17").length, 0);
});
test("unsafe assets, unapproved editorial photos, URLs and arbitrary properties cannot publish", () => {
  for (const mutate of [
    r => r.details.image.src = "/images/hero-sauna.webp",
    r => r.details.image.src = "/products/../secret.jpg",
    r => r.details.image.src = "https://other.example/model.jpg",
    r => r.details.manual.url = "javascript:alert(1)",
    r => r.details.manual.url = "not a URL",
    r => r.details.manual.url = "https://secret:password@example.com/manual.pdf",
    r => r.details.price = 0,
    r => r.details.copy.en.slug = "../draft",
  ]) { const record = catalogueFixture(); mutate(record); assert.equal(visible([record]).length, 0); }
});
test("unfinished drafts remain editable; invalid published records block release", () => {
  const draft = { id: "incomplete", status: "draft" };
  const [report] = inspectCatalogue([draft], today);
  assert.equal(report.blocking, false); assert.ok(report.issues.length);
  assert.equal(inspectCatalogue([{ ...draft, status: "published" }], today)[0].blocking, true);
  for (const value of [null, [], { id: "bad/id", status: "draft" }, { id: "unknown", status: "approved" }]) {
    assert.equal(inspectCatalogue([value], today)[0].blocking, true);
    assert.equal(visible([value]).length, 0);
  }
});
test("category discovery only includes the approved model applications", () => {
  const products = visible([catalogueFixture()]);
  for (const category of ["saunas", "outdoor", "cottage"]) assert.equal(categoryProducts(products, category).length, 1);
  for (const category of ["indoor", "commercial", "infrared", "home-page"]) assert.equal(categoryProducts(products, category).length, 0);
  const list = catalogueCollectionData(pages.find(p => p.key === "outdoor"), products, "fr", origin);
  assert.equal(list.itemListElement[0].url, origin + products[0].paths.fr);
  assert.equal(catalogueCollectionData(pages.find(p => p.key === "outdoor"), [], "en", origin), undefined);
});
test("paired routes, metadata, image dimensions and public sitemap share one projection", () => {
  const products = visible([catalogueFixture(), { ...catalogueFixture("hidden"), status: "draft" }]);
  const product = products[0];
  for (const lang of ["en", "fr"]) {
    assert.equal(findProduct(products, lang, product.paths[lang]), product);
    const metadata = productMetadata(product, lang, { origin, indexable: true });
    assert.equal(metadata.alternates.canonical, product.paths[lang]);
    assert.equal(metadata.alternates.languages["fr-CA"], product.paths.fr);
    assert.equal(metadata.openGraph.images[0].width, 1200);
    const graph = productStructuredData(product, lang, origin, pages)["@graph"];
    assert.equal(graph.find(item => item["@type"] === "BreadcrumbList").itemListElement.at(-1).item, origin + product.paths[lang]);
    assert.equal(graph.some(item => ["Product", "Offer", "Review", "AggregateRating"].includes(item["@type"])), false);
  }
  const index = siteSitemap([...pages, ...products.map(productPage)], { origin, indexable: true });
  assert.ok(index.includes(product.paths.en)); assert.ok(index.includes(product.paths.fr)); assert.equal(index.includes("hidden"), false);
  assert.equal(siteSitemap(products.map(productPage), { origin, indexable: false }).includes("<url>"), false);
});
test("quote handoff retains stable model identity, configuration and translated source", () => {
  const [product] = visible([catalogueFixture()]);
  for (const lang of ["en", "fr"]) {
    const query = new URLSearchParams(productQuoteQuery(product, lang));
    assert.equal(query.get("product"), product.id); assert.equal(query.get("source"), product.paths[lang]);
    assert.equal(query.get("interest"), "outdoor"); assert.equal(query.get("heat"), "electric");
    const message = productQuoteMessage(product, lang);
    for (const value of [product.id, product.model, product.copy[lang].configuration]) assert.ok(message.includes(value));
    assert.ok(message.length <= 2000);
  }
});
