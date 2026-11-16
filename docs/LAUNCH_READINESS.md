# BestSauna launch readiness

This checklist separates a working review build from an operational public sales website. A completed build or a reachable review URL does not establish supplier agreements, delivery coverage or a monitored sales process.

## Review configuration

- Source repository: `GrafovGroup/BestSauna`, branch `main`.
- Sites project: `appgprj_6afb50c9831c8191825be1b8da69c2de`.
- Configured review destination: `https://bestsauna.dimagrafov.chatgpt.site`.
- Review access: private through the Sites access setting.
- Indexing: disabled by default; `PUBLIC_INDEXABLE` must explicitly equal `true` to enable it.

Verify the actual deployed version and access controls. Private access and search-indexing controls are separate. Never use `robots.txt` or `noindex` as a substitute for access control.

## Owner/provider inputs still required

| Area | Required evidence or decision before the corresponding public claim |
| --- | --- |
| Supplier and catalogue | Written sales authorization where required, approved models/configurations, availability, order terms and current product documentation. Planning contacts are not approved partners. |
| Product imagery | Permission for supplier photographs and correct association with the exact model. Existing editorial imagery must not become a false product listing or project portfolio. |
| Delivery | Priced destination-specific freight, unloading/placement responsibilities, access restrictions, damage handling and lead-time basis. |
| Installation coverage | A contractor-confirmed service map, actual scopes, qualifications, pricing, specialist trades and support responsibilities. Accepting a national enquiry does not establish national installation coverage. |
| Commercial applications | Model-specific suitability and warranty approval for the proposed commercial or rental use. |
| Telephone and mailbox | Verify `(833) 696-9996` routing and `info@bestsauna.ca` ownership/access. Source-code contact links do not prove either. |
| Monitored quotations | Assign an intake operator and review schedule; verify authorized retrieval of a controlled saved enquiry. Formspree notifications are implemented; verify the linked info@bestsauna.ca address, enable its Email workflow, set QUOTE_EMAIL_ENABLED=true and confirm a controlled notification. Check quota and failed/uncertain notification records. |
| Seller and quotation terms | Confirm the legal seller, customer-facing company details, payment/change/cancellation terms, delivery boundaries, warranty allocation and other terms needed for actual orders. Grafov Group Inc. is intended, not verified here against legal records. |
| Privacy and retention | Adopt a retention period and access/deletion procedure. Match the privacy notice to actual processors, storage and notifications. Implement deletion before promising automatic retention limits; do not claim Canadian-only data residency. |
| Public access and domain | Decide when to make the Sites project public, configure BestSauna.ca DNS/domain handling and verify HTTPS, canonical host behaviour and redirects. |
| Production indexing | Set `PUBLIC_SITE_URL` to the verified public origin and enable `PUBLIC_INDEXABLE` only for the approved public launch. Recheck canonical/hreflang, robots and sitemap output afterward. |

Category and planning pages can remain useful without a published product catalogue. Do not fill missing supplier data with invented models, prices, stock or approvals. Do not publish unresolved internal launch notes as customer-facing badges.

## Technical release checks

- [ ] Required Worker bindings and environment values are present; secrets remain server-side.
- [ ] The correct D1 migrations have been applied to the target environment.
- [ ] Typecheck, tests, verification and production build complete; the handoff records the actual commands and results.
- [ ] Both languages work at mobile and desktop widths, including navigation, language switching, quotation errors and saved-reference confirmation.
- [ ] A controlled request creates exactly one retrievable record; an unchanged retry returns the original reference.
- [ ] Failure, rate-limit and network-error states preserve the form and do not claim a successful save.
- [ ] The deployed origin has the intended access level and indexing state.
- [ ] Contact links, logos, images, favicons and nested-route asset paths work in the browsers actually checked.
- [ ] No invented reviews, dealer badges, medical benefits, national installation promises, product offers or maintenance claims have entered the published pages or structured data.

The intake, draft and notification tests pass; consult the dated verification record for the current count. They do not establish live deployment, working telephone/mailbox routing, notifications or active intake monitoring. Complete the checks against the actual configured review and production environments.

## Release record

Record the deployed commit, deployment URL/time, migration state, access/indexing settings, controlled enquiry reference and reviewing operator in the delivery record. Keep personal customer information and credentials out of the repository. Recheck this list when adding products, service regions, payments, uploads or notifications.
