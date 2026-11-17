// Synthetic data for automated tests and isolated local visual QA only.
// Never import this file into application content or deployment source entry points.
import { evidenceKeys, specificationKeys } from "../../lib/product-catalogue.ts";

export function catalogueFixture(id = "internal-qa-model") {
  const copy = lang => ({
    name: lang === "en" ? "Internal QA model" : "Modèle de test interne", slug: lang === "en" ? id : `${id}-fr`,
    title: lang === "en" ? "Internal QA model | BestSauna.ca" : "Modèle de test interne | BestSauna.ca",
    description: lang === "en" ? "Synthetic model for testing the catalogue layout only." : "Modèle fictif utilisé uniquement pour tester la présentation du catalogue.",
    intro: lang === "en" ? "This is a synthetic fixture for local interface checks. It is not a real product, supplier or offer." : "Cette fiche fictive sert aux essais de l’interface locale. Elle ne représente aucun produit, fournisseur ou offre réelle.",
    configuration: lang === "en" ? "Internal test configuration" : "Configuration de test interne",
    specifications: Object.fromEntries(specificationKeys.map(key => [key, lang === "en" ? `Test value for ${key}. Verify against the exact manufacturer documentation.` : `Valeur de test : ${key}. À vérifier dans la documentation exacte du fabricant.`])),
    included: [lang === "en" ? "Synthetic included component for layout testing." : "Composant inclus fictif pour tester la présentation."],
    excluded: [lang === "en" ? "Synthetic excluded service for layout testing." : "Service exclu fictif pour tester la présentation."],
    ...Object.fromEntries(["delivery", "orderTerms", "leadTime", "availability", "warranty", "permittedUse"].map(key => [key, lang === "en" ? `Internal QA ${key} wording. Not a commercial claim.` : `Texte de test interne : ${key}. Aucune affirmation commerciale.`])),
  });
  return {
    id, status: "published",
    details: { manufacturer: "INTERNAL QA — NOT A SUPPLIER", model: "TEST-ONLY-001", category: "outdoor", placement: "outdoor", heat: "electric", uses: ["home", "cottage"], pricing: "quotation-only", image: { src: "/products/internal-qa.webp", width: 1200, height: 900, alt: { en: "Internal QA placeholder; not a product photo.", fr: "Image de test interne; aucune photo de produit." } }, manual: { url: "https://example.com/internal-qa-manual.pdf", version: "Synthetic test revision" }, copy: { en: copy("en"), fr: copy("fr") } },
    approval: { approvedBy: "Synthetic test reviewer", approvedAt: "2026-11-01", reviewBy: "2026-12-01", evidence: Object.fromEntries(evidenceKeys.map(key => [key, { source: `TEST-ONLY evidence for ${key}`, version: "TEST-ONLY-v1", verifiedAt: "2026-11-01", verifiedBy: "Synthetic test reviewer" }])) },
  };
}
