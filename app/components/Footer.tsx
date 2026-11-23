"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";
import LanguageWidget from "./LanguageWidget";

export default function Footer() {
  const { t } = useLanguage();
  const [localTime, setLocalTime] = useState("14:42:18 EST");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "America/Montreal",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };
      setLocalTime(`${now.toLocaleTimeString("en-US", options)} EST`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="bg-[#f6f3eb] py-14 text-black border-t border-black/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-12">
          {/* Col 1: Wordmark & Bio */}
          <div className="md:col-span-5 space-y-3">
            <Link href="/" className="inline-block font-editorial-serif italic text-2xl font-bold hover:text-[#d94726] transition-colors">
              xavier boudreault.
            </Link>
            <p className="font-editorial-mono text-xs text-black/70 max-w-sm leading-relaxed">
              {t.footer.bio}
            </p>
            <div className="pt-2">
              <LanguageWidget />
            </div>
          </div>

          {/* Col 2: Social / Network */}
          <div className="md:col-span-4 space-y-2">
            <h4 className="font-editorial-mono text-xs uppercase tracking-widest text-black font-bold">
              {t.footer.networkTitle}
            </h4>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-editorial-mono text-black/70">
              <a
                className="hover:text-black hover:underline underline-offset-4"
                href="https://github.com/xavierrrrrrrrrrr"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              <a
                className="hover:text-black hover:underline underline-offset-4"
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                X / Twitter
              </a>
              <a
                className="hover:text-black hover:underline underline-offset-4"
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
              <a
                className="hover:text-black hover:underline underline-offset-4"
                href="https://bsky.app"
                target="_blank"
                rel="noopener noreferrer"
              >
                Bluesky
              </a>
              <a
                className="hover:text-[#0052ff] font-bold hover:underline underline-offset-4"
                href="https://rocky-pouliot.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
              >
                Aménagement R.P. ↗
              </a>
            </div>
          </div>

          {/* Col 3: Live Time & Origin */}
          <div className="md:col-span-3 space-y-2 text-left md:text-right">
            <h4 className="font-editorial-mono text-xs uppercase tracking-widest text-black font-bold">
              {t.footer.clockTitle}
            </h4>
            <p className="font-editorial-mono text-xs text-black/70">
              {t.footer.location}
              <br />
              <span className="font-bold text-black" suppressHydrationWarning>
                {localTime}
              </span>{" "}
              · UTC-5
            </p>
          </div>
        </div>

        {/* Bottom Credits & Legal */}
        <div className="border-t border-black/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] font-editorial-mono text-black/50">
          <p>{t.footer.copyright}</p>
          <p className="text-center sm:text-right">{t.footer.colophon}</p>
        </div>
      </div>
    </footer>
  );
}
