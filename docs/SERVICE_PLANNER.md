# Delivery and installation planner

The delivery/installation pages now let visitors describe their requested service and work responsibilities before filling in the quotation form. The planner is available without published product records or confirmed local installation coverage. It creates an enquiry brief, not a price, site approval or booking.

## Customer journey

- The delivery-page hero opens the planner. Each of the three service cards can open it with that package selected. Homepage service-card links retain their direct quotation route.
- Seven fixed choices cover service, project use, indoor/outdoor location, access conditions, base/room preparation, unloading/placement and specialist connections. All work may remain undecided. No name, address or other free text is collected here.
- **Update my plan** submits a native GET form and focuses the result heading. Applied choices are represented in the URL and preserved through both language switches. Canonical metadata remains the base delivery-page URL; query combinations add no sitemap routes.
- Six task cards distinguish work the customer plans to arrange, work requested for assessment and work still to confirm. Assembly is requested for assembly/managed packages, while other responsibilities remain independent. Supply/delivery does not silently assign assembly to a contracted provider or claim it is included.
- A three-item checklist reflects the selected access, location and use. It requests project information without prescribing model-specific installation dimensions, connections or legal requirements. All service coverage, scope, pricing and readiness still require actual assessment and a written quotation.
- **Use this plan in my quote** is a submit button associated with the planner form, with the quote route as its `formAction`. It takes the current choices even if the visitor has edited controls without refreshing the summary. Header/bottom quote links carry the last applied URL state.
- **Start over** returns to the default undecided scope and the planner heading. It resets the planner URL; it does not erase a quote draft that the visitor may still want to resume.

## Quote handoff and drafts

The quote page accepts a planner handoff only with the explicit `planner=scope` marker. It validates every choice against `lib/service-planner.ts`; repeated or unknown values fall back to the documented defaults. Names, arbitrary text, addresses, outside URLs and other unexpected parameters are not imported.

The server generates a localized, editable message with all seven requested choices. Service, project use and placement prefill their existing form fields. Interest and heat remain `unsure`; a location or service package does not identify a sauna type. Source is the language-equivalent delivery/installation page.

The normal quote review, consent, temporary tab draft, validation and submission flow applies. Planner messages stay below the existing 2,000-character limit for every valid combination. Draft context includes the normalized seven choices, so language switching preserves edited notes and a different responsibility plan starts a separate brief. Existing general/model draft contexts remain compatible.

Valid direct-model or model-comparison handoffs retain precedence if a manually constructed URL mixes them with planner parameters. The planner does not silently append a second generated brief that could exceed the message limit. The regular site flow does not generate such mixed URLs.

No API/database fields, migrations, processors or notification settings were added. The existing customer message and source path are stored; the existing notification formatter includes that message. Tests use a mock transport and do not submit real Formspree notifications.

## Implementation and validation

- `lib/service-planner.ts`: allowlists, bilingual labels, URL normalization, quote message/context, task statuses and preparation checklist.
- `components/service-planner.tsx`: native form, responsive task cards, checklist and current-choice quote action.
- Shared content, shell and quote components: language links, entry points and validated prefills.
- `tests/service-planner.test.mjs`: all 3,888 combinations, invalid input, message length, quote defaults, independent responsibilities, contextual checklist and draft isolation.
- `tests/quote-service.test.mjs`: saved planning message and one mocked notification through the actual intake service.

Browser checks cover desktop/mobile layouts, language-preserved selections, fresh form values without a summary refresh, quote prefills, edited draft restoration and keyboard reset. See `VALIDATION.md` for the dated results. This tool does not establish a service area or authorize publication of location-specific claims.
