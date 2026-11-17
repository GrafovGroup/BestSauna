import { getPublishedProducts } from "@/lib/published-catalogue";
import { findProduct, productQuoteQuery } from "@/lib/product-catalogue";
import { productMetadata, productStructuredData, catalogueCollectionData } from "@/lib/product-seo";
import { ProductDetail } from "@/components/product-catalogue";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pages, pagePath, type Lang } from "@/content/site";
import { siteSettings } from "@/lib/site-settings";
import { SiteHeader, SiteFooter, QuoteBand } from "@/components/site-shell";
import { HomePage } from "@/components/home-page";
import { ContentPage } from "@/components/content-page";
import { guideSummaries } from "@/content/guide-summaries";
import { pageMetadata, pageStructuredData, serializeStructuredData } from "@/lib/page-seo";

type Params = { lang: string; slug?: string[] };
type Props = { params: Promise<Params>; searchParams: Promise<Record<string,string|string[]|undefined>> };
function routePath(params:Params) {return `/${params.lang}/${params.slug?.length?`${params.slug.join("/")}/`:""}`;}
function findPage(params:Params) {return pages.find(p=>p.paths[params.lang as Lang]===routePath(params));}

export async function generateMetadata({params}:Props):Promise<Metadata>{
 const p=await params;const product=findProduct(getPublishedProducts(),p.lang as Lang,routePath(p));if(product)return productMetadata(product,p.lang as Lang,siteSettings());const page=findPage(p);if(!page)return {title:"Page not found | BestSauna.ca",robots:{index:false,follow:false}};
 return pageMetadata(page,p.lang as Lang,siteSettings());
}

export default async function Page({params,searchParams}:Props){
 const p=await params;if(!["en","fr"].includes(p.lang))notFound();const products=getPublishedProducts();const product=findProduct(products,p.lang as Lang,routePath(p));const page=findPage(p);if(!page&&!product)notFound();
 const lang=p.lang as Lang;const {origin}=siteSettings();const search=await searchParams;
 if(product){
   const other:Lang=lang==="fr"?"en":"fr";const quoteHref=`${pagePath("quote",lang)}?${productQuoteQuery(product,lang)}`;
   const structured=productStructuredData(product,lang,origin,pages);
   return <><SiteHeader lang={lang} pageKey="saunas" counterpartHref={product.paths[other]} quoteHref={quoteHref}/><main id="main-content"><ProductDetail product={product} lang={lang} canCompare={products.length>=2}/></main><QuoteBand lang={lang} pageKey="saunas" quoteHref={quoteHref}/><SiteFooter lang={lang} pageKey="saunas" counterpartHref={product.paths[other]}/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:serializeStructuredData(structured)}}/></>;
 }
 if(!page)notFound();
 const structured=pageStructuredData(page,lang,origin,pages,guideSummaries[page.key]?.[lang]);
 const collection=catalogueCollectionData(page,products,lang,origin);if(collection){structured["@graph"].push(collection);const webpage=structured["@graph"].find(node=>node["@id"]===origin+page.paths[lang]+"#webpage");if(webpage)webpage.hasPart={"@id":collection["@id"]};}
 return <><SiteHeader lang={lang} pageKey={page.key} search={search}/><main id="main-content">{page.key==="home"?<HomePage lang={lang}/>:<ContentPage page={page} lang={lang} search={search} products={products}/>}</main>{page.kind!=="quote"&&page.kind!=="policy"&&<QuoteBand lang={lang} pageKey={page.key} search={search}/>}<SiteFooter lang={lang} pageKey={page.key} search={search}/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:serializeStructuredData(structured)}}/></>;
}
