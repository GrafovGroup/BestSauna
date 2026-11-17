import test from "node:test";
import assert from "node:assert/strict";
import { publishedProducts } from "../lib/product-catalogue.ts";
import { readComparison } from "../lib/sauna-comparison.ts";
import { modelSlots, readModelSelection, modelSelectionQuery, modelComparisonQuoteQuery, readQuoteModels, modelQuoteMessage, modelDraftContext, pairedComparisonQuery } from "../lib/model-comparison.ts";
import { readQuoteDraft, saveQuoteDraft } from "../lib/quote-draft.ts";
import { catalogueFixture } from "./fixtures/catalogue.mjs";

const records = ["internal-qa-a", "internal-qa-b", "internal-qa-c"].map(catalogueFixture);
const catalogue = publishedProducts(records, "2026-11-16");
const state = readComparison({ compare: "outdoor-infrared", use: "cottage", service: "assembly" });
const query = products => Object.fromEntries(new URLSearchParams(modelSelectionQuery(products, state)));

test("model comparison selects zero to three explicit published choices without inventing defaults", () => {
  assert.deepEqual(readModelSelection({}, catalogue), { products: [], adjusted: false });
  for (let count = 1; count <= 3; count++) {
    const selection = readModelSelection(query(catalogue.slice(0, count)), catalogue);
    assert.deepEqual(selection.products, catalogue.slice(0, count)); assert.equal(selection.adjusted, false);
  }
  const sparse = readModelSelection({ model3: catalogue[2].id }, catalogue);
  assert.deepEqual(sparse.products, [catalogue[2]]);
  assert.equal(readModelSelection({ model4: catalogue[0].id }, catalogue).products.length, 0);
});

test("unknown, repeated, duplicate and oversized model values are rejected without echoing them", () => {
  for (const value of ["not-published", [catalogue[1].id, catalogue[2].id], "x".repeat(81), "<script>", catalogue[0].id]) {
    const selected = readModelSelection({ model1: catalogue[0].id, model2: value, model3: catalogue[2].id }, catalogue);
    assert.equal(selected.adjusted, true); assert.deepEqual(selected.products.map(p => p.id), [catalogue[0].id, catalogue[2].id]);
  }
  assert.equal(readModelSelection({ model1: "", model2: "" }, catalogue).adjusted, false);
});

test("draft, archived, incomplete and expired models never enter a comparison or quote prefill", () => {
  const hidden = [catalogueFixture("draft"), catalogueFixture("archive"), catalogueFixture("incomplete"), catalogueFixture("expired")];
  hidden[0].status = "draft"; hidden[1].status = "archived";
  delete hidden[2].details.copy.fr; hidden[3].approval.reviewBy = "2026-11-15";
  const visible = publishedProducts([...records, ...hidden], "2026-11-16");
  for (const record of hidden) {
    const search = { model1: record.id, model2: catalogue[0].id };
    assert.deepEqual(readModelSelection(search, visible).products.map(p => p.id), [catalogue[0].id]);
    assert.equal(readQuoteModels(search, visible).adjusted, true);
    assert.equal(modelQuoteMessage(readQuoteModels(search, visible).products, "en").includes(`BestSauna reference: ${record.id}`), false);
  }
});

test("comparison and language queries preserve selected order and project scope, sanitizing rejected IDs", () => {
  const ordered = [catalogue[2], catalogue[0]];
  const search = query(ordered);
  assert.deepEqual(readModelSelection(search, catalogue).products, ordered);
  assert.deepEqual(readComparison(search), state);
  const paired = new URLSearchParams(pairedComparisonQuery({ ...search, model3: "secret-draft" }, catalogue));
  assert.equal(paired.get("model1"), ordered[0].id); assert.equal(paired.get("model2"), ordered[1].id);
  assert.equal(paired.has("model3"), false); assert.equal(paired.get("use"), "cottage"); assert.equal(paired.get("service"), "assembly");
});

test("mixed category, placement and heating selections remain undecided in quote handoff", () => {
  const infrared = { ...catalogue[1], category: "infrared", placement: "indoor", heat: "infrared" };
  const mixed = new URLSearchParams(modelComparisonQuoteQuery([catalogue[0], infrared], state, "/fr/comparer-les-saunas/"));
  for (const field of ["interest", "placement", "heat"]) assert.equal(mixed.get(field), "unsure");
  assert.equal(mixed.get("source"), "/fr/comparer-les-saunas/"); assert.equal(mixed.get("use"), "cottage"); assert.equal(mixed.has("message"), false);
  const matching = new URLSearchParams(modelComparisonQuoteQuery(catalogue, state, "/en/compare-saunas/"));
  assert.equal(matching.get("interest"), "outdoor"); assert.equal(matching.get("placement"), "outdoor"); assert.equal(matching.get("heat"), "electric");
});

test("direct model links preserve their original meaning when comparison values are also present", () => {
  const result = readQuoteModels({ product: catalogue[0].id, model1: catalogue[1].id, model2: catalogue[2].id }, catalogue);
  assert.equal(result.direct, true); assert.deepEqual(result.products, [catalogue[0]]);
  assert.equal(readQuoteModels(query(catalogue), catalogue).direct, false);
});

test("maximum-length three-model quote messages fit without dropping exact identifiers or configurations", () => {
  const largest = catalogue.map((p, i) => ({ ...p, id: `${i}`.repeat(80), manufacturer: "M".repeat(160), model: `${i}型号`.repeat(80).slice(0, 160), copy: { en: { ...p.copy.en, configuration: "E".repeat(160) }, fr: { ...p.copy.fr, configuration: "É".repeat(160) } } }));
  for (const lang of ["en", "fr"]) {
    const message = modelQuoteMessage(largest, lang);
    assert.ok(message.length <= 2000, message.length);
    for (const p of largest) for (const value of [p.id, p.model, p.copy[lang].configuration]) assert.ok(message.includes(value));
  }
  assert.equal(modelQuoteMessage([], "fr"), "");
  assert.ok(modelQuoteMessage([catalogue[0]], "fr").includes("Référence BestSauna"));
});

test("model draft contexts survive reordering and language changes but isolate a changed shortlist", () => {
  const values = new Map(), storage = { getItem: k => values.get(k) ?? null, setItem: (k, v) => values.set(k, v), removeItem: k => values.delete(k) };
  const context = modelDraftContext(catalogue.slice(0, 2));
  const fields = { message: "Une note personnalisée — ne pas remplacer." };
  saveQuoteDraft(storage, context, fields, { fingerprint: "", key: "" }, 1000);
  assert.equal(readQuoteDraft(storage, modelDraftContext([catalogue[1], catalogue[0]]), 1001).fields.message, fields.message);
  assert.equal(readQuoteDraft(storage, modelDraftContext([catalogue[0], catalogue[2]]), 1001), null);
  assert.equal(modelDraftContext([catalogue[0]]), catalogue[0].id);
  assert.equal(modelDraftContext([]), "");
  assert.deepEqual(modelSlots, ["model1", "model2", "model3"]);
});
