# BestSauna enquiry operations

## What the form actually does

`POST /api/quotes` validates an enquiry and stores it in the private D1 database bound as `DB`. A successful response is `{ "ok": true, "reference": "BS-…", "notification": "accepted" }` (the notification status varies). Success means the database accepted the record. With `QUOTE_EMAIL_ENABLED=true`, the server also submits the saved enquiry to the owner-provided Formspree endpoint `https://formspree.io/f/mljbjqwy`. Formspree’s Email workflow determines the recipient; configure the verified address `info@bestsauna.ca`. `accepted` means Formspree accepted its API request, not proof of inbox delivery. No customer autoresponse is added by this integration. There is no public enquiry-reading endpoint.

Use “Your enquiry has been saved” / “Votre demande a été enregistrée” with the reference. Do not promise an email, an inbox delivery or a response deadline that has not been established.

## Configuration and database

- Apply both generated Drizzle migrations before using this release. `0001_rainy_black_tom.sql` appends notification tracking columns; existing enquiries default to `not_requested` and are not backfilled or emailed. Tables remain `quote_enquiries` and `quote_rate_limits`.
- Set `QUOTE_EMAIL_ENABLED=true` only after verifying the Formspree destination. Keep it unset/false in ordinary local development so tests do not send real notifications. The fixed endpoint cannot be replaced by form input.
- Configure the `DB` binding and a private `RATE_LIMIT_SECRET` of at least 32 characters. Keep the secret out of Git, client bundles and public environment files.
- Use the same-origin endpoint with JSON. The browser supplies a UUID in `Idempotency-Key` and retains it while retrying the same submission. Generate a new key after a confirmed submission or an intentional edit after a conflict.
- API responses are not cacheable. Validation uses server-side allowlists and length limits; field error codes are `required`, `invalid` and `too_long` for the frontend to translate.
- No attachments or marketing enrolment are collected in this release. Unexpected extra fields are not stored.

## Duplicate handling and abuse controls

The payload is normalized before hashing. A unique database constraint prevents duplicate idempotency keys. The same key and normalized payload return the original reference; a changed payload with the same key returns 409. Double-click protection in the browser complements this server protection.

The server allows five new validated submission attempts per trusted edge IP per fixed UTC hour. The limiter uses an atomic SQL increment. Already saved retries do not consume another allowance. Simultaneous not-yet-saved retries or a database failure can consume an attempt without creating an additional enquiry. Shared-network users can share the allowance. A 429 response includes `Retry-After`; show a clear retry message and preserve their values.

Only an HMAC-derived hourly rate-limit key is stored; the application does not store raw IP addresses. Expired rate-limit rows are deleted on a later successful submission. This is opportunistic cleanup, not a timed deletion guarantee. If no further submissions occur, expired rows may remain until an operator removes them. The Worker trusts `CF-Connecting-IP` supplied by the Cloudflare edge, not arbitrary forwarded headers. A loopback-only fallback supports local development.

The honeypot rejects a filled `website` field. It never returns pretend success. Requests are limited to 16 KiB while streaming. These controls do not claim to prevent all distributed abuse.

## Owner retrieval and intake responsibility

Read submissions through the authenticated Sites database tools for this site's D1 binding, restricted to authorized business operators. Filter `quote_enquiries` by `status = 'new'` and sort by `created_at`. A suitable operational query is:

```sql
SELECT reference, created_at, name, email, phone, location, intended_use,
       interest, service, timeframe, contact_method, language, message,
       commercial_details, source_path
FROM quote_enquiries
WHERE status = 'new'
ORDER BY created_at ASC;
```

Use the reference to locate the full record and record progress by updating `status` to `in_progress` or `closed`. Restrict database access and exported customer data. Do not publish query results, customer details or database exports in the repository.

**Before public launch, assign an operator to monitor intake and establish the review schedule.** Keep the database as a fallback if email is filtered, the quota is exhausted or Formspree is unavailable. The dated validation record distinguishes provider acceptance from independently confirmed inbox delivery.

## Privacy and records

Records include supplied contact/project information, language/source path, submission time, idempotency data and the accepted privacy-notice version. `privacyAccepted` confirms the form's displayed enquiry/privacy notice; it is not marketing consent. The application does not write submission bodies, email addresses, raw IPs or provider traces to its logs. Hosting-platform logging is governed separately by the actual platform configuration.

The implementation does not promise Canadian-only data residency or automatic enquiry deletion. The owner must adopt a retention period and access/deletion procedure, ensure the published privacy notice describes the actual processors and handling, and implement any required scheduled deletion before promising one. Contact and project details, source path, reference and privacy version are also sent to Formspree. The notification contains no idempotency key, payload hash or raw IP. Formspree stores submissions in its archive and the email provider processes notifications. The form stores version `2026-11-16.4`; update that version when the substantive notice changes. Coordinate customer-record deletion with applicable business requirements and backup/platform behaviour.

## Failure handling

- 422: field validation errors; retain values, show translated errors and focus the error summary.
- 409: the key was reused with changed content; let the user review the updated enquiry and submit it with a fresh key.
- 429: preserve values and respect `Retry-After`.
- 503 or a network failure: do not show success or clear the form. Retry the unchanged payload with the same key. If the first request committed but its response was lost, the retry returns its saved reference.
- Missing D1, short/missing rate-limit secret or a missing trusted edge IP outside local development fail closed with 503.

## Verification

Run `node --experimental-strip-types --test tests/quote-service.test.mjs`. Tests load the actual generated migrations into Node SQLite and exercise server validation, transport/body limits, privacy acceptance, idempotency, concurrent duplicates, the atomic limiter and persistence failures. These tests do not establish production deployment, owner monitoring or inbox delivery. Verify a controlled request against the configured site and confirm its database record before reporting production intake as verified.

## Notification behaviour and recovery

The React UI retains its existing validation, draft, review and error states. Its same-origin request reaches the WHC Node server (or the Cloudflare Worker on the private review copy); a native server `fetch` implements Formspree’s JSON/AJAX protocol after database storage. Replacing this with a second client-side SDK submission would bypass the database claim and risk duplicate notifications. The payload uses Formspree’s `email` reply-to field and a fixed subject containing the saved reference. WHC storage and proxy identity requirements are documented in `WHC_HOSTING.md`.

The Worker atomically changes a new enquiry from `pending` to `sending` before its one outbound request. An eight-second deadline bounds that request. No detached promise is used. Status values:

| Status | Meaning |
| --- | --- |
| `not_requested` | Email was disabled when stored, or this predates notification support. Never automatically backfilled. |
| `pending` | Saved, but the send has not been claimed. An identical API retry can claim it. |
| `sending` | The send was claimed; it may still be in flight or the process could have stopped. |
| `accepted` | Formspree returned successful JSON with `ok: true`; check the mailbox/workflow for delivery. |
| `failed` | Formspree returned a redirect (not followed) or a 4xx rejection, including 429 for quota/rate limits. |
| `unknown` | Network timeout, 5xx, malformed response or an internal status-update failure left the outcome uncertain. |

Notification failure never converts a committed enquiry into a failed submission. For pending/failed/uncertain outcomes the confirmation retains the reference and asks the visitor to email it, without submitting the form again. A failed status write leaves the durable `sending` claim to prevent an automatic second email. There is no scheduled retry job and no claim of exactly-once delivery from Formspree.

Operators should inspect stale `pending`/`sending`, `failed` and `unknown` rows alongside new enquiries:

```sql
SELECT reference, created_at, notification_status, notification_attempted_at,
       notification_accepted_at, notification_error
FROM quote_enquiries
WHERE notification_status IN ('pending', 'sending', 'failed', 'unknown')
ORDER BY created_at;
```

Check Formspree’s submission archive and workflow history for the reference before manually forwarding a notification. Do not reset uncertain rows and resend blindly: Formspree could already have accepted the original request. Review the saved enquiry directly and contact the customer through the normal business process. Fixed error codes contain no provider trace or personal data.

Formspree may return `ok: true` for a submission it later filters as spam. Check its Spam folder as well as the Inbox and D1 records; a false positive can be reviewed and marked “Not Spam” individually. The owner confirmed receipt of the recovered QA notification BS-20261116-FB396C3D4969. This verifies that message’s delivery after individual recovery; automatic unfiltered delivery remains a launch check. Formspree earlier displayed a hard-bounce error, but the owner’s receipt confirmation supersedes a claim that this message remains undelivered. If future messages actually bounce, investigate the recipient mail service and use Formspree’s official recovery page at https://formspree.io/unblock/info@bestsauna.ca, which requires a CAPTCHA.

Changing the recipient, CAPTCHA requirement, spam rules, quota or enabled state in Formspree can affect notifications without a code change. This integration was prepared for the observed enabled form with CAPTCHA disabled and Formshield enabled; it does not alter those controls. Keep the email workflow enabled, use a verified linked address, and monitor the account’s submission allowance.

Primary integration references: [Formspree JSON submission](https://formspree.io/blog/type-safe-form-pipeline/) and [special fields](https://help.formspree.io/articles/building-your-form/special-fields).
