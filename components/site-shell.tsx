import { pages, pagePath, type Lang } from "@/content/site";
import { contacts } from "@/lib/site-settings";
import { SiteNav } from "./site-nav";

export function BrandWordmark() { return <span className="brand-wordmark"><img src="/brand/bestsauna-wordmark-en-light.png" width="2172" height="724" alt="BestSauna.ca" /></span>; }

export function SiteHeader({ lang, pageKey, search = {} }: { lang: Lang; pageKey: string; search?: Record<string,string|string[]|undefined> }) {
  const fr = lang === "fr";
  const other:Lang=fr?"en":"fr";
  const pairedQuery=new URLSearchParams();
  if(pageKey==="quote")for(const key of ["interest","service","use","placement","heat"]){const value=search[key];if(typeof value==="string"&&/^[a-z-]{1,30}$/.test(value))pairedQuery.set(key,value);}
  if(pageKey==="quote"&&typeof search.source==="string"){const source=pages.find(p=>p.paths[lang]===search.source);if(source)pairedQuery.set("source",source.paths[other]);}
  const counterpart=pagePath(pageKey,other)+(pairedQuery.size?`?${pairedQuery.toString()}`:"");
  const quote=pagePath("quote",lang)+(pageKey!=="quote"?`?source=${encodeURIComponent(pagePath(pageKey,lang))}`:"");
  return <><a className="skip-link" href="#main-content">{fr ? "Aller au contenu" : "Skip to content"}</a><SiteNav lang={lang} home={pagePath("home",lang)} quote={quote} counterpart={counterpart} nav={[
    {label:fr?"LIVRAISON ET INSTALLATION":"DELIVERY & INSTALLATION",href:pagePath("installation",lang)},
    {label:fr?"COMMERCIAL":"COMMERCIAL",href:pagePath("commercial",lang)},
    {label:fr?"GUIDES":"BUYING GUIDES",href:pagePath("guides",lang)}
  ]} saunaLinks={["saunas","outdoor","indoor","infrared","cottage","heaters","compare"].map(key => ({label:pages.find(p=>p.key===key)?.copy[lang].eyebrow || key,href:pagePath(key,lang)}))} /></>;
}

export function QuoteBand({ lang, pageKey }: { lang: Lang; pageKey:string }) {
  const fr=lang==="fr";
  return <section className="quote-band"><div className="container quote-band-inner"><div><p className="eyebrow">{fr?"COMMENÇONS PAR VOTRE ESPACE":"LET’S START WITH YOUR SPACE"}</p><h2>{fr?"Votre sauna commence ici.":"Your sauna starts here."}</h2><p>{fr?"Parlez-nous de votre projet. Nous préciserons la configuration, la livraison et les services à inclure.":"Tell us what you have in mind. We’ll clarify the configuration, delivery, and services your quotation needs."}</p></div><a className="button button-light" href={`${pagePath("quote",lang)}?source=${encodeURIComponent(pagePath(pageKey,lang))}`}>{fr?"DEMANDER UNE SOUMISSION":"REQUEST A QUOTE"}</a></div></section>;
}

export function SiteFooter({ lang, pageKey, search = {} }: { lang: Lang; pageKey: string; search?:Record<string,string|string[]|undefined> }) {
  const fr=lang==="fr";
  const pairedQuery=new URLSearchParams();
  if(pageKey==="quote")for(const key of ["interest","service","use","placement","heat"]){const value=search[key];if(typeof value==="string"&&/^[a-z-]{1,30}$/.test(value))pairedQuery.set(key,value);}
  if(pageKey==="quote"&&typeof search.source==="string"){const source=pages.find(p=>p.paths[lang]===search.source);if(source)pairedQuery.set("source",source.paths[fr?"en":"fr"]);}
  const counterpart=pagePath(pageKey,fr?"en":"fr")+(pairedQuery.size?`?${pairedQuery.toString()}`:"");
  const group=(title:string,keys:string[]) => <div className="footer-group"><h2>{title}</h2>{keys.map(key=>{const p=pages.find(p=>p.key===key)!;return <a key={key} href={p.paths[lang]}>{p.copy[lang].eyebrow}</a>;})}</div>;
  return <footer className="site-footer"><div className="container footer-top"><div className="footer-brand"><a href={pagePath("home",lang)} aria-label="BestSauna.ca"><BrandWordmark /></a><p>{fr?"Des choix réfléchis. Un projet bien défini.":"Thoughtful choices. A clearly defined project."}</p><a className="footer-phone" href={`tel:${contacts.tel}`}>{contacts.phone}</a><a href={`mailto:${contacts.email}`}>{contacts.email}</a></div>{group(fr?"VOTRE SAUNA":"YOUR SAUNA",["outdoor","indoor","infrared","cottage","commercial"])}{group(fr?"VOTRE PROJET":"YOUR PROJECT",["installation","compare","guides","coverage","quote"])}{group(fr?"BESTSAUNA.CA":"BESTSAUNA.CA",["about","support","privacy","terms"])}</div><div className="container footer-bottom"><span>© {new Date().getFullYear()} BestSauna.ca</span><span>{fr?"La disponibilité des produits et des services est confirmée dans votre soumission.":"Product and service availability is confirmed in your quotation."}</span><a href={counterpart} lang={fr?"en":"fr"}>{fr?"English":"Français"}</a></div></footer>;
}
