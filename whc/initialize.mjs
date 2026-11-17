import { randomBytes } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { isAbsolute, join } from "node:path";

// Run once on WHC. Never include this private output in a deployment archive.
const directory = process.argv[2];
const documentRoot = process.argv[3];
if (!directory || !documentRoot || !isAbsolute(directory) || !isAbsolute(documentRoot)) throw new Error("Supply absolute private data and public document-root paths");
mkdirSync(directory, { recursive: true, mode: 0o700 });
const config = [
  "PUBLIC_SITE_URL=https://bestsauna.ca", "PUBLIC_INDEXABLE=false", "QUOTE_EMAIL_ENABLED=false",
  "NEXT_TELEMETRY_DISABLED=1", `BESTSAUNA_DATA_DIR=${directory}`, `BESTSAUNA_DOCUMENT_ROOT=${documentRoot}`,
  `RATE_LIMIT_SECRET=${randomBytes(32).toString("hex")}`, "",
].join("\n");
// Exclusive creation protects an existing installation and its secret.
writeFileSync(join(directory, "runtime.env"), config, { flag: "wx", mode: 0o600 });
console.log("Private WHC configuration initialized; indexing and notifications await launch verification.");
