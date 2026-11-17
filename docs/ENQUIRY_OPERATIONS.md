# BestSauna enquiry operations

## What the form actually does

`POST /api/quotes` validates an enquiry and stores it in private SQLite on WHC (or D1 bound as `DB` on the retained review Worker). A successful response is `{ "ok": true, "reference": "BS-…", "notification": "accepted" }` (the notification status varies). Success means the database accepted the record. With `QUOTE_EMAIL_ENABLED=true`, the server also submits the saved enquiry to the owner-provided Formspree endpoint `https://formspree.io/f/mljbjqwy`. Formspree’s Email workflow determines the recipient; configure the verified address `info@bestsauna.ca`. `accepted` means Formspree accepted its API request, not proof of inbox delivery. No customer autoresponse is added by this integration. There is no public enquiry-reading endpoint.

Use “Your enquiry has been saved” / “Votre demande a été enregistrée” with the reference. Do not promise an email, an inbox delivery or a response deadline that has not been established.

## Configuration and database

- Apply all three generated Drizzle migrations before using this release. `0001_rainy_black_tom.sql` appends notification tracking columns; existing enquiries default to `not_requested` and are not backfilled or emailed. `0002_sloppy_glorian.sql` adds private workflow and history tables; existing enquiries retain their original data and start at workflow revision 0.
- Set `QUOTE_EMAIL_ENABLED=true` only after verifying the Formspree destination. Keep it unset/false in ordinary local development so tests do not send real notifications. The fixed endpoint cannot be replaced by form input.
- Configure WHC private storage per `WHC_HOSTING.md` (or the review Worker `DB` binding) and a private `RATE_LIMIT_SECRET` of at least 32 characters. Keep the secret out of Git, client bundles and public environment files.
- Use the same-origin endpoint with JSON. The browser supplies a UUID in `Idempotency-Key` and retains it while retrying the same submission. Generate a new key after a confirmed submission or an intentional edit after a conflict.
- API responses are not cacheable. Validation uses server-side allowlists and length limits; field error codes are `required`, `invalid` and `too_long` for the frontend to translate.
- No attachments or marketing enrolment are collected in this release. Unexpected extra fields are not stored.

## Commercial project qualification

Commercial / hospitality enquiries show a separate bilingual brief: facility type, project stage, expected use, operating hours, existing equipment/plans, purchasing role/process and project requirements. Facility and stage are required choices with undecided options; remaining details are optional. The normal contact section identifies the project contact. No file upload, warranty approval, installation commitment or additional recipient is implied.

New forms send `commercialBriefVersion: 1`. The server validates fixed choices, types and field limits, then formats the localized brief into the existing private `commercial_details` column. Notifications include the same saved text. No migration or backfill is needed. Already-open legacy forms without the version remain compatible with the existing notes field; existing records are unchanged. Hidden commercial fields are removed from residential/cottage submissions by the client and server.

Drafts preserve the additional fields through language switching, and older drafts retain their existing commercial notes. The normal 30-minute expiry, consent, review step, idempotency and notification controls apply. Commercial-page and commercial-guide quotation links carry the intended use and source context.

## Duplicate handling and abuse controls

The payload is normalized before hashing. A unique database constraint prevents duplicate idempotency keys. The same key and normalized payload return the original reference; a changed payload with the same key returns 409. Double-click protection in the browser complements this server protection.

The server allows five new validated submission attempts per trusted edge IP per fixed UTC hour. The limiter uses an atomic SQL increment. Already saved retries do not consume another allowance. Simultaneous not-yet-saved retries or a database failure can consume an attempt without creating an additional enquiry. Shared-network users can share the allowance. A 429 response includes `Retry-After`; show a clear retry message and preserve their values.

Only an HMAC-derived hourly rate-limit key is stored; the application does not store raw IP addresses. Expired rate-limit rows are deleted on a later successful submission. This is opportunistic cleanup, not a timed deletion guarantee. If no further submissions occur, expired rows may remain until an operator removes them. The Worker trusts `CF-Connecting-IP` supplied by the Cloudflare edge, not arbitrary forwarded headers. WHC uses the runtime-specific trusted peer described in `WHC_HOSTING.md`; forwarded prefixes are ignored. A loopback-only fallback supports local development.

The honeypot rejects a filled `website` field. It never returns pretend success. Requests are limited to 16 KiB while streaming. These controls do not claim to prevent all distributed abuse.

## Owner retrieval and intake responsibility

Use the private command-line workflow through the authenticated WHC terminal. It reads `/home/nvfglyl5/.bestsauna/quotes.sqlite`; it has no public URL or separate admin login. Access is controlled by the hosting account and private filesystem permissions. Limit that account to authorized operators. An operator name in a note is self-reported attribution, not a verified individual identity.

```sh
source /home/nvfglyl5/nodevenv/bestsauna-live/24/bin/activate
cd /home/nvfglyl5/bestsauna-live
export BESTSAUNA_CONFIG_FILE=/home/nvfglyl5/.bestsauna/runtime.env
node whc/enquiries.mjs summary
node whc/enquiries.mjs list --queue new
node whc/enquiries.mjs list --queue due
node whc/enquiries.mjs list --queue notifications
```

`summary` gives counts without customer information. Queues are `new`, `active` (not closed), `due` (open and follow-up time reached), `unassigned` (open with no assignee), `notifications` (pending/sending/failed/unknown, including closed enquiries), and `all`. Due items sort by earliest follow-up; other queues sort oldest first with a stable reference tie-breaker. Queue output omits customer names, location, contact details and messages. `--limit` accepts 1–100, default 20; pass the returned `nextOffset` as `--offset` for the next page. Counts are live snapshots, not monitoring alerts.

Read an individual record with `node whc/enquiries.mjs show REFERENCE`, using its full saved `BS-…` reference. This displays customer contact/project details and the latest 50 history entries, newest first; `historyTotal` and `historyTruncated` disclose older entries. All entries remain in the private database. Protect terminal scrollback and exports as customer records. No idempotency keys, payload hashes, configuration secrets or raw IPs are included.

### Assign, follow up and record progress

Run `node whc/enquiries.mjs update REFERENCE`. At its prompt, paste one JSON object, press Return, then Ctrl-D. Input goes to the program, keeping note text out of shell command history. For scripted use, supply JSON on standard input from a protected source; never put customer notes in shell arguments, repository files or shared logs. Example values below are illustrative:

```json
{
  "expectedRevision": 0,
  "operator": "Your name",
  "status": "in_progress",
  "assignedTo": "Responsible operator",
  "followUpAt": "2026-11-20T15:00:00Z",
  "note": "Requested site measurements. Freight and installation scope still need confirmation."
}
```

Use the current `revision` from `show` or `list` as `expectedRevision`. Supply your operator name (1–80 characters). Optional fields are `status` (`new`, `in_progress`, `closed`), `assignedTo` (up to 80 characters; empty to unassign), `followUpAt` (valid UTC date-time ending in `Z`, or `null` to clear), and `note` (up to 2,000 characters). Convert local times to UTC explicitly; the command does not assume Toronto time. Each input is limited to 8 KiB. At least one actual change or nonempty note is required.

Closing clears the follow-up date and records that change; reopen before scheduling further work. Note-only updates are allowed, including on closed records. The original customer brief, contact details, consent and notification state cannot be edited through this tool. It does not send messages, retry notifications, create orders, confirm warranties or schedule reminders.

Every update writes the status, workflow and history together in one transaction. The history records operator, time, revision, before/after values and note. If another operator saved first, the command exits 2 with `revision_conflict`; read again, review the change and deliberately retry with the new revision. Do not blindly increment it. After an interrupted or uncertain command, read the record before retrying. Reusing a committed revision cannot create a second note. Other errors exit 1; successful operations exit 0. CLI errors hide underlying database/configuration traces.

Read commands open SQLite read-only and neither create a database nor apply migrations. Deployment initializes migrations through the existing application. The history is an operational record, not a tamper-proof audit: an authorized database administrator can change it. Use this workflow for status changes rather than manual SQL so history and revision checks remain reliable.

Historical private-review D1 records were not transferred or deleted. This WHC command does not access them; use authenticated Sites database tools when needed. Do not publish query results, customer details or database exports in the repository.

**Before public launch, assign an operator to monitor intake and establish the review schedule.** Keep the database as a fallback if email is filtered, the quota is exhausted or Formspree is unavailable. The dated validation record distinguishes provider acceptance from independently confirmed inbox delivery.

## Privacy and records

Records include supplied contact/project information, language/source path, submission time, idempotency data and the accepted privacy-notice version. `privacyAccepted` confirms the form's displayed enquiry/privacy notice; it is not marketing consent. The application does not write submission bodies, email addresses, raw IPs or provider traces to its logs. Hosting-platform logging is governed separately by the actual platform configuration.

Private workflow records add assignee, follow-up date, revision and operator history/notes. Keep notes factual, relevant and free of payment credentials or unnecessary sensitive information. They stay in the private database and are excluded from Formspree payloads and public quote responses. When an authorized retention/deletion process deletes the parent enquiry with foreign keys enabled, its workflow/history rows cascade with it. This command intentionally provides no deletion action; adopt an appropriate business process covering the database, backups, Formspree and mailbox copies.

The implementation does not promise Canadian-only data residency or automatic enquiry deletion. The owner must adopt a retention period and access/deletion procedure, ensure the published privacy notice describes the actual processors and handling, and implement any required scheduled deletion before promising one. Contact and project details, source path, reference and privacy version are also sent to Formspree. The notification contains no idempotency key, payload hash or raw IP. Formspree stores submissions in its archive and the email provider processes notifications. The form stores version `2026-11-17.1`; update that version when the substantive notice changes. Coordinate customer-record deletion with applicable business requirements and backup/platform behaviour.

## Failure handling

- 422: field validation errors; retain values, show translated errors and focus the error summary.
- 409: the key was reused with changed content; let the user review the updated enquiry and submit it with a fresh key.
- 429: preserve values and respect `Retry-After`.
- 503 or a network failure: do not show success or clear the form. Retry the unchanged payload with the same key. If the first request committed but its response was lost, the retry returns its saved reference.
- Missing database storage, short/missing rate-limit secret or a missing trusted edge IP outside local development fail closed with 503.

## Verification

Run `node --experimental-strip-types --test tests/quote-service.test.mjs`. Tests load the actual generated migrations into Node SQLite and exercise server validation, transport/body limits, privacy acceptance, idempotency, concurrent duplicates, the atomic limiter and persistence failures. These tests do not establish production deployment, owner monitoring or inbox delivery. Verify a controlled request against the configured site and confirm its database record before reporting production intake as verified.

## Notification behaviour and recovery

The React UI retains its existing validation, draft, review and error states. Its same-origin request reaches the WHC Node server (or the Cloudflare Worker on the private review copy); a native server `fetch` implements Formspree’s JSON/AJAX protocol after database storage. Replacing this with a second client-side SDK submission would bypass the database claim and risk duplicate notifications. The payload uses Formspree’s `email` reply-to field and a fixed subject containing the saved reference. WHC storage and proxy identity requirements are documented in `WHC_HOSTING.md`.

The server atomically changes a new enquiry from `pending` to `sending` before its one outbound request. An eight-second deadline bounds that request. No detached promise is used. Status values:

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

Formspree may return `ok: true` for a submission it later filters as spam. Check its Spam folder as well as the Inbox and private database records; a false positive can be reviewed and marked “Not Spam” individually. The owner confirmed receipt of the recovered QA notification BS-20261116-FB396C3D4969. This verifies that message’s delivery after individual recovery; automatic unfiltered delivery remains a launch check. Formspree earlier displayed a hard-bounce error, but the owner’s receipt confirmation supersedes a claim that this message remains undelivered. If future messages actually bounce, investigate the recipient mail service and use Formspree’s official recovery page at https://formspree.io/unblock/info@bestsauna.ca, which requires a CAPTCHA.

Changing the recipient, CAPTCHA requirement, spam rules, quota or enabled state in Formspree can affect notifications without a code change. This integration was prepared for the observed enabled form with CAPTCHA disabled and Formshield enabled; it does not alter those controls. Keep the email workflow enabled, use a verified linked address, and monitor the account’s submission allowance.

Primary integration references: [Formspree JSON submission](https://formspree.io/blog/type-safe-form-pipeline/) and [special fields](https://help.formspree.io/articles/building-your-form/special-fields).
