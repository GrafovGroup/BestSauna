import type { Lang } from "../content/site";
import { projectUses, serviceScopes } from "./sauna-comparison.ts";

export const servicePlanChoices = {
  service: serviceScopes, use: projectUses, placement: ["unsure", "outdoor", "indoor"],
  access: ["unsure", "ground", "restricted", "remote"],
  preparation: ["unsure", "arranged", "request"],
  handling: ["unsure", "arranged", "request"],
  connections: ["unsure", "arranged", "request"],
} as const;
export type ServicePlanKey = keyof typeof servicePlanChoices;
export type ServicePlan = { [K in ServicePlanKey]: typeof servicePlanChoices[K][number] };
type Search = Record<string, string | string[] | undefined>;
export const servicePlanKeys = Object.keys(servicePlanChoices) as ServicePlanKey[];
export const defaultServicePlan: ServicePlan = { service: "unsure", use: "home", placement: "unsure", access: "unsure", preparation: "unsure", handling: "unsure", connections: "unsure" };

export function hasServicePlan(search: Search) { return search.planner === "scope"; }
export function readServicePlan(search: Search): ServicePlan {
  return Object.fromEntries(servicePlanKeys.map(key => {
    const value = search[key];
    return [key, typeof value === "string" && (servicePlanChoices[key] as readonly string[]).includes(value) ? value : defaultServicePlan[key]];
  })) as ServicePlan;
}
export function servicePlanQuery(plan: ServicePlan) {
  return new URLSearchParams({ planner: "scope", ...Object.fromEntries(servicePlanKeys.map(key => [key, plan[key]])) }).toString();
}
export function servicePlanQuoteQuery(plan: ServicePlan, source: string) {
  const query = new URLSearchParams(servicePlanQuery(plan));
  // Location and service choices do not establish a sauna or heating type.
  query.set("interest", "unsure"); query.set("heat", "unsure"); query.set("source", source);
  return query.toString();
}
export function servicePlanContext(plan: ServicePlan) { return "scope:" + servicePlanQuery(plan); }

type PlanCopy = { fields: Record<ServicePlanKey, string>; options: { [K in ServicePlanKey]: Record<ServicePlan[K], string> } };
export const servicePlanCopy: Record<Lang, PlanCopy> = {
  en: {
    fields: { service: "Requested service", use: "Your project", placement: "Sauna location", access: "Delivery access", preparation: "Base or room preparation", handling: "Unloading and final placement", connections: "Specialist connections" },
    options: {
      service: { unsure: "Help me define the scope", supply: "Supply & delivery", assembly: "Supply, delivery & assembly", managed: "Managed installation project" },
      use: { home: "My home", cottage: "My cottage", commercial: "Commercial / hospitality" },
      placement: { unsure: "Still deciding", outdoor: "Outdoors", indoor: "Indoors" },
      access: { unsure: "Not yet assessed", ground: "Ground-level route to assess", restricted: "Steps, gates or limited access", remote: "Remote or seasonal access" },
      preparation: { unsure: "Help me decide who handles it", arranged: "I will arrange it with my contractor", request: "Please assess it for my quotation" },
      handling: { unsure: "Help me decide who handles it", arranged: "I will arrange it with my contractor", request: "Please assess it for my quotation" },
      connections: { unsure: "Help me decide who handles it", arranged: "I will arrange the specialist work", request: "Please assess it for my quotation" },
    },
  },
  fr: {
    fields: { service: "Service demandé", use: "Votre projet", placement: "Emplacement du sauna", access: "Accès de livraison", preparation: "Préparation de la base ou de la pièce", handling: "Déchargement et mise en place finale", connections: "Raccordements spécialisés" },
    options: {
      service: { unsure: "Aidez-moi à définir la portée", supply: "Fourniture et livraison", assembly: "Fourniture, livraison et assemblage", managed: "Projet d’installation coordonné" },
      use: { home: "Ma résidence", cottage: "Mon chalet", commercial: "Commercial / hébergement" },
      placement: { unsure: "À déterminer", outdoor: "À l’extérieur", indoor: "À l’intérieur" },
      access: { unsure: "Pas encore évalué", ground: "Accès au niveau du sol à évaluer", restricted: "Marches, portails ou accès limité", remote: "Accès éloigné ou saisonnier" },
      preparation: { unsure: "Responsable à déterminer", arranged: "Je l’organiserai avec mon entrepreneur", request: "À évaluer pour ma soumission" },
      handling: { unsure: "Responsable à déterminer", arranged: "Je l’organiserai avec mon entrepreneur", request: "À évaluer pour ma soumission" },
      connections: { unsure: "Responsable à déterminer", arranged: "J’organiserai les travaux spécialisés", request: "À évaluer pour ma soumission" },
    },
  },
};
export function servicePlanValue(plan: ServicePlan, key: ServicePlanKey, lang: Lang) {
  return (servicePlanCopy[lang].options[key] as Record<string, string>)[plan[key]];
}
export function servicePlanMessage(plan: ServicePlan, lang: Lang) {
  const title = lang === "fr" ? "Portée demandée pour la livraison et l’installation — à confirmer :" : "Requested delivery and installation scope — to be confirmed:";
  return title + "\n" + servicePlanKeys.map(key => `${servicePlanCopy[lang].fields[key]}: ${servicePlanValue(plan, key, lang)}`).join("\n");
}

export type ServiceTask = { key: string; title: string; status: "customer" | "requested" | "confirm"; detail: string };
export function servicePlanTasks(plan: ServicePlan, lang: Lang): ServiceTask[] {
  const text = (en: string, fr: string) => lang === "fr" ? fr : en;
  const responsibility = (value: ServicePlan["preparation"]) => value === "arranged" ? "customer" : value === "request" ? "requested" : "confirm";
  return [
    { key: "delivery", title: text("Equipment & delivery", "Équipement et livraison"), status: "confirm", detail: text("Confirm the exact package, freight, delivery point and receiving arrangements in the quotation.", "Confirmez l’ensemble exact, le transport, le point de livraison et la réception dans la soumission.") },
    { key: "preparation", title: plan.placement === "indoor" ? text("Room preparation", "Préparation de la pièce") : plan.placement === "outdoor" ? text("Base & site preparation", "Préparation de la base et du site") : text("Site preparation", "Préparation du site"), status: responsibility(plan.preparation), detail: text("Identify who assesses and prepares the location against the selected model’s requirements. An existing base or room still needs to be checked.", "Précisez qui évalue et prépare l’emplacement selon les exigences du modèle. Une base ou une pièce existante doit aussi être vérifiée.") },
    { key: "handling", title: text("Unloading & placement", "Déchargement et mise en place"), status: responsibility(plan.handling), detail: text("Define who receives, unloads and moves the shipment from the carrier’s delivery point to its final position.", "Précisez qui reçoit, décharge et déplace l’envoi du point de livraison du transporteur jusqu’à son emplacement final.") },
    { key: "assembly", title: text("Assembly", "Assemblage"), status: plan.service === "assembly" || plan.service === "managed" ? "requested" : "confirm", detail: plan.service === "supply" ? text("Assembly is outside the requested supply-and-delivery scope. Identify your installer or change the service request if you need assembly help.", "L’assemblage est en dehors de la portée de fourniture et de livraison demandée. Précisez votre installateur ou modifiez la demande si vous souhaitez de l’aide.") : text("Confirm the kit, assembly tasks, local crew availability and readiness requirements. Assembly alone does not complete every installation task.", "Confirmez l’ensemble, les travaux d’assemblage, la disponibilité locale et la préparation requise. L’assemblage ne termine pas à lui seul toute l’installation.") },
    { key: "connections", title: text("Specialist connections", "Raccordements spécialisés"), status: responsibility(plan.connections), detail: text("Confirm the specialists, model-specific connection requirements and their written scope. A managed project does not automatically include every trade.", "Confirmez les spécialistes, les exigences de raccordement du modèle et leur portée écrite. Un projet coordonné n’inclut pas automatiquement tous les métiers.") },
    { key: "handover", title: text("Finishing & handover", "Finition et remise"), status: "confirm", detail: text("List remaining work, documentation, packaging removal and the agreed completion point before scheduling.", "Précisez les travaux restants, la documentation, le retrait des emballages et la fin convenue des travaux avant l’échéancier.") },
  ];
}

export function servicePlanChecklist(plan: ServicePlan, lang: Lang) {
  const text = (en: string, fr: string) => lang === "fr" ? fr : en;
  const access = {
    unsure: text("Identify the unloading point and trace the full route to the proposed sauna location.", "Repérez le point de déchargement et le trajet complet jusqu’à l’emplacement prévu du sauna."),
    ground: text("Check route widths, turns, surfaces and the distance from unloading to final placement. Ground-level access still needs assessment.", "Vérifiez la largeur du passage, les virages, les surfaces et la distance jusqu’à l’emplacement final. Un accès au niveau du sol doit aussi être évalué."),
    restricted: text("List steps, gates, tight turns and other access limits. Have measurements and photos ready for the project review.", "Notez les marches, portails, virages serrés et autres limites d’accès. Préparez des mesures et des photos pour l’examen du projet."),
    remote: text("Describe transport stages, seasonal road limits and receiving arrangements. Confirm each transfer and unloading responsibility.", "Décrivez les étapes de transport, les limites routières saisonnières et la réception. Confirmez la responsabilité de chaque transfert et déchargement."),
  };
  return [
    access[plan.access],
    plan.placement === "indoor" ? text("Prepare room measurements and the route through doors or corridors for the exact kit or cabin.", "Préparez les dimensions de la pièce et du passage par les portes ou corridors pour l’ensemble ou la cabine exacte.") : plan.placement === "outdoor" ? text("Identify the proposed outdoor location and who will assess the base and surrounding site.", "Repérez l’emplacement extérieur prévu et la personne qui évaluera la base et le terrain autour.") : text("Identify the possible indoor or outdoor location before confirming the model and site work.", "Repérez l’emplacement intérieur ou extérieur possible avant de confirmer le modèle et les travaux."),
    plan.use === "commercial" ? text("Describe expected usage, delivery windows and contractor coordination. Commercial or rental suitability and warranty need model-specific confirmation.", "Décrivez l’utilisation prévue, les plages de livraison et la coordination des entrepreneurs. L’usage commercial ou locatif et la garantie doivent être confirmés pour le modèle exact.") : plan.use === "cottage" ? text("Describe seasonal access, when someone can receive the delivery and whether the cottage will be rented.", "Décrivez l’accès saisonnier, les possibilités de réception et toute utilisation locative du chalet.") : text("Identify who can receive the delivery and which work you or your contractor will arrange.", "Précisez qui peut recevoir l’envoi et les travaux que vous ou votre entrepreneur organiserez."),
  ];
}
