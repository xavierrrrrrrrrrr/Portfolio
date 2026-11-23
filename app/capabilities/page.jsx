"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function CapabilitiesPage() {
  const { language } = useLanguage();
  const isFr = language === "fr";

  const [downloading, setDownloading] = useState(false);

  const triggerDownload = () => {
    setDownloading(true);
    const cvText = `XAVIER BOUDREAULT — CURRICULUM VITAE (2026)
Principal Full-Stack Software Engineer & Creative Technologist
Location: Montreal, QC, Canada
Email: xavier@xboudreault.dev | GitHub: github.com/xavierrrrrrrrrrr

PROFILE:
Full-stack software engineering meets editorial art direction. 
Over 8 years building resilient distributed digital products, interactive media, and tactile web interfaces from scratch.

CORE COMPETENCIES:
• Architecture: Next.js (App Router, Server Components), React 19, JavaScript, Node.js, WebSockets.
• Data & Cloud: PostgreSQL, Supabase, Redis, Vercel Edge Runtime, Cloudflare Workers, REST & GraphQL.
• Creative Tech: Three.js, GLSL Shaders, WebGL Canvas, Web Audio API, Framer Motion.
• Product Design: Swiss Typographic Systems, Design Tokens, Figma Architecture, WCAG AAA Accessibility.

SELECTED RECENT PRODUCTION BUILDS:
• Aménagement R.P. (rocky-pouliot.vercel.app): Flagship civil engineering & laser-grading platform.
• The Human Element: Interactive media platform with custom telemetry timeline streaming.
• Ledger & Vector: Sub-millisecond real-time treasury engine with optimistic UI updates.
• Atelier Kinetic UI: Swiss editorial component primitives design system.
• Cartography Zero: Spatial audio terrain archive with GLSL displacement shaders.

CONTRACT ENGAGEMENTS AVAILABLE:
Full-Stack MVP 0-to-1 Buildout, Technical Architecture Lead, Creative Prototyping.
`;

    const blob = new Blob([cvText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Xavier_Boudreault_CV_2026.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setTimeout(() => setDownloading(false), 2000);
  };

  const stackCategories = [
    {
      title: isFr ? "Ingénierie & Langages" : "Engineering & Languages",
      skills: [
        "JavaScript & Modern ECMAScript",
        "React 19 & Next.js App Router",
        "Node.js & Edge Runtimes",
        "PostgreSQL & SQLite",
        "WebSockets & Real-Time Sync",
        "Tailwind CSS v4",
      ],
    },
    {
      title: isFr ? "Design & Systèmes d'Interface" : "Product Design & UI Systems",
      skills: [
        "Swiss Grid Typography",
        "Design Tokens (Style Dictionary)",
        "Framer Motion Micro-Interactions",
        "Figma Component Architecture",
        "WCAG AAA Strict Contrast",
        "Storybook Documentation",
      ],
    },
    {
      title: isFr ? "Tech Créative & Graphisme" : "Creative Tech & Shaders",
      skills: [
        "Three.js & Canvas 2D/3D",
        "GLSL Shaders (Vertex & Fragment)",
        "Web Audio API Synthesis",
        "CRT Post-Processing Filters",
        "Procedural Terrain Generation",
        "Interactive Storytelling",
      ],
    },
  ];

  return (
    <div className="bg-[#f6f3eb] text-[#0f1115] font-editorial-mono antialiased selection:bg-[#0052ff] selection:text-white min-h-screen flex flex-col justify-between">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 sm:py-16 w-full">
        {/* Breadcrumb */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-black/60 hover:text-black transition-colors"
          >
            <span>←</span>
            <span>{isFr ? "Retour à l'accueil" : "Back to Home"}</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="mb-12 sm:mb-16">
          <span className="text-xs font-editorial-mono uppercase tracking-widest text-[#0052ff] font-bold block mb-2">
            {isFr ? "Matrice des compétences & Architecture" : "Capabilities & Engineering Philosophy"}
          </span>
          <h1 className="font-editorial-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-black mb-3 sm:mb-4">
            {isFr
              ? "L'avantage du profil polyvalent."
              : "The Generalist Advantage."}
          </h1>
          <p className="font-editorial-serif italic text-xl sm:text-3xl text-black/80 max-w-3xl leading-relaxed">
            {isFr
              ? "Allier la rigueur mathématique de l'informatique fondamentale avec une direction artistique intemporelle."
              : "Uniting deep distributed systems engineering with obsessive graphic sensibility and Swiss typographic rhythm."}
          </p>

          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md sm:max-w-none">
            <button
              type="button"
              onClick={triggerDownload}
              className="w-full sm:w-auto bg-black hover:bg-stone-800 text-white text-xs font-editorial-mono uppercase tracking-wider px-6 py-3.5 rounded font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95"
            >
              <span>{downloading ? (isFr ? "✓ Téléchargement..." : "✓ Downloading...") : (isFr ? "Télécharger le CV (Format Texte)" : "Download Curriculum Vitae")}</span>
              <span>↓</span>
            </button>
            <Link
              href="/talk"
              className="w-full sm:w-auto border-2 border-black hover:bg-black hover:text-white text-black text-xs font-editorial-mono uppercase tracking-wider px-6 py-3 rounded font-bold transition-all flex items-center justify-center gap-2 text-center"
            >
              <span>{isFr ? "Discuter d'un mandat" : "Inquire Contract Availability"}</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* 3 Main Pillars Deep Dive */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-20">
          {/* Pillar 01 */}
          <div className="bg-white/80 border border-black/15 rounded-2xl p-6 sm:p-8 space-y-4 sm:space-y-6 shadow-xs">
            <div className="flex justify-between items-center pb-3 sm:pb-4 border-b border-black/10">
              <span className="font-bold text-xs uppercase tracking-widest text-[#0052ff]">
                01 / Code
              </span>
              <span className="w-2 h-2 rounded-full bg-[#0052ff]" />
            </div>
            <h3 className="font-editorial-serif text-2xl sm:text-3xl font-bold text-black">
              {isFr ? "Architecture Logicielle" : "Software Architecture"}
            </h3>
            <p className="text-xs text-black/80 leading-relaxed">
              {isFr
                ? "Conception d'applications web résilientes prêtes pour l'échelle mondiale. Code structuré, élimination de la dette technique, temps de chargement sous les 50ms et pipelines de déploiement continu à toute épreuve."
                : "Engineered for resilience, low-latency, and zero runtime surprises. Clean contracts from database to edge runtime, optimistic client state, and sub-50ms TTFB."}
            </p>
            <div className="pt-4 border-t border-black/10 text-xs text-black/70 space-y-2">
              <p>• Next.js 16 App Router &amp; Server Actions</p>
              <p>• Edge Function Caching &amp; Partial Prerender</p>
              <p>• PostgreSQL / SQLite Schema &amp; Migration</p>
              <p>• WebSocket Deterministic State Synchronization</p>
            </div>
          </div>

          {/* Pillar 02 */}
          <div className="bg-white/80 border border-black/15 rounded-2xl p-6 sm:p-8 space-y-4 sm:space-y-6 shadow-xs">
            <div className="flex justify-between items-center pb-3 sm:pb-4 border-b border-black/10">
              <span className="font-bold text-xs uppercase tracking-widest text-[#d94726]">
                02 / Design
              </span>
              <span className="w-2 h-2 rounded-full bg-[#d94726]" />
            </div>
            <h3 className="font-editorial-serif text-2xl sm:text-3xl font-bold text-black">
              {isFr ? "Design Éditorial & Systèmes" : "Editorial UI & Systems"}
            </h3>
            <p className="text-xs text-black/80 leading-relaxed">
              {isFr
                ? "L'antidote à la monotonie visuelle des interfaces actuelles. Des grilles typographiques suisses rigoureuses, des micro-interactions à ressort naturel et des jetons de design structurés garantissant une cohérence parfaite."
                : "The antidote to bland automated SaaS templates. Rooted in classic Swiss grid typography, fluid headline scales, and physics-driven micro-interactions that feel tactile and alive."}
            </p>
            <div className="pt-4 border-t border-black/10 text-xs text-black/70 space-y-2">
              <p>• Multi-brand Design Tokens &amp; Primitives</p>
              <p>• Fluid Clamp() Algorithmic Typography</p>
              <p>• Framer Motion Spring Micro-Physics</p>
              <p>• Strict WCAG AAA Contrast Accessibility</p>
            </div>
          </div>

          {/* Pillar 03 */}
          <div className="bg-white/80 border border-black/15 rounded-2xl p-6 sm:p-8 space-y-4 sm:space-y-6 shadow-xs">
            <div className="flex justify-between items-center pb-3 sm:pb-4 border-b border-black/10">
              <span className="font-bold text-xs uppercase tracking-widest text-emerald-600">
                03 / Synthesis
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <h3 className="font-editorial-serif text-2xl sm:text-3xl font-bold text-black">
              {isFr ? "Tech Créative & WebGL" : "Creative Tech & Shaders"}
            </h3>
            <p className="text-xs text-black/80 leading-relaxed">
              {isFr
                ? "Exploitation du GPU dans le navigateur pour des expériences immersives inoubliables. Shaders GLSL personnalisés, cartographie 3D interactive, audio spatialisé et synthétiseurs procéduraux."
                : "Transforming the browser into an expressive 60fps real-time visual instrument. Handcrafted GLSL fragment shaders, CRT phosphor emulations, and custom Three.js pipelines."}
            </p>
            <div className="pt-4 border-t border-black/10 text-xs text-black/70 space-y-2">
              <p>• Custom GLSL Fragment &amp; Vertex Passes</p>
              <p>• CRT Tube Curvature &amp; Phosphor Trails</p>
              <p>• Web Audio API Synthesizers &amp; Spatial Sound</p>
              <p>• 0-to-1 Interactive MVP Prototypes</p>
            </div>
          </div>
        </div>

        {/* Technical Stack Breakdown Matrix */}
        <div className="bg-[#0f1115] text-white rounded-2xl p-6 sm:p-10 lg:p-12 mb-16 sm:mb-20 border border-black">
          <div className="mb-8 sm:mb-10 text-center sm:text-left">
            <span className="text-xs font-editorial-mono uppercase tracking-widest text-[#0052ff] font-bold block mb-2">
              {isFr ? "Matrice des technologies" : "Technical Stack Matrix"}
            </span>
            <h2 className="font-editorial-serif text-3xl sm:text-5xl font-bold text-white">
              {isFr ? "Outils de prédilection & Maîtrise" : "Battle-Tested Production Stack"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {stackCategories.map((cat) => (
              <div key={cat.title} className="bg-[#181b21] rounded-xl p-5 sm:p-6 border border-[#2a2e39]">
                <h4 className="font-editorial-serif text-lg sm:text-xl font-bold text-white mb-4 pb-2 border-b border-white/10">
                  {cat.title}
                </h4>
                <ul className="space-y-2.5 sm:space-y-3 text-xs font-editorial-mono text-neutral-300">
                  {cat.skills.map((skill) => (
                    <li key={skill} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0052ff]" />
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Engagement Modes */}
        <div className="mb-12 sm:mb-16">
          <h2 className="font-editorial-serif text-3xl sm:text-5xl font-bold text-black mb-6 sm:mb-8">
            {isFr ? "Modalités de collaboration" : "Engagement Models"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white border border-black/15 p-5 sm:p-6 rounded-xl">
              <span className="text-xs font-bold text-[#d94726] uppercase block mb-2">01 / Contract</span>
              <h4 className="font-editorial-serif text-xl font-bold mb-2">
                {isFr ? "Lead Full-Stack" : "Principal Engineer"}
              </h4>
              <p className="text-xs text-black/70 leading-relaxed">
                {isFr
                  ? "Intégration d'élite au sein de votre équipe produit pour débloquer des défis d'architecture complexes."
                  : "Embedded leadership to architect and execute high-stakes product features."}
              </p>
            </div>

            <div className="bg-white border border-black/15 p-5 sm:p-6 rounded-xl">
              <span className="text-xs font-bold text-[#0052ff] uppercase block mb-2">02 / 0 to 1</span>
              <h4 className="font-editorial-serif text-xl font-bold mb-2">
                {isFr ? "MVP Clé en main" : "0-to-1 MVP Build"}
              </h4>
              <p className="text-xs text-black/70 leading-relaxed">
                {isFr
                  ? "Conception et livraison complète d'un produit numérique de classe mondiale en 4 à 8 semaines."
                  : "Complete concept-to-production execution in 4–8 weeks with zero bloat."}
              </p>
            </div>

            <div className="bg-white border border-black/15 p-5 sm:p-6 rounded-xl">
              <span className="text-xs font-bold text-emerald-600 uppercase block mb-2">03 / Systems</span>
              <h4 className="font-editorial-serif text-xl font-bold mb-2">
                {isFr ? "Système de Design" : "Design Systems"}
              </h4>
              <p className="text-xs text-black/70 leading-relaxed">
                {isFr
                  ? "Création de kits d'interface modulaires, jetons de design et primitives réutilisables."
                  : "Codifying typography, tokens, and accessible components into living packages."}
              </p>
            </div>

            <div className="bg-white border border-black/15 p-5 sm:p-6 rounded-xl">
              <span className="text-xs font-bold text-stone-700 uppercase block mb-2">04 / Audit</span>
              <h4 className="font-editorial-serif text-xl font-bold mb-2">
                {isFr ? "Audit Technique" : "Architectural Audit"}
              </h4>
              <p className="text-xs text-black/70 leading-relaxed">
                {isFr
                  ? "Diagnostic complet de performance, d'accessibilité et de sécurité avec plan d'action immédiat."
                  : "Deep inspection of bundle weight, Web Vitals, and WCAG accessibility compliance."}
              </p>
            </div>
          </div>
        </div>

        {/* CTA Bridge */}
        <div className="bg-[#ebdcd0] border border-black/15 rounded-2xl p-6 sm:p-12 text-center space-y-4">
          <h3 className="font-editorial-serif text-2xl sm:text-4xl font-bold text-black">
            {isFr ? "Un projet ambitieux en vue ?" : "Planning an ambitious digital build?"}
          </h3>
          <p className="font-editorial-mono text-xs sm:text-sm text-black/75 max-w-xl mx-auto">
            {isFr
              ? "Discutons de vos besoins techniques et de vos attentes artistiques lors d'un premier échange de 30 minutes."
              : "Let’s review your architectural parameters and discuss timeline and budget."}
          </p>
          <div className="pt-2">
            <Link
              href="/talk"
              className="inline-flex items-center gap-2 bg-[#0052ff] hover:bg-blue-600 text-white font-editorial-mono uppercase text-xs tracking-wider px-6 sm:px-8 py-3.5 sm:py-4 rounded font-bold transition-all shadow-md active:scale-95"
            >
              <span>{isFr ? "Planifier un appel d'orientation" : "Schedule an Exploratory Call"}</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
