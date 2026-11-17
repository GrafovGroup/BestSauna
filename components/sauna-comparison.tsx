import type { PublicProduct } from "@/lib/product-catalogue";
import { modelSlots } from "@/lib/model-comparison";
import { pagePath, type Lang } from "@/content/site";
import { comparisonApproaches, comparisonPairs, comparisonQuoteQuery, projectUses, serviceScopes, type ComparisonState, type SaunaApproach } from "@/lib/sauna-comparison";

type ApproachCopy = { title: string; summary: string; details: string[] };
const approaches: Record<Lang, Record<SaunaApproach, ApproachCopy>> = {
  en: {
    outdoor: { title: "Traditional outdoor", summary: "Plan the sauna and the space around it.", details: [
      "An outdoor location with a delivery and placement route to assess.",
      "Cabin or barrel layouts. Compare usable benches, entrance space and internal dimensions.",
      "A compatible heater and controls. Confirm which components the package includes.",
      "Base, drainage, access, connections and seasonal use. Define who handles each part.",
      "Exterior protection, site instructions and the exact model’s permitted use and warranty.",
    ] },
    indoor: { title: "Traditional indoor", summary: "Make the sauna part of your indoor space.", details: [
      "An indoor room that meets the selected model’s installation requirements.",
      "An indoor kit or room project. Compare usable seating, ceiling space and door clearance.",
      "A matching sauna heater and controls. Confirm compatibility with the proposed room.",
      "Available space, ventilation, moisture planning and connections. Assess the room first.",
      "Room preparation, manufacturer instructions and the exact model’s permitted use and warranty.",
    ] },
    infrared: { title: "Infrared cabin", summary: "Start with the cabin and the experience you want.", details: [
      "The installation environment permitted for the specific cabin; verify it before choosing a location.",
      "A cabin with its own seating and panel layout. Compare internal dimensions and usable seats.",
      "Infrared panels and model-specific controls. Check the supplied components and power requirements.",
      "Delivery access, assembly space, clearances and power supply for the exact cabin.",
      "Panel layout, installation instructions and the exact model’s permitted use and warranty.",
    ] },
  },
  fr: {
    outdoor: { title: "Extérieur traditionnel", summary: "Pensez au sauna et à l’espace qui l’entoure.", details: [
      "Un emplacement extérieur dont il faut évaluer l’accès de livraison et de mise en place.",
      "Cabine ou tonneau. Comparez les banquettes utilisables, l’entrée et les dimensions intérieures.",
      "Un chauffe-sauna et des commandes compatibles. Confirmez les composants inclus.",
      "Base, drainage, accès, raccordements et usage saisonnier. Précisez qui s’occupe de chaque étape.",
      "Protection extérieure, consignes pour le site, usage permis et garantie du modèle exact.",
    ] },
    indoor: { title: "Intérieur traditionnel", summary: "Intégrez le sauna à votre espace intérieur.", details: [
      "Une pièce intérieure qui respecte les exigences d’installation du modèle retenu.",
      "Kit intérieur ou pièce aménagée. Comparez les assises, la hauteur et le dégagement de la porte.",
      "Un chauffe-sauna et des commandes adaptés. Confirmez leur compatibilité avec la pièce prévue.",
      "Espace disponible, ventilation, gestion de l’humidité et raccordements. Évaluez d’abord la pièce.",
      "Préparation de la pièce, instructions du fabricant, usage permis et garantie du modèle exact.",
    ] },
    infrared: { title: "Cabine infrarouge", summary: "Partez de la cabine et de l’expérience souhaitée.", details: [
      "L’environnement d’installation permis pour la cabine précise, à vérifier avant de choisir l’emplacement.",
      "Une cabine avec ses assises et ses panneaux. Comparez les dimensions intérieures et les places utilisables.",
      "Panneaux infrarouges et commandes propres au modèle. Vérifiez les composants et l’alimentation requis.",
      "Accès de livraison, espace d’assemblage, dégagements et alimentation de la cabine précise.",
      "Disposition des panneaux, instructions d’installation, usage permis et garantie du modèle exact.",
    ] },
  },
};

export function SaunaComparison({ lang, state, selectedModels = [] }: { lang: Lang; state: ComparisonState; selectedModels?: readonly PublicProduct[] }) {
  const fr = lang === "fr";
  const text = (en: string, french: string) => fr ? french : en;
  const selected = comparisonApproaches(state);
  const path = pagePath("compare", lang);
  const quote = (approach: SaunaApproach | "unsure") => `${pagePath("quote", lang)}?${comparisonQuoteQuery(state, approach, path)}`;
  const rows = fr ? ["Emplacement", "Aménagement", "Chauffage", "Travaux à prévoir", "À confirmer"] : ["Setting", "Layout", "Heating", "Work to plan", "Confirm before choosing"];
  const pairLabels = fr ? ["Les trois approches", "Extérieur et intérieur", "Extérieur et infrarouge", "Intérieur et infrarouge"] : ["All three approaches", "Outdoor and indoor", "Outdoor and infrared", "Indoor and infrared"];
  const useLabels = fr ? ["Ma résidence", "Mon chalet", "Un établissement commercial"] : ["My home", "My cottage", "A commercial property"];
  const serviceLabels = fr ? ["À déterminer ensemble", "Fourniture et livraison", "Livraison et assemblage", "Projet d’installation coordonné"] : ["Help me decide", "Supply & delivery", "Delivery & assembly", "Managed installation project"];
  const projectNotes = {
    home: text("Measure your available space and the delivery route. Include the number of people who will use the sauna together and the work already completed on site.", "Mesurez l’espace disponible et le passage pour la livraison. Précisez combien de personnes utiliseront le sauna ensemble et les travaux déjà réalisés sur place."),
    cottage: text("Describe road access, the final route to the sauna and when you use the property. Identify seasonal access limits and the utilities available at the proposed location.", "Décrivez l’accès routier, le trajet jusqu’au sauna et vos périodes d’utilisation du chalet. Précisez les limites d’accès saisonnier et les services disponibles à l’emplacement prévu."),
    commercial: text("Describe the property, expected usage and who will operate the sauna. Commercial or rental suitability, warranty and maintenance requirements must be confirmed for each exact model.", "Décrivez l’établissement, l’utilisation prévue et la personne responsable du sauna. L’usage commercial ou locatif, la garantie et les exigences d’entretien doivent être confirmés pour chaque modèle précis."),
  };
  const serviceNotes = {
    unsure: text("We can help define the scope. Start by listing the work you can arrange and the work you would like included in your quotation.", "Nous pouvons vous aider à définir la portée. Indiquez les travaux que vous pouvez organiser et ceux à inclure dans votre soumission."),
    supply: text("Clarify the delivery point, unloading and final placement. Confirm who will arrange assembly, site preparation and specialist connections.", "Précisez le point de livraison, le déchargement et la mise en place finale. Confirmez qui organisera l’assemblage, la préparation et les raccordements spécialisés."),
    assembly: text("Ask for the exact assembly scope and site-readiness requirements. Base preparation, unloading and specialist connections need their own written inclusions.", "Demandez la portée exacte de l’assemblage et les conditions de préparation du site. La base, le déchargement et les raccordements spécialisés doivent être précisés par écrit."),
    managed: text("Define coordination responsibilities and each trade’s scope. Crew availability, site work and specialist connections are confirmed for your location in the quotation.", "Précisez les responsabilités de coordination et la portée de chaque métier. La disponibilité des équipes, les travaux et les raccordements sont confirmés pour votre emplacement dans la soumission."),
  };
  const actions = (id: SaunaApproach) => <div className="compare-option-actions"><a className="button button-small" href={quote(id)} aria-label={text(`Plan this option: ${approaches.en[id].title.toLowerCase()}`, `Planifier cette option : ${approaches.fr[id].title.toLowerCase()}`)}>{text("PLAN THIS OPTION", "PLANIFIER CETTE OPTION")}</a><a className="text-link" href={pagePath(id, lang)}>{text("EXPLORE THE CATEGORY", "EXPLORER LA CATÉGORIE")}</a></div>;

  return <section className="container comparison-section" aria-labelledby="compare-heading">
    <div className="comparison-intro"><p className="eyebrow">{text("YOUR SPACE. YOUR PRIORITIES.", "VOTRE ESPACE. VOS PRIORITÉS.")}</p><h2 id="compare-heading">{text("Find your starting point.", "Trouvez votre point de départ.")}</h2><p>{text("Choose the approaches you want to compare, then update the comparison. Take a preferred option into your quote request when you’re ready.", "Choisissez les approches à comparer, puis actualisez la comparaison. Transférez votre option préférée dans une demande de soumission lorsque vous serez prêt.")}</p></div>
    <form action={path + "#comparison-results"} method="GET" className="comparison-controls">
      {selectedModels.map((product,i)=><input type="hidden" name={modelSlots[i]} value={product.id} key={product.id}/>)}
      <label htmlFor="compare-pair">{text("COMPARE", "COMPARER")}<select id="compare-pair" name="compare" defaultValue={state.compare}>{comparisonPairs.map((id, i) => <option key={id} value={id}>{pairLabels[i]}</option>)}</select></label>
      <label htmlFor="compare-use">{text("MY PROJECT", "MON PROJET")}<select id="compare-use" name="use" defaultValue={state.use}>{projectUses.map((id, i) => <option key={id} value={id}>{useLabels[i]}</option>)}</select></label>
      <label htmlFor="compare-service">{text("THE HELP I NEED", "L’ACCOMPAGNEMENT SOUHAITÉ")}<select id="compare-service" name="service" defaultValue={state.service}>{serviceScopes.map((id, i) => <option key={id} value={id}>{serviceLabels[i]}</option>)}</select></label>
      <button className="button" type="submit">{text("UPDATE COMPARISON", "ACTUALISER LA COMPARAISON")}</button>
    </form>
    <div className="comparison-results">
      <div className="comparison-result-heading"><h3 id="comparison-results" tabIndex={-1}>{text("Your comparison", "Votre comparaison")}</h3><p>{useLabels[projectUses.indexOf(state.use)]} · {serviceLabels[serviceScopes.indexOf(state.service)]}</p></div>
      <div className="comparison-desktop"><table className="approach-table"><caption className="sr-only">{text("Sauna approaches for your project", "Approches de sauna pour votre projet")}</caption><thead><tr><th scope="col">{text("WHAT MATTERS", "À CONSIDÉRER")}</th>{selected.map(id => <th key={id} scope="col"><span>{approaches[lang][id].title}</span><p>{approaches[lang][id].summary}</p></th>)}</tr></thead><tbody>{rows.map((row, i) => <tr key={row}><th scope="row">{row}</th>{selected.map(id => <td key={id}>{approaches[lang][id].details[i]}</td>)}</tr>)}<tr><th scope="row">{text("YOUR NEXT STEP", "LA PROCHAINE ÉTAPE")}</th>{selected.map(id => <td key={id}>{actions(id)}</td>)}</tr></tbody></table></div>
      <div className="comparison-mobile">{selected.map(id => <article className="comparison-card" key={id}><div className="comparison-card-heading"><h3>{approaches[lang][id].title}</h3><p>{approaches[lang][id].summary}</p></div><dl>{rows.map((row, i) => <div key={row}><dt>{row}</dt><dd>{approaches[lang][id].details[i]}</dd></div>)}</dl>{actions(id)}</article>)}</div>
      <p className="section-note">{text("These are planning approaches. Product availability, dimensions, capacity, price and suitability are confirmed for the exact model in your quotation.", "Il s’agit d’approches de planification. La disponibilité, les dimensions, la capacité, le prix et l’usage permis sont confirmés pour le modèle exact dans votre soumission.")}</p>
      <aside className="comparison-brief" aria-labelledby="compare-brief-heading"><div><p className="eyebrow">{text("BRING YOUR PROJECT INTO FOCUS", "PRÉCISEZ VOTRE PROJET")}</p><h3 id="compare-brief-heading">{text("What to bring to your enquiry", "Quoi préciser dans votre demande")}</h3><p>{projectNotes[state.use]}</p></div><div><h4>{text("Define the work", "Définir les travaux")}</h4><p>{serviceNotes[state.service]}</p><a className="text-link" href={quote("unsure")}>{text("HELP ME CHOOSE", "AIDEZ-MOI À CHOISIR")}</a></div></aside>
    </div>
  </section>;
}
