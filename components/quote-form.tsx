"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import type { Lang } from "@/content/site";

type Fields=Record<string,string>;
export function QuoteForm({lang,initialInterest="",initialService="",initialUse="",initialPlacement="",initialHeat="",sourcePath,privacyPath}:{lang:Lang;initialInterest?:string;initialService?:string;initialUse?:string;initialPlacement?:string;initialHeat?:string;sourcePath:string;privacyPath:string}) {
  const fr=lang==="fr";
  const [fields,setFields]=useState<Fields>({name:"",email:"",phone:"",location:"",intendedUse:initialUse||(initialInterest==="cottage"?"cottage":initialInterest==="commercial"?"commercial":""),placement:initialPlacement||(initialInterest==="outdoor"||initialInterest==="cottage"?"outdoor":initialInterest==="indoor"||initialInterest==="infrared"?"indoor":""),interest:initialInterest,service:initialService,timeframe:"",contactMethod:"email",capacity:"",heat:initialHeat,budget:"",message:"",commercialDetails:"",website:""});
  const [accepted,setAccepted]=useState(false);
  const [errors,setErrors]=useState<Fields>({});
  const [status,setStatus]=useState<"idle"|"saving"|"error"|"success">("idle");
  const [message,setMessage]=useState("");
  const [reference,setReference]=useState("");
  const lock=useRef(false); const attempt=useRef({payload:"",key:""}); const result=useRef<HTMLDivElement>(null);
  useEffect(()=>{if(status==="success"){result.current?.focus({preventScroll:true});result.current?.scrollIntoView({block:"start",behavior:"auto"});}},[status]);
  const update=(key:string,value:string)=>{setFields(f=>({...f,[key]:value}));setErrors(e=>{const next={...e};delete next[key];return next;});};
  const required=fr?"Veuillez remplir ce champ.":"Please complete this field.";
  const label=(en:string,frText:string)=>fr?frText:en;
  const err=(key:string)=>errors[key]?<span className="field-error" id={`error-${key}`}>{errors[key]}</span>:null;
  const text=(key:string,title:string,options:{type?:string;required?:boolean;placeholder?:string;autoComplete?:string;maxLength?:number}={})=><div className="form-field" key={key}><label htmlFor={key}>{title}{options.required&&<span aria-hidden="true"> *</span>}</label><input id={key} name={key} value={fields[key]} onChange={e=>update(key,e.target.value)} type={options.type||"text"} required={options.required} maxLength={options.maxLength||150} autoComplete={options.autoComplete} placeholder={options.placeholder} aria-invalid={!!errors[key]} aria-describedby={errors[key]?`error-${key}`:undefined}/>{err(key)}</div>;
  const select=(key:string,title:string,values:[string,string][],mandatory=true)=><div className="form-field" key={key}><label htmlFor={key}>{title}{mandatory&&<span aria-hidden="true"> *</span>}</label><select id={key} name={key} value={fields[key]} onChange={e=>update(key,e.target.value)} required={mandatory} aria-invalid={!!errors[key]} aria-describedby={errors[key]?`error-${key}`:undefined}><option value="">{fr?"Sélectionnez une option":"Select an option"}</option>{values.map(([value,title])=><option key={value} value={value}>{title}</option>)}</select>{err(key)}</div>;
  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault();if(lock.current)return;
    const next:Fields={}; for(const key of ["intendedUse","placement","interest","service","location","timeframe","name","email"])if(!fields[key].trim())next[key]=required;
    if(fields.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))next.email=label("Enter a valid email address.","Entrez une adresse courriel valide.");
    if(fields.contactMethod==="phone"&&!fields.phone.trim())next.phone=label("Add a phone number for a phone reply.","Ajoutez un numéro pour être joint par téléphone.");
    if(!accepted)next.privacyAccepted=label("Please acknowledge the privacy notice.","Veuillez prendre connaissance de l’avis de confidentialité.");
    setErrors(next);
    if(Object.keys(next).length){document.getElementById(Object.keys(next)[0])?.focus();return;}
    const payload=JSON.stringify({...fields,language:lang,sourcePath,privacyAccepted:accepted});
    if(attempt.current.payload!==payload)attempt.current={payload,key:crypto.randomUUID()};
    lock.current=true;setStatus("saving");setMessage("");
    const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),20000);
    try{
      const response=await fetch("/api/quotes",{method:"POST",headers:{"Content-Type":"application/json","Idempotency-Key":attempt.current.key},body:payload,signal:controller.signal});
      const data=await response.json() as {ok?:boolean;reference?:string;fields?:Record<string,string>};
      if(response.ok&&data.ok&&typeof data.reference==="string"){setReference(data.reference);setStatus("success");return;}
      if(response.status===422&&data.fields){
        const serverFields=data.fields;
        setErrors(Object.fromEntries(Object.entries(serverFields).map(([key,code])=>[key,code==="required"?required:code==="too_long"?label("Please shorten this entry.","Veuillez raccourcir ce texte."):label("Please check this field.","Veuillez vérifier ce champ.")])));
        setStatus("error");setMessage(label("Please correct the highlighted fields and send your request again.","Veuillez corriger les champs indiqués et envoyer votre demande à nouveau."));setTimeout(()=>document.getElementById(Object.keys(serverFields)[0])?.focus(),0);return;
      }
      setStatus("error");setMessage(response.status===429?label("Too many attempts. Please wait an hour before sending another request. Your entries remain here.","Trop de tentatives. Veuillez attendre une heure avant d’envoyer une autre demande. Vos renseignements restent dans le formulaire."):label("We couldn’t confirm that your request was saved. Please try again; your entries are still here. You can also contact us directly.","Nous n’avons pas pu confirmer l’enregistrement de votre demande. Réessayez; vos renseignements sont conservés dans le formulaire. Vous pouvez aussi nous joindre directement."));
    }catch{setStatus("error");setMessage(label("The connection was interrupted. Please try again. Retrying the same request will not create a duplicate.","La connexion a été interrompue. Veuillez réessayer. Une nouvelle tentative identique ne créera pas de doublon."));}
    finally{clearTimeout(timer);lock.current=false;}
  }
  if(status==="success")return <div ref={result} tabIndex={-1} className="form-success" role="status"><span className="success-mark" aria-hidden="true">✓</span><p className="eyebrow">{fr?"DEMANDE ENREGISTRÉE":"REQUEST SAVED"}</p><h2>{fr?"Merci de nous parler de votre projet.":"Thanks for telling us about your project."}</h2><p>{fr?"Votre demande a été enregistrée. Conservez ce numéro pour tout suivi avec BestSauna.ca.":"Your enquiry has been saved. Keep this reference for any follow-up with BestSauna.ca."}</p><div className="reference-number">{reference}</div><p>{fr?"Cette demande ne constitue ni une commande ni une réservation. Les produits, les services et les conditions seront confirmés dans une soumission écrite.":"This is an enquiry, not an order or reservation. Products, services, and terms will be confirmed in a written quotation."}</p><a href={`mailto:info@bestsauna.ca?subject=${encodeURIComponent(`BestSauna ${reference}`)}`} className="button">{fr?"NOUS ÉCRIRE":"EMAIL BESTSAUNA"}</a></div>;
  return <form className="quote-form" onSubmit={submit} noValidate>
    <p className="form-required">{fr?"Les champs marqués d’un * sont obligatoires.":"Fields marked * are required."}</p>
    <fieldset><legend><span>01</span>{fr?"Votre projet":"Your project"}</legend><div className="form-grid">
      {select("intendedUse",label("Where will it be used?","À quel usage est-il destiné?"),[["home",label("Home","Résidence")],["cottage",label("Cottage","Chalet")],["commercial",label("Commercial / hospitality","Commercial / hébergement")]])}
      {select("placement",label("Indoor or outdoor?","À l’intérieur ou à l’extérieur?"),[["outdoor",label("Outdoor","À l’extérieur")],["indoor",label("Indoor","À l’intérieur")],["unsure",label("Help me decide","J’aimerais être conseillé")]])}
      {select("interest",label("What are you considering?","Qu’envisagez-vous?"),[["outdoor",label("Outdoor sauna","Sauna extérieur")],["indoor",label("Indoor traditional sauna","Sauna intérieur traditionnel")],["infrared",label("Infrared sauna","Sauna infrarouge")],["cottage",label("Cottage sauna","Sauna pour chalet")],["commercial",label("Commercial sauna","Sauna commercial")],["heaters",label("Heater / accessories","Chauffe-sauna / accessoires")],["unsure",label("I need help choosing","J’ai besoin d’aide pour choisir")]])}
      {select("service",label("How much help do you need?","De quel accompagnement avez-vous besoin?"),[["supply",label("Supply & delivery","Fourniture et livraison")],["assembly",label("Supply, delivery & assembly","Fourniture, livraison et assemblage")],["managed",label("Managed installation project","Projet d’installation coordonné")],["unsure",label("Please advise me","À déterminer ensemble")]])}
      {text("location",label("City and postal code","Ville et code postal"),{required:true,autoComplete:"postal-code",placeholder:label("e.g. Toronto, M5V","p. ex. Montréal, H2X")})}
      {select("timeframe",label("Your project timing","Votre échéancier"),[["soon",label("As soon as practical","Dès que possible")],["three-six",label("Within 3–6 months","D’ici 3 à 6 mois")],["six-plus",label("More than 6 months","Dans plus de 6 mois")],["exploring",label("Exploring my options","Je me renseigne")]])}
    </div></fieldset>
    <fieldset><legend><span>02</span>{fr?"Vos coordonnées":"Your contact details"}</legend><div className="form-grid">
      {text("name",label("Full name","Nom complet"),{required:true,autoComplete:"name",maxLength:120})}
      {text("email",label("Email address","Adresse courriel"),{required:true,type:"email",autoComplete:"email",maxLength:254})}
      {text("phone",label("Phone number (optional)","Téléphone (facultatif)"),{type:"tel",autoComplete:"tel",maxLength:40})}
      {select("contactMethod",label("Preferred reply","Moyen de communication préféré"),[["email",label("Email","Courriel")],["phone",label("Phone","Téléphone")]],false)}
    </div></fieldset>
    <fieldset><legend><span>03</span>{fr?"Quelques précisions":"A little more detail"}</legend><div className="form-grid">
      {text("capacity",label("People using it at once (optional)","Nombre d’utilisateurs à la fois (facultatif)"),{maxLength:60})}
      {text("budget",label("Project budget, CAD (optional)","Budget du projet, CAD (facultatif)"),{maxLength:100})}
      {select("heat",label("Heat preference (optional)","Chauffage souhaité (facultatif)"),[["electric",label("Traditional electric","Électrique traditionnel")],["wood",label("Wood-fired","Au bois")],["infrared",label("Infrared","Infrarouge")],["unsure",label("Open to advice","À déterminer")]],false)}
    </div><div className="form-field"><label htmlFor="message">{fr?"Votre espace, vos idées, vos questions (facultatif)":"Your space, ideas, or questions (optional)"}</label><textarea id="message" name="message" rows={4} maxLength={2000} value={fields.message} onChange={e=>update("message",e.target.value)} placeholder={fr?"Accès au site, dimensions approximatives, style souhaité…":"Site access, approximate space, preferred style…"}/>{err("message")}</div>{fields.intendedUse==="commercial"&&<div className="form-field"><label htmlFor="commercialDetails">{fr?"Type d’établissement et utilisation prévue (facultatif)":"Facility type and expected use (optional)"}</label><textarea id="commercialDetails" name="commercialDetails" rows={3} maxLength={1500} value={fields.commercialDetails} onChange={e=>update("commercialDetails",e.target.value)} placeholder={fr?"Hôtel, centre de conditionnement, chalet locatif; heures d’utilisation et exigences du projet.":"Hotel, fitness facility, rental cottage; operating hours and project requirements."}/>{err("commercialDetails")}</div>}</fieldset>
    <div className="honey" aria-hidden="true"><label htmlFor="website">Website</label><input tabIndex={-1} autoComplete="off" id="website" name="website" value={fields.website} onChange={e=>update("website",e.target.value)}/></div>
    <div className="privacy-consent"><input type="checkbox" id="privacyAccepted" checked={accepted} required onChange={e=>{setAccepted(e.target.checked);setErrors(x=>{const y={...x};delete y.privacyAccepted;return y;});}} aria-invalid={!!errors.privacyAccepted} aria-describedby={errors.privacyAccepted?"error-privacyAccepted":undefined}/><label htmlFor="privacyAccepted">{fr?"J’ai lu l’":"I have read the "}<a href={privacyPath} target="_blank" rel="noreferrer">{fr?"avis de confidentialité":"privacy notice"}</a>{fr?" et je comprends que mes renseignements seront utilisés pour traiter cette demande.":" and understand that my details will be used to handle this enquiry."}</label></div>{err("privacyAccepted")}
    {status==="error"&&<div className="form-alert" role="alert">{message}</div>}
    <button className="button" type="submit" disabled={status==="saving"}>{status==="saving"?label("SAVING YOUR REQUEST…","ENREGISTREMENT EN COURS…"):label("SEND MY PROJECT REQUEST","ENVOYER MA DEMANDE")}</button><p className="form-note">{fr?"Aucun paiement. Aucun abonnement marketing. La disponibilité sera confirmée dans votre soumission.":"No payment. No marketing subscription. Availability will be confirmed in your quotation."}</p><noscript><p>{fr?"Activez JavaScript pour utiliser le formulaire, ou écrivez-nous à info@bestsauna.ca.":"Enable JavaScript to use this form, or email info@bestsauna.ca."}</p></noscript>
  </form>;
}
