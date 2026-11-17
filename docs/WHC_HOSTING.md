# WHC deployment

The owner selected WHC hosting on 2026-11-16. The existing owner-private Sites deployment remains a review copy. The public application uses Next.js on the existing WHC cPanel/CloudLinux Node runtime; it does not require a new hosting purchase.

## Build and release

Use Node 24 (WHC currently provides 24.22.3). Run `npm run verify`, `npm run build:whc`, then `npm run package:whc`. The archive is `outputs/bestsauna-whc.tar.gz`. The packager includes only compiled pages, public assets, runtime files and SQL migrations. It excludes credentials, environment files, local databases, Git and build caches. Install runtime dependencies using the included lockfile and `npm ci --omit=dev --ignore-scripts --no-audit --no-fund` on the Linux host. Do not copy macOS node_modules to WHC.

Use a dedicated application directory outside every public document root. The cPanel startup file is `app.cjs`. Set `NODE_ENV=production` and `BESTSAUNA_CONFIG_FILE` to the absolute private `runtime.env` path. Create the initial configuration once with `node whc/initialize.mjs ABSOLUTE_PRIVATE_DATA_DIRECTORY ABSOLUTE_DOCUMENT_ROOT`. The initializer refuses to replace an existing configuration. It generates the rate-limit secret without printing it and initially disables indexing and outbound notifications.

## Quote storage and request trust

Node's SQLite adapter runs the same checked SQL migrations as D1, under a write transaction with a migration ledger and checksums. Records live outside the application and document roots. The data directory is mode 0700; the database and runtime configuration are mode 0600. WAL and a busy timeout support concurrent Passenger workers. Deploying a new application release must not overwrite the data directory.

Passenger identifies clients using its protected `!~Passenger-Client-Address` header. Direct local tests use the socket address. Ordinary forwarded headers are ignored. Request-local context reaches the Next route without trusting visitor-supplied identity headers. Origin checks use the configured public origin, while the HTTP entry point rejects unexpected Host values and redirects the explicit www alias to the canonical host.

The existing quote validation, five-per-hour HMAC rate limiter, idempotency, reference creation and once-only Formspree notification claim are shared with the Worker build. Local migration tests send no emails. D1 records from the private review remain there; this deployment does not delete or transfer historical customer data.

The published privacy notice names WHC on the Node build and Cloudflare on the review Worker. Notice version `2026-11-16.4` accompanies new enquiries. Notifications continue to use the verified Formspree destination `info@bestsauna.ca` when enabled.

## Launch sequence and rollback

1. Add bestsauna.ca with its own cPanel document root, then install and register its Node application. Do not change other applications.
2. Keep WHC's authoritative DNS zone and its existing Forward Email MX/TXT records. Back up the zone and change only web-host records for bestsauna.ca/www.
3. Confirm HTTPS, canonical redirects, both languages, all assets, and a controlled database submission with notifications disabled. Inspect SQLite through an authorized terminal; never expose a public database viewer.
4. Enable `QUOTE_EMAIL_ENABLED=true` and `PUBLIC_INDEXABLE=true` only after the release checks. Restart only the BestSauna app. Robots and sitemap are runtime-generated, not frozen during compilation.
5. Verify ownership in Google Search Console and Bing Webmaster Tools and submit the public sitemap. A successful submission is not proof of indexing.

Keep the prior application release and a consistent SQLite backup before later migrations. To roll back code, switch the BestSauna app to the previous compatible release and restart it; retain the private database. Restore DNS from the saved zone only if necessary and preserve all mail records. Database migrations should be additive; do not downgrade a database or delete enquiries as part of a code rollback.

## References

- [WHC server specifications](https://help.whc.ca/en/articles/627459-what-are-your-server-s-technical-specifications)
- [cPanel Node.js applications](https://docs.cpanel.net/knowledge-base/web-services/how-to-install-a-node.js-application/)
- [Passenger secure HTTP headers](https://www.phusionpassenger.com/docs/advanced_guides/in_depth/node/secure_http_headers.html)
- [Next.js custom servers](https://nextjs.org/docs/app/guides/custom-server)

Deployment and indexing outcomes belong in the dated validation record; this procedure alone does not establish a successful launch.
