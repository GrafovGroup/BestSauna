import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pages, type Lang } from "@/content/site";
import { siteSettings } from "@/lib/site-settings";
import { SiteHeader, SiteFooter, QuoteBand } from "@/components/site-shell";
import { HomePage } from "@/components/home-page";
import { ContentPage } from "@/components/content-page";
import { guideSummaries } from "@/content/guide-summaries";
import { pageMetadata, pageStructuredData, serializeStructuredData } from "@/lib/page-seo";

type Params = { lang: string; slug?: string[] };
type Props = { params: Promise<Params>; searchParams: Promise<Record<string,string|string[]|undefined>> };
function findPage(params:Params) {const path=`/${params.lang}/${params.slug?.length?`${params.slug.join("/")}/`:""}`;return pages.find(p=>p.paths[params.lang as Lang]===path);}

export async function generateMetadata({params}:Props):Promise<Metadata>{
 const p=await params;const page=findPage(p);if(!page)return {title:"Page not found | BestSauna.ca",robots:{index:false,follow:false}};
 return pageMetadata(page,p.lang as Lang,siteSettings());
}

export default async function Page({params,searchParams}:Props){
 const p=await params;const page=findPage(p);if(!page||!["en","fr"].includes(p.lang))notFound();
 const lang=p.lang as Lang;const {origin}=siteSettings();const search=await searchParams;
 const structured=pageStructuredData(page,lang,origin,pages,guideSummaries[page.key]?.[lang]);
 return <><SiteHeader lang={lang} pageKey={page.key} search={search}/><main id="main-content">{page.key==="home"?<HomePage lang={lang}/>:<ContentPage page={page} lang={lang} search={search}/>}</main>{page.kind!=="quote"&&page.kind!=="policy"&&<QuoteBand lang={lang} pageKey={page.key} search={search}/>}<SiteFooter lang={lang} pageKey={page.key} search={search}/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:serializeStructuredData(structured)}}/></>;
}
