import { stat } from "node:fs/promises";
import { resolve } from "node:path";
import { productRecords } from "../content/products.ts";
import { inspectCatalogue } from "../lib/product-catalogue.ts";

const inspected = inspectCatalogue(productRecords);
let failed = false;
for (const record of inspected) {
  console.log(`${record.id}: ${record.status}${record.issues.length ? ` — ${record.issues.length} publication checks outstanding` : " — publication checks complete"}`);
  for (const issue of record.issues) console.log(`  ${issue}`);
  failed ||= record.blocking;
  if (record.product) {
    try {
      const file = await stat(resolve("public", record.product.image.src.slice(1)));
      if (!file.isFile() || !file.size) throw new Error("empty or non-file");
    } catch {
      console.error(`${record.id}: approved product image is missing or empty: ${record.product.image.src}`);
      failed = true;
    }
  }
}
console.log(`Catalogue: ${inspected.filter(record => record.product).length} published, ${inspected.filter(record => record.status === "draft").length} drafts, ${inspected.filter(record => record.status === "archived").length} archived.`);
if (!inspected.length) console.log("No real model records supplied. Category and project enquiries remain available.");
if (failed) process.exitCode = 1;
