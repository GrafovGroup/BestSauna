import test from "node:test";
import assert from "node:assert/strict";
import { defaultServicePlan, hasServicePlan, readServicePlan, servicePlanChoices, servicePlanKeys, servicePlanQuery, servicePlanQuoteQuery, servicePlanMessage, servicePlanContext, servicePlanTasks, servicePlanChecklist } from "../lib/service-planner.ts";
import { readQuoteDraft, saveQuoteDraft } from "../lib/quote-draft.ts";

test("planner accepts only explicit known choices and never carries arbitrary query text", () => {
  assert.deepEqual(readServicePlan({}), defaultServicePlan);
  for (const key of servicePlanKeys) {
    for (const value of ["<script>", "unverified", [servicePlanChoices[key][0]], "x".repeat(10000)]) {
      assert.equal(readServicePlan({ [key]: value })[key], defaultServicePlan[key]);
    }
  }
  assert.equal(hasServicePlan({ planner: "scope" }), true);
  assert.equal(hasServicePlan({ planner: ["scope"] }), false);
  assert.equal(hasServicePlan({}), false);
  assert.equal(hasServicePlan({ planner: "other" }), false);
  const cleaned = servicePlanQuery(readServicePlan({ name: "private-name", location: "private-location", source: "https://outside.example/", service: "assembly" }));
  assert.equal(cleaned.includes("private"), false); assert.equal(cleaned.includes("outside"), false);
});

test("every planner combination round-trips and produces a complete bilingual message within the enquiry limit", () => {
  let combinations = [{}];
  for (const key of servicePlanKeys) combinations = combinations.flatMap(plan => servicePlanChoices[key].map(value => ({ ...plan, [key]: value })));
  assert.equal(combinations.length, 3888);
  for (const plan of combinations) {
    const query = Object.fromEntries(new URLSearchParams(servicePlanQuery(plan)));
    assert.equal(hasServicePlan(query), true); assert.deepEqual(readServicePlan(query), plan);
    for (const lang of ["en", "fr"]) {
      const message = servicePlanMessage(plan, lang);
      assert.ok(message.length <= 2000); assert.equal(message.includes("undefined"), false);
      assert.equal(message.split("\n").length, 8);
      assert.equal(servicePlanTasks(plan, lang).length, 6);
      assert.equal(servicePlanChecklist(plan, lang).length, 3);
    }
  }
});

test("quote handoff preserves requested work without inferring a sauna type, heat or service availability", () => {
  const plan = readServicePlan({ service: "managed", use: "cottage", placement: "outdoor", access: "remote", preparation: "arranged", handling: "request", connections: "unsure" });
  for (const source of ["/en/delivery-installation/", "/fr/livraison-installation/"]) {
    const query = new URLSearchParams(servicePlanQuoteQuery(plan, source));
    assert.deepEqual(readServicePlan(Object.fromEntries(query)), plan);
    assert.equal(query.get("interest"), "unsure"); assert.equal(query.get("heat"), "unsure");
    assert.equal(query.get("placement"), "outdoor"); assert.equal(query.get("source"), source);
    for (const forbidden of ["price", "available", "approved", "message", "location"]) assert.equal(query.has(forbidden), false);
  }
});

test("service packages never imply that requested site work or connections are included", () => {
  for (const service of servicePlanChoices.service) {
    const tasks = servicePlanTasks({ ...defaultServicePlan, service }, "en");
    for (const key of ["delivery", "preparation", "handling", "connections", "handover"]) assert.equal(tasks.find(task => task.key === key).status, "confirm", `${service}/${key}`);
    assert.equal(tasks.find(task => task.key === "assembly").status, ["assembly", "managed"].includes(service) ? "requested" : "confirm");
  }
  for (const [choice, status] of [["arranged", "customer"], ["request", "requested"], ["unsure", "confirm"]]) {
    const tasks = servicePlanTasks({ ...defaultServicePlan, preparation: choice, handling: choice, connections: choice }, "fr");
    for (const key of ["preparation", "handling", "connections"]) assert.equal(tasks.find(task => task.key === key).status, status);
  }
});

test("site checklist changes for restricted, remote, indoor and commercial projects", () => {
  const limited = servicePlanChecklist(readServicePlan({ access: "restricted", placement: "indoor", use: "commercial" }), "en");
  assert.match(limited[0], /steps, gates/); assert.match(limited[1], /room measurements/); assert.match(limited[2], /Commercial or rental/);
  const remote = servicePlanChecklist(readServicePlan({ access: "remote", placement: "outdoor", use: "cottage" }), "fr");
  assert.match(remote[0], /étapes de transport/); assert.match(remote[1], /emplacement extérieur/); assert.match(remote[2], /locative/);
});

test("planner drafts retain edits across languages and isolate changed work responsibilities", () => {
  const values = new Map(), storage = { getItem: k => values.get(k) ?? null, setItem: (k, v) => values.set(k, v), removeItem: k => values.delete(k) };
  const plan = readServicePlan({ service: "assembly", preparation: "arranged", handling: "request" });
  const context = servicePlanContext(plan);
  saveQuoteDraft(storage, context, { message: "Une note ajoutée par le client." }, { fingerprint: "", key: "" }, 1000);
  const paired = readServicePlan(Object.fromEntries(new URLSearchParams(servicePlanQuoteQuery(plan, "/fr/livraison-installation/"))));
  assert.equal(readQuoteDraft(storage, servicePlanContext(paired), 1001).fields.message, "Une note ajoutée par le client.");
  assert.equal(readQuoteDraft(storage, servicePlanContext({ ...plan, handling: "arranged" }), 1001), null);
  assert.equal(readQuoteDraft(storage, "[]", 1001), null);
});
