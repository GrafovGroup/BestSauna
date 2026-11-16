import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pages, type Lang } from "@/content/site";
import { siteSettings } from "@/lib/site-settings";
import { SiteHeader, SiteFooter, QuoteBand } from "@/components/site-shell";
import { HomePage } from "@/components/home-page";
import { ContentPage } from "@/components/content-page";

type Params = { lang: string; slug?: string[] };
type Props = { params: Promise<Params>; searchParams: Promise<Record<string,string|string[]|undefined>> };
function findPage(params:Params) {const path=`/${params.lang}/${params.slug?.length?`${params.slug.join("/")}/`:""}`;return pages.find(p=>p.paths[params.lang as Lang]===path);}

export async function generateMetadata({params}:Props):Promise<Metadata>{
 const p=await params;const page=findPage(p);if(!page)return {title:"Page not found | BestSauna.ca",robots:{index:false,follow:false}};
 const lang=p.lang as Lang;const c=page.copy[lang];const {origin,indexable}=siteSettings();
 return {title:c.title,description:c.description,metadataBase:new URL(origin),alternates:{canonical:page.paths[lang],languages:{"en-CA":page.paths.en,"fr-CA":page.paths.fr,"x-default":page.paths.en}},robots:{index:indexable,follow:indexable},openGraph:{type:"website",siteName:"BestSauna.ca",title:c.title,description:c.description,url:origin+page.paths[lang],locale:lang==="fr"?"fr_CA":"en_CA",alternateLocale:lang==="fr"?["en_CA"]:["fr_CA"],images:[{url:origin+(c.image||"/images/hero-sauna.webp"),width:1672,height:941,alt:c.imageAlt||"BestSauna.ca"}]},twitter:{card:"summary_large_image",title:c.title,description:c.description,images:[origin+(c.image||"/images/hero-sauna.webp")]}};
}

export default async function Page({params,searchParams}:Props){
 const p=await params;const page=findPage(p);if(!page||!["en","fr"].includes(p.lang))notFound();
 const lang=p.lang as Lang;const {origin}=siteSettings();const c=page.copy[lang];const search=await searchParams;
 const structured={"@context":"https://schema.org","@graph":[{"@type":"Organization","@id":origin+"/#organization",name:"BestSauna.ca",url:origin,logo:origin+"/brand/bestsauna-wordmark-en-light.png"},{"@type":"WebSite","@id":origin+"/#website",url:origin,name:"BestSauna.ca",inLanguage:["en-CA","fr-CA"],publisher:{"@id":origin+"/#organization"}},...(page.key!=="home"?[{"@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:lang==="fr"?"Accueil":"Home",item:origin+`/${lang}/`},{"@type":"ListItem",position:2,name:c.eyebrow,item:origin+page.paths[lang]}]}]:[])]};
 return <><SiteHeader lang={lang} pageKey={page.key} search={search}/><main id="main-content">{page.key==="home"?<HomePage lang={lang}/>:<ContentPage page={page} lang={lang} search={search}/>}</main>{page.kind!=="quote"&&page.kind!=="policy"&&<QuoteBand lang={lang} pageKey={page.key} search={search}/>}<SiteFooter lang={lang} pageKey={page.key} search={search}/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structured).replace(/</g,"\\u003c")}}/></>;
}
