#!/usr/bin/env node
import { fileURLToPath } from "node:url";
import { privateQuoteDatabasePath } from "./database.mjs";
import { openEnquiryOperations, OperationsError } from "./enquiry-operations.mjs";

const help = `BestSauna private enquiry operations (authenticated WHC terminal only)

node whc/enquiries.mjs summary
node whc/enquiries.mjs list [--queue new|active|due|unassigned|notifications|all] [--limit 20] [--offset 0]
node whc/enquiries.mjs show BS-YYYYMMDD-XXXXXXXXXXXX
node whc/enquiries.mjs update BS-YYYYMMDD-XXXXXXXXXXXX

Set BESTSAUNA_CONFIG_FILE to the existing private runtime.env before running.
Read commands do not apply migrations or change records. Lists omit customer contact details.
Update reads one JSON object from standard input (maximum 8 KiB), never command arguments.
Required: expectedRevision (from show/list), operator (1–80 characters).
Optional: status (new/in_progress/closed), assignedTo (0–80 characters),
followUpAt (UTC ISO date-time ending in Z, or null), note (0–2000 characters).
Closing clears the follow-up date. Reopening permits a new date.
Updates keep private history; they do not send email, change the original brief or place orders.
An operator label is a record of responsibility, not a separate login or verified identity.
`;

let store;
try {
  const [command, ...args] = process.argv.slice(2);
  if (!command || ["help", "--help", "-h"].includes(command)) {
    process.stdout.write(help);
  } else {
    let options = {}, ref;
    const invalid = () => { throw new OperationsError("invalid_command", "Use --help for supported commands and arguments."); };
    if (command === "list") {
      const flags = { "--queue": "queue", "--limit": "limit", "--offset": "offset" };
      for (let i = 0; i < args.length; i += 2) {
        if (!Object.hasOwn(flags, args[i])) invalid();
        const key = flags[args[i]];
        if (!key || args[i + 1] === undefined || Object.hasOwn(options, key)) invalid();
        if (key !== "queue" && !/^\d+$/.test(args[i + 1])) invalid();
        options[key] = key === "queue" ? args[i + 1] : Number(args[i + 1]);
      }
    } else if (command === "summary") {
      if (args.length) invalid();
    } else if (["show", "update"].includes(command)) {
      if (args.length !== 1) invalid();
      ref = args[0];
    } else invalid();

    let input;
    if (command === "update") {
      if (process.stdin.isTTY) process.stderr.write("Paste the update JSON, press Return, then Ctrl-D. Customer notes stay out of shell history.\n");
      const chunks = []; let size = 0;
      for await (const chunk of process.stdin) {
        size += chunk.length;
        if (size > 8192) throw new OperationsError("invalid_update", "Update input exceeds 8 KiB.");
        chunks.push(chunk);
      }
      try { input = JSON.parse(Buffer.concat(chunks).toString("utf8")); }
      catch { throw new OperationsError("invalid_update", "Supply one valid JSON object on standard input."); }
    }

    process.chdir(fileURLToPath(new URL("../", import.meta.url)));
    if (process.env.BESTSAUNA_CONFIG_FILE) process.loadEnvFile(process.env.BESTSAUNA_CONFIG_FILE);
    store = openEnquiryOperations(privateQuoteDatabasePath(), { writable: command === "update" });
    const result = command === "summary" ? store.summary() : command === "list" ? store.list(options) : command === "show" ? store.show(ref) : store.update(ref, input);
    process.stdout.write(JSON.stringify(result, null, 2) + "\n");
  }
} catch (error) {
  const known = error instanceof OperationsError;
  process.stderr.write(JSON.stringify({ error: known ? error.code : "operations_unavailable", message: known ? error.message : "Could not access enquiry operations. Check private configuration, migrations and database availability." }) + "\n");
  process.exitCode = error?.code === "revision_conflict" ? 2 : 1;
} finally { store?.close(); }
