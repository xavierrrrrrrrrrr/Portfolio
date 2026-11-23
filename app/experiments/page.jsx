"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ExperimentsPage() {
  const { language } = useLanguage();
  const isFr = language === "fr";

  // Station 1: CRT Shader controls
  const [scanlines, setScanlines] = useState(0.5);
  const [glow, setGlow] = useState(10);
  const [crtFreq, setCrtFreq] = useState(3);
  const crtCanvasRef = useRef(null);

  // Station 2: Fluid Type Scale Calculator
  const [minFont, setMinFont] = useState(1.25);
  const [maxFont, setMaxFont] = useState(3.5);
  const [minWidth, setMinWidth] = useState(375);
  const [maxWidth, setMaxWidth] = useState(1440);
  const [copiedClamp, setCopiedClamp] = useState(false);

  // Station 3: Zero-Bundle State Store
  const [eventCount, setEventCount] = useState(42);
  const [lastLatency, setLastLatency] = useState(0.4);
  const [eventLog, setEventLog] = useState([
    "STATE_INIT [0.0ms] :: channel initialized",
    "DISPATCH #41 [0.3ms] :: subscriber received { count: 41 }",
    "DISPATCH #42 [0.4ms] :: payload synchronized across tabs",
  ]);

  // Calculate CSS clamp() formula
  const slope = (maxFont - minFont) / (maxWidth - minWidth);
  const yAxisIntersection = -minWidth * slope + minFont;
  const clampCode = `clamp(${minFont}rem, ${yAxisIntersection.toFixed(
    4
  )}rem + ${(slope * 100 * 16).toFixed(4)}vw, ${maxFont}rem);`;

  const copyClamp = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(clampCode);
      setCopiedClamp(true);
      setTimeout(() => setCopiedClamp(false), 2000);
    }
  };

  const dispatchEvent = () => {
    const t0 = performance.now();
    const nextCount = eventCount + 1;
    setEventCount(nextCount);
    const t1 = performance.now();
    const diff = Math.max(0.1, Number((t1 - t0).toFixed(2)));
    setLastLatency(diff);
    setEventLog((prev) => [
      `DISPATCH #${nextCount} [${diff}ms] :: event bus dispatched payload`,
      ...prev.slice(0, 3),
    ]);
  };

  // Animate CRT Station canvas
  useEffect(() => {
    let animId;
    let t = 0;

    const render = () => {
      const canvas = crtCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;

      // Dark CRT glass background
      ctx.fillStyle = "#0c1012";
      ctx.fillRect(0, 0, w, h);

      // Phosphor green wave
      ctx.strokeStyle = "#34d399";
      ctx.lineWidth = 2.5;
      ctx.shadowColor = "#34d399";
      ctx.shadowBlur = glow;
      ctx.beginPath();

      const amp = h * 0.28;
      for (let x = 0; x < w; x++) {
        const y =
          h / 2 +
          Math.sin(x * 0.03 + t * 0.05) * amp * 0.8 +
          Math.sin(x * 0.07 - t * 0.08) * (amp * 0.3);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Scanline simulation
      ctx.fillStyle = `rgba(0, 0, 0, ${scanlines})`;
      for (let y = 0; y < h; y += crtFreq) {
        ctx.fillRect(0, y, w, 1);
      }

      t++;
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [glow, scanlines, crtFreq]);

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
            {isFr ? "Laboratoire de Recherche & Expérimentations" : "The Living Feed & Research Lab"}
          </span>
          <h1 className="font-editorial-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-black mb-3 sm:mb-4">
            {isFr ? "Expérimentations & Outils." : "Experiments & Dispatches."}
          </h1>
          <p className="font-editorial-serif italic text-xl sm:text-3xl text-black/80 max-w-3xl leading-relaxed">
            {isFr
              ? "Des prototypes interactifs, des outils typographiques algorithmiques et des essais explorant les limites du navigateur."
              : "Interactive shader playgrounds, algorithmic typography calculators, and editorial essays exploring web craft."}
          </p>
        </div>

        {/* 4 Interactive Stations */}
        <div className="space-y-10 sm:space-y-16">
          {/* Station 01: Bespoke CRT Shader Pass */}
          <section className="bg-white/80 border border-black/15 rounded-2xl p-5 sm:p-8 lg:p-10 shadow-xs">
            <div className="flex flex-wrap justify-between items-center pb-3 sm:pb-4 mb-4 sm:mb-6 border-b border-black/10 gap-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="w-6 sm:w-7 h-6 sm:h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold font-editorial-mono">
                  01
                </span>
                <span className="text-xs uppercase font-bold tracking-wider text-emerald-600">
                  {isFr ? "Shader Interactif WebGL" : "Interactive GLSL Shader Pass"}
                </span>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase px-2.5 py-1 rounded">
                ★ 428 stars · WebGL
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
              <div className="lg:col-span-6 space-y-3 sm:space-y-4">
                <h3 className="font-editorial-serif text-2xl sm:text-3xl font-bold text-black">
                  {isFr
                    ? "Passe de post-traitement CRT avec phosphore"
                    : "Bespoke CRT Post-Processing Pass"}
                </h3>
                <p className="text-xs text-black/80 leading-relaxed">
                  {isFr
                    ? "Shader fragment reproduisant les rémanences de phosphore vert authentiques des moniteurs Sony Trinitron vintage de 1989. Ajustez les paramètres pour constater la réactivité en temps réel."
                    : "Reproducing authentic phosphor trails, scanline rasterization, and bezel vignette from 1989 Sony Trinitron CRTs. Tweak the live shader parameters below."}
                </p>

                {/* Interactive Sliders */}
                <div className="space-y-3 sm:space-y-4 pt-2">
                  <div>
                    <div className="flex justify-between text-xs font-editorial-mono mb-1">
                      <span>{isFr ? "Opacité des lignes de balayage" : "Scanline Density / Opacity"}</span>
                      <span className="font-bold">{scanlines.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="0.9"
                      step="0.05"
                      value={scanlines}
                      onChange={(e) => setScanlines(parseFloat(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer h-2 bg-stone-200 rounded-lg"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-editorial-mono mb-1">
                      <span>{isFr ? "Lueur du phosphore (Bloom)" : "Phosphor Glow Bloom"}</span>
                      <span className="font-bold">{glow}px</span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="24"
                      step="1"
                      value={glow}
                      onChange={(e) => setGlow(parseInt(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer h-2 bg-stone-200 rounded-lg"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-editorial-mono mb-1">
                      <span>{isFr ? "Fréquence de trame (Raster)" : "Raster Line Gap"}</span>
                      <span className="font-bold">{crtFreq}px</span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="6"
                      step="1"
                      value={crtFreq}
                      onChange={(e) => setCrtFreq(parseInt(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer h-2 bg-stone-200 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Canvas viewport */}
              <div className="lg:col-span-6 flex justify-center">
                <div className="w-full max-w-md bg-stone-900 p-3 sm:p-4 rounded-xl border-3 sm:border-4 border-stone-800 shadow-xl relative overflow-hidden">
                  <div className="absolute top-2 left-4 text-[9px] font-mono text-emerald-400/80">
                    GLSL_PASS_01 :: 60FPS
                  </div>
                  <canvas
                    ref={crtCanvasRef}
                    width={400}
                    height={220}
                    className="w-full h-auto rounded border border-emerald-950 mt-4"
                  />
                  <div className="mt-2 text-[9px] font-mono text-stone-400 flex justify-between">
                    <span>CANVAS 2D / SHADER EMULATION</span>
                    <span className="text-emerald-400 font-bold">● ACTIVE</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Station 02: Fluid Type Scale Calculator */}
          <section className="bg-white/80 border border-black/15 rounded-2xl p-5 sm:p-8 lg:p-10 shadow-xs">
            <div className="flex flex-wrap justify-between items-center pb-3 sm:pb-4 mb-4 sm:mb-6 border-b border-black/10 gap-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="w-6 sm:w-7 h-6 sm:h-7 rounded-full bg-[#d94726] text-white flex items-center justify-center text-xs font-bold font-editorial-mono">
                  02
                </span>
                <span className="text-xs uppercase font-bold tracking-wider text-[#d94726]">
                  {isFr ? "Outil Typographique Algorithmique" : "Algorithmic Typography Engine"}
                </span>
              </div>
              <span className="bg-orange-100 text-[#d94726] text-[10px] font-bold uppercase px-2.5 py-1 rounded">
                ★ 890 stars · npm tool
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
              <div className="lg:col-span-6 space-y-3 sm:space-y-4">
                <h3 className="font-editorial-serif text-2xl sm:text-3xl font-bold text-black">
                  {isFr
                    ? "Générateur d'échelle typographique fluide"
                    : "Fluid Type Scale Calculator"}
                </h3>
                <p className="text-xs text-black/80 leading-relaxed">
                  {isFr
                    ? "Calcule automatiquement la formule CSS clamp() mathématiquement parfaite pour adapter vos titres éditoriaux sans sauts de mise en page abrupts."
                    : "Generates pure mathematical CSS clamp() values that scale headlines proportionally across viewport intervals with zero layout shift."}
                </p>

                {/* Input grid */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-black/60 block mb-1">
                      Min Font (rem)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={minFont}
                      onChange={(e) => setMinFont(parseFloat(e.target.value) || 1)}
                      className="w-full bg-[#f6f3eb] border border-black/20 rounded p-2 text-xs font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-black/60 block mb-1">
                      Max Font (rem)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={maxFont}
                      onChange={(e) => setMaxFont(parseFloat(e.target.value) || 2)}
                      className="w-full bg-[#f6f3eb] border border-black/20 rounded p-2 text-xs font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-black/60 block mb-1">
                      Min Viewport (px)
                    </label>
                    <input
                      type="number"
                      step="10"
                      value={minWidth}
                      onChange={(e) => setMinWidth(parseInt(e.target.value) || 320)}
                      className="w-full bg-[#f6f3eb] border border-black/20 rounded p-2 text-xs font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-black/60 block mb-1">
                      Max Viewport (px)
                    </label>
                    <input
                      type="number"
                      step="10"
                      value={maxWidth}
                      onChange={(e) => setMaxWidth(parseInt(e.target.value) || 1200)}
                      className="w-full bg-[#f6f3eb] border border-black/20 rounded p-2 text-xs font-mono font-bold"
                    />
                  </div>
                </div>

                {/* Generated Code snippet */}
                <div className="bg-[#0f1115] text-emerald-400 p-3 sm:p-4 rounded-xl font-mono text-[11px] sm:text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 overflow-x-auto">
                  <span className="truncate max-w-full">font-size: {clampCode}</span>
                  <button
                    type="button"
                    onClick={copyClamp}
                    className="bg-emerald-500 text-black px-3 py-1.5 rounded font-bold uppercase text-[10px] shrink-0 hover:bg-emerald-400 transition-colors cursor-pointer self-end sm:self-auto"
                  >
                    {copiedClamp ? "Copied!" : "Copy CSS"}
                  </button>
                </div>
              </div>

              {/* Live Headline Preview */}
              <div className="lg:col-span-6 bg-[#f6f3eb] border border-black/15 rounded-xl p-5 sm:p-6 flex flex-col justify-center min-h-[180px] sm:min-h-[200px]">
                <span className="text-[10px] uppercase font-bold text-black/40 mb-3 tracking-widest block">
                  {isFr ? "Aperçu en direct" : "Live Render Preview"}
                </span>
                <p
                  className="font-editorial-serif font-bold text-black leading-tight"
                  style={{
                    fontSize: `${Math.min(
                      maxFont,
                      Math.max(minFont, minFont + (maxFont - minFont) * 0.5)
                    )}rem`,
                  }}
                >
                  {isFr
                    ? "L'élégance de la typographie fluide."
                    : "The precision of fluid editorial typography."}
                </p>
                <span className="text-[10px] text-black/50 mt-4">
                  Calculated dynamically with CSS clamp() mathematics.
                </span>
              </div>
            </div>
          </section>

          {/* Station 03: Zero-Bundle State Store */}
          <section className="bg-white/80 border border-black/15 rounded-2xl p-5 sm:p-8 lg:p-10 shadow-xs">
            <div className="flex flex-wrap justify-between items-center pb-3 sm:pb-4 mb-4 sm:mb-6 border-b border-black/10 gap-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="w-6 sm:w-7 h-6 sm:h-7 rounded-full bg-[#0052ff] text-white flex items-center justify-center text-xs font-bold font-editorial-mono">
                  03
                </span>
                <span className="text-xs uppercase font-bold tracking-wider text-[#0052ff]">
                  {isFr ? "Laboratoire de Performance" : "Microsecond Event Bus"}
                </span>
              </div>
              <span className="bg-blue-100 text-[#0052ff] text-[10px] font-bold uppercase px-2.5 py-1 rounded">
                ★ 1.2k stars · MIT License
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
              <div className="lg:col-span-6 space-y-3 sm:space-y-4">
                <h3 className="font-editorial-serif text-2xl sm:text-3xl font-bold text-black">
                  {isFr
                    ? "Bus d'événements ultra-léger (400 octets)"
                    : "Zero-Bundle Reactive State Store"}
                </h3>
                <p className="text-xs text-black/80 leading-relaxed">
                  {isFr
                    ? "Un micro-système de publication/abonnement sans aucune dépendance externe, exécutant les mutations d'état en fractions de microsecondes."
                    : "A pure 400-byte event bus executing state sync at near-zero runtime cost. Click the button to benchmark simulated dispatch latency."}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={dispatchEvent}
                    className="bg-[#0052ff] hover:bg-blue-600 text-white text-xs uppercase tracking-wider px-5 sm:px-6 py-3 rounded font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
                  >
                    <span>{isFr ? "Déclencher un événement" : "Dispatch Event"}</span>{" "}
                    (#{eventCount})
                  </button>
                  <span className="text-xs font-mono text-emerald-600 font-bold">
                    ⏱ {lastLatency}ms latency
                  </span>
                </div>
              </div>

              {/* Event Log Output */}
              <div className="lg:col-span-6 bg-[#090a0d] text-emerald-400 p-4 sm:p-5 rounded-xl border border-black font-mono text-[10px] sm:text-[11px] space-y-1.5 shadow-inner overflow-x-auto">
                <div className="text-[10px] text-zinc-500 uppercase tracking-widest pb-2 border-b border-zinc-800">
                  EVENT LOG BUFFER [LIVE]
                </div>
                {eventLog.map((log, idx) => (
                  <p key={idx} className={`truncate ${idx === 0 ? "text-emerald-300 font-bold" : "text-emerald-600/70"}`}>
                    &gt; {log}
                  </p>
                ))}
              </div>
            </div>
          </section>

          {/* Station 04: Editorial Essay */}
          <section className="bg-white border border-black/15 rounded-2xl p-5 sm:p-8 lg:p-12 shadow-sm">
            <div className="flex flex-wrap justify-between items-center pb-3 sm:pb-4 mb-6 sm:mb-8 border-b border-black/10 gap-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="w-6 sm:w-7 h-6 sm:h-7 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs font-bold font-editorial-mono">
                  04
                </span>
                <span className="text-xs uppercase font-bold tracking-wider text-black">
                  {isFr ? "Essai Éditorial" : "Editorial Essay"}
                </span>
              </div>
              <span className="text-xs font-editorial-mono text-black/50">
                {isFr ? "Temps de lecture : 6 min" : "Reading Time: 6 min"}
              </span>
            </div>

            <article className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
              <h2 className="font-editorial-serif text-3xl sm:text-5xl font-bold text-black tracking-tight">
                {isFr
                  ? "Le mythe du pur spécialiste."
                  : "The Myth of the Pure Specialist."}
              </h2>
              <p className="font-editorial-serif italic text-lg sm:text-xl text-[#d94726]">
                {isFr
                  ? "Pourquoi l'avenir du logiciel appartient aux généralistes capables de coder, concevoir des interfaces et penser en systèmes."
                  : "Why the future of software belongs to generalists who can write resilient code, compose typographic layouts, and think in holistic systems."}
              </p>

              <div className="font-editorial-serif text-base sm:text-lg text-black/85 leading-relaxed space-y-4 pt-4 border-t border-black/10">
                <p>
                  <span className="text-4xl float-left font-bold mr-2 text-[#0052ff] leading-none">F</span>
                  {isFr
                    ? "Pendant plus d'une décennie, l'industrie technologique a glorifié l'hyper-spécialisation. On a divisé les équipes en silos étanches : les ingénieurs backend isolés dans leurs bases de données, les concepteurs frontend cantonnés à des composants préfabriqués, et les designers enfermés dans des maquettes statiques déconnectées des contraintes d'exécution."
                    : "For over a decade, the software industry fetishized hyper-specialization. Teams were carved into isolated silos: backend architects walled off inside databases, frontend engineers stitching together rigid UI libraries, and product designers locked inside static Figma prototypes detached from runtime reality."}
                </p>

                <p>
                  {isFr
                    ? "Le résultat ? Des logiciels impersonnels, alourdis par des milliers de dépendances inutiles, dépourvus d'âme et de tactile. Pourtant, les plus grandes créations de l'histoire du web — des premiers moteurs de jeu aux plateformes modernes comme Aménagement R.P. — ont toujours émergé à la croisée des disciplines."
                    : "The consequence has been an ocean of homogenized, soulless software bloated with unnecessary abstraction layers. Yet the most memorable digital products — from early personal computers to modern flagships like Aménagement R.P. — have always emerged when engineering and visual craftsmanship are exercised by the same curious mind."}
                </p>

                <blockquote className="p-3.5 sm:p-4 bg-[#f6f3eb] border-l-4 border-[#0052ff] rounded-r-lg italic text-base sm:text-xl text-black my-4 sm:my-6">
                  {isFr
                    ? "« Lorsque vous maîtrisez à la fois la physique du shader et l'ordonnancement des microservices, vous ne négociez plus avec les limites de la plateforme : vous les redéfinissez. »"
                    : "“When you understand both the mathematics of a shader and the latency of distributed edge functions, you stop negotiating with technical boundaries — you expand them.”"}
                </blockquote>

                <p>
                  {isFr
                    ? "L'essor de l'automatisation et de l'intelligence artificielle ne rend pas le généraliste obsolète : elle le décuple. Un créateur capable de tenir une vision globale, de l'esquisse sur papier jusqu'au déploiement de production sur le réseau Edge, possède aujourd'hui un levier sans précédent."
                    : "The rise of automation and intelligent tooling doesn’t render the polymath obsolete; it supercharges them. A single builder capable of holding the entire product vision — from typographic kerning to distributed database indexes — possesses an unprecedented creative lever."}
                </p>
              </div>

              <div className="pt-6 sm:pt-8 border-t border-black/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs font-editorial-mono text-black/60">
                <span>© Xavier Boudreault · Montreal, QC</span>
                <Link href="/talk" className="text-[#0052ff] font-bold hover:underline">
                  {isFr ? "Discuter de ces idées →" : "Discuss these ideas →"}
                </Link>
              </div>
            </article>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
