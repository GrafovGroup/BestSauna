import { AsyncLocalStorage } from "node:async_hooks";
import { isIP } from "node:net";

// Next bundles route modules separately from the custom HTTP server. A shared
// process symbol keeps both copies on the same request-local store.
const key = Symbol.for("bestsauna.http-client-address");
const store = globalThis[key] ??= new AsyncLocalStorage();

export function withClientAddress(address, callback) {
  return store.run(address || null, callback);
}
export function currentClientAddress() { return store.getStore() ?? null; }

export function clientAddressFromRequest(request, passenger = Boolean(globalThis.PhusionPassenger), liteSpeed = Boolean(globalThis.LsNode)) {
  // Passenger rejects client-supplied !~ headers before forwarding a request.
  // Its reverse proxy means socket.remoteAddress is not the visitor's address.
  let address = passenger ? request.headers["!~passenger-client-address"] : request.socket.remoteAddress;
  if (!passenger && liteSpeed) {
    // WHC's lsnode shim hardcodes socket.remoteAddress to 127.0.0.1.
    // LiteSpeed appends its connection peer to X-Forwarded-For. Only the final
    // entry is trusted, and only inside the server-created LsNode runtime.
    // Never enable this branch merely because a visitor supplied a header.
    const forwarded = request.headers["x-forwarded-for"];
    address = typeof forwarded === "string" && forwarded.length <= 1024 ? forwarded.split(",").at(-1).trim() : null;
  }
  return typeof address === "string" && address.length <= 64 && isIP(address) ? address.toLowerCase() : null;
}
