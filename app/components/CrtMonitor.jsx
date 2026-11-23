"use client";

import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function CrtMonitor() {
  const { t, language } = useLanguage();
  const [channel, setChannel] = useState(1);
  const [knobRotation, setKnobRotation] = useState(0);
  const [tuningRotation, setTuningRotation] = useState(45);
  const [isPowerOn, setIsPowerOn] = useState(true);
  const [isSwitching, setIsSwitching] = useState(false);
  const [fps, setFps] = useState(60);
  const [latency, setLatency] = useState(14);
  const [clock, setClock] = useState("");
  const [reservedSlots, setReservedSlots] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);

  const canvasRef = useRef(null);
  const danceCanvasRef = useRef(null);
  const audioRef = useRef(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const bassRef = useRef(0); // smoothed bass energy 0..1
  const jumpRef = useRef(0); // bass-hit jump impulse 0..1

  // Live clock (America/Toronto) for the CH-01 terminal readout
  useEffect(() => {
    const tick = () =>
      setClock(
        new Date().toLocaleTimeString("en-CA", {
          hour12: false,
          timeZone: "America/Toronto",
        })
      );
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Pull real booking count once so the terminal reflects live data
  useEffect(() => {
    let cancelled = false;
    fetch("/api/contact")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data.success) {
          const booked = new Set(
            data.inquiries
              .filter((i) => i.selected_day && i.selected_slot)
              .map((i) => `${i.selected_day}|${i.selected_slot}`)
          );
          setReservedSlots(booked.size);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Cycle channels when clicking the main channel knob
  const cycleChannel = () => {
    if (!isPowerOn) {
      setIsPowerOn(true);
      return;
    }
    setIsSwitching(true);
    setKnobRotation((prev) => prev + 90);
    setChannel((prev) => (prev % 4) + 1);
    setTimeout(() => {
      setIsSwitching(false);
    }, 240);
  };

  // Fine tune knob
  const tweakTuning = () => {
    setTuningRotation((prev) => (prev + 45) % 360);
    setLatency((prev) => (prev === 14 ? 12 : prev === 12 ? 16 : 14));
  };

  // Toggle CRT power
  const togglePower = () => {
    if (isPowerOn && audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    setIsPowerOn((prev) => !prev);
  };

  // Play / pause "Baiana" by Barbatuques (hosted on Uploadthing).
  // The audio is routed through an AnalyserNode so the dancers can
  // move to the actual bass.
  const toggleMusic = () => {
    if (!audioRef.current) {
      const audio = new Audio(
        "https://11laitvi19.ufs.sh/f/nduEi13bO19R5gpbPmjWN30HAkLVtl6h7pJEcafqFCIDmiZr"
      );
      audio.crossOrigin = "anonymous"; // required for AnalyserNode taps
      audio.loop = true;
      audio.volume = 1;
      audio.addEventListener("error", () => setAudioError(true));
      // Reflect the real playback state — play() resolves before audio
      // actually renders, and the WAV is large enough to buffer slowly.
      audio.addEventListener("playing", () => {
        audioCtxRef.current?.resume().catch(() => {});
        setIsPlaying(true);
        setAudioError(false);
      });
      audio.addEventListener("pause", () => setIsPlaying(false));

      // Web Audio graph: element -> analyser -> speakers
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 2048;
          analyser.smoothingTimeConstant = 0.55;
          ctx.createMediaElementSource(audio).connect(analyser);
          analyser.connect(ctx.destination);
          audioCtxRef.current = ctx;
          analyserRef.current = analyser;
        }
      } catch {
        // No Web Audio — dancers fall back to the idle beat
      }
      audioRef.current = audio;
    }
    const audio = audioRef.current;
    if (isPlaying || !audio.paused) {
      audio.pause();
      setIsPlaying(false);
      return;
    }
    setAudioError(false);
    audioCtxRef.current?.resume().catch(() => {});
    audio.play().catch(() => setAudioError(true));
  };

  // Dancing stickmen overlay — runs only while music is playing.
  // Movement is driven by the real bass energy from the AnalyserNode:
  // dancers bounce higher on bass hits and swing limbs with the energy.
  useEffect(() => {
    const canvas = danceCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    // Always leave a clean screen when the music stops
    if (!isPlaying || !isPowerOn) {
      ctx.clearRect(0, 0, W, H);
      bassRef.current = 0;
      jumpRef.current = 0;
      return;
    }

    const groundY = H * 0.86;
    const dancerCount = 5;
    const colors = ["#34d399", "#34d399", "#38bdf8", "#34d399", "#fb923c"];
    const freqData = new Uint8Array(1024);

    const limb = (x1, y1, x2, y2) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    };

    const drawDancer = (cx, h, phase, color, energy, jump) => {
      const bounce =
        (Math.abs(Math.sin(phase)) * h * 0.09 + jump * h * 0.45) *
        (0.5 + energy);
      const sway = Math.sin(phase) * h * 0.07 * (0.5 + energy);
      const hipX = cx + sway;
      const hipY = groundY - h * 0.52 - bounce;
      const shoX = hipX + sway * 0.6;
      const shoY = hipY - h * 0.34;
      const headX = shoX + sway * 0.5;
      const headY = shoY - h * 0.24;

      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = Math.max(2, h * 0.055);
      ctx.lineCap = "round";
      ctx.shadowColor = color;
      ctx.shadowBlur = 6;

      // legs — alternating scissor kick, amplitude follows the bass
      const kick = Math.sin(phase) * h * 0.3 * (0.5 + energy);
      limb(hipX, hipY, hipX - h * 0.13 + kick, groundY);
      limb(hipX, hipY, hipX + h * 0.13 - kick, groundY);
      // torso
      limb(hipX, hipY, shoX, shoY);
      // arms — opposite swing to legs
      const arm = Math.sin(phase + Math.PI) * h * 0.26 * (0.5 + energy);
      limb(shoX, shoY, shoX - h * 0.2 + arm, shoY - h * 0.2);
      limb(shoX, shoY, shoX + h * 0.2 - arm, shoY - h * 0.2);
      // head
      ctx.beginPath();
      ctx.arc(headX, headY, h * 0.11, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    let rafId;
    let prevBass = 0;
    const render = (now) => {
      ctx.clearRect(0, 0, W, H);

      // Sample the real sub-bass band (~20–95 Hz ≈ bins 1–4 at 48 kHz)
      let bass = bassRef.current;
      const analyser = analyserRef.current;
      if (analyser) {
        analyser.getByteFrequencyData(freqData);
        let sum = 0;
        for (let i = 1; i <= 4; i++) sum += freqData[i];
        const raw = sum / (4 * 255);
        bass = bassRef.current * 0.75 + raw * 0.25;
        // Bass hit detection: sharp rise in the low end triggers a jump
        if (raw > 0.28 && raw > prevBass * 1.15) {
          jumpRef.current = 1;
        }
        prevBass = raw;
      }
      bassRef.current = bass;
      jumpRef.current *= 0.92; // jump impulse decays a bit slower
      const energy = Math.min(1, bass * 1.6);
      const jump = jumpRef.current;

      // dance-floor strip
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      ctx.fillRect(0, groundY - H * 0.05, W, H * 0.2);
      ctx.strokeStyle = "rgba(52,211,153,0.35)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(W, groundY);
      ctx.stroke();

      // ~132 BPM idle groove; dancers kick harder when the bass hits
      const beat = (now / 1000) * Math.PI * 2 * 2.2;
      const h = H * 0.34;
      for (let i = 0; i < dancerCount; i++) {
        const cx = (W / (dancerCount + 1)) * (i + 1);
        drawDancer(cx, h, beat + i * 0.9, colors[i % colors.length], energy, jump);
      }
      rafId = requestAnimationFrame(render);
    };
    rafId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafId);
  }, [isPlaying, isPowerOn]);

  // Telemetry fluctuation simulator
  useEffect(() => {
    const interval = setInterval(() => {
      setFps(Math.round(59 + Math.random() * 2));
    }, 120);
    return () => clearInterval(interval);
  }, []);

  // Canvas animations for CH-02 (Oscilloscope), CH-03 (Radar), CH-04 (3D Cube)
  useEffect(() => {
    if (!isPowerOn || isSwitching) return;

    let animId;
    let tCounter = 0;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      // CH-02: Audio Oscilloscope
      if (channel === 2) {
        ctx.fillStyle = "rgba(15, 23, 20, 0.28)";
        ctx.fillRect(0, 0, width, height);

        // Center line
        ctx.strokeStyle = "rgba(52, 211, 153, 0.15)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();

        // Waveform
        ctx.strokeStyle = "#34d399";
        ctx.lineWidth = 2;
        ctx.shadowColor = "#34d399";
        ctx.shadowBlur = 8;
        ctx.beginPath();

        const freq1 = 0.04;
        const freq2 = 0.08;
        const amp1 = height * 0.25;
        const amp2 = height * 0.12;

        for (let x = 0; x < width; x++) {
          const y =
            height / 2 +
            Math.sin(x * freq1 + tCounter * 0.08) * amp1 +
            Math.sin(x * freq2 - tCounter * 0.12) * amp2;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // CH-03: Aménagement R.P. Radar & Survey Telemetry
      else if (channel === 3) {
        ctx.fillStyle = "rgba(10, 20, 15, 0.25)";
        ctx.fillRect(0, 0, width, height);

        const cx = width / 2;
        const cy = height / 2;
        const maxR = Math.min(width, height) * 0.44;

        // Concentric radar circles
        ctx.strokeStyle = "rgba(52, 211, 153, 0.25)";
        ctx.lineWidth = 1;
        for (let r = maxR * 0.33; r <= maxR; r += maxR * 0.33) {
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Crosshairs
        ctx.beginPath();
        ctx.moveTo(cx - maxR, cy);
        ctx.lineTo(cx + maxR, cy);
        ctx.moveTo(cx, cy - maxR);
        ctx.lineTo(cx, cy + maxR);
        ctx.stroke();

        // Rotating radar sweep
        const sweepRad = (tCounter * 0.05) % (Math.PI * 2);
        ctx.fillStyle = "rgba(52, 211, 153, 0.12)";
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, maxR, sweepRad - 0.4, sweepRad);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = "#34d399";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(sweepRad) * maxR, cy + Math.sin(sweepRad) * maxR);
        ctx.stroke();

        // Target Blip: Petite-Nation excavation site
        const blipX = cx + maxR * 0.52;
        const blipY = cy - maxR * 0.35;
        ctx.fillStyle = "#34d399";
        ctx.shadowColor = "#34d399";
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(blipX, blipY, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // CH-04: 3D Wireframe Cube
      else if (channel === 4) {
        ctx.fillStyle = "rgba(12, 16, 20, 0.25)";
        ctx.fillRect(0, 0, width, height);

        const cx = width / 2;
        const cy = height / 2;
        const size = Math.min(width, height) * 0.28;

        const vertices = [
          [-1, -1, -1],
          [1, -1, -1],
          [1, 1, -1],
          [-1, 1, -1],
          [-1, -1, 1],
          [1, -1, 1],
          [1, 1, 1],
          [-1, 1, 1],
        ];

        const edges = [
          [0, 1],
          [1, 2],
          [2, 3],
          [3, 0],
          [4, 5],
          [5, 6],
          [6, 7],
          [7, 4],
          [0, 4],
          [1, 5],
          [2, 6],
          [3, 7],
        ];

        const rotX = tCounter * 0.03;
        const rotY = tCounter * 0.04;

        const projected = vertices.map(([x, y, z]) => {
          // Rotate around Y
          const x1 = x * Math.cos(rotY) + z * Math.sin(rotY);
          const z1 = -x * Math.sin(rotY) + z * Math.cos(rotY);

          // Rotate around X
          const y2 = y * Math.cos(rotX) - z1 * Math.sin(rotX);
          const z2 = y * Math.sin(rotX) + z1 * Math.cos(rotX);

          // Perspective projection
          const fov = 3.2;
          const scale = fov / (fov + z2);
          return [cx + x1 * size * scale, cy + y2 * size * scale];
        });

        ctx.strokeStyle = "#34d399";
        ctx.lineWidth = 1.8;
        ctx.shadowColor = "#34d399";
        ctx.shadowBlur = 6;
        ctx.beginPath();

        edges.forEach(([i, j]) => {
          ctx.moveTo(projected[i][0], projected[i][1]);
          ctx.lineTo(projected[j][0], projected[j][1]);
        });
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      tCounter++;
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [channel, isPowerOn, isSwitching]);

  return (
    <div className="relative w-full max-w-sm sm:max-w-md mx-auto bg-stone-300 border-3 sm:border-4 border-stone-800 rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-[6px_8px_0px_0px_rgba(0,0,0,0.85)] sm:shadow-[12px_16px_0px_0px_rgba(0,0,0,0.85)] flex flex-col select-none">
      {/* Top vent grills / Brand stamp */}
      <div className="flex justify-between items-center pb-2.5 mb-2.5 border-b-2 border-stone-400">
        <div className="flex space-x-1 sm:space-x-1.5">
          <span className="w-5 sm:w-8 h-1 sm:h-1.5 bg-stone-500 rounded-xs" />
          <span className="w-5 sm:w-8 h-1 sm:h-1.5 bg-stone-500 rounded-xs" />
          <span className="w-5 sm:w-8 h-1 sm:h-1.5 bg-stone-500 rounded-xs" />
        </div>
        <span className="font-editorial-mono text-[9px] sm:text-[10px] tracking-widest text-stone-700 font-bold uppercase truncate max-w-[160px] sm:max-w-[200px]">
          {t.tv.title}
        </span>
        <div
          className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-colors shrink-0 ${
            isPowerOn ? "bg-red-600 animate-ping" : "bg-stone-500"
          }`}
          title={isPowerOn ? "CRT Live" : "Standby"}
        />
      </div>

      <div className="grid grid-cols-12 gap-2 sm:gap-3 items-stretch">
        {/* CRT Convex Tube Screen */}
        <div className="col-span-8 sm:col-span-9 relative bg-zinc-950 rounded-lg sm:rounded-xl overflow-hidden border-3 sm:border-4 border-stone-900 aspect-[4/3] flex flex-col justify-center items-center shadow-inner">
          {/* Scanline overlay */}
          <div className="absolute inset-0 crt-scanlines pointer-events-none z-20 opacity-70" />

          {/* Vignette curvature */}
          <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_40%,rgba(0,0,0,0.85)_100%)] pointer-events-none z-20" />

          {/* Dancing stickmen overlay — visible only while music plays */}
          <canvas
            ref={danceCanvasRef}
            width={560}
            height={420}
            className="absolute inset-0 z-[5] w-full h-full pointer-events-none"
            aria-hidden="true"
          />

          {/* Screen Power Off / Static Glitch */}
          {!isPowerOn ? (
            <div className="z-10 flex flex-col items-center justify-center text-center p-3">
              <div className="w-2 h-0.5 bg-white shadow-[0_0_8px_white] animate-pulse" />
              <span className="mt-2 text-[8px] sm:text-[10px] font-editorial-mono text-zinc-600 tracking-widest uppercase">
                {language === "fr" ? "[ TÉLÉVISEUR ÉTEINT ]" : "[ CRT POWER OFF ]"}
              </span>
            </div>
          ) : isSwitching ? (
            <div className="z-10 absolute inset-0 bg-zinc-800 flex items-center justify-center">
              <div className="text-[8px] sm:text-[10px] font-editorial-mono text-emerald-400 tracking-widest animate-pulse">
                &gt;&gt; TUNING CH-0{channel} &lt;&lt;
              </div>
            </div>
          ) : (
            <>
              {/* Channel 1: Terminal text */}
              {channel === 1 && (
                <div className="z-10 text-center p-2 sm:p-4">
                  <span className="font-editorial-serif italic text-lg sm:text-2xl md:text-3xl text-emerald-400 font-bold tracking-wider drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]">
                    {t.tv.ch1Title}
                  </span>
                  <p className="font-editorial-mono text-[8px] sm:text-[11px] text-emerald-500/90 mt-1 sm:mt-2 leading-relaxed">
                    {t.tv.ch1Sub1}
                    <br />
                    &gt; mtl: {clock || "--:--:--"} ET · latency: {latency}ms · {fps}fps
                    <br />
                    &gt; reserved slots:{" "}
                    {reservedSlots === null ? "…" : reservedSlots}
                  </p>
                  <div className="mt-1 sm:mt-2 text-[7px] sm:text-[9px] font-editorial-mono text-emerald-600/80">
                    &gt; node: mtl-edge-01 [ACTIVE]
                  </div>
                </div>
              )}

              {/* Channels 2, 3, 4: Canvas rendering with HUD info */}
              {(channel === 2 || channel === 3 || channel === 4) && (
                <div className="absolute inset-0 flex flex-col justify-between p-1.5 sm:p-3 z-10 pointer-events-none">
                  <div className="flex justify-between items-center text-[7px] sm:text-[9px] font-editorial-mono text-emerald-400/90 drop-shadow-[0_0_4px_rgba(52,211,153,0.6)]">
                    <span className="font-bold tracking-widest uppercase truncate max-w-[100px] sm:max-w-[130px]">
                      {channel === 2 && t.tv.ch2Title}
                      {channel === 3 && t.tv.ch3Title}
                      {channel === 4 && t.tv.ch4Title}
                    </span>
                    <span className="bg-emerald-950/80 px-1 py-0.5 rounded border border-emerald-500/30 shrink-0">
                      CH-0{channel}
                    </span>
                  </div>

                  <canvas
                    ref={canvasRef}
                    width={280}
                    height={160}
                    className="w-full h-full object-contain my-auto"
                  />

                  <div className="flex justify-between items-center text-[7px] sm:text-[9px] font-editorial-mono text-emerald-500/80">
                    <span className="truncate max-w-[100px] sm:max-w-[130px]">
                      {channel === 2 && "440.0Hz · STEREO"}
                      {channel === 3 && "Petite-Nation · 200 OK"}
                      {channel === 4 && "GLSL · 3D MAT"}
                    </span>
                    <span className="shrink-0">{fps} FPS</span>
                  </div>
                </div>
              )}

              {/* Bottom Power / Channel Bar */}
              <div className="absolute bottom-1 text-[7px] sm:text-[9px] font-editorial-mono text-zinc-500 tracking-tighter z-10 px-1 text-center truncate max-w-full">
                {audioError
                  ? "♪ AUDIO STREAM UNAVAILABLE"
                  : isPlaying
                    ? "♪ NOW PLAYING: BAIANA — BARBATUQUES"
                    : channel === 3
                      ? "HTTP://ROCKY-POULIOT.VERCEL.APP"
                      : t.tv.signalOk}
              </div>
            </>
          )}
        </div>

        {/* CRT Knobs & Speaker Controls Panel */}
        <div className="col-span-4 sm:col-span-3 bg-stone-400/80 rounded-lg p-1.5 sm:p-2 border border-stone-500 flex flex-col justify-between items-center">
          {/* Speaker grill */}
          <div className="w-full grid grid-cols-4 gap-0.5 sm:gap-1 py-0.5 sm:py-1">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="h-0.5 sm:h-1 bg-stone-600 rounded-xs" />
            ))}
          </div>

          {/* Music button: plays "Baiana" — Barbatuques */}
          <button
            type="button"
            onClick={toggleMusic}
            disabled={!isPowerOn}
            aria-label={isPlaying ? "Pause Baiana" : "Play Baiana by Barbatuques"}
            aria-pressed={isPlaying}
            title={
              !isPowerOn
                ? "Turn the TV on first"
                : isPlaying
                  ? "Pause Baiana"
                  : "Play Baiana — Barbatuques"
            }
            className={`w-full flex items-center justify-center gap-1 rounded-md border py-1 sm:py-1.5 text-[8px] sm:text-[9px] font-editorial-mono font-bold tracking-widest uppercase transition-all ${
              !isPowerOn
                ? "bg-stone-500/50 border-stone-500 text-stone-300 cursor-not-allowed"
                : isPlaying
                  ? "bg-emerald-900 border-emerald-500 text-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.4)] cursor-pointer"
                  : "bg-stone-800 border-stone-600 text-stone-200 hover:border-emerald-400 cursor-pointer"
            }`}
          >
            <span className="text-[10px] sm:text-xs leading-none">♪</span>
            <span className="truncate">{isPlaying ? "❚❚" : "BAIANA"}</span>
            {isPlaying && (
              <span className="flex items-end gap-px h-2.5" aria-hidden="true">
                <span className="w-0.5 bg-emerald-300 animate-pulse" style={{ height: "60%" }} />
                <span className="w-0.5 bg-emerald-300 animate-pulse" style={{ height: "100%", animationDelay: "150ms" }} />
                <span className="w-0.5 bg-emerald-300 animate-pulse" style={{ height: "40%", animationDelay: "300ms" }} />
              </span>
            )}
          </button>

          {/* Interactive Dials */}
          <div className="space-y-2 sm:space-y-3 flex flex-col items-center my-0.5 sm:my-1">
            {/* Top Dial: Channel Switcher */}
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={cycleChannel}
                aria-label="Switch TV Channel"
                title="Click to cycle channels (CH 1-4)"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-stone-800 border-2 border-stone-600 flex items-center justify-center shadow-md active:scale-95 transition-transform cursor-pointer hover:border-emerald-400"
              >
                <div
                  className="w-1 h-3 sm:h-3.5 bg-stone-300 transition-transform duration-300"
                  style={{ transform: `rotate(${knobRotation}deg)` }}
                />
              </button>
              <span className="text-[7px] sm:text-[8px] font-editorial-mono font-bold text-stone-700 tracking-widest mt-0.5 sm:mt-1 uppercase">
                CH-0{channel}
              </span>
            </div>

            {/* Bottom Dial: Fine Tuning / Latency */}
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={tweakTuning}
                aria-label="Fine Tune Frequency"
                title="Click to tweak frequency/latency"
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-stone-800 border-2 border-stone-600 flex items-center justify-center shadow-md active:scale-95 transition-transform cursor-pointer hover:border-emerald-400"
              >
                <div
                  className="w-0.5 sm:w-1 h-2.5 sm:h-3 bg-stone-300 transition-transform duration-300"
                  style={{ transform: `rotate(${tuningRotation}deg)` }}
                />
              </button>
              <span className="text-[7px] sm:text-[8px] font-editorial-mono text-stone-700 tracking-widest mt-0.5 uppercase">
                TUNE
              </span>
            </div>
          </div>

          {/* Interactive Power Switch */}
          <button
            type="button"
            onClick={togglePower}
            aria-label="Toggle TV Power"
            title="Click to turn TV ON / OFF"
            className={`w-6 sm:w-7 h-4 sm:h-5 rounded-sm border flex items-center justify-center shadow-inner cursor-pointer transition-colors ${
              isPowerOn
                ? "bg-stone-800 border-stone-600"
                : "bg-stone-900 border-red-900"
            }`}
          >
            <span
              className={`w-2 sm:w-2.5 h-1 rounded-xs transition-colors ${
                isPowerOn ? "bg-red-500 shadow-[0_0_4px_red]" : "bg-stone-600"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Model & Instruction footer label */}
      <div className="mt-2.5 sm:mt-3 pt-2 border-t border-stone-400/60 flex justify-between items-center text-[7px] sm:text-[8px] font-editorial-mono text-stone-600">
        <span className="font-bold tracking-wider">{t.tv.model}</span>
        <span className="text-emerald-700 font-bold">{t.tv.vsync}</span>
        <span className="hidden sm:inline uppercase text-stone-500">
          {t.tv.knobHint}
        </span>
      </div>
    </div>
  );
}
