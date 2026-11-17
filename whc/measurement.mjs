#!/usr/bin/env node
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";
import { privateQuoteDatabasePath } from "./database.mjs";

export function measurementReport(db, { days = 30, by = "landing", now = Date.now() } = {}) {
  const columns = { landing: "entry_path", language: "language", device: "device", day: "day", field: "detail" };
  if (!Number.isInteger(days) || days < 1 || days > 90 || !Object.hasOwn(columns, by)) throw new Error("Invalid report options");
  const from = new Date(now - (days - 1) * 86400000).toISOString().slice(0, 10), through = new Date(now).toISOString().slice(0, 10);
  const totals = db.prepare("SELECT event, SUM(count) AS count FROM measurement_daily WHERE day BETWEEN ? AND ? GROUP BY event ORDER BY event").all(from, through);
  const filter = by === "field" ? "AND event IN ('validation_client', 'validation_server')" : "";
  const breakdown = db.prepare(`SELECT ${columns[by]} AS dimension, event, SUM(count) AS count FROM measurement_daily WHERE day BETWEEN ? AND ? ${filter} GROUP BY ${columns[by]}, event ORDER BY dimension, event`).all(from, through);
  return { from, through, timezone: "UTC", by, totals, breakdown, note: "Event counts, not unique people. Browser collection is best-effort; saved requests are counted only by the server. Small/medium/large describe viewport widths, not hardware. No rates or attribution claims are inferred." };
}
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  let db;
  try {
    const args = process.argv.slice(2), options = {};
    if (args.includes("--help")) {
      console.log("Private WHC measurement: node whc/measurement.mjs [--days 1..90] [--by landing|language|device|day|field]\nUses BESTSAUNA_CONFIG_FILE. Read-only aggregate counts; no customer records.");
    } else {
      for (let i = 0; i < args.length; i += 2) {
        const flag = args[i];
        if (!["--days", "--by"].includes(flag) || !args[i + 1] || Object.hasOwn(options, flag.slice(2))) throw new Error("Invalid arguments");
        if (flag === "--days" && !/^\d+$/.test(args[i + 1])) throw new Error("Invalid days");
        options[flag.slice(2)] = flag === "--days" ? Number(args[i + 1]) : args[i + 1];
      }
      process.chdir(fileURLToPath(new URL("../", import.meta.url)));
      if (process.env.BESTSAUNA_CONFIG_FILE) process.loadEnvFile(process.env.BESTSAUNA_CONFIG_FILE);
      const filename = privateQuoteDatabasePath();
      if (!existsSync(filename)) throw new Error("Missing initialized storage");
      db = new DatabaseSync(filename, { readOnly: true });
      db.exec("PRAGMA busy_timeout=5000");
      console.log(JSON.stringify(measurementReport(db, options), null, 2));
    }
  } catch { console.error("Measurement report unavailable. Check private configuration, migrations and --help options."); process.exitCode = 1; }
  finally { db?.close(); }
}
