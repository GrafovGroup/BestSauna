# Coverage geography, planning and publication

The master prompt's sections 10 and 14 require national geographic data and separate, evidence-backed local service coverage. Geography is not service availability. The national coverage page now prepares a destination brief without inventing a contractor map, offices, prices, transit times or local service pages.

## Geographic source

`content/coverage.ts` contains the 13 provinces/territories with stable two-letter codes and English/French names. Codes follow the [Government of Canada's province/territory reference standard](https://www.canada.ca/en/government/system/digital-government/digital-government-innovations/enabling-interoperability/gc-enterprise-data-reference-standards/data-reference-standard-canadian-provinces-territories.html) and the [Language Portal's province/territory table](https://our-languages.canada.ca/en/writing-tips-plus/abbreviations-canadian-provinces-and-territories), reviewed 2026-11-17. These sources establish names and codes, not BestSauna service coverage.

The separate `ServiceAreaRecord` supports a province, territory, metropolitan area or more specific local boundary. Metropolitan/local records can reference multiple province codes where appropriate; a provincial/territorial record must match exactly one region of the corresponding kind. No actual service-area records have been supplied.

## Customer journey

- The coverage-page hero opens the native GET planner. Choose a province/territory, requested service and known access conditions. Service/access can remain undecided; location has no preselected province.
- **Prepare my brief** applies the current choices and focuses the result heading. Three preparation cards cover freight/receiving, unloading/placement and assembly/site work. Access guidance changes for roads, restricted access, seasonal constraints and transport transfers. Guidance depends on the customer's selections, not assumptions about everyone in a province.
- Header/footer language links preserve applied choices. The result and quotation calls to action clearly state that availability, costs and responsibilities require actual assessment and a written quotation.
- **Use this brief in my quote** submits the current form values, including controls changed since the result was last refreshed. It does not carry a stale summary.
- The quote handoff requires `coverage=project` and a valid region code. Unknown/repeated values are rejected or normalized to undecided values. Query parameters contain fixed choices only; no names, city, postal code, address or arbitrary text are imported.
- The generated, editable message records the province/territory, service and access. Requested service prefills the existing field. The visitor still supplies city/postal code, intended use and placement; geography does not guess those answers or a product type.
- Temporary quote drafts preserve edited notes through language switching and remain isolated by normalized location/service/access context. Valid model handoffs take priority, followed by the delivery/installation scope planner, then this destination planner. Normal navigation does not create mixed handoffs.
- The existing validation, privacy notice, review, private database, idempotency and notification path handles the message. No new database column, processor, email recipient, upload or geolocation permission is introduced.

## Local service publication

`serviceAreaRecords` starts empty. A future record must have a unique identifier, explicit geographic boundary, service types, complete English/French name/boundary/scope/exclusions, evidence reference, approval, verification date and validity end date. Assembly or managed scopes additionally require actual contractor confirmation. These fields record a human evidence review; a nonempty string is not independent proof of the underlying agreement.

`publishedCoverageAreas` allows only published, complete, current and uniquely identified records. Draft, archived, incomplete, expired, future-dated and duplicate records are omitted. Only public summary fields leave this helper; private evidence references and approver names are excluded. Current dates use UTC date boundaries. Expiry is checked at render time and at build verification; do not configure a long-lived cached page that defeats that check.

The coverage page can display these verified summaries when genuine records are supplied. The current release publishes none. It does not create individual city/province routes. Any later location page also needs meaningful verified local content, an explicit route, translations, its own image and corresponding SEO review; adding a geography or draft record must not create an indexable page automatically.

Run `npm run coverage:check` before publication. Both production builds and `npm run verify` include the check; invalid published records fail the build. Do not place credentials, customer records or confidential contract contents in a public repository. Keep private supporting documents in authorized business storage and use an appropriate reference.

## Validation

The tests cover all 260 valid destination/service/access combinations in both languages, message length, malformed/repeated inputs, privacy of query serialization, draft isolation, geographic consistency, evidence expiry, contractor requirements and exclusion of private evidence. The intake integration test stores the generated brief and checks one mocked notification across identical retries. See `VALIDATION.md` for browser and hosted checks; no real notification is sent by the tests.
