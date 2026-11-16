import { readFile, readdir, stat } from "node:fs/promises";
import { dirname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { pages, pagePath } from "../content/site.ts";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = resolve(root, "public");
const errors = [];
const languages = ["en", "fr"];
const keys = new Set();
const routes = new Map();
const contentImages = new Set();
const checkedAssets = new Set();
const structuredTypes = new Set();

function check(condition, message) {
  if (!condition) errors.push(message);
}

function assetFile(url) {
  if (typeof url !== "string" || !url.startsWith("/") || url.startsWith("//") || /[?#]/.test(url)) {
    errors.push("Expected a root-relative local asset URL: " + String(url));
    return null;
  }
  const path = resolve(publicRoot, "." + url);
  if (!path.startsWith(publicRoot + sep)) {
    errors.push("Asset path escapes public/: " + url);
    return null;
  }
  return path;
}

async function asset(url) {
  const path = assetFile(url);
  if (!path) return null;
  try {
    const info = await stat(path);
    check(info.isFile() && info.size > 0, "Asset is not a nonempty file: " + url);
    checkedAssets.add(url);
    return path;
  } catch {
    errors.push("Missing public asset: " + url);
    return null;
  }
}

async function png(url, expectedSizes) {
  const path = await asset(url);
  if (!path) return;
  const data = await readFile(path);
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  if (data.length < 24 || !data.subarray(0, 8).equals(signature) || data.toString("ascii", 12, 16) !== "IHDR") {
    errors.push("Invalid PNG header: " + url);
    return;
  }
  const actual = data.readUInt32BE(16) + "x" + data.readUInt32BE(20);
  check(expectedSizes.includes(actual), url + " has " + actual + ", expected " + expectedSizes.join(" or "));
}

async function sourceFiles(folder) {
  const entries = await readdir(folder, { withFileTypes: true });
  const children = await Promise.all(entries.map(async (entry) => {
    const path = resolve(folder, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return /\.(?:[cm]?[jt]sx?)$/.test(entry.name) ? [path] : [];
  }));
  return children.flat();
}

check(Array.isArray(pages) && pages.length > 0, "The content collection must contain pages.");
for (const page of pages) {
  check(typeof page.key === "string" && page.key.length > 0, "A page is missing its key.");
  check(!keys.has(page.key), "Duplicate page key: " + page.key);
  keys.add(page.key);
  check(Object.keys(page.paths).sort().join(",") === "en,fr", page.key + " needs exactly one English and one French route.");
  check(Object.keys(page.copy).sort().join(",") === "en,fr", page.key + " needs both language copies.");
  for (const lang of languages) {
    const label = page.key + "/" + lang;
    const path = page.paths[lang];
    check(typeof path === "string" && path.startsWith("/" + lang + "/") && path.endsWith("/") && !/[?#]/.test(path), "Invalid canonical route: " + label);
    check(!routes.has(path), "Duplicate route: " + path);
    routes.set(path, label);
    check(pagePath(page.key, lang) === path, "Route helper mismatch: " + label);
    const copy = page.copy[lang];
    if (!copy) continue;
    for (const field of ["title", "description", "eyebrow", "heading", "intro"]) {
      check(typeof copy[field] === "string" && copy[field].trim().length > 0, label + " missing " + field);
    }
    check(Array.isArray(copy.sections) && copy.sections.length > 0, label + " has no sections.");
    for (const section of copy.sections ?? []) {
      check(typeof section.title === "string" && section.title.trim().length > 0, label + " has an untitled section.");
      check(Boolean(section.text?.trim() || section.bullets?.length || section.items?.length), label + " has an empty section: " + section.title);
    }
    if (copy.image) {
      check(copy.image.endsWith(".webp"), label + " image must match the current WebP editorial-image renderer.");
      check(typeof copy.imageAlt === "string" && copy.imageAlt.trim().length > 0, label + " image has no description.");
      contentImages.add(copy.image);
    } else {
      check(page.kind === "policy", label + " has no editorial image.");
    }
    for (const entry of copy.faq ?? []) {
      check(Boolean(entry.q?.trim() && entry.a?.trim()), label + " has an incomplete question/answer pair.");
    }
  }
}

check(keys.has("home"), "The shared shell needs a home page.");
for (const page of pages) {
  for (const lang of languages) {
    const related = page.copy[lang]?.related;
    check(Array.isArray(related), page.key + "/" + lang + " is missing related links.");
    for (const key of related ?? []) check(keys.has(key), page.key + "/" + lang + " links to unknown page: " + key);
  }
}
await Promise.all([...contentImages].flatMap((url) => [asset(url), asset(url.replace(/\.webp$/, "-800.webp"))]));

const manifestPath = await asset("/site.webmanifest");
let manifest;
if (manifestPath) {
  try { manifest = JSON.parse(await readFile(manifestPath, "utf8")); }
  catch { errors.push("site.webmanifest is not valid JSON."); }
}
if (manifest) {
  check(routes.has(manifest.start_url), "Manifest start_url is not a published language route.");
  check(Array.isArray(manifest.icons) && manifest.icons.length > 0, "Manifest has no icons.");
  for (const icon of manifest.icons ?? []) {
    const sizes = String(icon.sizes ?? "").split(/\s+/).filter(Boolean);
    check(sizes.length > 0, "Manifest icon has no declared size: " + icon.src);
    if (icon.type === "image/png") await png(icon.src, sizes);
    else await asset(icon.src);
  }
  for (const size of ["192x192", "512x512"]) {
    for (const purpose of ["any", "maskable"]) {
      check(manifest.icons?.some((icon) => String(icon.sizes).split(/\s+/).includes(size) && String(icon.purpose ?? "any").split(/\s+/).includes(purpose)), "Missing manifest " + purpose + " icon at " + size);
    }
  }
}
await Promise.all([
  png("/icons/favicon-16.png", ["16x16"]),
  png("/icons/favicon-32.png", ["32x32"]),
  png("/icons/apple-touch-icon.png", ["180x180"]),
]);

const icoPath = await asset("/favicon.ico");
if (icoPath) {
  const data = await readFile(icoPath);
  const valid = data.length >= 6 && data.readUInt16LE(0) === 0 && data.readUInt16LE(2) === 1;
  check(valid, "favicon.ico has an invalid ICO header.");
  if (valid) {
    const count = data.readUInt16LE(4);
    check(count > 0 && data.length >= 6 + count * 16, "favicon.ico has a truncated directory.");
    const sizes = new Set();
    for (let index = 0; index < count && 6 + (index + 1) * 16 <= data.length; index++) {
      const position = 6 + index * 16;
      const width = data[position] || 256;
      const height = data[position + 1] || 256;
      const length = data.readUInt32LE(position + 8);
      const offset = data.readUInt32LE(position + 12);
      check(offset >= 6 + count * 16 && length > 0 && offset + length <= data.length, "favicon.ico contains an invalid image entry.");
      sizes.add(width + "x" + height);
    }
    for (const size of ["16x16", "32x32", "48x48"]) check(sizes.has(size), "favicon.ico is missing its advertised " + size + " entry.");
  }
}

// These commercial schema types need verified offer, review or location evidence
// before their publication guard is deliberately updated.
const gatedTypes = new Set(["Product", "ProductGroup", "Offer", "AggregateOffer", "Review", "AggregateRating", "LocalBusiness", "Store"]);
const files = (await Promise.all(["app", "components"].map((dir) => sourceFiles(resolve(root, dir))))).flat();
const typePattern = /["']@type["']\s*:\s*(?:["']([^"']+)["']|\[([^\]]*)\])/g;
for (const file of files) {
  const code = await readFile(file, "utf8");
  const relative = file.slice(root.length + 1);
  check(!/bestsauna-wordmark-fr-(?:light|dark)\.png/.test(code), "Unconfirmed French maintenance-descriptor asset referenced in application: " + relative);
  for (const match of code.matchAll(typePattern)) {
    const types = match[1] ? [match[1]] : [...match[2].matchAll(/["']([^"']+)["']/g)].map((entry) => entry[1]);
    for (const type of types) {
      structuredTypes.add(type);
      check(!gatedTypes.has(type), "Evidence-gated " + type + " schema found in " + relative);
    }
  }
  // Check root-relative assets declared by active code, including brand files.
  const staticAssets = [...code.matchAll(/["'](\/(?:brand|icons|images)\/[^"'\s]+|\/favicon\.ico|\/site\.webmanifest)["']/g)].map((match) => match[1]);
  for (const url of new Set(staticAssets)) if (!checkedAssets.has(url)) await asset(url);
}
check(structuredTypes.has("Organization") && structuredTypes.has("WebSite"), "Base Organization/WebSite structured data is missing from application source.");

if (errors.length) {
  console.error("BestSauna content verification failed:");
  for (const error of errors) console.error("- " + error);
  process.exitCode = 1;
} else {
  console.log("BestSauna content verification passed.");
  console.log(pages.length + " bilingual page pairs; " + routes.size + " unique routes; all related links resolve.");
  console.log(contentImages.size + " editorial image sets; " + checkedAssets.size + " local assets checked, including responsive variants and icon headers/dimensions.");
  console.log("Publication guards passed. Present schema types: " + [...structuredTypes].sort().join(", ") + ".");
  console.log("Static checks do not establish supplier approval, contact routing, image rights or runtime delivery; those remain separate launch checks.");
}
