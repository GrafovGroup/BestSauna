import test from 'node:test';
import assert from 'node:assert/strict';
import { pages } from '../content/site.ts';
import { guideSummaries } from '../content/guide-summaries.ts';
import { pageBreadcrumbs, pageMetadata, pageStructuredData, serializeStructuredData, siteRobots, siteSitemap } from '../lib/page-seo.ts';

const origin = 'https://bestsauna.dimagrafov.chatgpt.site';
const settings = { origin, indexable: false };
const languages = ['en', 'fr'];

test('every bilingual route has canonical, reciprocal language and privacy-safe metadata', () => {
  for (const page of pages) for (const lang of languages) {
    const metadata = pageMetadata(page,lang,settings);
    assert.equal(metadata.alternates.canonical,page.paths[lang]);
    assert.deepEqual(metadata.alternates.languages,{'en-CA':page.paths.en,'fr-CA':page.paths.fr,'x-default':page.paths.en});
    assert.deepEqual(metadata.robots,{index:false,follow:false});
    assert.equal(metadata.openGraph.url,origin+page.paths[lang]);
    assert.equal(metadata.openGraph.type,page.kind==='guide'?'article':'website');
    assert.equal(metadata.openGraph.locale,lang==='fr'?'fr_CA':'en_CA');
    assert.equal(metadata.description,page.copy[lang].description);
    for(const url of [metadata.openGraph.url,origin+metadata.alternates.canonical,...Object.values(metadata.alternates.languages).map(path=>origin+path)]) {
      assert.equal(new URL(url).search,'');
      assert.equal(new URL(url).hash,'');
    }
    assert.deepEqual(pageMetadata(page,lang,{...settings,indexable:true}).robots,{index:true,follow:true});
  }
});

test('generated graph references resolve and unverified commercial or author claims remain absent', () => {
  const forbidden = new Set(['Product','ProductGroup','Offer','AggregateOffer','Review','AggregateRating','LocalBusiness','Store','FAQPage']);
  for (const page of pages) for (const lang of languages) {
    const data=pageStructuredData(page,lang,origin,pages,guideSummaries[page.key]?.[lang]);
    const ids=new Set();
    function collect(node) {
      if(!node||typeof node!=='object')return;
      if(node['@id']&&node['@type']) { assert.ok(!ids.has(node['@id']));ids.add(node['@id']); }
      if(node['@type'])assert.ok(!forbidden.has(node['@type']));
      for(const key of ['author','datePublished','dateModified','price','aggregateRating'])assert.ok(!(key in node));
      Object.values(node).forEach(collect);
    }
    collect(data);
    function refs(node) {
      if(!node||typeof node!=='object')return;
      if(node['@id'])assert.ok(ids.has(node['@id']),'Unresolved '+node['@id']);
      Object.values(node).forEach(refs);
    }
    refs(data);
    assert.equal(data['@graph'].filter(x=>x['@type']==='Article').length,page.kind==='guide'?1:0);
  }
});

test('guide summaries, section links and breadcrumbs describe the visible language content', () => {
  for(const page of pages.filter(p=>p.kind==='guide'))for(const lang of languages){
    const summary=guideSummaries[page.key][lang];
    assert.ok(summary.question&&summary.answer&&summary.points.length===3);
    const article=pageStructuredData(page,lang,origin,pages,summary)['@graph'].find(n=>n['@type']==='Article');
    assert.equal(article.abstract,summary.answer);
    assert.equal(article.headline,page.copy[lang].heading);
    assert.deepEqual(article.hasPart.map(p=>p.name),page.copy[lang].sections.map(s=>s.title));
    assert.deepEqual(article.hasPart.map(p=>p.url),page.copy[lang].sections.map((_,i)=>origin+page.paths[lang]+'#section-'+(i+1)));
    const trail=pageBreadcrumbs(page,lang,pages);
    assert.equal(trail.length,3);
    assert.equal(trail[1].path,pages.find(p=>p.key==='guides').paths[lang]);
    assert.equal(trail.at(-1).path,page.paths[lang]);
  }
});

test('collection markup names only the category and guide links actually presented', () => {
  for(const key of ['guides','saunas'])for(const lang of languages){
    const page=pages.find(p=>p.key===key);
    const list=pageStructuredData(page,lang,origin,pages)['@graph'].find(n=>n['@type']==='ItemList');
    const expected=key==='guides'?pages.filter(p=>p.kind==='guide'):['outdoor','indoor','infrared','cottage','commercial','heaters'].map(k=>pages.find(p=>p.key===k));
    assert.equal(list.numberOfItems,expected.length);
    assert.deepEqual(list.itemListElement.map(n=>n.url),expected.map(p=>origin+p.paths[lang]));
  }
});

test('private robots and sitemap stay closed; public output has every canonical and language alternative', () => {
  assert.equal(siteRobots(settings),'User-agent: *\nDisallow: /\n');
  assert.equal((siteSitemap(pages,settings).match(/<url>/g)||[]).length,0);
  const publicSettings={origin:'https://bestsauna.ca',indexable:true};
  const sitemap=siteSitemap(pages,publicSettings);
  assert.equal((sitemap.match(/<url>/g)||[]).length,40);
  for(const page of pages)for(const lang of languages)assert.ok(sitemap.includes('<loc>'+publicSettings.origin+page.paths[lang]+'</loc>'));
  for(const lang of ['en-CA','fr-CA','x-default'])assert.equal((sitemap.match(new RegExp('hreflang="'+lang+'"','g'))||[]).length,40);
  assert.ok(!sitemap.includes('<lastmod>'));
  assert.ok(siteRobots(publicSettings).includes('Disallow: /api/'));
  assert.ok(siteRobots(publicSettings).includes('Sitemap: https://bestsauna.ca/sitemap.xml'));
});

test('structured-data text cannot close its script tag or change the original content', () => {
  const input={text:'</script><script>alert(1)</script>\u2028\u2029 — Montréal & Québec'};
  const serialized=serializeStructuredData(input);
  assert.ok(!serialized.includes('<'));
  assert.deepEqual(JSON.parse(serialized),input);
});
