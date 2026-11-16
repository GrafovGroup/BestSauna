"use client";
import { usePathname } from "next/navigation";

export default function NotFound(){
 const path=usePathname();const fr=path?.startsWith("/fr/");
 return <><title>{fr?"Page introuvable | BestSauna.ca":"Page not found | BestSauna.ca"}</title><main id="main-content" className="not-found"><a href={fr?"/fr/":"/en/"} className="brand-wordmark"><img src="/brand/bestsauna-wordmark-en-light.png" width="2172" height="724" alt="BestSauna.ca"/></a><p className="eyebrow">404</p><h1>{fr?"Cette page a changé de place.":"This page is out of reach."}</h1><p>{fr?"Retrouvez votre point de départ pour explorer les saunas ou nous parler de votre projet.":"Find your starting point to explore saunas or tell us about your project."}</p><a className="button" href={fr?"/fr/":"/en/"}>{fr?"RETOUR À L’ACCUEIL":"BACK TO HOME"}</a></main></>;
}
