"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

// CRT boot / route-transition screen. Shows on first load and again
// every time the pathname changes (client-side navigation).
export default function BootScreen() {
  const pathname = usePathname();
  const [bootProgress, setBootProgress] = useState(0);
  const [bootFading, setBootFading] = useState(false);
  const [bootDone, setBootDone] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);

  // Reset the sequence when the route changes (render-time state adjust,
  // the React-endorsed alternative to setState-in-effect)
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setBootProgress(0);
    setBootFading(false);
    setBootDone(false);
  }

  useEffect(() => {
    // Fake progress that eases toward 95% while the route renders
    const progressTimer = setInterval(() => {
      setBootProgress((p) => (p >= 95 ? p : p + Math.random() * 9 + 2));
    }, 90);

    const pageReady =
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise((resolve) =>
            window.addEventListener("load", resolve, { once: true })
          );
    // Minimum on-screen time so the sequence reads on fast navigations
    const minDisplay = new Promise((r) => setTimeout(r, 1000));

    Promise.all([pageReady, minDisplay]).then(() => {
      clearInterval(progressTimer);
      setBootProgress(100);
      setBootFading(true);
      setTimeout(() => setBootDone(true), 700);
    });

    return () => clearInterval(progressTimer);
  }, [pathname]);

  if (bootDone) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-zinc-950 flex items-center justify-center p-4 sm:p-8 transition-opacity duration-700 ${
        bootFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      aria-hidden={bootFading}
      role="status"
      aria-label="Loading page"
    >
      {/* Scanlines + vignette, same treatment as the CRT monitor */}
      <div className="absolute inset-0 crt-scanlines pointer-events-none opacity-70" />
      <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_35%,rgba(0,0,0,0.9)_100%)] pointer-events-none" />

      {/* Fake CRT screen bezel */}
      <div className="relative w-full max-w-md bg-zinc-900 border-4 border-stone-700 rounded-2xl p-5 sm:p-8 shadow-[0_0_60px_rgba(52,211,153,0.15)]">
        <div className="flex justify-between items-center mb-5 sm:mb-7 text-[9px] sm:text-[10px] font-editorial-mono tracking-widest text-zinc-500 uppercase">
          <span>XB-OS · KERNEL 2.6</span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
            <span>ROUTE {pathname.toUpperCase()}</span>
          </span>
        </div>

        <div className="font-editorial-mono text-emerald-400 text-xs sm:text-sm leading-relaxed space-y-1.5 drop-shadow-[0_0_6px_rgba(52,211,153,0.6)]">
          <p>&gt; mounting {pathname} ... <span className="text-emerald-600">OK</span></p>
          <p>&gt; rendering view_tree ... <span className="text-emerald-600">OK</span></p>
          <p>&gt; calibrating crt_phosphor ... <span className="text-emerald-600">OK</span></p>
          <p className="pt-2">
            &gt; progress: <span className="text-white font-bold">{Math.floor(bootProgress)}%</span>
            <span className="inline-block w-2 h-3.5 bg-emerald-400 ml-1 animate-pulse align-middle" />
          </p>
        </div>

        {/* Progress bar */}
        <div className="mt-5 h-2.5 rounded-sm bg-zinc-800 border border-zinc-700 overflow-hidden">
          <div
            className="h-full bg-emerald-400 transition-all duration-150 shadow-[0_0_10px_rgba(52,211,153,0.8)]"
            style={{ width: `${bootProgress}%` }}
          />
        </div>

        <div className="mt-4 flex justify-between text-[8px] sm:text-[9px] font-editorial-mono text-zinc-600 tracking-widest uppercase">
          <span>SONY TRINITRON 1989</span>
          <span>PLEASE STAND BY</span>
        </div>
      </div>
    </div>
  );
}
