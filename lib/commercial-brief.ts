/** Shared form definitions and server normalization for commercial enquiries. */
type Lang = "en" | "fr";
export const commercialFieldLimits = {
  commercialFacility: 30, commercialStage: 30, commercialUsage: 240,
  commercialHours: 120, commercialEquipment: 400, commercialProcurement: 200,
};
export type CommercialField = {
  key: string; title: string; required?: boolean; options?: [string, string][];
  maxLength?: number; multiline?: boolean; placeholder?: string;
};

export function commercialBriefFields(lang: Lang): CommercialField[] {
  const t = (en: string, fr: string) => lang === "fr" ? fr : en;
  return [
    { key: "commercialFacility", title: t("Facility type", "Type d’établissement"), required: true, options: [
      ["hotel", t("Hotel / resort", "Hôtel / centre de villégiature")],
      ["fitness", t("Fitness / recreation facility", "Centre d’entraînement / de loisirs")],
      ["spa", t("Spa / wellness facility", "Spa / centre de bien-être")],
      ["rental", t("Rental cottage / accommodation", "Chalet locatif / hébergement")],
      ["shared", t("Condominium / shared amenity", "Copropriété / espace commun")],
      ["other", t("Another setting", "Autre établissement")],
      ["unsure", t("Still deciding", "À déterminer")],
    ] },
    { key: "commercialStage", title: t("Project stage", "Type de projet"), required: true, options: [
      ["new", t("New sauna / new construction", "Nouveau sauna / nouvelle construction")],
      ["replacement", t("Replace existing equipment", "Remplacement d’un équipement")],
      ["renovation", t("Renovate an existing sauna", "Rénovation d’un sauna existant")],
      ["exploring", t("Early planning / still deciding", "Planification préliminaire / à déterminer")],
    ] },
    { key: "commercialUsage", title: t("Expected use (optional)", "Utilisation prévue (facultatif)"), maxLength: 240, placeholder: t("Guest, member or resident use; approximate daily demand", "Clientèle, membres ou résidents; fréquentation quotidienne estimée") },
    { key: "commercialHours", title: t("Proposed operating hours (optional)", "Heures d’utilisation prévues (facultatif)"), maxLength: 120, placeholder: t("e.g. 7 am–9 pm; year-round or seasonal", "p. ex. 7 h à 21 h; toute l’année ou en saison") },
    { key: "commercialEquipment", title: t("Existing equipment, room or plans (optional)", "Équipement existant, pièce ou plans (facultatif)"), maxLength: 400, multiline: true, placeholder: t("Model identifiers, approximate space and any plans already available. Documents can be discussed during follow-up.", "Modèles, espace approximatif et plans disponibles. Les documents pourront être discutés lors du suivi.") },
    { key: "commercialProcurement", title: t("Your role and purchasing process (optional)", "Votre rôle et le processus d’achat (facultatif)"), maxLength: 200, placeholder: t("e.g. facilities manager; tender deadline or approval steps", "p. ex. responsable des installations; date d’appel d’offres ou étapes d’approbation") },
    { key: "commercialDetails", title: t("Project requirements (optional)", "Exigences du projet (facultatif)"), maxLength: 1500, multiline: true, placeholder: t("Access, scheduling, controls, handover documents or support requirements", "Accès, échéancier, commandes, documents de remise ou besoins d’assistance") },
  ];
}

/** Flat field names keep API errors associated with the visible controls. */
export function normalizeCommercialBrief(input: Record<string, unknown>, lang: Lang) {
  const errors: Record<string, string> = {};
  const lines: string[] = [];
  for (const field of commercialBriefFields(lang)) {
    const raw = input[field.key];
    if (raw === undefined || raw === null || raw === "") {
      if (field.required) errors[field.key] = "required";
      continue;
    }
    if (typeof raw !== "string") { errors[field.key] = "invalid"; continue; }
    const value = raw.trim();
    if (field.required && !value) errors[field.key] = "required";
    if (value.length > (field.maxLength ?? 30)) errors[field.key] = "too_long";
    if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value)) errors[field.key] = "invalid";
    const option = field.options?.find(([key]) => key === value);
    if (field.options && value && !option) errors[field.key] = "invalid";
    if (value) lines.push(`${field.title.replace(/ \((optional|facultatif)\)$/, "")}: ${option?.[1] ?? value}`);
  }
  return { errors, text: lines.join("\n\n") };
}

/** Hidden commercial controls must never become part of a residential enquiry. */
export function commercialSubmissionFields(fields: Record<string, string>) {
  return Object.fromEntries([
    ...Object.keys(commercialFieldLimits), "commercialDetails",
  ].map(key => [key, fields.intendedUse === "commercial" ? fields[key] ?? "" : ""]));
}
