"use client";

import { useEffect, useRef, useState } from "react";
import type { Lang } from "@/content/site";

type NavItem = { label: string; href: string };
export function SiteNav({ lang, home, quote, counterpart, nav, saunaLinks }: { lang: Lang; home: string; quote: string; counterpart: string; nav: NavItem[]; saunaLinks: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const [saunasOpen, setSaunasOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const saunaButton = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);
  const fr = lang === "fr";
  useEffect(() => {
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") { if (open) { setOpen(false); menuButton.current?.focus(); } else if (saunasOpen) { setSaunasOpen(false); saunaButton.current?.focus(); } } };
    const outside = (e: MouseEvent) => { if (!header.current?.contains(e.target as Node)) { setSaunasOpen(false); setOpen(false); } };
    document.addEventListener("keydown", key); document.addEventListener("click", outside);
    return () => { document.removeEventListener("keydown", key); document.removeEventListener("click", outside); };
  }, [open, saunasOpen]);
  return <header ref={header} className="site-header">
    <div className="utility-bar"><div className="container utility-inner"><span>{fr ? "VOTRE PROJET DE SAUNA, PARTOUT AU CANADA" : "YOUR SAUNA PROJECT, ANYWHERE IN CANADA"}</span><a href="tel:+18336969996">(833) 696-9996</a><a className="language-switch" href={counterpart} hrefLang={fr ? "en-CA" : "fr-CA"} lang={fr ? "en" : "fr"} aria-label={fr ? "View this page in English" : "Voir cette page en français"}>{fr ? "EN" : "FR"}</a></div></div>
    <div className="container main-nav">
      <a className="brand-wordmark" href={home} aria-label={fr?"BestSauna.ca — Accueil":"BestSauna.ca — Home"}><img src="/brand/bestsauna-wordmark-en-light.png" width="2172" height="724" alt="BestSauna.ca" /></a>
      <nav className={`nav-links ${open ? "is-open" : ""}`} aria-label={fr ? "Navigation principale" : "Main navigation"} id="primary-navigation">
        <div className="nav-dropdown" onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setSaunasOpen(false); }}>
          <button ref={saunaButton} className="nav-label" onClick={() => setSaunasOpen(!saunasOpen)} aria-expanded={saunasOpen} aria-controls="sauna-navigation">SAUNAS <span className={`chevron ${saunasOpen ? "up" : ""}`} /></button>
          <div className={`dropdown-links ${saunasOpen ? "is-open" : ""}`} id="sauna-navigation">{saunaLinks.map(item => <a href={item.href} key={item.href}>{item.label}</a>)}</div>
        </div>
        {nav.map(item => <a className="nav-label" href={item.href} key={item.href}>{item.label}</a>)}
        <a href={quote} className="button button-small nav-quote">{fr ? "DEMANDER UNE SOUMISSION" : "REQUEST A QUOTE"}</a>
      </nav>
      <button ref={menuButton} className="mobile-menu-toggle" aria-controls="primary-navigation" aria-expanded={open} aria-label={open ? (fr ? "Fermer le menu" : "Close menu") : (fr ? "Ouvrir le menu" : "Open menu")} onClick={() => setOpen(!open)}><span /><span /><span /></button>
    </div>
  </header>;
}
