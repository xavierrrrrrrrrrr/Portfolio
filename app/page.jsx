"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "./context/LanguageContext";
import { getProjects } from "../data/projects";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CrtMonitor from "./components/CrtMonitor";

export default function Portfolio() {
  const { language, t } = useLanguage();
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);

  const projects = getProjects(language);
  const activeProject = projects[activeProjectIndex] || projects[0];

  return (
    <div className="bg-[#f6f3eb] text-[#0f1115] font-editorial-mono antialiased selection:bg-[#0052ff] selection:text-white relative min-h-screen scroll-smooth flex flex-col justify-between">
      <Header />

      <main className="flex-1">
        {/* BEGIN: HeroSection */}
        <section className="relative pt-8 sm:pt-12 pb-16 sm:pb-24 border-b border-black/10 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
            {/* Left Hero Text Column */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                <h1 className="font-editorial-pixel pixel-text text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-black select-none">
                  {t.hero.title}
                </h1>
                <p className="font-editorial-serif italic text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight tracking-normal text-black">
                  <span className="text-[#d94726] font-normal">
                    {t.hero.reimagining}
                  </span>
                  {t.hero.theWeb}
                </p>
              </div>

              <p className="font-editorial-mono text-sm sm:text-base md:text-lg text-black/85 max-w-xl leading-relaxed mb-6 sm:mb-8">
                {t.hero.bio}
              </p>

              {/* Status & Highlights Badges */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] sm:text-xs font-editorial-mono text-black/70">
                <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 border border-black/20 rounded bg-black/5">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>{t.hero.badgeContracts}</span>
                </div>
                <div className="px-2.5 sm:px-3 py-1.5 border border-black/20 rounded bg-black/5">
                  <span>{t.hero.badgeStack}</span>
                </div>
                <div className="px-2.5 sm:px-3 py-1.5 border border-black/20 rounded bg-black/5">
                  <span>{t.hero.badgeLocation}</span>
                </div>
              </div>
            </div>

            {/* Right Retro Vintage CRT Monitor Showcase (Animated) */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end mt-4 lg:mt-0">
              <CrtMonitor />
            </div>
          </div>
        </section>
        {/* END: HeroSection */}

        {/* BEGIN: WorkShowcaseSection */}
        <section className="py-16 sm:py-24 border-b border-black/10" id="work">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-14 gap-4">
              <div>
                <h2 className="font-editorial-serif text-3xl sm:text-5xl md:text-6xl tracking-tight text-black">
                  {t.work.titlePrefix}
                </h2>
                <p className="font-editorial-serif italic text-2xl sm:text-4xl text-black/80 font-normal mt-1">
                  {t.work.titleSuffix}
                </p>
              </div>
              <Link
                href="/work"
                className="font-editorial-mono text-xs uppercase tracking-wider text-[#0052ff] hover:underline font-bold"
              >
                {t.work.viewArchive}
              </Link>
            </div>

            {/* Interactive Split Case Study Container */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
              {/* Left Column: Project Switcher Tabs (Responsive carousel on mobile/tablet) */}
              <div className="lg:col-span-3 flex lg:flex-col gap-2.5 sm:gap-3 overflow-x-auto pb-3 lg:pb-0 snap-x snap-mandatory">
                {projects.map((project, idx) => {
                  const isActive = idx === activeProjectIndex;
                  return (
                    <button
                      key={project.id}
                      onClick={() => setActiveProjectIndex(idx)}
                      type="button"
                      className={`flex items-center gap-3 p-2.5 sm:p-3 rounded-xl text-left transition-all group shrink-0 w-60 sm:w-64 lg:w-full snap-start cursor-pointer ${
                        isActive
                          ? "bg-[#ebdcd0] border-2 border-[#d94726] shadow-xs"
                          : "bg-black/5 hover:bg-black/10 border border-black/10"
                      }`}
                    >
                      <div
                        className={`w-10 sm:w-12 h-10 sm:h-12 rounded-lg overflow-hidden flex items-center justify-center text-white text-xs font-editorial-mono font-bold shrink-0 ${
                          isActive ? "bg-stone-800" : "bg-stone-700"
                        }`}
                      >
                        {project.id}
                      </div>
                      <div className="min-w-0">
                        <p
                          className={`text-[9px] sm:text-[10px] font-editorial-mono uppercase tracking-widest truncate ${
                            isActive
                              ? "text-[#d94726] font-bold"
                              : "text-black/50"
                          }`}
                        >
                          {project.category}
                        </p>
                        <h4 className="font-editorial-serif text-sm sm:text-base font-bold text-black group-hover:text-[#d94726] leading-tight truncate">
                          {project.title}
                        </h4>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Right Column: Warm Peach Feature Card */}
              <div className="lg:col-span-9 bg-[#ebdcd0]/80 border border-black/10 rounded-2xl p-4 sm:p-8 lg:p-10 shadow-sm">
                {/* Top Hero Cinematic Card Banner */}
                <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-black/20 mb-6 sm:mb-8 aspect-[16/10] sm:aspect-video max-h-[380px] w-full flex items-end">
                  {activeProject.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={activeProject.image}
                      alt={activeProject.fullTitle}
                      className="absolute inset-0 w-full h-full object-cover blur-md scale-105"
                    />
                  )}
                  <div className={`absolute inset-0 z-10 ${activeProject.image ? "bg-gradient-to-t from-black/80 via-black/30 to-black/10" : "bg-gradient-to-t from-black via-slate-900/60 to-transparent"}`} />
                  <div className="absolute inset-0 bg-[radial-gradient(#d94726_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />

                  <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4 sm:p-6 z-20">
                    <span className="font-editorial-mono text-[10px] sm:text-xs text-white/70 tracking-widest uppercase mb-1 sm:mb-2">
                      {activeProject.bannerSubtitle}
                    </span>
                    <h3 className="font-editorial-serif text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-white uppercase drop-shadow-md">
                      {activeProject.title}
                    </h3>
                    <p className="font-editorial-serif italic text-xs sm:text-base lg:text-lg text-[#ebdcd0] mt-1 max-w-xl px-2">
                      {activeProject.bannerQuote}
                    </p>
                  </div>

                  <div className="relative z-20 p-3 sm:p-4 w-full flex justify-between items-center text-xs font-editorial-mono text-white/80 border-t border-white/10 gap-2">
                    <span className="text-[10px] sm:text-xs truncate">
                      {activeProject.techHeader}
                    </span>
                    {activeProject.link ? (
                      <a
                        href={activeProject.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#0052ff] hover:bg-blue-600 transition-colors text-white px-2 sm:px-2.5 py-1 rounded text-[9px] sm:text-[10px] uppercase font-bold flex items-center gap-1 group/btn shrink-0"
                      >
                        <span>{activeProject.status}</span>
                        <span className="text-[10px] group-hover/btn:translate-x-0.5 transition-transform">
                          ↗
                        </span>
                      </a>
                    ) : (
                      <span className="bg-[#0052ff] text-white px-2 py-0.5 rounded text-[9px] sm:text-[10px] uppercase font-bold shrink-0">
                        {activeProject.status}
                      </span>
                    )}
                  </div>
                </div>

                {/* Project Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
                  {/* Left Details */}
                  <div className="md:col-span-7 space-y-3 sm:space-y-4">
                    <span className="text-[10px] sm:text-xs font-editorial-mono uppercase tracking-widest text-[#d94726] font-bold">
                      {activeProject.spotlight}
                    </span>
                    <h3 className="font-editorial-serif text-xl sm:text-3xl lg:text-4xl text-black font-bold">
                      {activeProject.fullTitle}
                    </h3>
                    <p className="font-editorial-mono text-xs sm:text-sm text-black/85 leading-relaxed">
                      {activeProject.description}
                    </p>

                    <div className="pt-2 flex flex-wrap gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-editorial-mono">
                      {activeProject.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-white/80 border border-black/15 px-2.5 sm:px-3 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right Quote / Callout Block */}
                  <div className="md:col-span-5 bg-white/70 border border-black/10 rounded-xl p-4 sm:p-5 space-y-3 sm:space-y-4">
                    <div className="flex items-start gap-2.5 sm:gap-3">
                      <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-full bg-[#d94726] flex items-center justify-center text-white shrink-0 font-editorial-serif font-bold text-base sm:text-lg">
                        “
                      </div>
                      <p className="font-editorial-serif italic text-sm sm:text-base lg:text-lg text-black/90 leading-snug">
                        {activeProject.quotePrefix}
                        <strong className="text-[#d94726] font-editorial-serif not-italic">
                          {activeProject.quoteStrong}
                        </strong>
                        {activeProject.quoteMiddle}
                        <em className="text-[#d94726]">{activeProject.quoteEm}</em>
                        {activeProject.quoteSuffix}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-black/10 flex justify-between items-center text-xs">
                      <span className="font-editorial-mono text-[11px] sm:text-xs text-black/60 truncate max-w-[130px] sm:max-w-[150px]">
                        {activeProject.deployLabel}
                      </span>
                      <a
                        className="font-editorial-mono text-[11px] sm:text-xs font-bold text-[#0052ff] hover:underline flex items-center gap-1 shrink-0"
                        href={activeProject.link || "/talk"}
                        target={activeProject.link ? "_blank" : undefined}
                        rel={
                          activeProject.link
                            ? "noopener noreferrer"
                            : undefined
                        }
                      >
                        {activeProject.ctaLabel}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* END: WorkShowcaseSection */}

        {/* BEGIN: CapabilitiesMatrixSection */}
        <section
          className="bg-[#0f1115] text-white py-16 sm:py-24 relative overflow-hidden border-b border-black"
          id="matrix"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
            <div className="flex flex-col items-center text-center mb-10 sm:mb-16">
              <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-full bg-white text-black flex items-center justify-center font-editorial-serif italic text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 shadow-xl ring-4 ring-white/10">
                X
              </div>
              <h2 className="font-editorial-serif text-3xl sm:text-5xl md:text-6xl tracking-tight text-white mb-3 sm:mb-4">
                {t.matrix.title}
              </h2>
              <p className="font-editorial-mono text-xs sm:text-sm text-neutral-400 max-w-xl uppercase tracking-wider">
                {t.matrix.subtitle}
              </p>
            </div>

            {/* 3-Column Capability Breakdown Cards (Responsive on mobile/tablet) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Column 01 */}
              <div className="bg-[#181b21]/90 border border-[#2a2e39] rounded-xl p-6 sm:p-8 flex flex-col justify-between hover:border-[#0052ff]/60 transition-all group">
                <div>
                  <div className="flex justify-between items-start mb-4 sm:mb-6">
                    <span className="font-editorial-mono text-xs text-[#0052ff] font-bold tracking-widest uppercase">
                      01 / Code
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#0052ff]" />
                  </div>
                  <h3 className="font-editorial-serif text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 group-hover:text-[#0052ff] transition-colors">
                    {t.matrix.col1Title}
                  </h3>
                  <p className="font-editorial-mono text-xs text-neutral-400 leading-relaxed mb-6">
                    {t.matrix.col1Sub}
                  </p>
                </div>
                <div className="pt-5 sm:pt-6 border-t border-white/10">
                  <ul className="text-[11px] font-editorial-mono text-white/80 space-y-1.5">
                    {t.matrix.col1Points.map((point) => (
                      <li key={point} className="flex items-center gap-2">
                        <span className="text-[#0052ff]">-</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Column 02 */}
              <div className="bg-[#181b21]/90 border border-[#2a2e39] rounded-xl p-6 sm:p-8 flex flex-col justify-between hover:border-[#d94726]/60 transition-all group">
                <div>
                  <div className="flex justify-between items-start mb-4 sm:mb-6">
                    <span className="font-editorial-mono text-xs text-[#d94726] font-bold tracking-widest uppercase">
                      02 / Design
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#d94726]" />
                  </div>
                  <h3 className="font-editorial-serif text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 group-hover:text-[#d94726] transition-colors">
                    {t.matrix.col2Title}
                  </h3>
                  <p className="font-editorial-mono text-xs text-neutral-400 leading-relaxed mb-6">
                    {t.matrix.col2Sub}
                  </p>
                </div>
                <div className="pt-5 sm:pt-6 border-t border-white/10">
                  <ul className="text-[11px] font-editorial-mono text-white/80 space-y-1.5">
                    {t.matrix.col2Points.map((point) => (
                      <li key={point} className="flex items-center gap-2">
                        <span className="text-[#d94726]">-</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Column 03 */}
              <div className="bg-[#181b21]/90 border border-[#2a2e39] rounded-xl p-6 sm:p-8 flex flex-col justify-between hover:border-emerald-500/60 transition-all group">
                <div>
                  <div className="flex justify-between items-start mb-4 sm:mb-6">
                    <span className="font-editorial-mono text-xs text-emerald-400 font-bold tracking-widest uppercase">
                      03 / Synthesis
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <h3 className="font-editorial-serif text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 group-hover:text-emerald-400 transition-colors">
                    {t.matrix.col3Title}
                  </h3>
                  <p className="font-editorial-mono text-xs text-neutral-400 leading-relaxed mb-6">
                    {t.matrix.col3Sub}
                  </p>
                </div>
                <div className="pt-5 sm:pt-6 border-t border-white/10">
                  <ul className="text-[11px] font-editorial-mono text-white/80 space-y-1.5">
                    {t.matrix.col3Points.map((point) => (
                      <li key={point} className="flex items-center gap-2">
                        <span className="text-emerald-400">-</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* END: CapabilitiesMatrixSection */}

        {/* BEGIN: ExperimentsLabSection */}
        <section
          className="bg-[#090a0d] py-16 sm:py-24 border-b border-white/10 overflow-hidden"
          id="experiments"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 sm:mb-12">
              <div>
                <span className="font-editorial-mono text-xs text-[#0052ff] uppercase tracking-widest font-bold">
                  {t.experiments.badge}
                </span>
                <h2 className="font-editorial-serif text-3xl sm:text-5xl text-white tracking-tight mt-1">
                  {t.experiments.title}
                </h2>
              </div>
              <Link
                className="mt-3 md:mt-0 font-editorial-mono text-xs text-white/70 hover:text-white uppercase tracking-wider underline underline-offset-4"
                href="/experiments"
              >
                {t.experiments.viewAll}
              </Link>
            </div>

            {/* Responsive Card Grid (1 on mobile, 2 on tablet, 4 on desktop) */}
            <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-stretch">
              {/* Experiment Card 1 */}
              <div className="bg-white rounded-xl p-5 shadow-xl lg:-rotate-2 hover:rotate-0 transition-transform duration-300 border-2 border-emerald-500 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-editorial-mono font-bold">
                      01
                    </span>
                    <span className="font-editorial-mono text-[10px] text-zinc-600 font-bold uppercase tracking-wider">
                      {t.experiments.exp1Badge}
                    </span>
                  </div>
                  <h4 className="font-editorial-serif text-base sm:text-lg font-bold text-zinc-900 leading-tight mb-2">
                    {t.experiments.exp1Title}
                  </h4>
                  <p className="font-editorial-mono text-[11px] text-zinc-600 mb-4">
                    {t.experiments.exp1Desc}
                  </p>
                </div>
                <div className="flex justify-between items-center text-[10px] font-editorial-mono text-zinc-400 border-t border-zinc-100 pt-3">
                  <span>★ 428 stars</span>
                  <span className="text-emerald-600 font-bold">
                    {t.experiments.exp1Status}
                  </span>
                </div>
              </div>

              {/* Experiment Card 2 */}
              <div className="bg-white rounded-xl p-5 shadow-xl lg:rotate-1 hover:rotate-0 transition-transform duration-300 border-2 border-[#d94726] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-6 h-6 rounded-full bg-[#d94726] text-white flex items-center justify-center text-[10px] font-editorial-mono font-bold">
                      02
                    </span>
                    <span className="font-editorial-mono text-[10px] text-zinc-600 font-bold uppercase tracking-wider">
                      {t.experiments.exp2Badge}
                    </span>
                  </div>
                  <h4 className="font-editorial-serif text-base sm:text-lg font-bold text-zinc-900 leading-tight mb-2">
                    {t.experiments.exp2Title}
                  </h4>
                  <p className="font-editorial-mono text-[11px] text-zinc-600 mb-4">
                    {t.experiments.exp2Desc}
                  </p>
                </div>
                <div className="flex justify-between items-center text-[10px] font-editorial-mono text-zinc-400 border-t border-zinc-100 pt-3">
                  <span>★ 890 stars</span>
                  <span className="text-[#d94726] font-bold">
                    {t.experiments.exp2Status}
                  </span>
                </div>
              </div>

              {/* Experiment Card 3 */}
              <div className="bg-white rounded-xl p-5 shadow-xl lg:-rotate-1 hover:rotate-0 transition-transform duration-300 border-2 border-[#0052ff] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-6 h-6 rounded-full bg-[#0052ff] text-white flex items-center justify-center text-[10px] font-editorial-mono font-bold">
                      03
                    </span>
                    <span className="font-editorial-mono text-[10px] text-zinc-600 font-bold uppercase tracking-wider">
                      {t.experiments.exp3Badge}
                    </span>
                  </div>
                  <h4 className="font-editorial-serif text-base sm:text-lg font-bold text-zinc-900 leading-tight mb-2">
                    {t.experiments.exp3Title}
                  </h4>
                  <p className="font-editorial-mono text-[11px] text-zinc-600 mb-4">
                    {t.experiments.exp3Desc}
                  </p>
                </div>
                <div className="flex justify-between items-center text-[10px] font-editorial-mono text-zinc-400 border-t border-zinc-100 pt-3">
                  <span>★ 1.2k stars</span>
                  <span className="text-[#0052ff] font-bold">
                    {t.experiments.exp3Status}
                  </span>
                </div>
              </div>

              {/* Experiment Card 4 */}
              <div className="bg-white rounded-xl p-5 shadow-xl lg:rotate-3 hover:rotate-0 transition-transform duration-300 border-2 border-stone-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center text-[10px] font-editorial-mono font-bold">
                      04
                    </span>
                    <span className="font-editorial-mono text-[10px] text-zinc-600 font-bold uppercase tracking-wider">
                      {t.experiments.exp4Badge}
                    </span>
                  </div>
                  <h4 className="font-editorial-serif text-base sm:text-lg font-bold text-zinc-900 leading-tight mb-2">
                    {t.experiments.exp4Title}
                  </h4>
                  <p className="font-editorial-mono text-[11px] text-zinc-600 mb-4">
                    {t.experiments.exp4Desc}
                  </p>
                </div>
                <div className="flex justify-between items-center text-[10px] font-editorial-mono text-zinc-400 border-t border-zinc-100 pt-3">
                  <span>8 min read</span>
                  <Link
                    href="/experiments"
                    className="text-black font-bold hover:underline"
                  >
                    {t.experiments.exp4Status}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* END: ExperimentsLabSection */}

        {/* BEGIN: CallToActionSection */}
        <section
          className="bg-[#f6f3eb] py-16 sm:py-24 border-b border-black/10"
          id="contact"
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-12 text-center">
            <h2 className="font-editorial-serif text-4xl sm:text-6xl lg:text-8xl text-[#0052ff] tracking-tight mb-3 sm:mb-4 font-normal">
              {t.contact.title}
            </h2>
            <p className="font-editorial-mono text-xs sm:text-sm uppercase tracking-widest text-black/70 mb-6 sm:mb-8 max-w-xl mx-auto">
              {t.contact.badge}
            </p>
            <p className="font-editorial-serif italic text-xl sm:text-3xl text-black/90 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed">
              {t.contact.lead}
            </p>

            {/* CTA Buttons Group (Full-width on mobile, side-by-side on sm+) */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto">
              <Link
                className="w-full sm:w-auto bg-[#0052ff] hover:bg-blue-600 text-white font-editorial-mono uppercase text-xs tracking-wider px-6 sm:px-8 py-3.5 sm:py-4 rounded font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                href="/talk"
              >
                <span>{t.contact.introBtn}</span>
                <span>→</span>
              </Link>
              <Link
                className="w-full sm:w-auto border-2 border-black hover:bg-black hover:text-white text-black font-editorial-mono uppercase text-xs tracking-wider px-6 sm:px-8 py-3.5 sm:py-4 rounded font-bold transition-all active:scale-95 text-center"
                href="/capabilities"
              >
                {t.contact.cvBtn}
              </Link>
            </div>

            <div className="mt-8 sm:mt-10 flex items-center justify-center gap-2 text-xs font-editorial-mono text-black/60">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{t.contact.responseTime}</span>
            </div>
          </div>
        </section>
        {/* END: CallToActionSection */}
      </main>

      <Footer />
    </div>
  );
}
