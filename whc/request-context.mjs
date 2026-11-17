import { AsyncLocalStorage } from "node:async_hooks";

// Next bundles route modules separately from the custom HTTP server. A shared
// process symbol keeps both copies on the same request-local store.
const key = Symbol.for("bestsauna.http-client-address");
const store = globalThis[key] ??= new AsyncLocalStorage();

export function withClientAddress(address, callback) {
  return store.run(address || null, callback);
}
export function currentClientAddress() { return store.getStore() ?? null; }

export function clientAddressFromRequest(request, passenger = Boolean(globalThis.PhusionPassenger)) {
  // Passenger rejects client-supplied !~ headers before forwarding a request.
  // Its reverse proxy means socket.remoteAddress is not the visitor's address.
  const address = passenger ? request.headers["!~passenger-client-address"] : request.socket.remoteAddress;
  return typeof address === "string" && address.length <= 64 && /^[a-f\d:.]+$/i.test(address) ? address : null;
}
