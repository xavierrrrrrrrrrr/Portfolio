"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function LetsTalkPage() {
  const { language } = useLanguage();
  const isFr = language === "fr";

  const [copied, setCopied] = useState(false);
  const [selectedDay, setSelectedDay] = useState("Tue");
  const [selectedSlot, setSelectedSlot] = useState("14:00 EST");
  const [serviceType, setServiceType] = useState("Full-Stack Web Engineering");
  const [budget, setBudget] = useState("$10k – $25k");
  const [timeline, setTimeline] = useState("Immediate");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [refId, setRefId] = useState("4892");

  const copyEmail = () => {
    navigator.clipboard.writeText("xavier@xboudreault.dev");
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setRefId(String(Math.floor(Math.random() * 9000 + 1000)));
    setIsSubmitted(true);
  };

  const services = isFr
    ? [
        "Ingénierie Web Full-Stack",
        "Design de Produit & Système UI",
        "WebGL Créatif & Shaders 3D",
        "Audit & Optimisation Technique",
      ]
    : [
        "Full-Stack Web Engineering",
        "Product Design & UI Systems",
        "Creative WebGL & 3D Shaders",
        "Technical Architecture Audit",
      ];

  const budgetOptions = ["< $10k", "$10k – $25k", "$25k – $50k", "$50k+"];
  const timelineOptions = isFr
    ? ["Immédiat", "1 à 2 mois", "T2 / T3", "Flexible"]
    : ["Immediate", "1–2 months", "Q2 / Q3", "Flexible"];

  const days = [
    { key: "Mon", en: "Mon", fr: "Lun", date: "Nov 24" },
    { key: "Tue", en: "Tue", fr: "Mar", date: "Nov 25" },
    { key: "Wed", en: "Wed", fr: "Mer", date: "Nov 26" },
    { key: "Thu", en: "Thu", fr: "Jeu", date: "Nov 27" },
  ];

  const timeSlots = ["10:30 EST", "14:00 EST", "16:30 EST"];

  return (
    <div className="bg-[#f6f3eb] text-[#0f1115] font-editorial-mono antialiased selection:bg-[#0052ff] selection:text-white min-h-screen flex flex-col justify-between">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-6 lg:px-12 py-16 w-full">
        {/* Breadcrumb / Back button */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-black/60 hover:text-black transition-colors"
          >
            <span>←</span>
            <span>{isFr ? "Retour à l'accueil" : "Back to Home"}</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#0052ff]/10 text-[#0052ff] text-xs font-bold uppercase tracking-widest mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              {isFr
                ? "Disponible pour mandats Q2/Q3"
                : "Open for Q2/Q3 Engineering Contracts"}
            </span>
          </div>
          <h1 className="font-editorial-serif text-5xl sm:text-7xl font-bold tracking-tight text-black mb-4">
            {isFr ? "Parlons de votre projet." : "Let’s build together."}
          </h1>
          <p className="font-editorial-serif italic text-2xl sm:text-3xl text-black/80 max-w-2xl leading-relaxed">
            {isFr
              ? "De l'architecture full-stack robuste au design d'interfaces tactiles de classe mondiale."
              : "From distributed system architecture to world-class tactile editorial interfaces."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct channels & Quick 30-min call booking */}
          <div className="lg:col-span-5 space-y-8">
            {/* Direct Email Card */}
            <div className="bg-white/80 border border-black/15 rounded-2xl p-6 shadow-xs">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#d94726]">
                {isFr ? "Courriel direct" : "Direct Dispatch"}
              </span>
              <h3 className="font-editorial-serif text-2xl font-bold text-black mt-1 mb-2">
                xavier@xboudreault.dev
              </h3>
              <p className="text-xs text-black/70 mb-4 leading-relaxed">
                {isFr
                  ? "Idéal pour l'envoi de cahiers des charges, de spécifications techniques ou de propositions de partenariat."
                  : "Best for RFP documents, technical specs, or detailed partnership briefs."}
              </p>
              <button
                type="button"
                onClick={copyEmail}
                className="inline-flex items-center gap-2 bg-black text-white hover:bg-stone-800 px-4 py-2 rounded text-xs uppercase tracking-wider font-bold transition-all cursor-pointer"
              >
                <span>{copied ? (isFr ? "✓ Copié !" : "✓ Copied to clipboard!") : (isFr ? "Copier le courriel" : "Copy Email Address")}</span>
              </button>
            </div>

            {/* Quick 30-Min Architecture Intro Call Selector */}
            <div className="bg-[#ebdcd0]/70 border border-black/15 rounded-2xl p-6 shadow-xs">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#0052ff]">
                {isFr ? "Appel de cadrage 30 min" : "30-Min Architecture Call"}
              </span>
              <h3 className="font-editorial-serif text-xl font-bold text-black mt-1 mb-2">
                {isFr ? "Réserver un créneau direct" : "Reserve a direct intro slot"}
              </h3>
              <p className="text-xs text-black/70 mb-5 leading-relaxed">
                {isFr
                  ? "Un échange de 30 minutes sans intermédiaire commercial pour explorer la faisabilité technique de votre produit."
                  : "A focused, zero-sales technical deep dive directly with the engineer to evaluate feasibility."}
              </p>

              {/* Day selection */}
              <div className="mb-4">
                <span className="text-[10px] uppercase tracking-wider text-black/60 block mb-2 font-bold">
                  {isFr ? "1. Choisir un jour :" : "1. Select Day:"}
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {days.map((d) => (
                    <button
                      key={d.key}
                      type="button"
                      onClick={() => setSelectedDay(d.key)}
                      className={`p-2 rounded-lg text-center border text-xs transition-all cursor-pointer ${
                        selectedDay === d.key
                          ? "bg-black text-white border-black font-bold shadow-xs"
                          : "bg-white/70 border-black/10 hover:border-black/30 text-black/80"
                      }`}
                    >
                      <span className="block font-bold">{isFr ? d.fr : d.en}</span>
                      <span className="text-[9px] opacity-75">{d.date}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time slot selection */}
              <div className="mb-6">
                <span className="text-[10px] uppercase tracking-wider text-black/60 block mb-2 font-bold">
                  {isFr ? "2. Choisir l'heure (HNE) :" : "2. Select Time (EST):"}
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2 px-1 text-center rounded border text-xs transition-all cursor-pointer ${
                        selectedSlot === slot
                          ? "bg-[#0052ff] text-white border-[#0052ff] font-bold"
                          : "bg-white/70 border-black/10 hover:border-black/30 text-black/80"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded bg-white/60 border border-black/10 text-xs text-black/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-black/50 uppercase block">
                    {isFr ? "Sélectionné" : "Selected"}
                  </span>
                  <span className="font-bold">
                    {selectedDay} · {selectedSlot}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    alert(
                      isFr
                        ? `Créneau pré-réservé pour ${selectedDay} à ${selectedSlot}. Merci de compléter le formulaire ci-contre pour valider.`
                        : `Slot tentatively held for ${selectedDay} at ${selectedSlot}. Please submit the project inquiry form to confirm.`
                    )
                  }
                  className="bg-[#0052ff] text-white hover:bg-blue-600 px-3 py-1.5 rounded text-[11px] font-bold uppercase transition-colors"
                >
                  {isFr ? "Confirmer" : "Hold Slot"}
                </button>
              </div>
            </div>

            {/* Studio Info */}
            <div className="text-xs text-black/60 space-y-1.5 pt-2">
              <p>
                <strong>{isFr ? "Localisation :" : "Base Studio:"}</strong>{" "}
                Montreal, QC, Canada (UTC-5)
              </p>
              <p>
                <strong>{isFr ? "Délai de réponse :" : "Response Time:"}</strong>{" "}
                {isFr ? "Habituellement sous 24 heures" : "Under 24 hours on business days"}
              </p>
              <p>
                <strong>{isFr ? "Exemple récent :" : "Recent Production Flagship:"}</strong>{" "}
                <a
                  href="https://rocky-pouliot.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0052ff] underline font-bold"
                >
                  rocky-pouliot.vercel.app ↗
                </a>
              </p>
            </div>
          </div>

          {/* Right Column: Full Project Inquiry Form */}
          <div className="lg:col-span-7 bg-white border border-black/15 rounded-2xl p-8 sm:p-10 shadow-sm">
            {isSubmitted ? (
              <div className="text-center py-12 space-y-5">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto font-bold">
                  ✓
                </div>
                <h3 className="font-editorial-serif text-3xl sm:text-4xl font-bold text-black">
                  {isFr ? "Demande bien reçue !" : "Inquiry Dispatched."}
                </h3>
                <p className="font-editorial-mono text-sm text-black/75 max-w-md mx-auto leading-relaxed">
                  {isFr
                    ? `Merci ${formData.name}. Votre dossier a été transmis directement à Xavier. Vous recevrez une réponse détaillée ainsi qu'une confirmation pour le créneau ${selectedDay} à ${selectedSlot}.`
                    : `Thank you, ${formData.name}. Your brief has landed directly in Xavier’s inbox. Expect a personal architectural response and confirmation for ${selectedDay} at ${selectedSlot}.`}
                </p>
                <div className="p-4 bg-stone-100 rounded-lg text-xs font-editorial-mono text-stone-600 max-w-sm mx-auto">
                  <span>REF ID: #XB-2026-{refId}</span>
                  <br />
                  <span>SLOT: {selectedDay} · {selectedSlot}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="text-xs uppercase tracking-wider text-[#0052ff] underline font-bold mt-4"
                >
                  {isFr ? "Envoyer un autre message" : "Send another inquiry"}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="font-editorial-serif text-2xl sm:text-3xl font-bold text-black mb-1">
                    {isFr ? "Fiche de cadrage projet" : "Project Inquiry Sheet"}
                  </h3>
                  <p className="text-xs text-black/60">
                    {isFr
                      ? "Tous les champs nous aident à vous fournir un devis et un calendrier précis dès le premier échange."
                      : "Help us provide accurate architectural guidance and budget estimates on the first exchange."}
                  </p>
                </div>

                {/* Name & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-bold text-black/70 mb-2">
                      {isFr ? "Nom complet *" : "Your Name *"}
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder={isFr ? "ex. Julie Tremblay" : "e.g. Elena Rostova"}
                      className="w-full bg-[#f6f3eb]/60 border border-black/15 focus:border-black rounded px-4 py-3 text-sm font-editorial-mono outline-hidden transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-bold text-black/70 mb-2">
                      {isFr ? "Courriel professionnel *" : "Work Email *"}
                    </label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="name@company.com"
                      className="w-full bg-[#f6f3eb]/60 border border-black/15 focus:border-black rounded px-4 py-3 text-sm font-editorial-mono outline-hidden transition-colors"
                    />
                  </div>
                </div>

                {/* Company / URL */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-black/70 mb-2">
                    {isFr
                      ? "Entreprise ou site web existant (facultatif)"
                      : "Company or Current Website (Optional)"}
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    placeholder="https://yourcompany.com"
                    className="w-full bg-[#f6f3eb]/60 border border-black/15 focus:border-black rounded px-4 py-3 text-sm font-editorial-mono outline-hidden transition-colors"
                  />
                </div>

                {/* Service pills */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-black/70 mb-2">
                    {isFr ? "Domaine d'intervention" : "Primary Service Scope"}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {services.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setServiceType(s)}
                        className={`text-xs px-3.5 py-2 rounded-lg border transition-all cursor-pointer ${
                          serviceType === s
                            ? "bg-black text-white border-black font-bold shadow-xs"
                            : "bg-[#f6f3eb]/60 border-black/15 text-black/80 hover:border-black/30"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Budget range */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-black/70 mb-2">
                    {isFr ? "Enveloppe budgétaire estimée" : "Estimated Budget Range"}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {budgetOptions.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setBudget(b)}
                        className={`py-2 px-3 text-center rounded border text-xs transition-all cursor-pointer ${
                          budget === b
                            ? "bg-[#0052ff] text-white border-[#0052ff] font-bold"
                            : "bg-[#f6f3eb]/60 border-black/15 text-black/80 hover:border-black/30"
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-black/70 mb-2">
                    {isFr ? "Échéancier souhaité" : "Target Launch Timeline"}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {timelineOptions.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTimeline(t)}
                        className={`py-2 px-3 text-center rounded border text-xs transition-all cursor-pointer ${
                          timeline === t
                            ? "bg-[#d94726] text-white border-[#d94726] font-bold"
                            : "bg-[#f6f3eb]/60 border-black/15 text-black/80 hover:border-black/30"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-black/70 mb-2">
                    {isFr
                      ? "Aperçu du projet ou exigences techniques *"
                      : "Project Overview or Architectural Requirements *"}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder={
                      isFr
                        ? "Parlez-nous des objectifs, de la vision graphique ou des défis d'ingénierie..."
                        : "Tell us about your objectives, visual aesthetic expectations, or engineering constraints..."
                    }
                    className="w-full bg-[#f6f3eb]/60 border border-black/15 focus:border-black rounded px-4 py-3 text-sm font-editorial-mono outline-hidden transition-colors"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full bg-[#0052ff] hover:bg-blue-600 text-white font-editorial-mono uppercase text-xs tracking-wider py-4 rounded font-bold transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>
                    {isFr
                      ? "Transmettre le dossier de projet"
                      : "Send Project Inquiry"}
                  </span>
                  <span>→</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
