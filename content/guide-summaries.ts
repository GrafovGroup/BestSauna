import type { Lang } from "./site";

export type GuideSummary = { question: string; answer: string; points: string[] };
export const guideSummaries: Record<string, Record<Lang, GuideSummary>> = {
  "guide-budget": {
    en: {
      question: "What belongs in a sauna project budget?",
      answer: "Start with the exact sauna and heating configuration, then account for delivery, unloading, final placement, site preparation, assembly and specialist connections. A useful quotation identifies what is included, excluded or still unresolved so you can compare the complete project.",
      points: ["Use the same equipment and work list for every quotation.", "Include work you will arrange separately in your overall budget.", "Confirm access, responsibilities and written terms before accepting a total."],
    },
    fr: {
      question: "Que doit comprendre le budget d’un projet de sauna?",
      answer: "Partez du sauna et du chauffage précis, puis prévoyez la livraison, le déchargement, la mise en place, la préparation, l’assemblage et les raccordements spécialisés. Une soumission utile distingue les inclusions, les exclusions et les éléments à préciser pour comparer le projet complet.",
      points: ["Utilisez la même liste d’équipement et de travaux pour chaque soumission.", "Ajoutez au budget global les travaux que vous organiserez séparément.", "Confirmez l’accès, les responsabilités et les conditions écrites avant d’accepter un total."],
    },
  },
  "guide-delivery": {
    en: {
      question: "What should you confirm before a sauna delivery?",
      answer: "Confirm the shipment format, unloading point and route to the sauna’s final position. Match site preparation to the chosen model, then assign responsibility for handling, assembly and remaining connections before booking the work.",
      points: ["Obtain package dimensions and clarify who unloads the shipment.", "Measure gates, doors, turns, stairs and slopes along the full route.", "Keep unfinished site work and specialist connections visible in the schedule."],
    },
    fr: {
      question: "Que faut-il confirmer avant la livraison d’un sauna?",
      answer: "Confirmez le format de l’envoi, le point de déchargement et le trajet jusqu’à l’emplacement final. Adaptez la préparation au modèle choisi, puis attribuez la manutention, l’assemblage et les raccordements restants avant de fixer les travaux.",
      points: ["Obtenez les dimensions des colis et précisez qui les déchargera.", "Mesurez les portails, portes, virages, escaliers et pentes sur tout le trajet.", "Gardez les travaux de préparation et les raccordements restants dans l’échéancier."],
    },
  },
  "guide-commercial": {
    en: {
      question: "What belongs in a commercial sauna enquiry?",
      answer: "Describe the facility, expected use, existing conditions and the work each party will handle. Add the decision process and timing constraints. The exact model’s permitted commercial or rental use, installation requirements and warranty need confirmation for the proposed application.",
      points: ["Explain operating hours, desired capacity and access management.", "Separate measured site information from estimates and unanswered questions.", "Name the project contacts, requested work and handover documents."],
    },
    fr: {
      question: "Que faut-il inclure dans une demande de sauna commercial?",
      answer: "Décrivez l’établissement, l’utilisation prévue, l’état des lieux et les travaux de chaque partie. Ajoutez le processus de décision et les contraintes d’échéancier. L’usage commercial ou locatif permis, les exigences d’installation et la garantie du modèle exact doivent être confirmés pour cette application.",
      points: ["Précisez les heures d’exploitation, la capacité souhaitée et la gestion de l’accès.", "Distinguez les mesures du site, les estimations et les questions sans réponse.", "Identifiez les contacts, les travaux demandés et les documents de remise."],
    },
  },
};
