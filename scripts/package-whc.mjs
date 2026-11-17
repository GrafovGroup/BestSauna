import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";

const root = process.cwd();
if (!existsSync(".next/BUILD_ID")) throw new Error("Run npm run build:whc first");
if (!existsSync("whc/package-lock.json")) throw new Error("Generate the locked WHC runtime dependencies first");
const output = resolve("outputs/whc-release");
rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });
for (const name of ["public", "drizzle", "whc", "app.cjs"]) cpSync(name, resolve(output, name), { recursive: true });
cpSync(".next", resolve(output, ".next"), { recursive: true, filter: source => !resolve(source).startsWith(resolve(root, ".next/cache")) });
cpSync("whc/package.json", resolve(output, "package.json"));
cpSync("whc/package-lock.json", resolve(output, "package-lock.json"));
writeFileSync(resolve(output, "next.config.mjs"), "export default { trailingSlash: true };\n");
writeFileSync(resolve(output, "release.json"), JSON.stringify({
  sourceCommit: execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim(),
  sourceHasChanges: Boolean(execFileSync("git", ["status", "--porcelain"], { encoding: "utf8" }).trim()),
  buildId: readFileSync(".next/BUILD_ID", "utf8").trim(), builtAt: new Date().toISOString(),
}, null, 2));
const archive = resolve("outputs/bestsauna-whc.tar.gz");
execFileSync("tar", ["-czf", archive, "-C", output, "."], { env: { ...process.env, COPYFILE_DISABLE: "1" } });
console.log(JSON.stringify({ directory: output, archive }));
