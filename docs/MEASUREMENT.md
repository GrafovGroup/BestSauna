# First-party quotation measurement

BestSauna stores aggregate funnel counts in its existing private WHC SQLite database. It adds no third-party tracking service, tracking cookie, session replay, persistent visitor identifier or automatic customer messaging. `MEASUREMENT_ENABLED=true` enables both the browser collector and server collection; it is off by default. The retained private Sites copy remains off unless explicitly configured.

## What the counts mean

| Event | Trigger |
| --- | --- |
| `quote_view` | The quotation form mounts in a measured browser tab. |
| `quote_start` | The visitor edits a field or acknowledges the privacy notice. |
| `quote_review` | Required validation passes and the review screen opens. |
| `validation_client` | A review attempt fails browser validation; one event per affected fixed field label. |
| `validation_server` | The intake API rejects fields after review; fixed field labels only. |
| `quote_error` | The browser observes a network, rate-limit, conflict or unavailable outcome. |
| `quote_saved` | The server commits a new request carrying valid, permitted measurement context. A retry does not increment it. |

View/start/review are counted at most once per tab's 30-minute measurement window, including language changes. Errors can occur multiple times. Saved requests count new commits, not unique customers. Counts are not a matched visitor/session funnel: language can change between stages, one tab can submit multiple enquiries, and browser collection can be blocked or interrupted. Do not divide these totals and label the result a precise conversion rate. In particular, an offline error may also prevent its measurement request from arriving.

The dimensions are UTC date, a known public entry-page path, current page language, broad viewport category (`small` <700px, `medium` 700–1099px, `large` ≥1100px), event and optional fixed field/error label. Viewport category is not hardware identification. Entry-page attribution records the first page seen in this tab during the window; it is not proof that a search engine referred the visitor. Search Console and Bing Webmaster Tools remain the sources for search impressions, clicks and indexation.

## Privacy and boundaries

- The collector does not read form values, enquiry references, external referrers or URL queries. The server allowlists known page paths and fixed labels, rejecting extra properties. No customer records are joined to aggregates. Analytics fields are excluded from the quote's payload hash, stored enquiry and Formspree notification.
- Session storage contains only the entry path, expiry and completed-stage flags. There is no visit/user identifier. A new entry window starts after expiry on the next access. If storage is blocked, measurement uses page memory and may count repeated mounts.
- Each transmitted event gets a fresh random UUID; only its SHA-256 hash is retained for deduplication. These receipts expire after 24 hours. Daily aggregates older than 90 days and expired receipts are deleted during subsequent collection. Cleanup is activity-driven, not a timed deletion guarantee. Hosting access logs and private backups have separate handling.
- Browser Do Not Track and Global Privacy Control signals stop browser collection and clear its tab state on the next access. Corresponding HTTP headers also stop server collection. No third-party request is made by the collector; its same-origin request omits credentials and referrer information.
- The endpoint accepts same-origin JSON POST only, limits bodies to 8 KiB/24 events and applies a separate 120-request/hour HMAC rate bucket. Raw IPs are not stored. It shares the expiry table with quote intake but uses a separate namespace, so collection does not consume the customer's five-quote allowance.
- Clients cannot submit `quote_saved`. The server counts only new committed quotes, not idempotent retries. Measurement failure does not fail a quote or change email notification handling. Saved counts can therefore undercount during a measurement/database fault; private enquiries remain the operational source of truth.

The public English/French privacy notices describe this handling. New quotes acknowledge version `2026-11-17.2`; existing notices on saved records remain unchanged. This document describes implementation, not a legal compliance certification.

## Read the report

Use the authenticated WHC terminal, with the same hosting-account access controls as enquiry operations:

```sh
source /home/nvfglyl5/nodevenv/bestsauna-live/24/bin/activate
cd /home/nvfglyl5/bestsauna-live
export BESTSAUNA_CONFIG_FILE=/home/nvfglyl5/.bestsauna/runtime.env
node whc/measurement.mjs --days 30 --by landing
node whc/measurement.mjs --days 30 --by language
node whc/measurement.mjs --days 30 --by device
node whc/measurement.mjs --days 30 --by field
```

`--days` accepts 1–90, including today (UTC). `--by` accepts `landing`, `language`, `device`, `day` or `field`. Each report includes overall event totals and the requested breakdown. The field view includes validation events only. The tool opens SQLite read-only and provides no public reporting endpoint. Empty reports are normal before collection begins. Treat internal reports as business data.

Compare periods with enough activity, look for repeated field errors and review low-engagement entry pages before changing the form. Retain the distinct definitions above; browser counts and server saves need not match exactly. Test traffic can affect totals, so development runs belong in the local database with notifications disabled.

## Deployment

Migration `0003_lean_joshua_kane.sql` adds `measurement_daily`, `measurement_receipts` and an SQLite trigger. Inserting a new receipt increments its aggregate in the same transaction; duplicate receipt IDs do nothing. The trigger is intentionally included in the SQL migration and is not represented by Drizzle's table snapshot. Keep the migration immutable after deployment.

Back up private SQLite consistently before deploying. Set only `MEASUREMENT_ENABLED=true` in the existing private runtime configuration; never print or replace its other settings. Restart the BestSauna app. Verify the public HTML exposes `data-measurement="on"`, invalid measurement payloads are rejected, and the private report is accessible. Do not send a real quote merely to populate analytics.
