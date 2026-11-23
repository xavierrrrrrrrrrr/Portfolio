"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function WorkPage() {
  const { language, t } = useLanguage();
  const isFr = language === "fr";
  const [filter, setFilter] = useState<string>("all");

  const projects = t.projects;

  const categories = [
    { key: "all", label: isFr ? "Tous les projets" : "All Projects" },
    { key: "production", label: isFr ? "En Production" : "Production" },
    { key: "creative", label: isFr ? "WebGL & 3D" : "Creative WebGL" },
    { key: "system", label: isFr ? "Systèmes de Design" : "Design Systems" },
  ];

  const filteredProjects = projects.filter((p) => {
    if (filter === "all") return true;
    if (filter === "production")
      return p.status.toLowerCase().includes("production") || p.status.toLowerCase().includes("live");
    if (filter === "creative")
      return p.tags.some((t) => t.toLowerCase().includes("three") || t.toLowerCase().includes("glsl") || t.toLowerCase().includes("webgl"));
    if (filter === "system")
      return p.tags.some((t) => t.toLowerCase().includes("design token") || t.toLowerCase().includes("jetons"));
    return true;
  });

  return (
    <div className="bg-[#f6f3eb] text-[#0f1115] font-editorial-mono antialiased selection:bg-[#0052ff] selection:text-white min-h-screen flex flex-col justify-between">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-6 lg:px-12 py-16 w-full">
        {/* Breadcrumb */}
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
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-xs font-editorial-mono uppercase tracking-widest text-[#d94726] font-bold block mb-2">
              {isFr ? "Catalogue & Réalisations" : "Archive & Case Studies"}
            </span>
            <h1 className="font-editorial-serif text-5xl sm:text-7xl font-bold tracking-tight text-black mb-3">
              {isFr ? "Projets sélectionnés." : "Selected Work."}
            </h1>
            <p className="font-editorial-serif italic text-2xl text-black/80 max-w-2xl leading-relaxed">
              {isFr
                ? "Plateformes d'ingénierie complètes, médias interactifs et systèmes de design éditoriaux."
                : "Full-scale engineering platforms, interactive media, and tactile editorial design systems."}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => setFilter(c.key)}
                className={`text-xs px-4 py-2 rounded-full border transition-all cursor-pointer font-bold ${
                  filter === c.key
                    ? "bg-black text-white border-black shadow-xs"
                    : "bg-white/70 border-black/15 text-black/70 hover:border-black/40 hover:text-black"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Project Grid */}
        <div className="space-y-12">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white/80 border border-black/15 rounded-2xl p-6 sm:p-10 shadow-xs hover:border-black/30 transition-all"
            >
              {/* Card Top Metadata */}
              <div className="flex flex-wrap justify-between items-center pb-6 mb-6 border-b border-black/10 text-xs font-editorial-mono gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded bg-stone-900 text-white flex items-center justify-center font-bold text-xs">
                    {project.id}
                  </span>
                  <span className="text-[#d94726] font-bold uppercase tracking-wider">
                    {project.category}
                  </span>
                  {project.clientType && (
                    <>
                      <span className="text-black/30">/</span>
                      <span className="text-black/60 hidden sm:inline">
                        {project.clientType}
                      </span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {project.link ? (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#0052ff] hover:bg-blue-600 text-white px-3 py-1 rounded text-[11px] font-bold uppercase flex items-center gap-1.5 transition-colors"
                    >
                      <span>{project.status}</span>
                      <span>↗</span>
                    </a>
                  ) : (
                    <span className="bg-stone-800 text-white px-3 py-1 rounded text-[11px] font-bold uppercase">
                      {project.status}
                    </span>
                  )}
                  {project.year && (
                    <span className="text-black/50 border border-black/15 px-2 py-1 rounded text-[11px]">
                      {project.year}
                    </span>
                  )}
                </div>
              </div>

              {/* Main Info */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-8 space-y-4">
                  <h2 className="font-editorial-serif text-3xl sm:text-4xl font-bold text-black">
                    {project.fullTitle}
                  </h2>
                  <p className="font-editorial-mono text-xs sm:text-sm text-black/80 leading-relaxed max-w-2xl">
                    {project.description}
                  </p>

                  {/* Quote block */}
                  <div className="bg-[#f6f3eb] p-4 rounded-xl border border-black/10 flex items-start gap-3">
                    <span className="text-2xl text-[#d94726] font-editorial-serif leading-none">“</span>
                    <p className="font-editorial-serif italic text-base sm:text-lg text-black/90">
                      {project.quotePrefix}
                      <strong className="text-[#d94726] font-editorial-serif not-italic">
                        {project.quoteStrong}
                      </strong>
                      {project.quoteMiddle}
                      <em className="text-[#d94726]">{project.quoteEm}</em>
                      {project.quoteSuffix}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="pt-2 flex flex-wrap gap-2 text-xs font-editorial-mono">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-white border border-black/15 px-3 py-1 rounded text-black/80"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right Specs & Action */}
                <div className="lg:col-span-4 bg-[#f6f3eb] rounded-xl p-5 border border-black/10 space-y-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-black/50 block mb-1">
                      {isFr ? "Architecture & Rôle" : "Architecture & Role"}
                    </span>
                    <p className="font-bold text-xs text-black">
                      {project.bannerSubtitle}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-black/50 block mb-1">
                      {isFr ? "Pile technique" : "Tech Stack"}
                    </span>
                    <p className="text-xs text-black/75">
                      {project.techHeader}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-black/50 block mb-1">
                      {isFr ? "Déploiement" : "Deployment"}
                    </span>
                    <p className="text-xs font-mono font-bold text-black">
                      {project.deployLabel}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-black/10">
                    {project.link ? (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-[#0052ff] hover:bg-blue-600 text-white font-editorial-mono uppercase text-xs tracking-wider py-3 rounded font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                      >
                        <span>{project.ctaLabel}</span>
                        <span>↗</span>
                      </a>
                    ) : (
                      <Link
                        href="/talk"
                        className="w-full border-2 border-black hover:bg-black hover:text-white text-black font-editorial-mono uppercase text-xs tracking-wider py-2.5 rounded font-bold transition-all flex items-center justify-center gap-1 text-center"
                      >
                        {isFr ? "Discuter de ce type de projet" : "Inquire Similar Architecture"}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Card */}
        <div className="mt-16 bg-[#0f1115] text-white rounded-2xl p-8 sm:p-12 text-center space-y-4">
          <h3 className="font-editorial-serif text-3xl sm:text-5xl font-bold">
            {isFr ? "Prêt à lancer votre prochain produit ?" : "Ready to launch your next flagship?"}
          </h3>
          <p className="font-editorial-mono text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto">
            {isFr
              ? "Disponible pour des mandats de direction technique, d'architecture full-stack ou de prototypes créatifs."
              : "Available for principal engineering contracts, full-stack MVP architecture, or high-impact creative prototypes."}
          </p>
          <div className="pt-4">
            <Link
              href="/talk"
              className="inline-flex items-center gap-2 bg-[#0052ff] hover:bg-blue-600 text-white font-editorial-mono uppercase text-xs tracking-wider px-8 py-4 rounded font-bold transition-all shadow-md active:scale-95"
            >
              <span>{isFr ? "Démarrer une collaboration" : "Start a Conversation"}</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
