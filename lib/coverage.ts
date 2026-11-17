import { canadianRegions, type RegionCode, type ServiceAreaRecord } from "../content/coverage.ts";
import { servicePlanCopy } from "./service-planner.ts";
type Lang = "en" | "fr";
type Search = Record<string, string | string[] | undefined>;
export const coverageServices = ["unsure", "supply", "assembly", "managed"] as const;
export const coverageAccess = ["unsure", "road", "restricted", "seasonal", "transfer"] as const;
export type CoveragePlan = { region: RegionCode | ""; service: typeof coverageServices[number]; access: typeof coverageAccess[number] };
export const defaultCoveragePlan: CoveragePlan = { region: "", service: "unsure", access: "unsure" };

export function readCoveragePlan(search: Search): CoveragePlan {
  return {
    region: typeof search.region === "string" && canadianRegions.some(r => r.code === search.region) ? search.region as RegionCode : "",
    service: coverageServices.includes(search.service as CoveragePlan["service"]) ? search.service as CoveragePlan["service"] : "unsure",
    access: coverageAccess.includes(search.access as CoveragePlan["access"]) ? search.access as CoveragePlan["access"] : "unsure",
  };
}
export function hasCoveragePlan(search: Search) { return search.coverage === "project" && readCoveragePlan(search).region !== ""; }
export function coveragePlanQuery(plan: CoveragePlan) { return new URLSearchParams({ coverage: "project", region: plan.region, service: plan.service, access: plan.access }).toString(); }
export function coverageQuoteQuery(plan: CoveragePlan, source: string) { return new URLSearchParams({ coverage: "project", region: plan.region, service: plan.service, access: plan.access, interest: "unsure", source }).toString(); }
export function coveragePlanContext(plan: CoveragePlan) { return "coverage:" + coveragePlanQuery(plan); }
export function regionName(code: CoveragePlan["region"], lang: Lang) { return canadianRegions.find(r => r.code === code)?.name[lang] ?? ""; }
export function coverageServiceName(service: CoveragePlan["service"], lang: Lang) { return servicePlanCopy[lang].options.service[service]; }
export function coverageAccessName(access: CoveragePlan["access"], lang: Lang) {
  const labels = {
    en: { unsure: "Not yet assessed", road: "Road access to assess", restricted: "Limited access, gates or stairs", seasonal: "Seasonal road or receiving limits", transfer: "Ferry, onward freight or another transfer" },
    fr: { unsure: "Pas encore évalué", road: "Accès routier à évaluer", restricted: "Accès limité, portails ou escaliers", seasonal: "Restrictions saisonnières d’accès ou de réception", transfer: "Traversier, transport supplémentaire ou autre transfert" },
  };
  return labels[lang][access];
}
export function coverageChecklist(plan: CoveragePlan, lang: Lang) {
  const t = (en: string, fr: string) => lang === "fr" ? fr : en;
  const access = {
    unsure: t("Identify the carrier’s proposed stopping point, who can receive the shipment and the route to the sauna location.", "Précisez le point d’arrêt prévu du transporteur, qui peut recevoir l’envoi et le trajet jusqu’au sauna."),
    road: t("Describe the approach road, parking or turning space and receiving arrangements. Road access alone does not confirm that a delivery vehicle can reach the site.", "Décrivez la voie d’accès, le stationnement ou l’espace de manœuvre et la réception. Un accès routier ne confirme pas à lui seul qu’un véhicule de livraison peut atteindre le site."),
    restricted: t("List gates, stairs, narrow passages and limits on vehicle access. Prepare measurements and photos for follow-up before confirming the delivery point.", "Notez les portails, escaliers, passages étroits et limites d’accès des véhicules. Préparez des mesures et des photos pour le suivi avant de confirmer le point de livraison."),
    seasonal: t("State when the route is usable and when someone can receive the shipment. Include closures or seasonal constraints that need checking before scheduling.", "Précisez quand le trajet est accessible et quand quelqu’un peut recevoir l’envoi. Indiquez les fermetures ou contraintes saisonnières à vérifier avant de fixer la livraison."),
    transfer: t("Identify each transport stage and transfer point. Ask who books, receives and unloads each leg, and which costs are included in the quotation.", "Précisez chaque étape de transport et point de transfert. Demandez qui réserve, reçoit et décharge à chaque étape, et quels coûts sont inclus dans la soumission."),
  };
  return [
    { title: t("Freight & receiving", "Transport et réception"), detail: access[plan.access] },
    { title: t("Unloading & final placement", "Déchargement et mise en place"), detail: t("Describe the distance and route from the carrier’s delivery point to the final position. Confirm unloading equipment, labour and responsibility separately.", "Décrivez la distance et le trajet du point de livraison du transporteur à l’emplacement final. Confirmez séparément l’équipement, la main-d’œuvre et les responsabilités de déchargement.") },
    { title: t("Assembly & site work", "Assemblage et travaux sur place"), detail: plan.service === "supply" ? t("Your request is for supply and delivery. Identify who will arrange assembly, site preparation and specialist connections, or request a broader scope.", "Votre demande concerne la fourniture et la livraison. Précisez qui organise l’assemblage, la préparation et les raccordements spécialisés, ou demandez une portée plus large.") : t("Confirm the actual service boundary, crew availability and written tasks for your address. A requested package does not reserve a crew or establish local coverage.", "Confirmez la zone réelle, la disponibilité de l’équipe et les tâches écrites pour votre adresse. Le service demandé ne réserve pas une équipe et ne confirme pas la couverture locale.") },
  ];
}
export function coveragePlanMessage(plan: CoveragePlan, lang: Lang) {
  const fr = lang === "fr";
  return [
    fr ? "Projet de livraison et de services — à évaluer pour ma destination :" : "Delivery and service enquiry — to assess for my destination:",
    `${fr ? "Province ou territoire" : "Province or territory"}: ${regionName(plan.region, lang)} (${plan.region})`,
    `${fr ? "Service demandé" : "Requested service"}: ${coverageServiceName(plan.service, lang)}`,
    `${fr ? "Accès à évaluer" : "Access to assess"}: ${coverageAccessName(plan.access, lang)}`,
    fr ? "Veuillez confirmer le transport, le point de livraison, le déchargement et la disponibilité des travaux pour mon emplacement. Je préciserai la ville et le code postal dans le formulaire." : "Please confirm freight, the delivery point, unloading and site-work availability for my location. I will add the city and postal code in the form.",
  ].join("\n");
}

function validDate(value: string) { return /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value; }
export function coverageAreaIssues(area: ServiceAreaRecord, today: string) {
  const issues: string[] = [];
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(area.id)) issues.push("Invalid area identifier");
  if (!["province", "territory", "metro", "local"].includes(area.geography)) issues.push("Invalid geographic type");
  if (!area.regions.length || new Set(area.regions).size !== area.regions.length || area.regions.some(code => !canadianRegions.some(r => r.code === code))) issues.push("Valid region codes required");
  if ((area.geography === "province" || area.geography === "territory") && (area.regions.length !== 1 || canadianRegions.find(r => r.code === area.regions[0])?.kind !== area.geography)) issues.push("Geographic type must match its region");
  if (!area.services.length || new Set(area.services).size !== area.services.length || area.services.some(service => !["delivery", "assembly", "managed"].includes(service))) issues.push("Explicit service scope required");
  for (const lang of ["en", "fr"] as const) for (const key of ["name", "boundary", "scope", "exclusions"] as const) if (!area.copy?.[lang]?.[key]?.trim()) issues.push(`Missing ${lang} ${key}`);
  const evidence = area.evidence;
  if (!evidence?.reference?.trim() || !evidence?.approvedBy?.trim()) issues.push("Evidence and approval required");
  if (!validDate(evidence?.verifiedOn ?? "") || !validDate(evidence?.validThrough ?? "") || evidence.verifiedOn > today || evidence.validThrough < today || evidence.validThrough < evidence.verifiedOn) issues.push("Current dated evidence required");
  if (area.services.some(s => s === "assembly" || s === "managed") && evidence?.contractorConfirmed !== true) issues.push("Contractor confirmation required");
  return issues;
}
export function publishedCoverageAreas(records: readonly ServiceAreaRecord[], today: string) {
  return records.filter(area => area.status === "published" && records.filter(other => other.id === area.id).length === 1 && coverageAreaIssues(area, today).length === 0).map(area => ({ id: area.id, regions: [...area.regions], services: [...area.services], copy: area.copy }));
}
