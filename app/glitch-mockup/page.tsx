"use client";

import { useEffect, useRef, useState } from "react";

// ═══════════════════════════════════════════════════════════════
// RESEARCH NOTES — glitch techniques (summary)
// ═══════════════════════════════════════════════════════════════
// 1. Text scramble (Matt Boldt's "scramble-text") — letters cycle through
//    random chars, settle sequentially. Classic "hacker" reveal.
// 2. RGB slice (anime-glitch, cssfx) — layered text with red+cyan offsets,
//    randomly clipped horizontal slices. Gives VHS/broadcast look.
// 3. SVG displacement (feTurbulence + feDisplacementMap) — organic warping,
//    analog/liquid feel. CSS-only, GPU-accelerated.
// 4. Neon flicker — realistic broken-neon effect via text-shadow pulses with
//    irregular keyframes. Strong atmospheric feel.
// 5. Character corruption — per-letter scale/skew/translate, random timing.
//    Most chaotic, "signal lost" vibe.
//
// Current AeroMat hero uses #2 + stroke variant heavily — we can upgrade
// to something more refined or combine techniques.
// ═══════════════════════════════════════════════════════════════

const WORD = "ŚCIANA";
const ALT = "KAMERA";

// ─────────────────────────────────────────────────────────────
// V1: Text scramble with settle
// ─────────────────────────────────────────────────────────────
function Scramble({ text, delay = 0, trigger }: { text: string; delay?: number; trigger: number }) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%&*1234567890";
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const startTimeout = setTimeout(() => {
      const targetChars = [...text];
      const currentChars = targetChars.map(() => "_");
      setDisplay(currentChars.join(""));

      targetChars.forEach((target, i) => {
        let iterations = 0;
        const max = 8 + i * 2;
        const interval = setInterval(() => {
          currentChars[i] = iterations >= max ? target : chars[Math.floor(Math.random() * chars.length)];
          setDisplay(currentChars.join(""));
          iterations++;
          if (iterations > max) clearInterval(interval);
        }, 50);
      });
    }, delay);
    timeouts.push(startTimeout);

    return () => timeouts.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger, text, delay]);

  return <span className="font-[family-name:var(--font-anton)] text-7xl tracking-tight text-white">{display}</span>;
}

function VariantScramble() {
  const [trigger, setTrigger] = useState(0);
  return (
    <div className="relative h-48 bg-black rounded-xl overflow-hidden flex items-center justify-center">
      <Scramble text={WORD} trigger={trigger} />
      <button
        onClick={() => setTrigger((t) => t + 1)}
        className="absolute top-3 right-3 px-3 py-1 text-xs rounded bg-[#ff7302] text-black font-semibold hover:bg-[#e06600]"
      >
        ▶ Replay
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// V2: RGB slice glitch (layered + clip-path)
// ─────────────────────────────────────────────────────────────
function VariantRGBSlice() {
  return (
    <div className="relative h-48 bg-black rounded-xl overflow-hidden flex items-center justify-center">
      <div className="relative font-[family-name:var(--font-anton)] text-7xl tracking-tight text-white rgb-slice-root">
        <span className="rgb-base">{WORD}</span>
        <span className="rgb-layer rgb-cyan" aria-hidden>{WORD}</span>
        <span className="rgb-layer rgb-magenta" aria-hidden>{WORD}</span>
      </div>

      <style jsx>{`
        .rgb-slice-root {
          position: relative;
          display: inline-block;
        }
        .rgb-base {
          position: relative;
          z-index: 3;
        }
        .rgb-layer {
          position: absolute;
          top: 0;
          left: 0;
          mix-blend-mode: screen;
          pointer-events: none;
        }
        .rgb-cyan {
          color: #0af;
          animation: rgbCyan 2.5s infinite linear;
          z-index: 1;
        }
        .rgb-magenta {
          color: #f0a;
          animation: rgbMagenta 2.5s infinite linear;
          z-index: 2;
        }

        @keyframes rgbCyan {
          0%, 100% { transform: translate(-3px, 0); clip-path: inset(0 0 0 0); }
          5% { transform: translate(-8px, 1px); clip-path: inset(20% 0 55% 0); }
          7% { transform: translate(-3px, 0); clip-path: inset(0 0 0 0); }
          40% { transform: translate(-5px, 0); }
          42% { clip-path: inset(60% 0 10% 0); transform: translate(-10px, 0); }
          44% { clip-path: inset(0 0 0 0); transform: translate(-3px, 0); }
          80% { transform: translate(-3px, 2px); clip-path: inset(40% 0 30% 0); }
          82% { transform: translate(-3px, 0); clip-path: inset(0 0 0 0); }
        }
        @keyframes rgbMagenta {
          0%, 100% { transform: translate(3px, 0); clip-path: inset(0 0 0 0); }
          5% { transform: translate(8px, -1px); clip-path: inset(40% 0 35% 0); }
          7% { transform: translate(3px, 0); clip-path: inset(0 0 0 0); }
          42% { clip-path: inset(10% 0 60% 0); transform: translate(10px, 0); }
          44% { clip-path: inset(0 0 0 0); transform: translate(3px, 0); }
          80% { transform: translate(3px, -2px); clip-path: inset(20% 0 50% 0); }
          82% { transform: translate(3px, 0); clip-path: inset(0 0 0 0); }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// V3: SVG displacement (feTurbulence + feDisplacementMap)
// ─────────────────────────────────────────────────────────────
function VariantDisplacement() {
  return (
    <div className="relative h-48 bg-black rounded-xl overflow-hidden flex items-center justify-center">
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id="glitch-warp">
            <feTurbulence type="fractalNoise" baseFrequency="0.01 0.5" numOctaves="2" seed="3">
              <animate attributeName="baseFrequency" dur="8s" values="0.01 0.5;0.03 0.8;0.01 0.5" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" scale="8" />
          </filter>
        </defs>
      </svg>
      <span
        className="font-[family-name:var(--font-anton)] text-7xl tracking-tight text-white"
        style={{ filter: "url(#glitch-warp)" }}
      >
        {WORD}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// V4: Neon flicker (irregular pulse)
// ─────────────────────────────────────────────────────────────
function VariantNeon() {
  return (
    <div className="relative h-48 bg-black rounded-xl overflow-hidden flex items-center justify-center">
      <span className="neon-text font-[family-name:var(--font-anton)] text-7xl tracking-tight">{WORD}</span>
      <style jsx>{`
        .neon-text {
          color: #fff;
          animation: neonFlicker 4s infinite;
          text-shadow:
            0 0 6px rgba(255, 255, 255, 0.9),
            0 0 14px rgba(255, 115, 2, 0.8),
            0 0 30px rgba(255, 115, 2, 0.6),
            0 0 50px rgba(255, 115, 2, 0.35);
        }
        @keyframes neonFlicker {
          0%, 18%, 22%, 25%, 53%, 57%, 100% {
            opacity: 1;
            text-shadow:
              0 0 6px rgba(255, 255, 255, 0.9),
              0 0 14px rgba(255, 115, 2, 0.8),
              0 0 30px rgba(255, 115, 2, 0.6),
              0 0 50px rgba(255, 115, 2, 0.35);
          }
          20%, 24%, 55% {
            opacity: 0.35;
            text-shadow: none;
          }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// V5: Character corruption (per-letter chaotic transforms)
// ─────────────────────────────────────────────────────────────
function VariantCharCorrupt() {
  return (
    <div className="relative h-48 bg-black rounded-xl overflow-hidden flex items-center justify-center">
      <span className="font-[family-name:var(--font-anton)] text-7xl tracking-tight text-white inline-flex">
        {[...WORD].map((c, i) => (
          <span
            key={i}
            className="corrupt-char inline-block"
            style={{
              animationDelay: `${i * 0.17}s`,
              animationDuration: `${3 + (i % 3) * 0.4}s`,
            }}
          >
            {c}
          </span>
        ))}
      </span>
      <style jsx>{`
        .corrupt-char {
          animation: charGlitch 3s infinite;
          transform-origin: center;
        }
        @keyframes charGlitch {
          0%, 90%, 100% { transform: translateY(0) skewX(0) scale(1); opacity: 1; color: white; }
          92% { transform: translateY(-4px) skewX(-8deg) scale(1.1); color: #0af; }
          94% { transform: translateY(6px) skewX(8deg) scale(0.92); color: #ffe600; }
          96% { transform: translate(3px, -2px) skewX(-4deg); color: white; }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// V6: Refined stroke (current AeroMat style, cleaned)
// ─────────────────────────────────────────────────────────────
function VariantStrokeRefined() {
  return (
    <div className="relative h-48 bg-black rounded-xl overflow-hidden flex items-center justify-center">
      <span className="stroke-refined font-[family-name:var(--font-anton)] text-7xl tracking-tight">{WORD}</span>
      <style jsx>{`
        .stroke-refined {
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.85);
          position: relative;
          animation: strokePulse 4s infinite;
        }
        .stroke-refined::before,
        .stroke-refined::after {
          content: "${WORD}";
          position: absolute;
          inset: 0;
          color: transparent;
          mix-blend-mode: screen;
          pointer-events: none;
        }
        .stroke-refined::before {
          -webkit-text-stroke: 1.5px #0af;
          animation: strokeGhost 3s infinite linear;
        }
        .stroke-refined::after {
          -webkit-text-stroke: 1.5px #ffe600;
          animation: strokeGhost 3s infinite linear reverse;
        }
        @keyframes strokePulse {
          0%, 100% { filter: drop-shadow(0 0 8px rgba(255,255,255,0.3)); }
          50% { filter: drop-shadow(0 0 20px rgba(255,115,2,0.6)); }
        }
        @keyframes strokeGhost {
          0%, 100% { transform: translate(0, 0); opacity: 0.6; }
          10% { transform: translate(-6px, 1px); opacity: 0.9; }
          12% { transform: translate(0, 0); opacity: 0.5; }
          42% { transform: translate(-3px, -1px); opacity: 0.8; }
          44% { transform: translate(0, 0); opacity: 0.6; }
          80% { transform: translate(-8px, 2px); opacity: 1; }
          82% { transform: translate(0, 0); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// PIXEL SNOW VARIANTS
// ═════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────
// V7: TV Static overlay — animated noise layer on top of text
// ─────────────────────────────────────────────────────────────
function VariantTVStatic() {
  return (
    <div className="relative h-48 bg-black rounded-xl overflow-hidden flex items-center justify-center">
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
        <defs>
          <filter id="tv-static">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch" seed="2">
              <animate attributeName="seed" dur="0.2s" values="1;4;2;7;3;8;5" repeatCount="indefinite" />
            </feTurbulence>
            <feColorMatrix values="0 0 0 0 1   0 0 0 0 1   0 0 0 0 1   0 0 0 0.45 0" />
          </filter>
        </defs>
      </svg>
      <span className="font-[family-name:var(--font-anton)] text-7xl tracking-tight text-white relative z-10">
        {WORD}
      </span>
      <div
        className="absolute inset-0 pointer-events-none z-20 mix-blend-screen"
        style={{ filter: "url(#tv-static)", background: "#000" }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// V8: Heavy noise INSIDE text — displacement + high-freq turbulence
// ─────────────────────────────────────────────────────────────
function VariantHeavyNoise() {
  return (
    <div className="relative h-48 bg-black rounded-xl overflow-hidden flex items-center justify-center">
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
        <defs>
          <filter id="text-noise">
            <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="2" seed="5">
              <animate attributeName="seed" dur="0.15s" values="2;6;1;9;3" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" scale="6" />
          </filter>
        </defs>
      </svg>
      <span
        className="font-[family-name:var(--font-anton)] text-7xl tracking-tight text-white"
        style={{ filter: "url(#text-noise)" }}
      >
        {WORD}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// V9: Flash noise burst — brief snow flashes (signal loss)
// ─────────────────────────────────────────────────────────────
function VariantFlashBurst() {
  return (
    <div className="relative h-48 bg-black rounded-xl overflow-hidden flex items-center justify-center">
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
        <defs>
          <filter id="burst-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" seed="4">
              <animate attributeName="seed" dur="0.1s" values="1;5;2;8;3" repeatCount="indefinite" />
            </feTurbulence>
            <feColorMatrix values="0 0 0 0 1   0 0 0 0 1   0 0 0 0 1   0 0 0 0.8 0" />
          </filter>
        </defs>
      </svg>
      <span className="font-[family-name:var(--font-anton)] text-7xl tracking-tight text-white relative z-10 burst-text">
        {WORD}
      </span>
      <div
        className="absolute inset-0 pointer-events-none z-20 mix-blend-screen burst-noise"
        style={{ filter: "url(#burst-noise)", background: "#000" }}
      />
      <style jsx>{`
        .burst-noise {
          animation: burstFlash 3s infinite;
        }
        .burst-text {
          animation: textJitter 3s infinite;
        }
        @keyframes burstFlash {
          0%, 100% { opacity: 0; }
          45% { opacity: 0; }
          46% { opacity: 0.7; }
          47% { opacity: 0.2; }
          48% { opacity: 0.9; }
          49% { opacity: 0; }
          85% { opacity: 0; }
          86% { opacity: 0.8; }
          87% { opacity: 0; }
        }
        @keyframes textJitter {
          0%, 44%, 50%, 84%, 88%, 100% { transform: translate(0, 0); }
          45% { transform: translate(-4px, 2px); }
          47% { transform: translate(3px, -1px); }
          86% { transform: translate(-2px, 1px); }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// V10: Reveal through noise — text emerges from static
// ─────────────────────────────────────────────────────────────
function VariantRevealFromNoise() {
  const [trigger, setTrigger] = useState(0);
  return (
    <div className="relative h-48 bg-black rounded-xl overflow-hidden flex items-center justify-center">
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
        <defs>
          <filter id="reveal-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" stitchTiles="stitch" seed="9">
              <animate attributeName="seed" dur="0.12s" values="3;7;1;9;5" repeatCount="indefinite" />
            </feTurbulence>
            <feColorMatrix values="0 0 0 0 1   0 0 0 0 1   0 0 0 0 1   0 0 0 0.9 0" />
          </filter>
        </defs>
      </svg>
      <span key={trigger} className="font-[family-name:var(--font-anton)] text-7xl tracking-tight text-white relative z-10 reveal-text">
        {WORD}
      </span>
      <div
        key={`n-${trigger}`}
        className="absolute inset-0 pointer-events-none z-20 mix-blend-screen reveal-noise"
        style={{ filter: "url(#reveal-noise)", background: "#000" }}
      />
      <button
        onClick={() => setTrigger((t) => t + 1)}
        className="absolute top-3 right-3 px-3 py-1 text-xs rounded bg-[#ff7302] text-black font-semibold hover:bg-[#e06600] z-30"
      >
        ▶ Replay
      </button>
      <style jsx>{`
        .reveal-text {
          animation: revealText 2.2s ease-out forwards;
        }
        .reveal-noise {
          animation: revealNoise 2.2s ease-out forwards;
        }
        @keyframes revealText {
          0% { opacity: 0; filter: blur(6px); }
          30% { opacity: 0.3; filter: blur(3px); }
          70% { opacity: 1; filter: blur(0); }
          100% { opacity: 1; filter: blur(0); }
        }
        @keyframes revealNoise {
          0% { opacity: 1; }
          60% { opacity: 0.6; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// V11: Scanlines + snow + text — retro CRT feel
// ─────────────────────────────────────────────────────────────
function VariantCRT() {
  return (
    <div className="relative h-48 bg-black rounded-xl overflow-hidden flex items-center justify-center">
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
        <defs>
          <filter id="crt-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7">
              <animate attributeName="seed" dur="0.25s" values="1;5;3;8;2" repeatCount="indefinite" />
            </feTurbulence>
            <feColorMatrix values="0 0 0 0 1   0 0 0 0 1   0 0 0 0 1   0 0 0 0.3 0" />
          </filter>
        </defs>
      </svg>
      <span className="font-[family-name:var(--font-anton)] text-7xl tracking-tight text-white relative z-10 crt-text">
        {WORD}
      </span>
      {/* Snow layer */}
      <div
        className="absolute inset-0 pointer-events-none z-20 mix-blend-screen"
        style={{ filter: "url(#crt-noise)", background: "#000" }}
      />
      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none z-30 scanlines" />
      <style jsx>{`
        .crt-text {
          text-shadow: 0 0 10px rgba(0, 255, 150, 0.4), 0 0 20px rgba(0, 255, 150, 0.2);
          animation: crtJitter 0.15s infinite;
        }
        .scanlines {
          background: repeating-linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0) 0px,
            rgba(0, 0, 0, 0) 2px,
            rgba(0, 0, 0, 0.35) 2px,
            rgba(0, 0, 0, 0.35) 3px
          );
          animation: scanDrift 8s linear infinite;
        }
        @keyframes crtJitter {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(0.5px, 0.3px); }
        }
        @keyframes scanDrift {
          0% { background-position: 0 0; }
          100% { background-position: 0 40px; }
        }
      `}</style>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// CHUNKY PIXEL VARIANTS — duże piksele, pixelation
// ═════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────
// V12: Chunky pixel snow — big random blocks (low freq + binarize)
// ─────────────────────────────────────────────────────────────
function VariantChunkySnow() {
  return (
    <div className="relative h-48 bg-black rounded-xl overflow-hidden flex items-center justify-center">
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
        <defs>
          <filter id="chunky-snow">
            <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="1" stitchTiles="stitch" seed="3">
              <animate attributeName="seed" dur="0.2s" values="1;4;2;7;3;8;5" repeatCount="indefinite" />
            </feTurbulence>
            {/* discrete w tableValues="0 1" = binarize: mały szum -> duże bloki */}
            <feComponentTransfer>
              <feFuncR type="discrete" tableValues="0 1" />
              <feFuncG type="discrete" tableValues="0 1" />
              <feFuncB type="discrete" tableValues="0 1" />
              <feFuncA type="discrete" tableValues="0 0.75" />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>
      <span className="font-[family-name:var(--font-anton)] text-7xl tracking-tight text-white relative z-10">
        {WORD}
      </span>
      <div
        className="absolute inset-0 pointer-events-none z-20 mix-blend-screen"
        style={{ filter: "url(#chunky-snow)", background: "#fff" }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Canvas helpers for real pixelation effects
// ─────────────────────────────────────────────────────────────
function drawTextToCanvas(
  ctx: CanvasRenderingContext2D,
  text: string,
  w: number,
  h: number,
  fontSize: number
) {
  ctx.clearRect(0, 0, w, h);
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = "#fff";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  // Anton-like bold condensed fallback — Anton may not be available in canvas context immediately
  ctx.font = `bold ${fontSize}px "Anton", "Arial Narrow", sans-serif`;
  ctx.fillText(text, w / 2, h / 2);
}

// ─────────────────────────────────────────────────────────────
// V13: Pixel dissolve — canvas, random pixels flicker off/on
// ─────────────────────────────────────────────────────────────
function VariantPixelDissolve() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cvs = ref.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;
    const w = 100,
      h = 24;
    cvs.width = w;
    cvs.height = h;

    let raf = 0;
    const render = () => {
      drawTextToCanvas(ctx, WORD, w, h, 18);
      // Randomly erase ~12% of the pixels in chunky 2x2 blocks
      const img = ctx.getImageData(0, 0, w, h);
      for (let y = 0; y < h; y += 2) {
        for (let x = 0; x < w; x += 2) {
          if (Math.random() < 0.12) {
            for (let dy = 0; dy < 2; dy++) {
              for (let dx = 0; dx < 2; dx++) {
                const idx = ((y + dy) * w + (x + dx)) * 4;
                img.data[idx + 3] = 0; // alpha 0
              }
            }
          }
        }
      }
      ctx.putImageData(img, 0, 0);
      raf = window.setTimeout(render, 140) as unknown as number;
    };
    render();
    return () => clearTimeout(raf);
  }, []);

  return (
    <div className="relative h-48 bg-black rounded-xl overflow-hidden flex items-center justify-center">
      <canvas
        ref={ref}
        style={{
          width: "500px",
          height: "120px",
          imageRendering: "pixelated",
          maxWidth: "95%",
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// V14: Edge dilate morph — SVG morphology only (distinct from 13)
// ─────────────────────────────────────────────────────────────
function VariantMosaic() {
  return (
    <div className="relative h-48 bg-black rounded-xl overflow-hidden flex items-center justify-center">
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
        <defs>
          <filter id="edge-dilate">
            <feMorphology operator="dilate" radius="2">
              <animate
                attributeName="radius"
                dur="2.8s"
                values="1;5;2;7;1"
                keyTimes="0;0.25;0.5;0.75;1"
                repeatCount="indefinite"
              />
            </feMorphology>
          </filter>
        </defs>
      </svg>
      <span
        className="font-[family-name:var(--font-anton)] text-7xl tracking-tight text-white"
        style={{ filter: "url(#edge-dilate)" }}
      >
        {WORD}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// V15: Particle shatter — canvas, pixels start scattered, converge
// ─────────────────────────────────────────────────────────────
function VariantShatter() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    const cvs = ref.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;
    const w = 140,
      h = 30;
    cvs.width = w;
    cvs.height = h;

    // Render text to temp canvas to extract target pixels
    const tmp = document.createElement("canvas");
    tmp.width = w;
    tmp.height = h;
    const tctx = tmp.getContext("2d");
    if (!tctx) return;
    drawTextToCanvas(tctx, WORD, w, h, 22);
    const data = tctx.getImageData(0, 0, w, h).data;

    type Particle = { tx: number; ty: number; x: number; y: number; vx: number; vy: number };
    const particles: Particle[] = [];
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const a = data[(y * w + x) * 4 + 3];
        if (a > 128) {
          const angle = Math.random() * Math.PI * 2;
          const dist = 40 + Math.random() * 80;
          particles.push({
            tx: x,
            ty: y,
            x: w / 2 + Math.cos(angle) * dist,
            y: h / 2 + Math.sin(angle) * dist,
            vx: 0,
            vy: 0,
          });
        }
      }
    }

    let raf = 0;
    let start = performance.now();
    const duration = 2200;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#fff";
      for (const p of particles) {
        const cx = p.x + (p.tx - p.x) * eased;
        const cy = p.y + (p.ty - p.y) * eased;
        ctx.fillRect(Math.round(cx), Math.round(cy), 1, 1);
      }
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [trigger]);

  return (
    <div className="relative h-48 bg-black rounded-xl overflow-hidden flex items-center justify-center">
      <canvas
        ref={ref}
        style={{
          width: "560px",
          height: "120px",
          imageRendering: "pixelated",
          maxWidth: "95%",
        }}
      />
      <button
        onClick={() => setTrigger((t) => t + 1)}
        className="absolute top-3 right-3 px-3 py-1 text-xs rounded bg-[#ff7302] text-black font-semibold hover:bg-[#e06600] z-30"
      >
        ▶ Replay
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// V16: 8-bit pixelate — canvas at low res + CSS scale up
// ─────────────────────────────────────────────────────────────
function VariantEightBit() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cvs = ref.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;
    const w = 80,
      h = 18;
    cvs.width = w;
    cvs.height = h;
    drawTextToCanvas(ctx, WORD, w, h, 14);
  }, []);

  return (
    <div className="relative h-48 bg-black rounded-xl overflow-hidden flex items-center justify-center">
      <canvas
        ref={ref}
        style={{
          width: "520px",
          height: "116px",
          imageRendering: "pixelated",
          maxWidth: "95%",
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// V17: Feistel Pixel Dissolve — Wolfenstein 3D style
// Every pixel hit exactly once via Feistel permutation
// ─────────────────────────────────────────────────────────────
function VariantFeistelDissolve() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    const cvs = ref.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;
    const w = 128,
      h = 32; // power-of-two friendly
    cvs.width = w;
    cvs.height = h;

    // Render text to get target pixels
    drawTextToCanvas(ctx, WORD, w, h, 22);
    const full = ctx.getImageData(0, 0, w, h);

    // Feistel: split position (17-bit for 128*32=4096) into 2 halves of ~6-bits each
    // Use w*h as universe size (not power-of-two safe) so wrap via retry: extended permute
    const total = w * h;
    const half = Math.ceil(Math.log2(Math.max(w, h)));
    const mask = (1 << half) - 1;
    const rounds = 4;
    const keys = [0x57, 0xA3, 0x2F, 0x91];
    const hash = (x: number, k: number) => ((x * 2654435761) ^ (k * 0xdeadbeef)) & mask;
    const feistel = (n: number) => {
      let l = (n >> half) & mask;
      let r = n & mask;
      for (let i = 0; i < rounds; i++) {
        const t = l ^ hash(r, keys[i]);
        l = r;
        r = t;
      }
      return ((l << half) | r) & ((1 << (2 * half)) - 1);
    };
    // Generate permutation: for each n in [0,max), compute feistel(n),
    // skip values >= total to cover only real pixels.
    const max = 1 << (2 * half);
    const order: number[] = [];
    for (let n = 0; n < max && order.length < total; n++) {
      const v = feistel(n);
      if (v < total) order.push(v);
    }

    // Start with full text, erase pixels in Feistel order
    let i = 0;
    const perFrame = Math.max(1, Math.floor(total / 90)); // ~1.5s to fully dissolve
    let dissolving = true;
    let raf = 0;

    const tick = () => {
      if (!ctx) return;
      const step = perFrame;
      const frameEnd = Math.min(i + step, total);
      const img = ctx.getImageData(0, 0, w, h);
      for (; i < frameEnd; i++) {
        const idx = order[i];
        const px = (idx % w) + Math.floor(idx / w) * w;
        img.data[px * 4 + 3] = 0; // alpha 0 (erase)
      }
      ctx.putImageData(img, 0, 0);

      if (i < total && dissolving) {
        raf = requestAnimationFrame(tick);
      } else if (dissolving) {
        // Pause, then rebuild
        setTimeout(() => {
          dissolving = false;
          i = 0;
          rebuild();
        }, 400);
      }
    };

    const rebuild = () => {
      const step = perFrame;
      const frameEnd = Math.min(i + step, total);
      const img = ctx.getImageData(0, 0, w, h);
      for (; i < frameEnd; i++) {
        const idx = order[i];
        const px = (idx % w) + Math.floor(idx / w) * w;
        img.data[px * 4 + 3] = full.data[px * 4 + 3];
      }
      ctx.putImageData(img, 0, 0);
      if (i < total) {
        raf = requestAnimationFrame(rebuild);
      } else {
        // Loop
        setTimeout(() => {
          dissolving = true;
          i = 0;
          tick();
        }, 1200);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      dissolving = false;
    };
  }, [trigger]);

  return (
    <div className="relative h-48 bg-black rounded-xl overflow-hidden flex items-center justify-center">
      <canvas
        ref={ref}
        style={{
          width: "560px",
          height: "140px",
          imageRendering: "pixelated",
          maxWidth: "95%",
        }}
      />
      <button
        onClick={() => setTrigger((t) => t + 1)}
        className="absolute top-3 right-3 px-3 py-1 text-xs rounded bg-[#ff7302] text-black font-semibold hover:bg-[#e06600] z-30"
      >
        ⟲ Restart
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// V18: Interactive Repulsion — particles flee from mouse
// ─────────────────────────────────────────────────────────────
function VariantRepulsion() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cvs = ref.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;
    const w = 200,
      h = 48;
    cvs.width = w;
    cvs.height = h;

    // Build particles from text
    const tmp = document.createElement("canvas");
    tmp.width = w;
    tmp.height = h;
    const tctx = tmp.getContext("2d");
    if (!tctx) return;
    drawTextToCanvas(tctx, WORD, w, h, 34);
    const data = tctx.getImageData(0, 0, w, h).data;

    type P = { hx: number; hy: number; x: number; y: number; vx: number; vy: number };
    const particles: P[] = [];
    for (let y = 0; y < h; y += 1) {
      for (let x = 0; x < w; x += 1) {
        if (data[(y * w + x) * 4 + 3] > 128) {
          particles.push({ hx: x, hy: y, x, y, vx: 0, vy: 0 });
        }
      }
    }

    const mouse = { x: -9999, y: -9999 };
    const REPULSE_RADIUS = 28;
    const REPULSE_FORCE = 2.2;
    const RETURN_FORCE = 0.05;
    const FRICTION = 0.86;

    const onMove = (e: MouseEvent) => {
      const rect = cvs.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * w;
      mouse.y = ((e.clientY - rect.top) / rect.height) * h;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    cvs.addEventListener("mousemove", onMove);
    cvs.addEventListener("mouseleave", onLeave);

    let raf = 0;
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#fff";
      for (const p of particles) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < REPULSE_RADIUS) {
          const f = ((REPULSE_RADIUS - dist) / REPULSE_RADIUS) * REPULSE_FORCE;
          p.vx += (dx / (dist || 1)) * f;
          p.vy += (dy / (dist || 1)) * f;
        }
        // Return force
        p.vx += (p.hx - p.x) * RETURN_FORCE;
        p.vy += (p.hy - p.y) * RETURN_FORCE;
        p.vx *= FRICTION;
        p.vy *= FRICTION;
        p.x += p.vx;
        p.y += p.vy;
        ctx.fillRect(Math.round(p.x), Math.round(p.y), 1, 1);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      cvs.removeEventListener("mousemove", onMove);
      cvs.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div className="relative h-48 bg-black rounded-xl overflow-hidden flex items-center justify-center">
      <canvas
        ref={ref}
        style={{
          width: "600px",
          height: "144px",
          imageRendering: "pixelated",
          maxWidth: "95%",
          cursor: "crosshair",
        }}
      />
      <p className="absolute top-3 left-3 text-xs text-gray-400 pointer-events-none">najedź kursorem →</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Vertical vertical (rotated) — demo for hero context
// ─────────────────────────────────────────────────────────────
function VerticalDemo({ variant }: { variant: "rgb" | "displacement" | "neon" }) {
  const wordStyle = "text-white font-[family-name:var(--font-anton)] text-6xl";
  const wrapper = "writing-mode-vertical inline-block [writing-mode:vertical-lr] rotate-180 leading-[0.85]";

  if (variant === "rgb") {
    return (
      <div className="relative h-64 bg-black rounded-xl overflow-hidden flex justify-start items-end p-4">
        <div className={`${wrapper} relative rgb-slice-root`}>
          <span className={`${wordStyle} rgb-base`}>{ALT}</span>
          <span className={`${wordStyle} rgb-layer rgb-cyan absolute top-0 left-0`} aria-hidden>{ALT}</span>
          <span className={`${wordStyle} rgb-layer rgb-magenta absolute top-0 left-0`} aria-hidden>{ALT}</span>
        </div>
      </div>
    );
  }
  if (variant === "displacement") {
    return (
      <div className="relative h-64 bg-black rounded-xl overflow-hidden flex justify-start items-end p-4">
        <span className={`${wrapper} ${wordStyle}`} style={{ filter: "url(#glitch-warp)" }}>{ALT}</span>
      </div>
    );
  }
  return (
    <div className="relative h-64 bg-black rounded-xl overflow-hidden flex justify-start items-end p-4">
      <span className={`${wrapper} neon-text ${wordStyle}`}>{ALT}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────
export default function GlitchMockup() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white py-12 px-4 mt-20">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-3">
            Glitch text animations — research &amp; mockup
          </h1>
          <p className="text-gray-400 text-sm max-w-3xl">
            Aktualny hero ma agresywne RGB ghosts + drift + text-shadow, czasem
            wygląda chaotycznie. Poniżej 6 wariantów w izolacji (poziomo) +
            demo w kontekście pionowym (tak jak w hero).
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { label: "1) Text Scramble — letters cycle, settle sequentially", render: <VariantScramble /> },
            { label: "2) RGB Slice — cyan/magenta offsets + clip-path slices", render: <VariantRGBSlice /> },
            { label: "3) SVG Displacement — organic turbulence warp", render: <VariantDisplacement /> },
            { label: "4) Neon Flicker — atmospheric broken-neon pulse", render: <VariantNeon /> },
            { label: "5) Character Corruption — per-letter chaos", render: <VariantCharCorrupt /> },
            { label: "6) Refined Stroke — cleaner remix of current", render: <VariantStrokeRefined /> },
          ].map((v, i) => (
            <div key={i}>
              <p className="text-sm text-gray-400 mb-2">{v.label}</p>
              {v.render}
            </div>
          ))}
        </section>

        <h2 className="text-2xl font-bold mt-12 mb-4">Śnieżenie pikseli — TV static / noise</h2>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { label: "7) TV Static overlay — ciągłe śnieżenie na wierzchu", render: <VariantTVStatic /> },
            { label: "8) Heavy Noise inside text — szum zamiast tekstu", render: <VariantHeavyNoise /> },
            { label: "9) Flash Burst — krótkie trzaski utraty sygnału", render: <VariantFlashBurst /> },
            { label: "10) Reveal from Noise — tekst wyłania się z szumu", render: <VariantRevealFromNoise /> },
            { label: "11) Retro CRT — śnieg + scanlines + zielona poświata", render: <VariantCRT /> },
          ].map((v, i) => (
            <div key={i}>
              <p className="text-sm text-gray-400 mb-2">{v.label}</p>
              {v.render}
            </div>
          ))}
        </section>

        <h2 className="text-2xl font-bold mt-12 mb-4">Duże piksele / pixelation / rozpikselowywanie</h2>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { label: "12) Chunky Pixel Snow — duże kwadraty (low-freq + binarize)", render: <VariantChunkySnow /> },
            { label: "13) Pixel Dissolve — canvas, random pixels erased", render: <VariantPixelDissolve /> },
            { label: "14) Edge Dilate — tylko pogrubienie krawędzi (morphology)", render: <VariantMosaic /> },
            { label: "15) Particle Shatter — canvas, pixels converge z chaosu", render: <VariantShatter /> },
            { label: "16) 8-bit Pixelate — canvas niska rozdz. + CSS scale", render: <VariantEightBit /> },
            { label: "17) Feistel Dissolve — Wolfenstein 3D style, każdy piksel raz", render: <VariantFeistelDissolve /> },
            { label: "18) Interactive Repulsion — piksele uciekają od kursora", render: <VariantRepulsion /> },
          ].map((v, i) => (
            <div key={i}>
              <p className="text-sm text-gray-400 mb-2">{v.label}</p>
              {v.render}
            </div>
          ))}
        </section>

        <h2 className="text-2xl font-bold mt-12 mb-4">Kontekst hero — pionowe słowo</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <p className="text-sm text-gray-400 mb-2">RGB Slice (vertical)</p>
            <VerticalDemo variant="rgb" />
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-2">Displacement (vertical)</p>
            <VerticalDemo variant="displacement" />
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-2">Neon (vertical)</p>
            <VerticalDemo variant="neon" />
          </div>
        </div>

        <div className="mt-12 max-w-3xl text-sm text-gray-300 space-y-3">
          <h3 className="text-white text-lg font-bold">Rekomendacja</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Wariant 2 (RGB Slice)</strong> — najlepszy &quot;klasyczny glitch&quot;. Czytelny, kinematograficzny, dobrze pasuje do konceptu ŚCIANA/KAMERA/AKCJA.</li>
            <li><strong>Wariant 3 (Displacement)</strong> — subtelniejszy, analogowy, VHS-feel. Nie dominuje sceny, nie odciąga od video.</li>
            <li><strong>Wariant 4 (Neon)</strong> — najprostszy, ale bardzo atmosferyczny. Zero ruchu horyzontalnego, tylko pulsowanie światła.</li>
            <li><strong>Kombinacja</strong> — Neon jako baza + krótki RGB slice co 4s jako &quot;akcent&quot; (zamiast ciągłego intensywnego glitchu).</li>
          </ul>
          <p className="pt-3">Który wariant chcesz zastosować w produkcji? Mogę też zrobić mix kilku (np. intro = scramble, potem neon pulse z okazjonalnym RGB slice).</p>
        </div>
      </div>
    </main>
  );
}
