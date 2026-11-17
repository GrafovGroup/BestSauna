import { createServer } from "node:http";
import next from "next";
import { withClientAddress, clientAddressFromRequest } from "./request-context.mjs";
import { getQuoteDatabase } from "./database.mjs";

const production = process.env.NODE_ENV === "production";
const configured = new URL(process.env.PUBLIC_SITE_URL || "http://127.0.0.1:5173");
const loopback = ["127.0.0.1", "localhost", "[::1]"].includes(configured.hostname);
if (production && configured.protocol !== "https:" && !loopback) throw new Error("Production requires an HTTPS PUBLIC_SITE_URL");
if (!process.env.RATE_LIMIT_SECRET || process.env.RATE_LIMIT_SECRET.length < 32) throw new Error("Configure RATE_LIMIT_SECRET before starting");
getQuoteDatabase(); // Fail startup rather than silently accepting enquiries without storage.

const app = next({ dev: !production, dir: process.cwd(), hostname: configured.hostname, port: Number(process.env.PORT || 5173) });
await app.prepare();
const handle = app.getRequestHandler();
const server = createServer((request, response) => {
  const incomingHost = request.headers.host?.toLowerCase();
  const canonicalHost = configured.host.toLowerCase();
  // Reject arbitrary Host headers. Redirect the explicitly supported www alias.
  if (production && incomingHost !== canonicalHost) {
    if (incomingHost === `www.${canonicalHost}` && ["GET", "HEAD"].includes(request.method || "")) {
      const target = new URL(configured.origin);
      const source = new URL(request.url || "/", "http://request.invalid");
      target.pathname = source.pathname; target.search = source.search;
      response.writeHead(308, { Location: target.href }); response.end(); return;
    }
    response.writeHead(421); response.end("Misdirected request"); return;
  }
  // Only Passenger's unspoofable secure header (or a direct local socket) may
  // identify the client. Ordinary forwarding headers are visitor-controlled.
  const address = clientAddressFromRequest(request);
  delete request.headers["cf-connecting-ip"];
  delete request.headers["x-forwarded-for"];
  delete request.headers["x-real-ip"];
  request.headers["x-forwarded-host"] = configured.host;
  request.headers["x-forwarded-proto"] = configured.protocol.slice(0, -1);
  response.setHeader("X-Content-Type-Options", "nosniff");
  withClientAddress(address, () => handle(request, response)).catch(() => {
    if (!response.headersSent) response.writeHead(500, { "Cache-Control": "no-store" });
    response.end();
  });
});
// Passenger hooks listen(); local verification uses an ordinary loopback port.
server.listen(Number(process.env.PORT || 5173), "127.0.0.1", () => console.log("BestSauna server ready"));
