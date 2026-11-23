"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "../context/LanguageContext";
import LanguageWidget from "./LanguageWidget";

export default function Header() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHome = pathname === "/";

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-[#f6f3eb]/95 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-16 sm:h-20 flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <Link className="flex items-center gap-1.5 sm:gap-2.5 group shrink min-w-0" href="/">
          <span className="font-editorial-serif italic text-base sm:text-2xl lg:text-3xl font-bold tracking-tight group-hover:text-[#d94726] transition-colors truncate">
            xavier boudreault
          </span>
          <span className="text-[10px] sm:text-xs bg-black text-white px-1.5 py-0.5 rounded font-editorial-mono font-medium tracking-wide shrink-0">
            .dev
          </span>
        </Link>

        {/* Desktop Navigation Links (Large Screens) */}
        <nav className="hidden lg:flex items-center space-x-7 text-xs font-editorial-mono tracking-wider uppercase shrink-0">
          <Link
            className={`transition-colors hover:text-black hover:underline underline-offset-8 decoration-1 decoration-[#d94726] ${
              pathname === "/work" ? "text-[#d94726] font-bold" : "text-black/80"
            }`}
            href={isHome ? "#work" : "/work"}
          >
            {t.nav.work}
          </Link>
          <Link
            className={`transition-colors hover:text-black hover:underline underline-offset-8 decoration-1 decoration-[#d94726] ${
              pathname === "/capabilities"
                ? "text-[#d94726] font-bold"
                : "text-black/80"
            }`}
            href={isHome ? "#matrix" : "/capabilities"}
          >
            {t.nav.capabilities}
          </Link>
          <Link
            className={`transition-colors hover:text-black hover:underline underline-offset-8 decoration-1 decoration-[#d94726] ${
              pathname === "/experiments"
                ? "text-[#d94726] font-bold"
                : "text-black/80"
            }`}
            href={isHome ? "#experiments" : "/experiments"}
          >
            {t.nav.experiments}
          </Link>
          <Link
            className={`transition-colors hover:text-black hover:underline underline-offset-8 decoration-1 decoration-[#d94726] ${
              pathname === "/talk" ? "text-[#d94726] font-bold" : "text-black/80"
            }`}
            href="/talk"
          >
            {t.nav.contact}
          </Link>
        </nav>

        {/* Right Actions: Language Widget, Let's Talk CTA, GitHub Icon, Mobile Toggle */}
        <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
          <LanguageWidget />

          <Link
            className="hidden sm:inline-flex bg-[#0052ff] hover:bg-blue-600 text-white font-editorial-mono uppercase text-xs tracking-wider px-3.5 sm:px-5 py-2 sm:py-2.5 rounded font-medium shadow-xs transition-all transform active:scale-95 items-center gap-2"
            href="/talk"
          >
            <span>{t.nav.talk}</span>
            <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          </Link>

          <a
            aria-label="GitHub Profile"
            className="w-8 h-8 sm:w-9 sm:h-9 border border-black/15 hover:border-black rounded flex items-center justify-center transition-colors text-black"
            href="https://github.com/xavierrrrrrrrrrr"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>

          {/* Mobile & Tablet hamburger menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-8 h-8 sm:w-9 sm:h-9 border border-black/15 hover:border-black rounded flex items-center justify-center transition-colors text-black cursor-pointer"
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile & Tablet dropdown menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-black/10 bg-[#f6f3eb] px-4 sm:px-6 py-4 space-y-2 font-editorial-mono text-xs uppercase tracking-wider animate-fadeIn">
          <Link
            className={`block py-3 px-3.5 rounded-lg transition-colors ${
              pathname === "/work" ? "bg-black/5 text-[#d94726] font-bold" : "text-black/80 hover:bg-black/5"
            }`}
            href="/work"
            onClick={() => setMobileMenuOpen(false)}
          >
            {t.nav.work}
          </Link>
          <Link
            className={`block py-3 px-3.5 rounded-lg transition-colors ${
              pathname === "/capabilities" ? "bg-black/5 text-[#d94726] font-bold" : "text-black/80 hover:bg-black/5"
            }`}
            href="/capabilities"
            onClick={() => setMobileMenuOpen(false)}
          >
            {t.nav.capabilities}
          </Link>
          <Link
            className={`block py-3 px-3.5 rounded-lg transition-colors ${
              pathname === "/experiments" ? "bg-black/5 text-[#d94726] font-bold" : "text-black/80 hover:bg-black/5"
            }`}
            href="/experiments"
            onClick={() => setMobileMenuOpen(false)}
          >
            {t.nav.experiments}
          </Link>
          <Link
            className="block py-3.5 px-3.5 rounded-lg bg-[#0052ff] text-white font-bold text-center mt-3 shadow-xs"
            href="/talk"
            onClick={() => setMobileMenuOpen(false)}
          >
            {t.nav.talk} →
          </Link>
        </div>
      )}
    </header>
  );
}
