# Product catalogue foundation

The source-managed catalogue is ready for actual, approved model/configuration records. It currently contains **no real products**. The ten sourcing archetypes in the planning brief remain research inputs. A two- or three-model comparison is implemented and becomes visible when at least two eligible models exist. There is no product admin dashboard, checkout, inventory feed or live pricing in this phase; the approach comparison remains available for category planning.

## Files and responsibilities

| File | Purpose |
| --- | --- |
| `content/products.ts` | Authoritative array of model records; currently empty. Server-side imports only. |
| `docs/product-record.template.json` | Blank draft worksheet. It is not imported by the application. |
| `lib/product-catalogue.ts` | Runtime schema, approval checks, public projection, routes, category membership and quote context. |
| `lib/published-catalogue.ts` | Single application entry point; rechecks publication eligibility per request. |
| `components/product-catalogue.tsx` | Bilingual catalogue cards and model detail layout. |
| `lib/model-comparison.ts`, `components/model-comparison.tsx` | Validated model selection, side-by-side/mobile comparison and shortlist quote handoff. |
| `scripts/check-catalogue.mjs` | Publication report and build gate, including local image existence. |

## Prepare a record

1. Copy the blank worksheet and keep `status: "draft"`. Assign a stable lowercase `id` using letters, numbers and single hyphens. Start with only the ID/status in `content/products.ts` if evidence is incomplete; optional top-level details can be filled progressively. The worksheet deliberately has blank enum values and must be completed before assigning it as a typed record.
2. Record the real manufacturer and exact model. Use one record per quoted configuration. Choose `category` from `outdoor`, `indoor`, `infrared`, `heaters`; `placement` from `indoor`, `outdoor`; `heat` from `electric`, `wood`, `infrared`; and the verified `uses` from `home`, `cottage`, `commercial`. A cottage listing does not by itself authorize rental or commercial use. Unsupported applications must remain absent.
3. Complete **both** language copies, including separate slugs, names, configuration, title, description, introduction, all seven specification fields, scope lists and commercial/warranty wording. For an inapplicable specification, write a truthful localized explanation rather than omitting the field. The system checks completeness; a human must check accuracy and Canadian French quality.
4. Store a licensed, exact-configuration raster image under `public/products/`, then use its root-relative path, actual pixel dimensions and bilingual alternative text. Supported extensions are WebP, PNG and JPEG. Do not reuse generated category imagery as a model photo. The image renders with `object-fit: contain`; no fictitious responsive variant is assumed. Add a public HTTPS manufacturer-document URL and its exact revision. No credentials or signed/private URLs.
5. Keep `pricing: "quotation-only"`. Specify how price, taxes, freight, scope, timing, availability, warranty, permitted use and order terms will be confirmed. Describe heater/control/stone inclusion, base work, assembly, unloading, placement, connections and packaging removal as applicable. Do not insert zero prices, invented stock or unsupported installation promises.

## Approval and publication

Each evidence group needs a **source reference, document version, verification date and verifier**:

| Evidence key | What the reviewer must verify |
| --- | --- |
| `identity` | Actual manufacturer/model/configuration, sales authority where applicable and supported environment/application. |
| `imageAndCopyRights` | Permission for photos/descriptions and their match to the exact configuration. |
| `specifications` | Dimensions, seating, materials, heater/controls, connections, required components and model-specific installation documentation. |
| `scope` | Customer-facing inclusions/exclusions and responsibility for delivery, assembly, preparation and specialist work. |
| `commercialTerms` | Approved quotation price basis, tax/freight treatment, availability/timing and order terms. |
| `warrantyAndUse` | Exact warranty and supported residential, rental or commercial applications. |
| `translations` | Matching EN/Canadian French copy, metadata, alt text and route meaning. |

Use document identifiers or approved source references. Keep contracts, negotiated supplier margins, private contacts, credentials and other confidential material out of the repository. Evidence and approval fields are never included in the public product projection.

An authorized reviewer supplies `approvedBy`, `approvedAt` and a business-chosen `reviewBy` date, then explicitly changes the record to `published`. Dates use `YYYY-MM-DD`; evidence must have been verified by the approval date. Future approvals, invalid calendar dates and overdue reviews fail validation. Approval is valid through `reviewBy` in UTC and is rechecked on each request. Cached or already-open pages are not an instant revocation mechanism; the sitemap has a five-minute cache policy. Re-review all affected evidence whenever model content changes. These software checks do not prove that approval or supplier evidence is authentic.

Run:

```sh
npm run catalogue:check
npm run verify
npm run build
```

Unfinished drafts report missing fields without blocking a release. Invalid published records, malformed envelopes, duplicate IDs, duplicate language slugs and missing published-image files block it. Build runs the catalogue check automatically. Any conflicting ID/slug withholds all affected records, including conflicts with drafts or archives; use a new unique identifier for a distinct configuration.

After validation, review the real imagery, translations and quote handoff at desktop and phone widths before deployment. To withdraw a model, set `status: "archived"` and deploy. Archived records are not publicly discoverable and their direct routes return 404. Redirects for renamed or retired models are outside this foundation; avoid changing stable IDs or slugs casually.

## Public behaviour

- Eligible models appear on the all-saunas page and their applicable category/cottage/commercial pages. Empty collections add no customer-facing placeholder section.
- Model routes are `/en/saunas/models/{en-slug}/` and `/fr/saunas/modeles/{fr-slug}/`, with reciprocal language links, canonical metadata, correctly sized social images and page/breadcrumb structured data.
- Only eligible models enter a public sitemap. The current private review site remains non-indexable with an empty sitemap. Product/Offer/review rich-result types remain deliberately gated.
- Model quote buttons retain the stable ID, category, placement, heat and localized source path. The server resolves the ID from eligible records and prefills the editable message with manufacturer, model and configuration. Arbitrary or unpublished query IDs cannot expose draft content.
- Existing form review, temporary tab drafts, persistence and email formatting carry that message. The selected model is an enquiry preference, not a stock reservation, accepted order or immutable order line. No database migration or notification change is required.
- Model IDs separate draft contexts, while EN/FR switches retain the same context and user edits. Changing to a different model does not import the previous model’s draft.

## Model comparison

When at least two eligible records exist, the comparison page gains model selectors and model cards/detail pages gain a comparison link. Visitors explicitly choose two or three different configurations. No models are selected or ranked by default. Native GET controls work without client JavaScript and store the choices in `model1`, `model2`, `model3`, alongside project use and requested service. The category approach form preserves applied model choices when changing its project context.

A desktop table compares manufacturer/model, configuration, placement, all seven specification fields, inclusions/exclusions, delivery, availability, timing, warranty, permitted use and order terms. Mobile readers open individual model cards using native accessible disclosure controls. All values come from the same public records as detail pages. No numeric capacity, feature score, stock or price is inferred from text.

Duplicate, malformed, unavailable or unpublished IDs are removed with a localized notice. At least two remaining models are required to show the comparison. Remove and clear controls preserve project/service context; language links retain only eligible model IDs and equivalent page paths. Fewer than two eligible catalogue records hides the model-comparison interface and entry links.

The shortlist CTA and the page’s header/bottom quote CTAs retain the selected models and requested project scope. Mixed categories, environments or heat types prefill `unsure`; matching values may prefill their common choice. A use not listed in every selected record produces a visible notice identifying the affected models, without asserting their suitability. The existing category-specific planning CTAs still describe the approach the visitor explicitly chose.

The quote page resolves all IDs again against current published records. The editable message includes exact manufacturer/model, configuration and stable IDs for up to three models within the existing 2,000-character limit. Model selection is not an inventory reservation or order. A changed shortlist gets a distinct temporary draft context; changing display order or language preserves the same shortlist draft. A direct `product` link retains its single-model meaning even if unrelated comparison parameters are also present. Unknown IDs cannot retrieve hidden record details.

Comparison query variants keep the comparison page’s canonical path and do not add sitemap URLs or Product/Offer markup. No new database fields or notification settings are required. The existing notification formatter carries the customer’s message.

## Tests and isolated visual QA

`tests/fixtures/catalogue.mjs` is synthetic test data, never production inventory. The normal application does not import it. Visual QA may use an ignored, isolated copy under `outputs/catalogue-preview/` with clearly labelled test imagery. Never replace the production array to obtain screenshots, never deploy the QA copy, and never send a test quote to Formspree merely to inspect this UI.
