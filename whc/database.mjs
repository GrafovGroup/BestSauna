import { DatabaseSync } from "node:sqlite";
import { chmodSync, mkdirSync, readFileSync, readdirSync, realpathSync } from "node:fs";
import { createHash } from "node:crypto";
import { isAbsolute, join, relative, resolve } from "node:path";

let sharedDatabase;

/** Apply the same SQL migrations used by D1, once, inside a write transaction. */
export function openQuoteDatabase(filename, migrationDirectory) {
  const db = new DatabaseSync(filename);
  try {
    db.exec("PRAGMA busy_timeout = 5000; PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;");
    db.exec("BEGIN IMMEDIATE");
    db.exec("CREATE TABLE IF NOT EXISTS bestsauna_migrations (name TEXT PRIMARY KEY, checksum TEXT NOT NULL)");
    for (const name of readdirSync(migrationDirectory).filter(name => /^\d+.*\.sql$/.test(name)).sort()) {
      const sql = readFileSync(join(migrationDirectory, name), "utf8");
      const checksum = createHash("sha256").update(sql).digest("hex");
      const previous = db.prepare("SELECT checksum FROM bestsauna_migrations WHERE name = ?").get(name);
      if (previous) {
        if (previous.checksum !== checksum) throw new Error("An applied database migration has changed");
        continue;
      }
      db.exec(sql);
      db.prepare("INSERT INTO bestsauna_migrations (name, checksum) VALUES (?, ?)").run(name, checksum);
    }
    db.exec("COMMIT");
  } catch (error) {
    try { db.exec("ROLLBACK"); } catch { /* The transaction may not have started. */ }
    db.close();
    throw error;
  }
  function prepare(query, values = []) {
    return {
      bind(...bound) { return prepare(query, bound); },
      async first() { return db.prepare(query).get(...values) ?? null; },
      async run() { db.prepare(query).run(...values); return { success: true }; },
    };
  }
  return { prepare, close: () => db.close() };
}

export function getQuoteDatabase() {
  if (sharedDatabase) return sharedDatabase;
  const dataDirectory = process.env.BESTSAUNA_DATA_DIR;
  if (!dataDirectory || !isAbsolute(dataDirectory)) throw new Error("Set an absolute private BESTSAUNA_DATA_DIR");
  mkdirSync(dataDirectory, { recursive: true, mode: 0o700 });
  const actual = realpathSync(dataDirectory);
  const appDirectory = realpathSync(process.cwd());
  const inside = (parent, child) => { const path = relative(parent, child); return path === "" || (!path.startsWith("..") && !isAbsolute(path)); };
  // Keep records outside the application tree and all cPanel document roots.
  if (inside(appDirectory, actual) || actual.split("/").includes("public_html") ||
      (process.env.BESTSAUNA_DOCUMENT_ROOT && inside(resolve(process.env.BESTSAUNA_DOCUMENT_ROOT), actual))) {
    throw new Error("Quote storage must be outside the web and application directories");
  }
  chmodSync(actual, 0o700);
  const filename = join(actual, "quotes.sqlite");
  sharedDatabase = openQuoteDatabase(filename, join(appDirectory, "drizzle"));
  chmodSync(filename, 0o600);
  return sharedDatabase;
}
