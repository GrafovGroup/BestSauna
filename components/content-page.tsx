import { supportingImage, type SupportingImageKey } from "@/content/editorial-images";
import { ServicePlanner } from "./service-planner";
import { hasServicePlan, readServicePlan, servicePlanContext, servicePlanMessage } from "@/lib/service-planner";
import { ProductCollection } from "./product-catalogue";
import { ModelComparison } from "./model-comparison";
import { modelComparisonQuoteQuery, modelDraftContext, modelQuoteMessage, readModelSelection, readQuoteModels } from "@/lib/model-comparison";
import { type PublicProduct } from "@/lib/product-catalogue";
import { pages, pagePath, type SitePage, type Lang } from "@/content/site";
import { CategoryCards, EditorialImage, FAQ, ServiceCards } from "./home-page";
import { QuoteForm } from "./quote-form";
import { SaunaComparison } from "./sauna-comparison";
import { readComparison } from "@/lib/sauna-comparison";
import { GuideArticle } from "./guide-article";
import { pageBreadcrumbs } from "@/lib/page-seo";
import { storageProvider } from "@/lib/runtime-environment";

function Breadcrumbs({lang,page}:{lang:Lang;page:SitePage}) {
 const trail=pageBreadcrumbs(page,lang,pages);
 return <nav className="breadcrumbs" aria-label={lang==="fr"?"Fil d’Ariane":"Breadcrumb"}>{trail.map((item,i)=><span className="breadcrumb-item" key={item.path}>{i>0&&<span aria-hidden="true">/</span>}{i===trail.length-1?<span aria-current="page">{item.name}</span>:<a href={item.path}>{item.name}</a>}</span>)}</nav>;
}

export function ContentPage({page,lang,search,products=[]}:{page:SitePage;lang:Lang;search:Record<string,string|string[]|undefined>;products?:readonly PublicProduct[]}){
 const source=page.copy[lang];const fr=lang==="fr";
 const c=page.key==="privacy"?{...source,sections:source.sections.map(section=>({...section,text:section.text?.replace("Cloudflare",storageProvider())}))}:source;
 const allowedInterest=["outdoor","indoor","infrared","cottage","commercial","heaters","unsure"];
 const selection=page.kind==="quote"?readQuoteModels(search,products):{products:[],adjusted:false,direct:false};
 const plan=readServicePlan(search);
 const planActive=page.kind==="quote"&&hasServicePlan(search)&&selection.products.length===0;
 const product=selection.direct?selection.products[0]:undefined;
 const modelPreferences=selection.products.length?new URLSearchParams(modelComparisonQuoteQuery(selection.products,readComparison(search),pagePath("compare",lang))):undefined;
 const comparedModels=page.kind==="compare"?readModelSelection(search,products).products:[];
 const interest=modelPreferences?.get("interest") || (planActive?"unsure":undefined) || (typeof search.interest==="string"&&allowedInterest.includes(search.interest)?search.interest:"");
 const service=planActive?plan.service:typeof search.service==="string"&&["supply","assembly","managed","unsure"].includes(search.service)?search.service:"";
 const quoteUrl=`${pagePath("quote",lang)}?source=${encodeURIComponent(page.paths[lang])}${allowedInterest.includes(page.key)?`&interest=${page.key}`:""}`;
 const selectedSource=(planActive?pagePath("installation",lang):undefined) || product?.paths[lang] || (selection.products.length?pagePath("compare",lang):undefined) || (typeof search.source==="string"&&pages.some(p=>p.paths[lang]===search.source)?search.source:page.paths[lang]);
 const simple=["policy","quote","support","guide-index"].includes(page.kind);
 const illustrated=simple&&page.kind!=="quote"&&Boolean(c.image);
 return <>
   <section className={`page-hero ${simple?"page-hero-simple":""} ${illustrated?"page-hero-illustrated":""} ${page.kind==="guide"?"article-hero":""}`}><div className="container page-hero-grid"><div className="page-hero-copy"><Breadcrumbs lang={lang} page={page}/><p className="eyebrow">{c.eyebrow}</p><h1 id="page-title" tabIndex={-1}>{c.heading}</h1><p className="page-intro">{c.intro}</p>{!simple&&<a href={page.kind==="compare"?(products.length>=2?"#model-comparison-heading":"#compare-heading"):page.kind==="guide"?"#guide-answer-heading":page.key==="installation"?"#service-planner-heading":quoteUrl} className="button">{page.kind==="compare"?(products.length>=2?(fr?"COMPARER LES MODÈLES":"COMPARE MODELS"):(fr?"COMPARER LES APPROCHES":"COMPARE THE APPROACHES")):page.kind==="guide"?(fr?"LIRE LE GUIDE":"READ THE GUIDE"):page.key==="installation"?(fr?"PLANIFIER LES TRAVAUX":"PLAN THE WORK"):(fr?"PARLONS DE VOTRE PROJET":"DISCUSS YOUR PROJECT")}</a>}</div>{page.kind!=="quote"&&c.image&&<div className="page-hero-image"><EditorialImage src={c.image} alt={c.imageAlt} priority/><span className="image-label">{fr?"INSPIRATION ET PLANIFICATION":"INSPIRATION & PLANNING"}</span></div>}</div></section>
   {page.kind==="quote"?<div className="container quote-layout"><QuoteForm key={planActive?servicePlanContext(plan):modelDraftContext(selection.products) || "project"} lang={lang} initialProductId={modelDraftContext(selection.products)} initialMessage={planActive?servicePlanMessage(plan,lang):modelQuoteMessage(selection.products,lang)} initialPlanContext={planActive?servicePlanContext(plan):""} selectionAdjusted={selection.adjusted} initialInterest={interest} initialService={service} initialUse={planActive?plan.use:typeof search.use==="string"&&["home","cottage","commercial"].includes(search.use)?search.use:""} initialPlacement={modelPreferences?.get("placement") || (planActive?plan.placement:undefined) || (typeof search.placement==="string"&&["indoor","outdoor","unsure"].includes(search.placement)?search.placement:"")} initialHeat={modelPreferences?.get("heat") || (planActive?"unsure":undefined) || (typeof search.heat==="string"&&["electric","wood","infrared","unsure"].includes(search.heat)?search.heat:"")} sourcePath={selectedSource} privacyPath={pagePath("privacy",lang)}/><aside className="quote-aside"><EditorialImage src={c.image} alt={c.imageAlt}/><div><p className="eyebrow">{fr?"LA SUITE":"WHAT HAPPENS NEXT"}</p><h2>{fr?"Les détails font le projet.":"The details make the project."}</h2><ol><li>{fr?"Votre demande est enregistrée avec un numéro de référence.":"Your request is saved with a reference number."}</li><li>{fr?"Les préférences, le site et la portée souhaitée orientent l’évaluation.":"Your preferences, site, and desired scope guide the review."}</li><li>{fr?"La disponibilité, les coûts et les responsabilités sont précisés dans la soumission.":"Availability, costs, and responsibilities are defined in the quotation."}</li></ol><p>{fr?"Vous préférez nous joindre directement?":"Prefer to contact us directly?"}</p><a href="tel:+18336969996">(833) 696-9996</a><a href="mailto:info@bestsauna.ca">info@bestsauna.ca</a></div></aside></div>:<>
   {page.key==="saunas"&&<section className="container section compact-top"><CategoryCards lang={lang} context="browse" keys={["outdoor","indoor","infrared","cottage","commercial","heaters"]}/></section>}
   {page.kind==="category"&&<ProductCollection products={products} lang={lang} category={page.key}/>}
   {page.kind==="service"&&<section className="container section compact-top"><ServiceCards lang={lang} planFirst/></section>}
   {page.key==="installation"&&<ServicePlanner lang={lang} plan={plan}/>}
   {page.kind==="compare"&&<>
     {products.length>=2&&<nav className="container comparison-jumps" aria-label={fr?"Types de comparaison":"Comparison types"}><a href="#model-comparison-heading">{fr?"COMPARER LES MODÈLES":"COMPARE MODELS"}</a><a href="#compare-heading">{fr?"COMPARER LES APPROCHES":"COMPARE SAUNA APPROACHES"}</a></nav>}
     <ModelComparison catalogue={products} lang={lang} search={search} state={readComparison(search)}/>
     <SaunaComparison lang={lang} state={readComparison(search)} selectedModels={comparedModels}/>
   </>}
   {page.kind==="support"&&<section className="container contact-options"><a href="mailto:info@bestsauna.ca"><span className="eyebrow">{fr?"PAR COURRIEL":"BY EMAIL"}</span><strong>info@bestsauna.ca</strong><span>{fr?"Précisez votre numéro de référence, si vous en avez un.":"Include your reference number if you have one."}</span></a><a href="tel:+18336969996"><span className="eyebrow">{fr?"PAR TÉLÉPHONE":"BY PHONE"}</span><strong>(833) 696-9996</strong><span>{fr?"Pour discuter de votre projet ou d’une demande.":"For your project or an existing enquiry."}</span></a></section>}
   {page.kind==="guide-index"&&<section className="container section compact-top"><div className="guide-grid">{pages.filter(p=>p.kind==="guide").map(p=><a className="guide-card" key={p.key} href={p.paths[lang]}><EditorialImage {...supportingImage(`index-${p.key}` as SupportingImageKey,lang)}/><div><p className="eyebrow">{fr?"PLANIFIER VOTRE PROJET":"PLAN YOUR PROJECT"}</p><h2>{p.copy[lang].heading}</h2><p>{p.copy[lang].description}</p><span className="text-link">{fr?"LIRE LE GUIDE":"READ THE GUIDE"}</span></div></a>)}</div></section>}
   {page.kind==="guide"?<GuideArticle page={page} lang={lang} quoteUrl={quoteUrl}/>:<div className={`container content-sections ${page.kind==="policy"?"reading-width":""}`}>{c.sections.map((section,i)=><section className={`content-section ${section.items?"has-items":""}`} key={section.title}><div className="content-section-heading">{section.eyebrow?<p className="eyebrow">{section.eyebrow}</p>:page.kind!=="policy"&&<span className="section-index">0{i+1}</span>}<h2>{section.title}</h2></div><div className="content-section-body">{section.text&&section.text.split("\n\n").map(p=><p key={p}>{p}</p>)}{section.bullets&&<ul className="detail-list">{section.bullets.map(p=><li key={p}>{p}</li>)}</ul>}{section.items&&<div className="detail-items">{section.items.map(item=><article key={item.title}><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>}</div></section>)}</div>}
   </>}
   {c.faq&&c.faq.length>0&&<FAQ items={c.faq} lang={lang}/>}
   {c.related.length>0&&<section className="container related-section"><p className="eyebrow">{fr?"POUR CONTINUER":"KEEP EXPLORING"}</p><div>{c.related.map(key=>{const related=pages.find(p=>p.key===key);if(!related)return null;return <a key={key} href={related.paths[lang]}>{related.copy[lang].eyebrow}</a>;})}</div></section>}
 </>;
}
