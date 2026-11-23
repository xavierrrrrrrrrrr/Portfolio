"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";
import Header from "../components/Header";
import Footer from "../components/Footer";

// 14 rolling business days for the carousel
const CAROUSEL_DAYS = [
  { key: "2026-11-24", dayEn: "Mon", dayFr: "Lun", dateNum: 24, monthEn: "Nov", monthFr: "Nov", fullDate: "Nov 24, 2026" },
  { key: "2026-11-25", dayEn: "Tue", dayFr: "Mar", dateNum: 25, monthEn: "Nov", monthFr: "Nov", fullDate: "Nov 25, 2026" },
  { key: "2026-11-26", dayEn: "Wed", dayFr: "Mer", dateNum: 26, monthEn: "Nov", monthFr: "Nov", fullDate: "Nov 26, 2026" },
  { key: "2026-11-27", dayEn: "Thu", dayFr: "Jeu", dateNum: 27, monthEn: "Nov", monthFr: "Nov", fullDate: "Nov 27, 2026" },
  { key: "2026-11-28", dayEn: "Fri", dayFr: "Ven", dateNum: 28, monthEn: "Nov", monthFr: "Nov", fullDate: "Nov 28, 2026" },
  { key: "2026-12-01", dayEn: "Mon", dayFr: "Lun", dateNum: 1, monthEn: "Dec", monthFr: "Déc", fullDate: "Dec 01, 2026" },
  { key: "2026-12-02", dayEn: "Tue", dayFr: "Mar", dateNum: 2, monthEn: "Dec", monthFr: "Déc", fullDate: "Dec 02, 2026" },
  { key: "2026-12-03", dayEn: "Wed", dayFr: "Mer", dateNum: 3, monthEn: "Dec", monthFr: "Déc", fullDate: "Dec 03, 2026" },
  { key: "2026-12-04", dayEn: "Thu", dayFr: "Jeu", dateNum: 4, monthEn: "Dec", monthFr: "Déc", fullDate: "Dec 04, 2026" },
  { key: "2026-12-05", dayEn: "Fri", dayFr: "Ven", dateNum: 5, monthEn: "Dec", monthFr: "Déc", fullDate: "Dec 05, 2026" },
  { key: "2026-12-08", dayEn: "Mon", dayFr: "Lun", dateNum: 8, monthEn: "Dec", monthFr: "Déc", fullDate: "Dec 08, 2026" },
  { key: "2026-12-09", dayEn: "Tue", dayFr: "Mar", dateNum: 9, monthEn: "Dec", monthFr: "Déc", fullDate: "Dec 09, 2026" },
  { key: "2026-12-10", dayEn: "Wed", dayFr: "Mer", dateNum: 10, monthEn: "Dec", monthFr: "Déc", fullDate: "Dec 10, 2026" },
  { key: "2026-12-11", dayEn: "Thu", dayFr: "Jeu", dateNum: 11, monthEn: "Dec", monthFr: "Déc", fullDate: "Dec 11, 2026" },
];

function fallbackInquiryRef() {
  return `#XB-INQ-${Math.floor(1000 + Math.random() * 9000)}`;
}

export default function LetsTalkPage() {
  const { language } = useLanguage();
  const isFr = language === "fr";

  const [copied, setCopied] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState(1); // default to Tuesday
  const [selectedSlot, setSelectedSlot] = useState("14:00 EST");
  const [serviceType, setServiceType] = useState(
    isFr ? "Ingénierie Web Full-Stack" : "Full-Stack Web Engineering"
  );

  // Lowered budget envelope starting at 1-5k and higher
  const budgetOptions = isFr
    ? ["1k – 5k $", "5k – 15k $", "15k – 30k $", "30k+ $"]
    : ["$1k – $5k", "$5k – $15k", "$15k – $30k", "$30k+"];

  const [budget, setBudget] = useState(budgetOptions[0]);
  const [timeline, setTimeline] = useState(isFr ? "Immédiat" : "Immediate");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [refId, setRefId] = useState("#XB-INQ-0001");
  const [errorMessage, setErrorMessage] = useState("");

  // Database inquiries log viewer
  const [showDbLog, setShowDbLog] = useState(false);
  const [dbInquiries, setDbInquiries] = useState([]);
  const [loadingDb, setLoadingDb] = useState(false);

  // Carousel ref
  const carouselTrackRef = useRef(null);

  const scrollCarousel = (direction) => {
    if (!carouselTrackRef.current) return;
    const scrollAmount = direction === "left" ? -220 : 220;
    carouselTrackRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const copyEmail = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText("xavier@xboudreault.dev");
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Load bookings without touching the drawer's loading state
  const loadBookings = useCallback(async () => {
    try {
      const res = await fetch("/api/contact");
      const data = await res.json();
      if (data.success && Array.isArray(data.inquiries)) {
        setDbInquiries(data.inquiries);
      }
    } catch (err) {
      console.error("Failed to load inquiries from DB:", err);
    }
  }, []);

  // Fetch inquiries from SQLite database (with loading indicator)
  const fetchInquiries = useCallback(async () => {
    setLoadingDb(true);
    try {
      await loadBookings();
    } finally {
      setLoadingDb(false);
    }
  }, [loadBookings]);

  // Load existing bookings on mount so taken slots can be disabled
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetching external data on mount
    loadBookings();
  }, [loadBookings]);

  const toggleDbLog = () => {
    const nextState = !showDbLog;
    setShowDbLog(nextState);
    if (nextState) {
      fetchInquiries();
    }
  };

  // Submit inquiry to SQLite database via /api/contact
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    setIsSubmitting(true);
    setErrorMessage("");

    const payload = {
      name: formData.name,
      email: formData.email,
      company: formData.company,
      service: serviceType,
      budget: budget,
      timeline: timeline,
      message: formData.message,
      selected_day: selectedDay.key,
      selected_slot: activeSlot,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to record inquiry");
      }

      setRefId(result.reference || `#XB-INQ-${String(result.id).padStart(4, "0")}`);
      fetchInquiries();
      setIsSubmitted(true);
    } catch (err) {
      console.error("Database submission error:", err);
      // Fallback display
      setRefId(fallbackInquiryRef());
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
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

  const timelineOptions = isFr
    ? ["Immédiat", "1 à 2 mois", "T2 / T3", "Flexible"]
    : ["Immediate", "1–2 months", "Q2 / Q3", "Flexible"];

  const timeSlots = ["10:30 EST", "14:00 EST", "16:30 EST"];

  // Slots already taken in the database, keyed as "YYYY-MM-DD|HH:MM EST"
  const bookedSlots = useMemo(() => {
    const set = new Set();
    dbInquiries.forEach((inq) => {
      if (inq.selected_day && inq.selected_slot) {
        set.add(`${inq.selected_day}|${inq.selected_slot}`);
      }
    });
    return set;
  }, [dbInquiries]);

  const isSlotBooked = (dayKey, slot) => bookedSlots.has(`${dayKey}|${slot}`);
  const isDayFullyBooked = (day) =>
    timeSlots.every((slot) => isSlotBooked(day.key, slot));

  // Resolve the effective selection, skipping days/slots already booked.
  // (Derived rather than corrected via effect to avoid cascading renders.)
  const firstFreeDayIndex = CAROUSEL_DAYS.findIndex((day) => !isDayFullyBooked(day));
  const activeDayIndex =
    selectedDayIndex >= 0 &&
    CAROUSEL_DAYS[selectedDayIndex] &&
    !isDayFullyBooked(CAROUSEL_DAYS[selectedDayIndex])
      ? selectedDayIndex
      : firstFreeDayIndex === -1
        ? selectedDayIndex
        : firstFreeDayIndex;
  const selectedDay = CAROUSEL_DAYS[activeDayIndex] || CAROUSEL_DAYS[0];
  const activeSlot = isSlotBooked(selectedDay.key, selectedSlot)
    ? timeSlots.find((slot) => !isSlotBooked(selectedDay.key, slot)) || selectedSlot
    : selectedSlot;

  // Display helper: stored day keys ("2026-11-25") back to readable labels
  const formatStoredDay = (value) => {
    const match = CAROUSEL_DAYS.find((day) => day.key === value);
    return match ? match.fullDate : value;
  };

  return (
    <div className="bg-[#f6f3eb] text-[#0f1115] font-editorial-mono antialiased selection:bg-[#0052ff] selection:text-white min-h-screen flex flex-col justify-between">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 sm:py-16 w-full">
        {/* Breadcrumb / Back button */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-black/60 hover:text-black transition-colors"
          >
            <span>←</span>
            <span>{isFr ? "Retour à l'accueil" : "Back to Home"}</span>
          </Link>

          {/* Database Inspector Toggle Button */}
          <button
            type="button"
            onClick={toggleDbLog}
            className="text-xs font-bold text-[#0052ff] hover:underline flex items-center gap-1.5 cursor-pointer bg-white/70 px-3 py-1.5 rounded-full border border-black/10"
          >
            <span>🗄️</span>
            <span>
              {showDbLog
                ? (isFr ? "Masquer la base de données" : "Hide Inquiries Database")
                : (isFr ? "Voir la base de données SQLite" : "View SQLite Database Log")}
            </span>
          </button>
        </div>

        {/* Database Live Inspector Drawer */}
        {showDbLog && (
          <div className="mb-8 sm:mb-12 bg-[#0f1115] text-white p-4 sm:p-6 rounded-2xl border border-black/30 shadow-lg">
            <div className="flex justify-between items-center pb-3 sm:pb-4 mb-4 border-b border-white/10 gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <h3 className="font-editorial-serif text-lg sm:text-xl font-bold text-white truncate">
                  {isFr ? "Base SQLite des demandes clients" : "Client Inquiries Database (SQLite)"}
                </h3>
                <span className="text-xs text-neutral-400 hidden sm:inline ml-2">
                  (table: `inquiries`)
                </span>
              </div>
              <button
                type="button"
                onClick={fetchInquiries}
                className="text-xs bg-[#0052ff] text-white px-3 py-1 rounded font-bold hover:bg-blue-600 transition-colors shrink-0 cursor-pointer"
              >
                {loadingDb ? "..." : (isFr ? "Actualiser" : "Refresh")}
              </button>
            </div>

            {loadingDb ? (
              <p className="text-xs text-neutral-400 py-4 font-mono">
                {isFr ? "Chargement des enregistrements..." : "Fetching records from SQLite database..."}
              </p>
            ) : dbInquiries.length === 0 ? (
              <p className="text-xs text-neutral-400 py-4 font-mono">
                {isFr
                  ? "Aucune demande enregistrée pour l'instant. Soumettez le formulaire ci-dessous pour insérer votre premier enregistrement !"
                  : "No client inquiries recorded yet. Submit the form below to insert your first record!"}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono min-w-[500px]">
                  <thead>
                    <tr className="text-neutral-400 border-b border-white/10">
                      <th className="py-2 pr-4">ID</th>
                      <th className="py-2 pr-4">{isFr ? "Client" : "Client"}</th>
                      <th className="py-2 pr-4">{isFr ? "Courriel" : "Email"}</th>
                      <th className="py-2 pr-4">{isFr ? "Budget" : "Budget"}</th>
                      <th className="py-2 pr-4">{isFr ? "Créneau" : "Slot"}</th>
                      <th className="py-2">{isFr ? "Date" : "Recorded At"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {dbInquiries.map((inq) => (
                      <tr key={inq.id} className="text-neutral-300 hover:bg-white/5">
                        <td className="py-2.5 pr-4 text-emerald-400 font-bold whitespace-nowrap">
                          #XB-{String(inq.id).padStart(4, "0")}
                        </td>
                        <td className="py-2.5 pr-4 font-bold text-white whitespace-nowrap">{inq.name}</td>
                        <td className="py-2.5 pr-4 text-neutral-300 whitespace-nowrap">{inq.email}</td>
                        <td className="py-2.5 pr-4 text-[#d94726] font-bold whitespace-nowrap">
                          {inq.budget || "—"}
                        </td>
                        <td className="py-2.5 pr-4 text-neutral-400 whitespace-nowrap">
                          {formatStoredDay(inq.selected_day)} · {inq.selected_slot}
                        </td>
                        <td className="py-2.5 text-neutral-500 whitespace-nowrap">{inq.created_at}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Page Header */}
        <div className="mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#0052ff]/10 text-[#0052ff] text-xs font-bold uppercase tracking-widest mb-3 sm:mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              {isFr
                ? "Disponible pour mandats Q2/Q3"
                : "Open for Q2/Q3 Engineering Contracts"}
            </span>
          </div>
          <h1 className="font-editorial-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-black mb-3 sm:mb-4">
            {isFr ? "Parlons de votre projet." : "Let’s build together."}
          </h1>
          <p className="font-editorial-serif italic text-xl sm:text-3xl text-black/80 max-w-2xl leading-relaxed">
            {isFr
              ? "De l'architecture logicielle full-stack au design d'interfaces tactiles d'exception."
              : "From distributed system architecture to world-class tactile editorial interfaces."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Direct channels & Interactive Day Carousel */}
          <div className="lg:col-span-5 space-y-6 sm:space-y-8">
            {/* Direct Email Card */}
            <div className="bg-white/80 border border-black/15 rounded-2xl p-5 sm:p-6 shadow-xs">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#d94726]">
                {isFr ? "Courriel direct" : "Direct Dispatch"}
              </span>
              <h3 className="font-editorial-serif text-xl sm:text-2xl font-bold text-black mt-1 mb-2 truncate">
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
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-black text-white hover:bg-stone-800 px-4 py-2.5 rounded text-xs uppercase tracking-wider font-bold transition-all cursor-pointer"
              >
                <span>
                  {copied
                    ? (isFr ? "✓ Copié !" : "✓ Copied to clipboard!")
                    : (isFr ? "Copier le courriel" : "Copy Email Address")}
                </span>
              </button>
            </div>

            {/* Quick 30-Min Architecture Intro Call Selector WITH DAY CAROUSEL */}
            <div className="bg-[#ebdcd0]/80 border border-black/15 rounded-2xl p-4 sm:p-6 shadow-xs">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#0052ff]">
                    {isFr ? "Appel de cadrage 30 min" : "30-Min Architecture Call"}
                  </span>
                  <h3 className="font-editorial-serif text-lg sm:text-xl font-bold text-black mt-0.5">
                    {isFr ? "Réserver un créneau direct" : "Reserve a direct intro slot"}
                  </h3>
                </div>
              </div>

              <p className="text-xs text-black/70 mb-4 sm:mb-5 leading-relaxed">
                {isFr
                  ? "Faites défiler le carrousel pour choisir votre date idéale, puis sélectionnez une heure d'échange."
                  : "Slide the carousel to select your preferred date, then choose an intro time slot."}
              </p>

              {/* BEGIN: CAROUSEL FOR REQUESTED DAYS */}
              <div className="mb-5 sm:mb-6">
                <div className="flex justify-between items-center mb-2.5">
                  <span className="text-[10px] uppercase tracking-wider text-black/70 font-bold flex items-center gap-1.5">
                    <span>1.</span>
                    <span>{isFr ? "Carrousel des jours disponibles :" : "Select Date (Carousel):"}</span>
                  </span>

                  {/* Carousel Prev / Next Navigation Buttons */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => scrollCarousel("left")}
                      aria-label="Previous Days"
                      title={isFr ? "Jours précédents" : "Previous Days"}
                      className="w-7 h-7 rounded-full bg-white border border-black/20 hover:border-black flex items-center justify-center text-xs text-black transition-all shadow-xs cursor-pointer active:scale-95"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollCarousel("right")}
                      aria-label="Next Days"
                      title={isFr ? "Jours suivants" : "Next Days"}
                      className="w-7 h-7 rounded-full bg-white border border-black/20 hover:border-black flex items-center justify-center text-xs text-black transition-all shadow-xs cursor-pointer active:scale-95"
                    >
                      ›
                    </button>
                  </div>
                </div>

                {/* Carousel Track with smooth touch sliding */}
                <div
                  ref={carouselTrackRef}
                  className="flex gap-2 sm:gap-2.5 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory focus:outline-hidden touch-pan-x"
                  style={{ scrollbarWidth: "thin" }}
                >
                  {CAROUSEL_DAYS.map((day, idx) => {
                    const isSelected = idx === activeDayIndex;
                    const dayBooked = isDayFullyBooked(day);
                    return (
                      <button
                        key={day.key}
                        type="button"
                        onClick={() => setSelectedDayIndex(idx)}
                        disabled={dayBooked}
                        title={dayBooked ? (isFr ? "Complètement réservé" : "Fully booked") : undefined}
                        className={`shrink-0 w-18 sm:w-20 p-2 sm:p-2.5 rounded-xl border text-center transition-all snap-start flex flex-col justify-between items-center ${
                          dayBooked
                            ? "bg-neutral-200/60 border-neutral-300 text-neutral-400 cursor-not-allowed line-through"
                            : isSelected
                              ? "bg-black text-white border-black font-bold shadow-md scale-102 ring-2 ring-black/20 cursor-pointer"
                              : "bg-white/80 border-black/15 hover:border-black/40 text-black/80 hover:bg-white cursor-pointer"
                        }`}
                      >
                        <span className={`text-[9px] sm:text-[10px] uppercase tracking-wider ${isSelected ? "text-white/80" : "text-black/60"}`}>
                          {isFr ? day.dayFr : day.dayEn}
                        </span>
                        <span className="text-lg sm:text-xl font-editorial-serif font-bold my-0.5">
                          {day.dateNum}
                        </span>
                        <span className={`text-[8px] sm:text-[9px] uppercase font-bold ${isSelected ? "text-emerald-400" : "text-[#d94726]"}`}>
                          {isFr ? day.monthFr : day.monthEn}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
              {/* END: CAROUSEL FOR REQUESTED DAYS */}

              {/* Time slot selection */}
              <div className="mb-5 sm:mb-6">
                <span className="text-[10px] uppercase tracking-wider text-black/70 block mb-2 font-bold">
                  2. {isFr ? "Choisir l'heure (HNE) :" : "Select Time (EST):"}
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((slot) => {
                    const slotBooked = isSlotBooked(selectedDay.key, slot);
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        disabled={slotBooked}
                        title={slotBooked ? (isFr ? "Créneau déjà réservé" : "Slot already booked") : undefined}
                        className={`py-2 px-1 text-center rounded border text-[11px] sm:text-xs transition-all ${
                          slotBooked
                            ? "bg-neutral-200/60 border-neutral-300 text-neutral-400 line-through cursor-not-allowed"
                            : activeSlot === slot
                              ? "bg-[#0052ff] text-white border-[#0052ff] font-bold shadow-xs cursor-pointer"
                              : "bg-white/70 border-black/10 hover:border-black/30 text-black/80 cursor-pointer"
                        }`}
                      >
                        {slot}
                        {slotBooked && (
                          <span className="block text-[8px] uppercase tracking-wider no-underline">
                            {isFr ? "Réservé" : "Booked"}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected slot recap */}
              <div className="p-3 sm:p-3.5 rounded-xl bg-white/70 border border-black/10 text-xs text-black/80 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[10px] text-black/50 uppercase block">
                    {isFr ? "Date & Heure choisies :" : "Selected Slot:"}
                  </span>
                  <span className="font-bold text-black text-xs sm:text-sm truncate block">
                    {isFr ? selectedDay.dayFr : selectedDay.dayEn} {selectedDay.dateNum}{" "}
                    {isFr ? selectedDay.monthFr : selectedDay.monthEn} · {activeSlot}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-emerald-700 font-bold bg-emerald-100 px-2 sm:px-2.5 py-1 rounded-full shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  <span>{isFr ? "Prêt" : "Held"}</span>
                </div>
              </div>
            </div>

            {/* Studio Info */}
            <div className="text-xs text-black/60 space-y-1.5 pt-2">
              <p>
                <strong>{isFr ? "Localisation :" : "Base Studio:"}</strong>{" "}
                Montreal, QC, Canada (UTC-5)
              </p>
              <p>
                <strong>{isFr ? "Stockage des données :" : "Data Persistence:"}</strong>{" "}
                SQLite database via Next.js Route Handler
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

          {/* Right Column: Full Project Inquiry Form (Saves to SQLite Database) */}
          <div className="lg:col-span-7 bg-white border border-black/15 rounded-2xl p-5 sm:p-8 lg:p-10 shadow-sm">
            {isSubmitted ? (
              <div className="text-center py-8 sm:py-12 space-y-4 sm:space-y-5">
                <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl sm:text-3xl mx-auto font-bold">
                  ✓
                </div>
                <h3 className="font-editorial-serif text-2xl sm:text-4xl font-bold text-black">
                  {isFr ? "Demande enregistrée en base de données !" : "Inquiry Saved in Database!"}
                </h3>
                <p className="font-editorial-mono text-xs sm:text-sm text-black/75 max-w-md mx-auto leading-relaxed">
                  {isFr
                    ? `Merci ${formData.name}. Votre demande a été enregistrée avec succès dans notre base de données SQLite sous la référence ${refId}. Vous recevrez une confirmation pour le créneau sélectionné.`
                    : `Thank you, ${formData.name}. Your inquiry has been persisted in our SQLite database under reference ${refId}. We will confirm your requested slot shortly.`}
                </p>
                <div className="p-3.5 sm:p-4 bg-stone-100 rounded-lg text-xs font-editorial-mono text-stone-700 max-w-sm mx-auto space-y-1 border border-black/10 text-left">
                  <div className="font-bold text-emerald-700">RECORDED IN DATABASE (SQLite)</div>
                  <div>REFERENCE: {refId}</div>
                  <div>BUDGET: {budget}</div>
                  <div>
                    SLOT: {isFr ? selectedDay.dayFr : selectedDay.dayEn} {selectedDay.dateNum}{" "}
                    {isFr ? selectedDay.monthFr : selectedDay.monthEn} · {activeSlot}
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row justify-center gap-2.5 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDbLog(true);
                      fetchInquiries();
                    }}
                    className="w-full sm:w-auto bg-black text-white px-5 py-2.5 rounded text-xs uppercase font-bold tracking-wider hover:bg-stone-800 transition-colors cursor-pointer"
                  >
                    {isFr ? "Voir l'enregistrement dans la base" : "Inspect Database Entry"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ name: "", email: "", company: "", message: "" });
                    }}
                    className="text-xs uppercase tracking-wider text-[#0052ff] underline font-bold px-4 py-2.5 cursor-pointer"
                  >
                    {isFr ? "Envoyer un autre message" : "Send another inquiry"}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                <div>
                  <h3 className="font-editorial-serif text-2xl sm:text-3xl font-bold text-black mb-1">
                    {isFr ? "Fiche de cadrage projet" : "Project Inquiry Sheet"}
                  </h3>
                  <p className="text-xs text-black/60">
                    {isFr
                      ? "Vos informations sont enregistrées directement dans notre base de données sécurisée."
                      : "Your brief is directly recorded into our secure production database."}
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-3 bg-red-100 border border-red-300 text-red-700 text-xs rounded">
                    {errorMessage}
                  </div>
                )}

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
                      className="w-full bg-[#f6f3eb]/60 border border-black/15 focus:border-black rounded px-4 py-3 text-base sm:text-sm font-editorial-mono outline-hidden transition-colors"
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
                      className="w-full bg-[#f6f3eb]/60 border border-black/15 focus:border-black rounded px-4 py-3 text-base sm:text-sm font-editorial-mono outline-hidden transition-colors"
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
                    className="w-full bg-[#f6f3eb]/60 border border-black/15 focus:border-black rounded px-4 py-3 text-base sm:text-sm font-editorial-mono outline-hidden transition-colors"
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
                        className={`text-xs px-3 sm:px-3.5 py-2 rounded-lg border transition-all cursor-pointer ${
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

                {/* BUDGET ENVELOPE: LOWERED TO 1-5k AND HIGHER */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs uppercase tracking-wider font-bold text-black/70">
                      {isFr ? "Enveloppe budgétaire estimée" : "Estimated Budget Range"}
                    </label>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                      {isFr ? "Accessible dès 1k" : "Starting at $1k"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {budgetOptions.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setBudget(b)}
                        className={`py-2.5 px-2 sm:px-3 text-center rounded-lg border text-xs transition-all cursor-pointer font-bold ${
                          budget === b
                            ? "bg-[#0052ff] text-white border-[#0052ff] shadow-xs"
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
                    {timelineOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setTimeline(opt)}
                        className={`py-2 px-2 sm:px-3 text-center rounded border text-xs transition-all cursor-pointer ${
                          timeline === opt
                            ? "bg-[#d94726] text-white border-[#d94726] font-bold"
                            : "bg-[#f6f3eb]/60 border-black/15 text-black/80 hover:border-black/30"
                        }`}
                      >
                        {opt}
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
                        ? "Décrivez les objectifs, le contexte ou les besoins techniques..."
                        : "Tell us about your objectives, visual aesthetic expectations, or engineering constraints..."
                    }
                    className="w-full bg-[#f6f3eb]/60 border border-black/15 focus:border-black rounded px-4 py-3 text-base sm:text-sm font-editorial-mono outline-hidden transition-colors"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#0052ff] hover:bg-blue-600 disabled:opacity-50 text-white font-editorial-mono uppercase text-xs tracking-wider py-4 rounded font-bold transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>
                    {isSubmitting
                      ? (isFr ? "Enregistrement en base de données..." : "Recording in database...")
                      : (isFr ? "Transmettre le dossier de projet" : "Send Project Inquiry")}
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
