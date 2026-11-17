# BestSauna content evidence and publication gates

Internal implementation record. Updated 2026-11-17. This document is not customer-facing copy and is not evidence of a public commercial launch.

## Evidence status

The working sources are the owner's instructions, the approved “Launch Sauna Brand” chat direction, the original `BestSauna_Codex_Master_Prompt.txt`, repository content and supplied approved brand kit. The original master prompt was recovered from the owner's authenticated ChatGPT Library on 2026-11-16 and saved at the repository root. Source: https://chatgpt.com/library?file_id=libfile_fde3_f-7c0addcc79e88191b3f0cf66c45a2ada_fec494b6085c81919e703e0d461b9b17. Earlier work followed the owner-approved chat/repository direction; the recovered brief confirms that direction. Owner-provided information is identified below; it has not been converted into independent verification. No supplier outreach, contractor appointment, purchase or telephone call was performed. The owner confirmed receipt of a controlled notification test on 2026-11-16; see `ENQUIRY_OPERATIONS.md` for its delivery limitations.

| Item | Evidence currently available | Permitted use / current gate |
| --- | --- | --- |
| BestSauna.ca domain | Owner-authorized WHC domain and public HTTPS launch verified 2026-11-16. | Public origin is https://bestsauna.ca; DNS, HTTPS and search submission records are in `WHC_HOSTING.md`. |
| Repository | Owner supplied `github/grafovgroup/bestsauna.git`; parent build verified accessible `GrafovGroup/BestSauna`. | Authorized destination for website implementation. Repository availability does not establish fulfilment or trading readiness. |
| Brand direction | Owner selected concept 04, Pure Wordmark. Supplied PNG originals are in `public/brand`. | Preserve wordmark typography, charcoal `#22282B`, amber `#BA7C39`, the heat-cap on S, and amber `.ca`. No new independent emblem. |
| Brand source format | Raster PNG artwork, inspected. Light EN export has alpha; dark EN export has an opaque subtly varying charcoal background. | Do not describe these as vector masters. Avoid halo damage, distorted proportions and a mismatched footer rectangle. |
| French descriptor | Supplied FR artwork contains ENTRETIEN. No maintenance service has been established. | Do not use ENTRETIEN in the active site. Use the shared SERVICE descriptor or crop the approved descriptor out of the rendered wordmark. |
| Concept imagery | 37 distinct generated editorial placements; source filenames and technical exports are recorded in `ASSET_SOURCES.md`. | Category/lifestyle context only. They are not exact supplier models, completed projects, site-engineering examples, inventory evidence or certification evidence. |
| Telephone | Owner-provided planned number: `(833) 696-9996`; link `tel:+18336969996`. | May be displayed from supplied information in the review build. Routing and answer ownership remain unverified before public launch. |
| Email | Owner verified `info@bestsauna.ca` in Formspree and confirmed receipt of test reference `BS-20261116-FB396C3D4969`. | Quote notification recipient is configured. The test required manual spam recovery; ordinary unfiltered delivery and the monitored response process still need operational confirmation. |
| Operating company | Brief identifies intended operator Grafov Group Inc. | Confirm customer-facing seller identity and records before legal, order or checkout use; do not infer addresses or registration details. |
| Supplier approvals | No approved agreement, dealer territory, supply allocation, written terms or fulfilment arrangement supplied. | Do not display supplier-partner or authorized-dealer claims. Public enquiry routes researched during planning are not approvals. |
| Actual product catalogue | No approved model/configuration records, prices, stock, shipping dates, warranties or product photo rights supplied. The ten planning archetypes are sourcing briefs. | The source-managed foundation and publication gates are implemented; its real-model array is empty. Explain categories and accept project enquiries. Keep model listings unpublished until verified; Product/Offer markup remains gated. See `PRODUCT_CATALOGUE.md`. |
| Geographic foundation | Government of Canada province/territory names and alpha codes reviewed 2026-11-17; all 13 are represented in `content/coverage.ts`. | Use as geographic enquiry choices only. Local service records are separate and evidence-gated; no verified boundaries have been supplied. See `COVERAGE.md`. |
| Contractor coverage | No contracted crew map, capacity commitment, service boundary or completed installation evidence supplied. | Accept national project enquiries and confirm service availability individually. Do not claim nationwide installation, all-Ontario coverage, employees, local offices or completed work. |
| Service packages | Three scope concepts are approved in the brief: supply/delivery, supply/delivery/assembly and managed installation project. | Explain scope differences and quotation-dependent inclusions. Do not imply universal turnkey service or electrically ready operation after assembly. |
| Enquiry handling | Public WHC implementation stores requests in private SQLite and returns a saved reference; the private review copy retains D1. Controlled hosted persistence and idempotency were verified. | Structured commercial briefs use the same validated intake, storage and notification path. Follow `ENQUIRY_OPERATIONS.md`; database acceptance is not inbox delivery. |
| Reviews and claims | No reviews, customer counts, partner logos, awards, medical evidence or performance guarantees supplied. | Omit them. Do not fill visual proof sections with fabricated evidence. |

## Wordmark implementation review

The initial `BrandWordmark` and navigation components reference the same approved EN light image and use the accessible label BestSauna.ca. Using the shared SERVICE descriptor avoids implying an unestablished French maintenance offering. The reference plate containing the concept label is not a usable website logo.

For the source image at 2172 × 724, the visible alpha bounds are approximately x=167–2005 and y=181–563. The wordmark band occupies y=181–455; the descriptor occupies y=512–563. A CSS viewport may remove the descriptor while preserving the exact wordmark pixels and aspect ratio. This is a presentation crop, not a vector recreation. Inspect the rendered crop at desktop and phone widths before marking it passed. The light artwork requires a light background; dark footer treatment must use a compatible asset or a deliberate light logo area.

## Publish a real product only after the record is complete

- Establish the actual manufacturer, exact model identifier, supplier authority where relevant, and intended application. Record the source, document version, verification date and verifier.
- Obtain permission for supplier photographs and descriptions. Match each image to the actual configuration; do not substitute generated category imagery for a named model.
- Verify dimensions, usable seating, materials, heater/control choices, electrical or combustion documentation, required components, intended environment and model-specific installation instructions. Do not transfer values from a similar model.
- Specify inclusions and exclusions, including heater, controls, stones, roofing, assembly, freight, unloading, final placement, base preparation, specialist connections and packaging removal where applicable.
- Approve the customer price basis, taxes and freight treatment, payment/order terms, lead-time wording and real availability. Quotation-only offers must not use a fake zero price or invented stock state.
- Verify warranty and permitted residential, rental or commercial use for the exact application. Keep commercial suitability separate from residential documentation.
- Produce complete English and Canadian French descriptions, metadata, accessible image descriptions and equivalent routes.
- Require an explicit publication state. Draft or incomplete records must be absent from navigation, search, related products, comparisons, sitemaps, direct indexable routes and structured data.
- Add Product/Offer data only when the public model and offer support it. Never add invented reviews, rating counts or merchant policies.

## Publish a province or city page only when it is useful and true

- Document the actual delivery or service boundary, named internal service owner and evidence date. An accepted enquiry is not a local crew.
- Confirm contractor scope, current capacity and the customer's contracting relationship before promising assembly or managed work.
- Provide substantive local information such as verified access logistics, service limits, supported site-work coordination or actual projects used with permission.
- Cite current primary sources for jurisdiction-specific requirements. Avoid technical or legal claims inferred from another municipality.
- Keep offices, addresses, map pins and local telephone numbers absent unless real and authorized for publication.
- Publish the matching translation and reciprocal language metadata together. Keep unready locations out of all route discovery surfaces and sitemaps.

## Public launch inputs still owned by the business

The website can be reviewed with category and service-scope content while sourcing continues. Before opening it as a public commercial intake channel, the owner must confirm seller/contact details, monitored enquiry retrieval and notification arrangements, real delivery terms and advertised service coverage. Any model advertised as available needs its own approved evidence record. Checkout additionally needs payment, order, fulfilment and customer policy decisions.

Privacy copy must follow actual implementation: what the form collects, where it is stored, who receives it, why it is used, how access is controlled and how a customer can make a privacy request. Do not promise a retention period, third-party sharing practice, analytics setup or email delivery behavior that has not been decided and implemented. Keep marketing consent separate if marketing is added later; none is inferred from requesting a quotation.

This register should be updated when evidence changes. Replacing an unknown with an assumption does not clear a publication gate.
