import { productRecords } from "../content/products.ts";
import { publishedProducts } from "./product-catalogue.ts";

// Resolve per request: a long-lived Worker must not retain expired approvals.
// Never import raw records into a client component or send them as page props.
export function getPublishedProducts() {
  return publishedProducts(productRecords);
}
