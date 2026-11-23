"use client";

import React from "react";
import { useLanguage } from "../context/LanguageContext";

export default function LanguageWidget({ className = "" }: { className?: string }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className={`inline-flex items-center rounded-md border border-black/15 bg-black/5 p-0.5 text-xs font-editorial-mono select-none ${className}`}
      role="group"
      aria-label="Language Selector"
    >
      <button
        type="button"
        onClick={() => setLanguage("en")}
        aria-pressed={language === "en"}
        className={`px-2.5 py-1 rounded transition-all font-bold tracking-wider ${
          language === "en"
            ? "bg-black text-white shadow-xs"
            : "text-black/60 hover:text-black"
        }`}
      >
        EN
      </button>
      <span className="text-black/25 px-0.5">/</span>
      <button
        type="button"
        onClick={() => setLanguage("fr")}
        aria-pressed={language === "fr"}
        className={`px-2.5 py-1 rounded transition-all font-bold tracking-wider ${
          language === "fr"
            ? "bg-black text-white shadow-xs"
            : "text-black/60 hover:text-black"
        }`}
      >
        FR
      </button>
    </div>
  );
}
