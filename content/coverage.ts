/** Geographic names/codes, not promises of delivery or contractor coverage.
 * Source and publication instructions: docs/COVERAGE.md.
 */
export const canadianRegions = [
  { code: "AB", kind: "province", name: { en: "Alberta", fr: "Alberta" } },
  { code: "BC", kind: "province", name: { en: "British Columbia", fr: "Colombie-Britannique" } },
  { code: "MB", kind: "province", name: { en: "Manitoba", fr: "Manitoba" } },
  { code: "NB", kind: "province", name: { en: "New Brunswick", fr: "Nouveau-Brunswick" } },
  { code: "NL", kind: "province", name: { en: "Newfoundland and Labrador", fr: "Terre-Neuve-et-Labrador" } },
  { code: "NT", kind: "territory", name: { en: "Northwest Territories", fr: "Territoires du Nord-Ouest" } },
  { code: "NS", kind: "province", name: { en: "Nova Scotia", fr: "Nouvelle-Écosse" } },
  { code: "NU", kind: "territory", name: { en: "Nunavut", fr: "Nunavut" } },
  { code: "ON", kind: "province", name: { en: "Ontario", fr: "Ontario" } },
  { code: "PE", kind: "province", name: { en: "Prince Edward Island", fr: "Île-du-Prince-Édouard" } },
  { code: "QC", kind: "province", name: { en: "Quebec", fr: "Québec" } },
  { code: "SK", kind: "province", name: { en: "Saskatchewan", fr: "Saskatchewan" } },
  { code: "YT", kind: "territory", name: { en: "Yukon", fr: "Yukon" } },
] as const;

export type RegionCode = typeof canadianRegions[number]["code"];

/** Reserved for evidence-backed local coverage. A metro may cross provinces.
 * Drafts and private evidence never become public summaries automatically.
 */
export type ServiceAreaRecord = {
  id: string;
  status: "draft" | "published" | "archived";
  geography: "province" | "territory" | "metro" | "local";
  regions: RegionCode[];
  services: ("delivery" | "assembly" | "managed")[];
  copy: { [lang in "en" | "fr"]: { name: string; boundary: string; scope: string; exclusions: string } };
  evidence: { reference: string; verifiedOn: string; validThrough: string; approvedBy: string; contractorConfirmed: boolean };
};

// No contractor-confirmed service boundaries have been supplied.
export const serviceAreaRecords: readonly ServiceAreaRecord[] = [];
