import type { Lang, SitePage } from "@/content/site";
import { guideSummaries } from "@/content/guide-summaries";

export function GuideArticle({ page, lang, quoteUrl }: { page: SitePage; lang: Lang; quoteUrl: string }) {
  const fr = lang === "fr";
  const copy = page.copy[lang];
  const summary = guideSummaries[page.key]?.[lang];
  const contents = <ol>{copy.sections.map((section, i) => <li key={section.title}><a href={`#section-${i + 1}`}>{section.title.replace(/^\d+\.\s*/, "")}</a></li>)}</ol>;
  return <div className="container guide-layout">
    <aside className="guide-sidebar">
      <nav className="guide-toc-desktop" aria-label={fr ? "Dans ce guide" : "In this guide"}><p className="eyebrow">{fr ? "DANS CE GUIDE" : "IN THIS GUIDE"}</p>{contents}</nav>
      <details className="guide-toc-mobile"><summary>{fr ? "DANS CE GUIDE" : "IN THIS GUIDE"}<span aria-hidden="true">+</span></summary><nav aria-label={fr ? "Dans ce guide" : "In this guide"}>{contents}</nav></details>
      <a className="text-link guide-sidebar-quote" href={quoteUrl}>{fr ? "DEMANDER UNE SOUMISSION" : "REQUEST A QUOTE"}</a>
    </aside>
    <article className="guide-article" aria-labelledby="page-title">
      {summary && <section className="guide-answer" aria-labelledby="guide-answer-heading"><p className="eyebrow">{fr ? "L’ESSENTIEL" : "AT A GLANCE"}</p><h2 id="guide-answer-heading" tabIndex={-1}>{summary.question}</h2><p>{summary.answer}</p><ul>{summary.points.map(point => <li key={point}>{point}</li>)}</ul></section>}
      {copy.sections.map((section, i) => <section className="guide-section" key={section.title} aria-labelledby={`section-${i + 1}`}><h2 id={`section-${i + 1}`} tabIndex={-1}>{section.title}</h2>{section.text?.split("\n\n").map(p => <p key={p}>{p}</p>)}{section.bullets && <ul className="guide-checklist">{section.bullets.map(p => <li key={p}>{p}</li>)}</ul>}{section.items && <div className="guide-detail-items">{section.items.map(item => <div key={item.title}><h3>{item.title}</h3><p>{item.text}</p></div>)}</div>}</section>)}
      <a className="text-link guide-back-top" href="#page-title">{fr ? "REVENIR AU DÉBUT" : "BACK TO THE TOP"}<span aria-hidden="true"> ↑</span></a>
    </article>
  </div>;
}
