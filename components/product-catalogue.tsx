import { pagePath, type Lang } from "@/content/site";
import { categoryProducts, productQuoteQuery, specificationKeys, type PublicProduct } from "@/lib/product-catalogue";

const specLabels = {
  en: { dimensions: "Dimensions", seating: "Seating", materials: "Materials", heaterControls: "Heat & controls", connections: "Connections", requiredComponents: "Required components", installation: "Installation requirements" },
  fr: { dimensions: "Dimensions", seating: "Places assises", materials: "Matériaux", heaterControls: "Chauffage et commandes", connections: "Raccordements", requiredComponents: "Composants requis", installation: "Exigences d’installation" },
};
export function ProductCollection({ products, lang, category }: { products: readonly PublicProduct[]; lang: Lang; category: string }) {
  const models = categoryProducts(products, category);
  if (!models.length) return null;
  const fr = lang === "fr";
  return <section className="container section product-collection" aria-labelledby="models-heading">
    <div className="product-collection-heading"><div><p className="eyebrow">{fr ? "VOTRE PROCHAIN CHOIX" : "YOUR NEXT CHOICE"}</p><h2 id="models-heading">{fr ? "Explorez les modèles." : "Explore the models."}</h2></div><p>{fr ? "Comparez les configurations et les inclusions. Le prix, la disponibilité et les services sont confirmés dans votre soumission." : "Explore configurations and what’s included. Pricing, availability and services are confirmed in your quotation."}</p></div>
    <div className="product-grid">{models.map(product => {
      const c = product.copy[lang];
      return <article className="product-card" key={product.id}>
        <a className="product-card-image" href={product.paths[lang]} tabIndex={-1} aria-hidden="true"><img src={product.image.src} alt="" width={product.image.width} height={product.image.height} loading="lazy"/></a>
        <div className="product-card-copy"><p className="eyebrow">{product.manufacturer}</p><h3><a href={product.paths[lang]}>{c.name}</a></h3><p>{c.configuration}</p><dl><div><dt>{specLabels[lang].seating}</dt><dd>{c.specifications.seating}</dd></div><div><dt>{specLabels[lang].heaterControls}</dt><dd>{c.specifications.heaterControls}</dd></div></dl><span className="product-quote-label">{fr ? "Prix sur soumission" : "Price by quotation"}</span><a className="text-link" href={product.paths[lang]}>{fr ? "DÉCOUVRIR LE MODÈLE" : "VIEW MODEL"}<span className="sr-only"> — {c.name}</span></a></div>
      </article>;
    })}</div>
  </section>;
}

export function ProductDetail({ product, lang }: { product: PublicProduct; lang: Lang }) {
  const fr = lang === "fr", c = product.copy[lang];
  const quote = `${pagePath("quote", lang)}?${productQuoteQuery(product, lang)}`;
  const terms = [
    [fr ? "Disponibilité" : "Availability", c.availability], [fr ? "Délais" : "Lead time", c.leadTime],
    [fr ? "Livraison et accès" : "Delivery & access", c.delivery], [fr ? "Conditions de soumission et de commande" : "Quotation & order terms", c.orderTerms],
    [fr ? "Garantie" : "Warranty", c.warranty], [fr ? "Utilisations permises" : "Permitted uses", c.permittedUse],
  ];
  return <>
    <section className="container product-hero">
      <nav className="breadcrumbs" aria-label={fr ? "Fil d’Ariane" : "Breadcrumb"}><a href={pagePath("home", lang)}>{fr ? "Accueil" : "Home"}</a><span aria-hidden="true">/</span><a href={pagePath("saunas", lang)}>Saunas</a><span aria-hidden="true">/</span><span aria-current="page">{c.name}</span></nav>
      <div className="product-hero-grid"><div className="product-image"><img src={product.image.src} alt={product.image.alt[lang]} width={product.image.width} height={product.image.height} fetchPriority="high"/></div><div className="product-intro"><p className="eyebrow">{product.manufacturer}</p><h1 id="page-title" tabIndex={-1}>{c.name}</h1><p className="product-configuration">{c.configuration}</p><p>{c.intro}</p><dl className="product-identity"><div><dt>{fr ? "Modèle du fabricant" : "Manufacturer model"}</dt><dd>{product.model}</dd></div><div><dt>{fr ? "Référence BestSauna" : "BestSauna reference"}</dt><dd>{product.id}</dd></div></dl><p className="product-price">{fr ? "Prix sur soumission" : "Price by quotation"}</p><p className="product-price-note">{fr ? "Votre emplacement, la configuration et les services définissent la portée et le prix de votre projet." : "Your location, configuration and services define the scope and price of your project."}</p><a className="button" href={quote}>{fr ? "DEMANDER CE MODÈLE" : "ENQUIRE ABOUT THIS MODEL"}</a><a className="text-link" href="#product-specifications">{fr ? "VOIR LES CARACTÉRISTIQUES" : "VIEW SPECIFICATIONS"}</a></div></div>
    </section>
    <div className="container product-information">
      <section className="product-section" aria-labelledby="product-specifications"><div><p className="eyebrow">{fr ? "LES DÉTAILS" : "THE DETAILS"}</p><h2 id="product-specifications" tabIndex={-1}>{fr ? "Caractéristiques." : "Specifications."}</h2><a className="text-link" href={product.manual.url}>{fr ? "DOCUMENTATION DU FABRICANT" : "MANUFACTURER DOCUMENTATION"}</a><p className="product-document-version">{product.manual.version}</p></div><dl className="product-specs">{specificationKeys.map(key => <div key={key}><dt>{specLabels[lang][key]}</dt><dd>{c.specifications[key]}</dd></div>)}</dl></section>
      <section className="product-section" aria-labelledby="product-scope"><div><p className="eyebrow">{fr ? "UNE PORTÉE CLAIRE" : "A CLEAR SCOPE"}</p><h2 id="product-scope">{fr ? "Ce qui est compris." : "What’s included."}</h2></div><div className="product-scope-grid"><div><h3>{fr ? "Inclus dans cette configuration" : "Included in this configuration"}</h3><ul>{c.included.map(item => <li key={item}>{item}</li>)}</ul></div><div><h3>{fr ? "Non inclus" : "Not included"}</h3><ul>{c.excluded.map(item => <li key={item}>{item}</li>)}</ul></div></div></section>
      <section className="product-section" aria-labelledby="product-planning"><div><p className="eyebrow">{fr ? "AVANT DE COMMANDER" : "BEFORE YOU ORDER"}</p><h2 id="product-planning">{fr ? "Planifier votre projet." : "Plan your project."}</h2></div><div className="product-terms">{terms.map(([title, body]) => <div key={title}><h3>{title}</h3><p>{body}</p></div>)}</div></section>
    </div>
  </>;
}
