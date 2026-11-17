import { pagePath, type Lang } from "@/content/site";
import { specificationKeys, type PublicProduct } from "@/lib/product-catalogue";
import { modelComparisonQuoteQuery, modelSelectionQuery, modelSlots, readModelSelection } from "@/lib/model-comparison";
import { projectUses, serviceScopes, type ComparisonState } from "@/lib/sauna-comparison";

const labels = {
  en: { dimensions: "Dimensions", seating: "Seating", materials: "Materials", heaterControls: "Heat & controls", connections: "Connections", requiredComponents: "Required components", installation: "Installation requirements" },
  fr: { dimensions: "Dimensions", seating: "Places assises", materials: "Matériaux", heaterControls: "Chauffage et commandes", connections: "Raccordements", requiredComponents: "Composants requis", installation: "Exigences d’installation" },
};
export function ModelComparison({ catalogue, lang, search, state }: { catalogue: readonly PublicProduct[]; lang: Lang; search: Record<string, string | string[] | undefined>; state: ComparisonState }) {
  if (catalogue.length < 2) return null;
  const { products, adjusted } = readModelSelection(search, catalogue);
  const fr = lang === "fr", text = (en: string, french: string) => fr ? french : en;
  const path = pagePath("compare", lang);
  const uses = fr ? ["Ma résidence", "Mon chalet", "Un établissement commercial"] : ["My home", "My cottage", "A commercial property"];
  const services = fr ? ["À déterminer ensemble", "Fourniture et livraison", "Livraison et assemblage", "Projet d’installation coordonné"] : ["Help me decide", "Supply & delivery", "Delivery & assembly", "Managed installation project"];
  type Row = { label: string; value: (p: PublicProduct) => string | string[] };
  const rows: Row[] = [
    { label: text("Manufacturer model", "Modèle du fabricant"), value: p => `${p.manufacturer} — ${p.model}` },
    { label: text("Configuration", "Configuration"), value: p => p.copy[lang].configuration },
    { label: text("Placement", "Emplacement"), value: p => p.placement === "outdoor" ? text("Outdoor", "À l’extérieur") : text("Indoor", "À l’intérieur") },
    ...specificationKeys.map(key => ({ label: labels[lang][key], value: (p: PublicProduct) => p.copy[lang].specifications[key] })),
    { label: text("Included", "Inclus"), value: p => p.copy[lang].included },
    { label: text("Not included", "Non inclus"), value: p => p.copy[lang].excluded },
    { label: text("Delivery & access", "Livraison et accès"), value: p => p.copy[lang].delivery },
    { label: text("Availability", "Disponibilité"), value: p => p.copy[lang].availability },
    { label: text("Lead time", "Délais"), value: p => p.copy[lang].leadTime },
    { label: text("Warranty", "Garantie"), value: p => p.copy[lang].warranty },
    { label: text("Permitted uses", "Utilisations permises"), value: p => p.copy[lang].permittedUse },
    { label: text("Quotation & order terms", "Conditions de soumission et de commande"), value: p => p.copy[lang].orderTerms },
  ];
  const value = (row: Row, product: PublicProduct) => {
    const content = row.value(product);
    return Array.isArray(content) ? <ul>{content.map((item, i) => <li key={i}>{item}</li>)}</ul> : content;
  };
  const remove = (product: PublicProduct) => `${path}?${modelSelectionQuery(products.filter(p => p.id !== product.id), state)}#model-comparison-results`;
  const actions = (product: PublicProduct) => <div className="model-comparison-actions"><a className="text-link" href={product.paths[lang]}>{text("VIEW MODEL", "DÉCOUVRIR LE MODÈLE")}<span className="sr-only"> — {product.copy[lang].name}</span></a><a className="model-remove" href={remove(product)}>{text("Remove", "Retirer")}<span className="sr-only"> — {product.copy[lang].name}</span></a></div>;
  return <section className="container model-comparison" aria-labelledby="model-comparison-heading">
    <div className="model-comparison-intro"><div><p className="eyebrow">{text("A CLOSER LOOK", "REGARDEZ DE PLUS PRÈS")}</p><h2 id="model-comparison-heading" tabIndex={-1}>{text("Compare the details.", "Comparez les détails.")}</h2></div><p>{text("Choose two or three models. Review their exact configurations and what each includes, then bring your shortlist into your quote request.", "Choisissez deux ou trois modèles. Examinez les configurations et les inclusions, puis joignez votre sélection à votre demande de soumission.")}</p></div>
    <form action={path + "#model-comparison-results"} method="GET" className="model-comparison-controls">
      <input type="hidden" name="compare" value={state.compare}/>
      <fieldset><legend>{text("YOUR MODELS", "VOS MODÈLES")}</legend><div className="model-selectors">{modelSlots.map((slot, i) => <label key={slot} htmlFor={slot}>{text(`Model ${i + 1}${i === 2 ? " (optional)" : ""}`, `Modèle ${i + 1}${i === 2 ? " (facultatif)" : ""}`)}<select id={slot} name={slot} defaultValue={products[i]?.id || ""}><option value="">{text("Choose a model", "Choisir un modèle")}</option>{catalogue.map(product => <option value={product.id} key={product.id}>{product.manufacturer} · {product.copy[lang].name} · {product.copy[lang].configuration}</option>)}</select></label>)}</div></fieldset>
      <div className="model-project-selectors"><label htmlFor="model-project-use">{text("MY PROJECT", "MON PROJET")}<select id="model-project-use" name="use" defaultValue={state.use}>{projectUses.map((use, i) => <option key={use} value={use}>{uses[i]}</option>)}</select></label><label htmlFor="model-project-service">{text("THE HELP I NEED", "L’ACCOMPAGNEMENT SOUHAITÉ")}<select id="model-project-service" name="service" defaultValue={state.service}>{serviceScopes.map((service, i) => <option key={service} value={service}>{services[i]}</option>)}</select></label><button type="submit" className="button">{text("COMPARE MODELS", "COMPARER LES MODÈLES")}</button></div>
    </form>
    <div className="model-result-heading"><h3 id="model-comparison-results" tabIndex={-1}>{text("Your model comparison", "Votre comparaison de modèles")}</h3>{products.length > 0 && <a className="model-remove" href={`${path}?${modelSelectionQuery([], state)}#model-comparison-heading`}>{text("Clear selection", "Effacer la sélection")}</a>}</div>
    {adjusted && <p className="model-selection-notice" role="status">{text("Some choices were repeated or are no longer available for comparison. Review the remaining models and choose at least two different ones.", "Certains choix étaient répétés ou ne sont plus disponibles pour la comparaison. Vérifiez les modèles restants et choisissez-en au moins deux différents.")}</p>}
    {products.length < 2 ? <div className="model-comparison-empty"><p>{text("Select at least two different models above to see their details together.", "Sélectionnez au moins deux modèles différents ci-dessus pour comparer leurs détails.")}</p>{products.length === 1 && <p>{text("Selected", "Sélectionné")} : <strong>{products[0].copy[lang].name}</strong></p>}</div> : <>
      <p className="model-comparison-context">{uses[projectUses.indexOf(state.use)]} · {services[serviceScopes.indexOf(state.service)]}</p>
      {products.some(product => !product.uses.includes(state.use)) && <div className="model-selection-notice"><p>{text("Your selected project use is not listed for every configuration below. Ask us to confirm a suitable option before choosing.", "L’usage choisi pour votre projet n’est pas indiqué pour toutes les configurations ci-dessous. Demandez-nous de confirmer une option adaptée avant de choisir.")}</p><ul>{products.filter(product => !product.uses.includes(state.use)).map(product => <li key={product.id}>{product.copy[lang].name}</li>)}</ul></div>}
      <div className="model-comparison-desktop"><table className="model-table"><caption className="sr-only">{text("Selected model specifications, scope and terms", "Caractéristiques, portée et conditions des modèles sélectionnés")}</caption><thead><tr><th scope="col">{text("YOUR COMPARISON", "VOTRE COMPARAISON")}</th>{products.map(product => <th scope="col" key={product.id}><img src={product.image.src} alt={product.image.alt[lang]} width={product.image.width} height={product.image.height}/><span>{product.copy[lang].name}</span><p>{text("Price by quotation", "Prix sur soumission")}</p>{actions(product)}</th>)}</tr></thead><tbody>{rows.map(row => <tr key={row.label}><th scope="row">{row.label}</th>{products.map(product => <td key={product.id}>{value(row, product)}</td>)}</tr>)}</tbody></table></div>
      <div className="model-comparison-mobile"><p className="model-mobile-help">{text("Open a model to review its details.", "Ouvrez un modèle pour consulter ses détails.")}</p>{products.map((product, i) => <details className="model-comparison-card" key={product.id} open={i === 0}><summary><span><span className="eyebrow">{product.manufacturer}</span><strong>{product.copy[lang].name}</strong><span>{product.copy[lang].configuration}</span></span><span className="model-expand" aria-hidden="true">+</span></summary><div className="model-mobile-image"><img src={product.image.src} alt={product.image.alt[lang]} width={product.image.width} height={product.image.height}/><p>{text("Price by quotation", "Prix sur soumission")}</p>{actions(product)}</div><dl>{rows.map(row => <div key={row.label}><dt>{row.label}</dt><dd>{value(row, product)}</dd></div>)}</dl></details>)}</div>
      <aside className="model-comparison-next"><div><h3>{text("Bring your shortlist.", "Présentez votre sélection.")}</h3><p>{text("We’ll use these models and your project details to clarify the configuration, availability, delivery and services in your quotation.", "Vos modèles et les détails de votre projet serviront à préciser la configuration, la disponibilité, la livraison et les services dans votre soumission.")}</p></div><a className="button" href={`${pagePath("quote", lang)}?${modelComparisonQuoteQuery(products, state, path)}`}>{text("DISCUSS THESE MODELS", "DISCUTER DE CES MODÈLES")}</a></aside>
    </>}
  </section>;
}
