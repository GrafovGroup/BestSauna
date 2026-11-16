# BestSauna.ca

A bilingual Canadian sauna project and quotation website, using the approved **04 — Pure Wordmark** identity. The initial experience helps residential, cottage and commercial buyers compare options and request a project quotation.

The website contains **40 English/French content routes**, including three buying/planning guides in both languages. Categories explain project options; they are not an inventory of verified products. There is no checkout, fabricated pricing or claimed dealer authorization.

## Project destinations

| Item | Destination |
| --- | --- |
| Authoritative source repository | [GrafovGroup/BestSauna](https://github.com/GrafovGroup/BestSauna) |
| Current review branch | `codex/continue-build` — [draft PR #1](https://github.com/GrafovGroup/BestSauna/pull/1) |
| Sites project | `appgprj_6afb50c9831c8191825be1b8da69c2de` |
| Configured private review destination | [bestsauna.dimagrafov.chatgpt.site](https://bestsauna.dimagrafov.chatgpt.site) |
| Intended public domain | `BestSauna.ca` — domain/DNS and public access require a separate verified launch step |

The GitHub repository is the source of record. Sites receives a matching hosting copy. A configured project URL is not evidence that the latest source has been deployed; verify the actual deployment and access state before reporting it as live.

The default site origin is the private review destination. Search indexing remains disabled unless `PUBLIC_INDEXABLE` is explicitly set to `true`. Private access is a separate Sites hosting setting; `noindex` is not access control.

## Architecture

- **Application:** Vinext with React and Next-compatible routes, compiled for a Cloudflare Worker with static assets.
- **Content:** one bilingual page and route map in `content/site.ts`; customer-facing pages under `app/[lang]/`.
- **Quotations:** same-origin `POST /api/quotes`, with server validation and D1 storage.
- **Database:** Drizzle schema in `db/schema.ts`; versioned SQL migrations in `drizzle/`.
- **Hosting:** Sites tooling manages the review/deployment lifecycle and declared Cloudflare bindings.

This is not a PHP application or a standalone HTML export. Uploading its source or `dist/` directory to ordinary WHC shared hosting will not provide the Worker/D1 runtime. A WHC move would require an explicit supported architecture change and replacement of the quotation backend; a static export is **not currently supplied**.

## Local setup

Use Node.js **22.13.0 or later**, npm and the committed lockfile. The intake tests were run with Node.js 24.22.1. The portable development workflow supports macOS, Windows and Linux.

From a clean checkout:

```sh
npm run install:ci
```

Use the starter-owned installer once; do not overlap installers or replace the lockfile with an unrelated install. It performs the locked dependency install with required development and optional dependencies. A clean checkout selects the portable execution profile. Managed Sites workspaces use the Sites skill's execution-profile and installation helpers.

### Environment

| Setting | Purpose | Review behaviour |
| --- | --- | --- |
| `PUBLIC_SITE_URL` | Canonical origin used by site metadata | Defaults to `https://bestsauna.dimagrafov.chatgpt.site` |
| `PUBLIC_INDEXABLE` | Enables production indexing only when its value is exactly `true` | Unset/other values keep indexing disabled |
| `RATE_LIMIT_SECRET` | Private secret for HMAC-derived abuse-control keys | Required for form submission; at least 32 characters |
| `DB` | Cloudflare D1 binding for quotations and rate counters | Required for form submission |
| `QUOTE_EMAIL_ENABLED` | Set exactly `true` to notify through the approved Formspree form | Leave unset for offline/local tests; verify the Formspree recipient before enabling |

Configure hosted values through the Sites environment/binding controls. For local Cloudflare development, use an ignored `.dev.vars` file with local values, including a separate securely generated `RATE_LIMIT_SECRET`. Do not put real secrets into Git or any `PUBLIC_*` setting. `DB` is a binding declared by the hosting configuration, not a database password pasted into frontend code.

Missing database or rate-limit configuration makes the endpoint return an honest unavailable response. The site must never simulate a saved enquiry.

## Development and review

### Portable checkout

```sh
npm run dev
```

The portable starter uses Vinext development mode, normally on port 5173. Open the URL printed by the process and keep the server on loopback. You can pass a port explicitly:

```sh
npm run dev -- --port 5174
```

### Managed Sites workspace

Use the Sites skill's managed preview workflow and the URL returned by that workflow. It starts the managed Vite preview with its assigned host/port and lifecycle controls. Do not start a competing portable preview or replace the managed profile to work around a transient preview problem.

### Preview a production build locally

```sh
npm run build
npm start -- --env-file /absolute/path/to/your/checkout/.dev.vars
```

Replace the environment-file path with the absolute path to your ignored local file; Wrangler resolves relative environment paths from `dist/server/`. `npm start` runs the built Worker through local Wrangler. It does not deploy the site. Apply local D1 migrations before exercising the form; use the URL printed by the server.

## Database migrations

After changing `db/schema.ts`:

```sh
npm run db:generate
```

Review and commit the generated SQL and Drizzle metadata. The initial migration is `drizzle/0000_purple_scarlet_spider.sql`.

For a local D1-backed preview, build first to generate the runtime configuration, then apply each **pending** SQL migration in order:

```sh
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_purple_scarlet_spider.sql
```

Do not replay a migration already applied to that local database. The supplied command affects local state only. Production migrations belong to the managed Sites deployment workflow; a local migration does not establish production schema readiness.

## Verification commands

```sh
npm run typecheck
npm test
npm run verify
npm run build
```

See `package.json` for the current `verify` composition. The individual backend suite can also run directly:

```sh
node --experimental-strip-types --test tests/quote-service.test.mjs
```

The intake and notification suite uses the actual generated migrations with Node SQLite. It covers committed storage, validation, body limits, duplicate/concurrent retries, rate limits, configuration and write failures, SQL binding, Formspree payloads, one-time notification claims and uncertain provider outcomes. Tests use a mocked notification transport and never send email. See the current counts and live verification boundaries in `docs/VALIDATION.md`.

Before release, also review the actual English/French customer journeys at narrow and desktop widths, keyboard navigation, language switching, real endpoint behaviour, page metadata and images. Record only checks actually performed.

## Enquiry drafts and review

The bilingual form now has a details step and an explicit review-before-send step. A short-lived `sessionStorage` draft preserves entries across reloads and EN/FR navigation in the same tab. A new finder/service context starts a separate brief. Drafts expire 30 minutes after the last edit or send attempt; they are removed while the form remains open or on its next access, after a confirmed save, or with **Clear draft**. Consent and the honeypot are not restored. Storage failures leave the in-memory form usable and display a notice.

Retry identity is stored as a UUID and a SHA-256 payload fingerprint alongside the draft. An unchanged retry after reload uses the same key. No enquiry is sent until the visitor uses the final send button. Phone replies require a telephone number; validation includes a focused, linked error summary. The privacy notice records this browser storage behaviour with version `2026-11-16.3`.

`npm run verify` now includes five draft lifecycle tests as well as the intake and notification tests. See the dated continuation record in [Validation](docs/VALIDATION.md).

## How quotation intake works

The form sends a validated project enquiry to `/api/quotes`. A success response means the enquiry was committed to D1 and returns a reference beginning `BS-`. When `QUOTE_EMAIL_ENABLED=true`, the Worker then submits a notification to `https://formspree.io/f/mljbjqwy`. The recipient is set in Formspree’s Email workflow, with `info@bestsauna.ca` as the intended verified destination. No customer autoresponse is configured by this code.

- UUID idempotency keys allow safe retries after a lost response.
- A unique database constraint protects against duplicate inserts.
- A changed payload with a reused key returns a conflict.
- The rate limiter allows five new validated attempts per trusted edge IP per fixed UTC hour. Only HMAC-derived rate keys are stored.
- No file uploads or public enquiry retrieval endpoints are included.
- The browser should preserve values after an error and clear the form only after confirmed success.

Read enquiries and notification outcomes through the site's **authenticated Sites database tools**. Formspree acceptance is recorded separately from inbox delivery. Replays do not resend notifications, and uncertain failures require operator review rather than automatic duplicate email. Assign an intake operator and check the Formspree quota and destination before public launch. Detailed behaviour, retrieval SQL and failure handling are in [Enquiry operations](docs/ENQUIRY_OPERATIONS.md).

## Content, branding and publication

| Change | Where to work |
| --- | --- |
| Bilingual copy, equivalent routes and related links | `content/site.ts` |
| Page rendering, navigation and forms | `app/` and the relevant components |
| Guide summaries and section navigation | `content/guide-summaries.ts` and `components/guide-article.tsx` |
| Metadata, breadcrumbs, structured data and sitemap/robots generation | `lib/page-seo.ts` |
| Site origin, indexing and planned contacts | `lib/site-settings.ts` plus environment settings |
| Approved brand artwork | `public/brand/` |
| Editorial/category imagery | `public/images/` |
| Asset provenance and allowed presentation | [Asset sources](docs/ASSET_SOURCES.md) |
| Intake validation and persistence | `lib/quote-service.ts` |
| Database fields | `db/schema.ts` |

Keep the approved Pure Wordmark identity. The French `ENTRETIEN` artwork is gated on an actual maintenance offer; use the approved shared descriptor or descriptor-free treatment where appropriate. Do not imply brand certification or approved supplier status.

The current imagery illustrates sauna settings. It is not proof of a specific product, actual installation, certification, capacity or warranty. Real product pages require approved catalogue data and permission to use the supplier's actual images. Add English and French content together and preserve equivalent language routes.

Keep supplier wholesale costs, private financial assumptions, customer records and sensitive business documents out of this public-facing source handoff. Product and service claims must follow actual evidence rather than the existence of a page.

## Launch handoff

Review [Launch readiness](docs/LAUNCH_READINESS.md) before making the site public or changing indexing. The planned contact details are `info@bestsauna.ca` and `(833) 696-9996`; their appearance in source is not verification of mailbox ownership or telephone routing.

Grafov Group Inc. is the intended operating company. Confirm customer-facing seller details against the owner's business records before using them in binding quotations or final legal policies.

Deployment should preserve the repository as the source of record, copy the matching version to the authorized Sites project, apply its migrations and verify the live result. Changes to public access, BestSauna.ca DNS and indexing are explicit launch steps, separate from compiling or previewing the application.
