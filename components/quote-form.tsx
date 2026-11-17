"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import type { Lang } from "@/content/site";
import { clearQuoteDraft, QUOTE_DRAFT_TTL, readQuoteDraft, saveQuoteDraft, type QuoteAttempt, type QuoteFields } from "@/lib/quote-draft";

type Props = { lang: Lang; initialProductId?: string; initialMessage?: string; initialPlanContext?: string; selectionAdjusted?: boolean; initialInterest?: string; initialService?: string; initialUse?: string; initialPlacement?: string; initialHeat?: string; sourcePath: string; privacyPath: string };
type Field = { key: string; title: string; options?: [string, string][]; required?: boolean; type?: string; autoComplete?: string; maxLength?: number; placeholder?: string; multiline?: boolean };

export function QuoteForm({ lang, initialInterest = "", initialService = "", initialUse = "", initialPlacement = "", initialHeat = "", initialProductId = "", initialMessage = "", initialPlanContext = "", selectionAdjusted = false, sourcePath, privacyPath }: Props) {
  const fr = lang === "fr";
  const label = (en: string, french: string) => fr ? french : en;
  const initialFields: QuoteFields = {
    name: "", email: "", phone: "", location: "",
    intendedUse: initialUse || (initialInterest === "cottage" ? "cottage" : initialInterest === "commercial" ? "commercial" : ""),
    placement: initialPlacement || (["outdoor", "cottage"].includes(initialInterest) ? "outdoor" : ["indoor", "infrared"].includes(initialInterest) ? "indoor" : ""),
    interest: initialInterest, service: initialService, timeframe: "", contactMethod: "email",
    capacity: "", heat: initialHeat, budget: "", message: initialMessage, commercialDetails: "", website: "",
  };
  const context = JSON.stringify([initialInterest, initialService, initialUse, initialPlacement, initialHeat, ...(initialProductId ? [initialProductId] : []), ...(initialPlanContext ? [initialPlanContext] : [])]);
  const [fields, setFields] = useState(initialFields);
  const [accepted, setAccepted] = useState(false);
  const [errors, setErrors] = useState<QuoteFields>({});
  const [status, setStatus] = useState<"idle" | "saving" | "error" | "success">("idle");
  const [reviewing, setReviewing] = useState(false);
  const [message, setMessage] = useState("");
  const [reference, setReference] = useState("");
  const [notificationNeedsFollowUp, setNotificationNeedsFollowUp] = useState(false);
  const [draftState, setDraftState] = useState<"ready" | "saved" | "unavailable" | "expired">("ready");
  const lock = useRef(false);
  const attempt = useRef<QuoteAttempt>({ fingerprint: "", key: "" });
  const storage = useRef<Storage | null>(null);
  const expiryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const result = useRef<HTMLDivElement>(null);
  const reviewTitle = useRef<HTMLHeadingElement>(null);
  const errorSummary = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  function scheduleExpiry(remaining = QUOTE_DRAFT_TTL) {
    if (expiryTimer.current) clearTimeout(expiryTimer.current);
    expiryTimer.current = setTimeout(() => {
      if (storage.current) clearQuoteDraft(storage.current);
      setDraftState("expired");
    }, remaining);
  }

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      try {
        storage.current = window.sessionStorage;
        const draft = readQuoteDraft(storage.current, context);
        if (draft) {
          setFields({ ...initialFields, ...draft.fields });
          attempt.current = draft.attempt;
          setDraftState("saved");
        }
      } catch { setDraftState("unavailable"); }
    }
    // Resume the original expiry, including React's development effect replay.
    if (storage.current) {
      const draft = readQuoteDraft(storage.current, context);
      if (draft) scheduleExpiry(Math.max(0, QUOTE_DRAFT_TTL - (Date.now() - draft.savedAt)));
    }
    return () => { if (expiryTimer.current) clearTimeout(expiryTimer.current); };
    // Initial route choices define this mounted form; editing them must not reset it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (status === "success") {
      result.current?.focus({ preventScroll: true });
      result.current?.scrollIntoView({ block: "start", behavior: "auto" });
    }
  }, [status]);
  useEffect(() => {
    if (reviewing) {
      reviewTitle.current?.focus({ preventScroll: true });
      reviewTitle.current?.scrollIntoView({ block: "start", behavior: "auto" });
    }
  }, [reviewing]);

  function persist(next: QuoteFields) {
    if (!storage.current || !saveQuoteDraft(storage.current, context, next, attempt.current)) {
      setDraftState("unavailable");
      return;
    }
    setDraftState("saved");
    scheduleExpiry();
  }
  function update(key: string, value: string) {
    const next = { ...fields, [key]: value };
    setFields(next);
    if (key !== "website") persist(next);
    setErrors(previous => { const nextErrors = { ...previous }; delete nextErrors[key]; return nextErrors; });
  }
  function discard() {
    if (storage.current) clearQuoteDraft(storage.current);
    if (expiryTimer.current) clearTimeout(expiryTimer.current);
    setFields(initialFields); setAccepted(false); setErrors({}); setStatus("idle"); setMessage(""); setReviewing(false); setDraftState("ready");
    attempt.current = { fingerprint: "", key: "" };
    requestAnimationFrame(() => document.getElementById("intendedUse")?.focus());
  }

  const projectFields: Field[] = [
    { key: "intendedUse", title: label("Where will it be used?", "À quel usage est-il destiné?"), required: true, options: [["home", label("Home", "Résidence")], ["cottage", label("Cottage", "Chalet")], ["commercial", label("Commercial / hospitality", "Commercial / hébergement")]] },
    { key: "placement", title: label("Indoor or outdoor?", "À l’intérieur ou à l’extérieur?"), required: true, options: [["outdoor", label("Outdoor", "À l’extérieur")], ["indoor", label("Indoor", "À l’intérieur")], ["unsure", label("Help me decide", "J’aimerais être conseillé")]] },
    { key: "interest", title: label("What are you considering?", "Qu’envisagez-vous?"), required: true, options: [["outdoor", label("Outdoor sauna", "Sauna extérieur")], ["indoor", label("Indoor traditional sauna", "Sauna intérieur traditionnel")], ["infrared", label("Infrared sauna", "Sauna infrarouge")], ["cottage", label("Cottage sauna", "Sauna pour chalet")], ["commercial", label("Commercial sauna", "Sauna commercial")], ["heaters", label("Heater / accessories", "Chauffe-sauna / accessoires")], ["unsure", label("I need help choosing", "J’ai besoin d’aide pour choisir")]] },
    { key: "service", title: label("How much help do you need?", "De quel accompagnement avez-vous besoin?"), required: true, options: [["supply", label("Supply & delivery", "Fourniture et livraison")], ["assembly", label("Supply, delivery & assembly", "Fourniture, livraison et assemblage")], ["managed", label("Managed installation project", "Projet d’installation coordonné")], ["unsure", label("Please advise me", "À déterminer ensemble")]] },
    { key: "location", title: label("City and postal code", "Ville et code postal"), required: true, autoComplete: "postal-code", placeholder: label("e.g. Toronto, M5V", "p. ex. Montréal, H2X") },
    { key: "timeframe", title: label("Your project timing", "Votre échéancier"), required: true, options: [["soon", label("As soon as practical", "Dès que possible")], ["three-six", label("Within 3–6 months", "D’ici 3 à 6 mois")], ["six-plus", label("More than 6 months", "Dans plus de 6 mois")], ["exploring", label("Exploring my options", "Je me renseigne")]] },
  ];
  const contactFields: Field[] = [
    { key: "name", title: label("Full name", "Nom complet"), required: true, autoComplete: "name", maxLength: 120 },
    { key: "email", title: label("Email address", "Adresse courriel"), required: true, type: "email", autoComplete: "email", maxLength: 254 },
    { key: "contactMethod", title: label("Preferred reply", "Moyen de communication préféré"), required: true, options: [["email", label("Email", "Courriel")], ["phone", label("Phone", "Téléphone")]] },
    { key: "phone", title: fields.contactMethod === "phone" ? label("Phone number", "Téléphone") : label("Phone number (optional)", "Téléphone (facultatif)"), required: fields.contactMethod === "phone", type: "tel", autoComplete: "tel", maxLength: 40 },
  ];
  const detailFields: Field[] = [
    { key: "capacity", title: label("People using it at once (optional)", "Nombre d’utilisateurs à la fois (facultatif)"), maxLength: 60 },
    { key: "budget", title: label("Project budget, CAD (optional)", "Budget du projet, CAD (facultatif)"), maxLength: 100 },
    { key: "heat", title: label("Heat preference (optional)", "Chauffage souhaité (facultatif)"), options: [["electric", label("Traditional electric", "Électrique traditionnel")], ["wood", label("Wood-fired", "Au bois")], ["infrared", label("Infrared", "Infrarouge")], ["unsure", label("Open to advice", "À déterminer")]] },
    { key: "message", title: label("Your space, ideas, or questions (optional)", "Votre espace, vos idées, vos questions (facultatif)"), multiline: true, maxLength: 2000, placeholder: label("Site access, approximate space, preferred style…", "Accès au site, dimensions approximatives, style souhaité…") },
    ...(fields.intendedUse === "commercial" ? [{ key: "commercialDetails", title: label("Facility type and expected use (optional)", "Type d’établissement et utilisation prévue (facultatif)"), multiline: true, maxLength: 1500, placeholder: label("Hotel, fitness facility, rental cottage; operating hours and project requirements.", "Hôtel, centre de conditionnement, chalet locatif; heures d’utilisation et exigences du projet.") }] : []),
  ];
  const groups = [
    { title: label("Your project", "Votre projet"), fields: projectFields },
    { title: label("Your contact details", "Vos coordonnées"), fields: contactFields },
    { title: label("A little more detail", "Quelques précisions"), fields: detailFields },
  ];
  const allFields = groups.flatMap(group => group.fields);
  const required = label("Please complete this field.", "Veuillez remplir ce champ.");
  const err = (key: string) => errors[key] ? <span className="field-error" id={`error-${key}`}>{errors[key]}</span> : null;
  function renderField(field: Field) {
    const common = { id: field.key, name: field.key, value: fields[field.key], onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => update(field.key, e.target.value), required: field.required, "aria-invalid": !!errors[field.key], "aria-describedby": errors[field.key] ? `error-${field.key}` : undefined };
    return <div className={`form-field ${field.multiline ? "form-field-wide" : ""}`} key={field.key}>
      <label htmlFor={field.key}>{field.title}{field.required && <span aria-hidden="true"> *</span>}</label>
      {field.options ? <select {...common}><option value="">{label("Select an option", "Sélectionnez une option")}</option>{field.options.map(([value, title]) => <option key={value} value={value}>{title}</option>)}</select>
        : field.multiline ? <textarea {...common} rows={4} maxLength={field.maxLength} placeholder={field.placeholder} />
        : <input {...common} type={field.type || "text"} maxLength={field.maxLength || 150} autoComplete={field.autoComplete} placeholder={field.placeholder} />}
      {err(field.key)}
    </div>;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (lock.current) return;
    const next: QuoteFields = {};
    for (const field of allFields) {
      if (field.required && !fields[field.key].trim()) next[field.key] = required;
      else if (field.options && fields[field.key] && !field.options.some(([value]) => value === fields[field.key])) next[field.key] = label("Please select an option.", "Veuillez sélectionner une option.");
    }
    if (fields.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) next.email = label("Enter a valid email address.", "Entrez une adresse courriel valide.");
    if (fields.phone && (fields.phone.replace(/\D/g, "").length < 7 || fields.phone.replace(/\D/g, "").length > 16)) next.phone = label("Enter a valid phone number.", "Entrez un numéro de téléphone valide.");
    if (!accepted) next.privacyAccepted = label("Please acknowledge the privacy notice.", "Veuillez prendre connaissance de l’avis de confidentialité.");
    setErrors(next);
    if (Object.keys(next).length) {
      setReviewing(false);
      requestAnimationFrame(() => errorSummary.current?.focus());
      return;
    }
    if (!reviewing) { setReviewing(true); setStatus("idle"); return; }
    const payload = JSON.stringify({ ...fields, commercialDetails: fields.intendedUse === "commercial" ? fields.commercialDetails : "", language: lang, sourcePath, privacyAccepted: accepted });
    lock.current = true; setStatus("saving"); setMessage("");
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);
    try {
      const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(payload));
      const fingerprint = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
      if (attempt.current.fingerprint !== fingerprint) attempt.current = { fingerprint, key: crypto.randomUUID() };
      persist(fields);
      const response = await fetch("/api/quotes", { method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": attempt.current.key }, body: payload, signal: controller.signal });
      const data = await response.json() as { ok?: boolean; reference?: string; notification?: string; fields?: Record<string, string> };
      if (response.ok && data.ok && typeof data.reference === "string") {
        if (storage.current) clearQuoteDraft(storage.current);
        if (expiryTimer.current) clearTimeout(expiryTimer.current);
        setFields(initialFields); setAccepted(false); attempt.current = { fingerprint: "", key: "" };
        setNotificationNeedsFollowUp(["failed", "unknown", "sending", "pending"].includes(data.notification || ""));
        setReference(data.reference); setStatus("success"); return;
      }
      if (response.status === 422 && data.fields) {
        setErrors(Object.fromEntries(Object.entries(data.fields).map(([key, code]) => [key, code === "required" ? required : code === "too_long" ? label("Please shorten this entry.", "Veuillez raccourcir ce texte.") : label("Please check this field.", "Veuillez vérifier ce champ.")])));
        setReviewing(false); setStatus("error");
        setMessage(label("Please correct the highlighted fields and review your request again.", "Veuillez corriger les champs indiqués et vérifier votre demande à nouveau."));
        requestAnimationFrame(() => errorSummary.current?.focus()); return;
      }
      setStatus("error");
      setMessage(response.status === 429
        ? label("Too many attempts. Please wait an hour before sending another request. Your entries remain here.", "Trop de tentatives. Veuillez attendre une heure avant d’envoyer une autre demande. Vos renseignements restent dans le formulaire.")
        : label("We couldn’t confirm that your request was saved. Please try again; your entries are still here. You can also contact us directly.", "Nous n’avons pas pu confirmer l’enregistrement de votre demande. Réessayez; vos renseignements sont conservés dans le formulaire. Vous pouvez aussi nous joindre directement."));
    } catch {
      setStatus("error"); setMessage(label("The connection was interrupted. Please try again. Retrying the same request will not create a duplicate.", "La connexion a été interrompue. Veuillez réessayer. Une nouvelle tentative identique ne créera pas de doublon."));
    } finally { clearTimeout(timer); lock.current = false; }
  }

  if (status === "success") return <div ref={result} tabIndex={-1} className="form-success" role="status"><span className="success-mark" aria-hidden="true">✓</span><p className="eyebrow">{label("REQUEST SAVED", "DEMANDE ENREGISTRÉE")}</p><h2>{label("Thanks for telling us about your project.", "Merci de nous parler de votre projet.")}</h2><p>{label("Your enquiry has been saved. Keep this reference for any follow-up with BestSauna.ca.", "Votre demande a été enregistrée. Conservez ce numéro pour tout suivi avec BestSauna.ca.")}</p><div className="reference-number">{reference}</div>{notificationNeedsFollowUp && <div className="form-alert" role="alert">{label("Your request is safely saved, but we couldn’t confirm the email notification to our team. Please email us with this reference so we can follow up. You do not need to submit the form again.", "Votre demande est bien enregistrée, mais nous n’avons pas pu confirmer l’envoi de l’avis par courriel à notre équipe. Écrivez-nous avec cette référence pour assurer le suivi. Il n’est pas nécessaire de remplir le formulaire à nouveau.")}</div>}<p>{label("This is an enquiry, not an order or reservation. Products, services, and terms will be confirmed in a written quotation.", "Cette demande ne constitue ni une commande ni une réservation. Les produits, les services et les conditions seront confirmés dans une soumission écrite.")}</p><a href={`mailto:info@bestsauna.ca?subject=${encodeURIComponent(`BestSauna ${reference}`)}`} className="button">{label("EMAIL BESTSAUNA", "NOUS ÉCRIRE")}</a></div>;

  return <form className="quote-form" onSubmit={submit} noValidate aria-busy={status === "saving"}>
    <ol className="quote-progress" aria-label={label("Request progress", "Étapes de la demande")}><li aria-current={!reviewing ? "step" : undefined}>01 {label("YOUR DETAILS", "VOS RENSEIGNEMENTS")}</li><li aria-current={reviewing ? "step" : undefined}>02 {label("REVIEW & SEND", "VÉRIFIER ET ENVOYER")}</li></ol>
    {selectionAdjusted && <p className="model-selection-notice" role="status">{label("Some selected models are no longer available or were repeated. Review the models in your project message before sending.", "Certains modèles sélectionnés ne sont plus disponibles ou étaient répétés. Vérifiez les modèles dans votre message avant l’envoi.")}</p>}
    <div className="draft-notice"><p>{draftState === "unavailable" ? label("Draft saving is unavailable in this browser. Keep this page open until you send your request.", "L’enregistrement du brouillon n’est pas disponible dans ce navigateur. Gardez cette page ouverte jusqu’à l’envoi.") : draftState === "expired" ? label("Your saved draft has expired. Your details remain on this page; edit a field to save a new draft.", "Votre brouillon enregistré a expiré. Vos renseignements restent sur cette page; modifiez un champ pour créer un nouveau brouillon.") : label("Your draft stays in this browser tab for 30 minutes after your last edit, including when you switch languages. It is cleared after a successful submission.", "Votre brouillon reste dans cet onglet pendant 30 minutes après votre dernière modification, même si vous changez de langue. Il est effacé après un envoi réussi.")}</p><button className="draft-clear" type="button" disabled={status === "saving"} onClick={discard}>{label("CLEAR DRAFT", "EFFACER LE BROUILLON")}</button></div>
    {Object.keys(errors).length > 0 && <div className="form-alert error-summary" ref={errorSummary} tabIndex={-1} role="alert"><strong>{label("Please check these details", "Veuillez vérifier ces renseignements")}</strong><ul>{Object.entries(errors).map(([key, error]) => <li key={key}><a href={`#${key}`}>{allFields.find(field => field.key === key)?.title || label("Privacy notice", "Avis de confidentialité")}: {error}</a></li>)}</ul></div>}
    <div hidden={reviewing}>
      <p className="form-required">{label("Fields marked * are required.", "Les champs marqués d’un * sont obligatoires.")}</p>
      {groups.map((group, index) => <fieldset key={group.title} disabled={status === "saving"}><legend><span>0{index + 1}</span>{group.title}</legend><div className="form-grid">{group.fields.map(renderField)}</div></fieldset>)}
      <div className="honey" aria-hidden="true"><label htmlFor="website">Website</label><input tabIndex={-1} autoComplete="off" id="website" name="website" value={fields.website} onChange={e => update("website", e.target.value)} /></div>
      <div className="privacy-consent"><input type="checkbox" id="privacyAccepted" checked={accepted} required onChange={e => { setAccepted(e.target.checked); setErrors(previous => { const next = { ...previous }; delete next.privacyAccepted; return next; }); }} aria-invalid={!!errors.privacyAccepted} aria-describedby={errors.privacyAccepted ? "error-privacyAccepted" : undefined} /><label htmlFor="privacyAccepted">{fr ? "J’ai lu l’" : "I have read the "}<a href={privacyPath} target="_blank" rel="noreferrer">{label("privacy notice", "avis de confidentialité")}</a>{label(" and understand that my details will be used to handle this enquiry.", " et je comprends que mes renseignements seront utilisés pour traiter cette demande.")}</label></div>{err("privacyAccepted")}
    </div>
    {reviewing && <section className="quote-review" aria-labelledby="quote-review-title"><p className="eyebrow">{label("ONE LAST LOOK", "UNE DERNIÈRE VÉRIFICATION")}</p><h2 id="quote-review-title" ref={reviewTitle} tabIndex={-1}>{label("Ready to send?", "Prêt à envoyer?")}</h2><p>{label("Check your contact details and project choices. You can go back and change anything before sending.", "Vérifiez vos coordonnées et vos choix. Vous pouvez revenir en arrière pour les modifier avant l’envoi.")}</p>{groups.map(group => {
      const completed = group.fields.filter(field => fields[field.key].trim());
      return completed.length > 0 && <div className="review-group" key={group.title}><h3>{group.title}</h3><dl>{completed.map(field => <div key={field.key}><dt>{field.title}</dt><dd>{field.options?.find(([value]) => value === fields[field.key])?.[1] || fields[field.key]}</dd></div>)}</dl></div>;
    })}<p className="review-consent">{label("You have acknowledged the privacy notice for this enquiry.", "Vous avez pris connaissance de l’avis de confidentialité pour cette demande.")}</p></section>}
    {status === "error" && <div className="form-alert" role="alert">{message}</div>}
    <div className="quote-actions">{reviewing && <button className="button button-edit" type="button" disabled={status === "saving"} onClick={() => { setReviewing(false); setStatus("idle"); requestAnimationFrame(() => document.getElementById("intendedUse")?.focus()); }}>{label("EDIT DETAILS", "MODIFIER")}</button>}<button className="button" type="submit" disabled={status === "saving"}>{status === "saving" ? label("SAVING YOUR REQUEST…", "ENREGISTREMENT EN COURS…") : reviewing ? label("SEND MY PROJECT REQUEST", "ENVOYER MA DEMANDE") : label("REVIEW MY REQUEST", "VÉRIFIER MA DEMANDE")}</button></div>
    <p className="form-note">{label("No payment. No marketing subscription. Availability will be confirmed in your quotation.", "Aucun paiement. Aucun abonnement marketing. La disponibilité sera confirmée dans votre soumission.")}</p><noscript><p>{label("Enable JavaScript to use this form, or email info@bestsauna.ca.", "Activez JavaScript pour utiliser ce formulaire, ou écrivez-nous à info@bestsauna.ca.")}</p></noscript>
  </form>;
}
