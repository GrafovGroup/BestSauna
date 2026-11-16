# BestSauna enquiry operations

## What the form actually does

`POST /api/quotes` validates an enquiry and stores it in the private D1 database bound as `DB`. A successful response is `{ "ok": true, "reference": "BS-…" }`. It means the database accepted the record. **Version 1 does not send email, webhooks, customer receipts or other notifications.** There is no public enquiry-reading endpoint.

Use “Your enquiry has been saved” / “Votre demande a été enregistrée” with the reference. Do not promise an email, an inbox delivery or a response deadline that has not been established.

## Configuration and database

- Apply the generated Drizzle migrations before using the form. Tables are `quote_enquiries` and `quote_rate_limits`.
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

**Before public launch, assign an operator to monitor intake and establish the review schedule. If inbox notification is the intended operational route, it must first be implemented, configured and verified with an authorized controlled submission.** A functioning database form without a monitored retrieval process is not a completed sales-intake operation. This document does not claim that operator monitoring or email delivery has already been verified.

## Privacy and records

Records include supplied contact/project information, language/source path, submission time, idempotency data and the accepted privacy-notice version. `privacyAccepted` confirms the form's displayed enquiry/privacy notice; it is not marketing consent. The application does not write submission bodies, email addresses, raw IPs or provider traces to its logs. Hosting-platform logging is governed separately by the actual platform configuration.

The implementation does not promise Canadian-only data residency or automatic enquiry deletion. The owner must adopt a retention period and access/deletion procedure, ensure the published privacy notice describes the actual processors and handling, and implement any required scheduled deletion before promising one. The form stores version `2026-11-16`; update that version when the substantive notice changes. Coordinate customer-record deletion with applicable business requirements and backup/platform behaviour.

## Failure handling

- 422: field validation errors; retain values, show translated errors and focus the error summary.
- 409: the key was reused with changed content; let the user review the updated enquiry and submit it with a fresh key.
- 429: preserve values and respect `Retry-After`.
- 503 or a network failure: do not show success or clear the form. Retry the unchanged payload with the same key. If the first request committed but its response was lost, the retry returns its saved reference.
- Missing D1, short/missing rate-limit secret or a missing trusted edge IP outside local development fail closed with 503.

## Verification

Run `node --experimental-strip-types --test tests/quote-service.test.mjs`. Tests load the actual generated migrations into Node SQLite and exercise server validation, transport/body limits, privacy acceptance, idempotency, concurrent duplicates, the atomic limiter and persistence failures. These tests do not establish production deployment, owner monitoring or inbox delivery. Verify a controlled request against the configured site and confirm its database record before reporting production intake as verified.
