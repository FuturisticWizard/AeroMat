"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useAudio } from "@/app/context/AudioContext";
import gsap from "gsap";
import styles from "./GlitchedVideoHero.module.css";

// ---- Debounce utility ----
function debounce(fn: () => void, ms: number) {
  let timer: ReturnType<typeof setTimeout>;
  return () => { clearTimeout(timer); timer = setTimeout(fn, ms); };
}

// ---- Breakpoint helper ----
function getBreakpoint(): "desktop" | "tablet" | "mobile" | "small" {
  const w = window.innerWidth;
  if (w >= 1025) return "desktop";
  if (w > 768) return "tablet";
  if (w >= 480) return "mobile";
  return "small";
}

// ---- Responsive multipliers ----
function getVerticalHeightMultiplier(): number {
  switch (getBreakpoint()) {
    case "desktop": return 0.78;
    case "tablet":  return 0.85;
    case "mobile":  return 0.65;
    default:        return 0.55;
  }
}

function getMaxVerticalWidth(): number {
  const vw = window.innerWidth;
  switch (getBreakpoint()) {
    case "desktop": return 9999;
    case "tablet":  return vw * 0.18;
    case "mobile":  return vw * 0.16;
    default:        return vw * 0.14;
  }
}

// ---- Font measurement: reuse single measurer element ----
let _measurer: HTMLSpanElement | null = null;
function getMeasurer(): HTMLSpanElement {
  if (!_measurer) {
    _measurer = document.createElement("span");
    _measurer.style.cssText = "font-family:'Anton',sans-serif;text-transform:uppercase;white-space:nowrap;visibility:hidden;position:absolute;top:-9999px;left:-9999px;line-height:.82;";
    document.body.appendChild(_measurer);
  }
  return _measurer;
}

function fitFont(text: string, maxW: number, maxH: number, ls = "-0.02em"): number {
  const m = getMeasurer();
  m.style.letterSpacing = ls;
  m.textContent = text;
  let lo = 4, hi = 2000, best = 20;
  for (let i = 0; i < 30; i++) {
    const mid = (lo + hi) / 2;
    m.style.fontSize = mid + "px";
    if (m.offsetWidth <= maxW && m.offsetHeight <= maxH) { best = mid; lo = mid; }
    else { hi = mid; }
  }
  return Math.floor(best);
}

function measureH(text: string, fs: number, ls = "-0.02em"): number {
  const m = getMeasurer();
  m.style.letterSpacing = ls;
  m.style.fontSize = fs + "px";
  m.textContent = text;
  return m.offsetHeight;
}

// ---- Vertical Word component ----
function VerticalWord({
  text, fontSize, visible, refCallback,
}: {
  text: string;
  fontSize: number;
  visible: boolean;
  refCallback: (el: HTMLDivElement | null) => void;
}) {
  const wordRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wordRef.current) return;
    const colWidth = measureH(text, fontSize, "0em");
    wordRef.current.style.width = Math.ceil(colWidth) + "px";
    const ko = wordRef.current.closest("[class*='koHalf']") as HTMLElement | null;
    wordRef.current.style.height = (ko ? ko.offsetHeight : window.innerHeight) + "px";
  }, [text, fontSize]);

  useEffect(() => { refCallback(wordRef.current); }, [refCallback]);

  return (
    <div ref={wordRef} className={`${styles.vWord} ${styles.waveEl} ${visible ? styles.visible : ""}`} data-glitch="">
      {[...text].map((c, i) => (
        <div key={i} className={styles.clip}>
          <span
            className={`${styles.char} ${c === c.toLowerCase() && c !== c.toUpperCase() ? styles.lowercase : ""}`}
            style={{ fontSize: fontSize + "px" }}
          >{c}</span>
        </div>
      ))}
    </div>
  );
}

// ---- Highlight style ----
type HighlightStyle = "scale" | "dim" | "whiteglow" | "combo" | "full" | "stroke" | "combined";

// ---- Main Component ----
const GlitchedVideoHero = ({ highlightStyle = "stroke" }: { highlightStyle?: HighlightStyle }) => {
  const { muted } = useAudio();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [videoSources, setVideoSources] = useState<{ webm: string; mp4: string } | null>(null);

  // Pick sources based on viewport (runs client-side only, no hydration mismatch)
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    setVideoSources(
      isMobile
        ? { webm: "/movies/hero_mini.webm", mp4: "/movies/hero_mini.mp4" }
        : { webm: "/movies/hero_medium.webm", mp4: "/movies/hero_compressed.mp4" }
    );
  }, []);
  const vColRef = useRef<HTMLDivElement>(null);
  const koRef = useRef<HTMLDivElement>(null);
  const botRef = useRef<HTMLDivElement>(null);

  const scianaRef = useRef<HTMLDivElement | null>(null);
  const kameraRef = useRef<HTMLDivElement | null>(null);
  const akcjaRef = useRef<HTMLDivElement | null>(null);
  const glitchIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const introTlRef = useRef<gsap.core.Timeline | null>(null);
  const introPlayedRef = useRef(false);
  const layoutReadyRef = useRef(false);

  // All layout state
  const [layout, setLayout] = useState<{
    vFontSize: number;
  } | null>(null);

  // Visibility controlled via React state (not classList) to survive re-renders
  const [scianaVisible, setScianaVisible] = useState(false);
  const [kameraVisible, setKameraVisible] = useState(false);
  const [akcjaVisible, setAkcjaVisible] = useState(false);

  const setScianaRef = useCallback((el: HTMLDivElement | null) => { scianaRef.current = el; }, []);
  const setKameraRef = useCallback((el: HTMLDivElement | null) => { kameraRef.current = el; }, []);
  const setAkcjaRef = useCallback((el: HTMLDivElement | null) => { akcjaRef.current = el; }, []);

  // Video muted sync
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !videoReady) return;
    v.muted = muted;
    v.defaultMuted = muted;
    if (!muted) v.volume = 0.1;
  }, [muted, videoReady]);

  // Video autoplay
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.defaultMuted = true;
    const play = async () => { try { v.muted = true; await v.play(); } catch (_) {} };
    if (v.readyState >= 3) play();
    else v.addEventListener("canplay", play, { once: true });
  }, []);

  // Single unified layout calculation (debounced on resize)
  useEffect(() => {
    const calc = () => {
      const vCol = vColRef.current;
      const ko = koRef.current;
      if (!vCol || !ko) return;

      const bp = getBreakpoint();
      const vh = window.innerHeight;

      // Vertical word font size
      const vMult = getVerticalHeightMultiplier();
      const vMaxW = getMaxVerticalWidth();
      const vFs = fitFont("śCIANA", vh * vMult, vMaxW, "0em");

      // vCol width from calculated font (3 vertical words)
      const sW = measureH("śCIANA", vFs, "0em");
      const kW = measureH("KAMERA", vFs, "0em");
      const aW = measureH("AKCJA", vFs, "0em");
      const vColWidth = Math.ceil(sW) + Math.ceil(kW) + Math.ceil(aW);
      vCol.style.width = vColWidth + "px";

      layoutReadyRef.current = true;
      setLayout({ vFontSize: vFs });
    };

    // First calc after CSS layout is done
    setTimeout(calc, 100);

    const debouncedCalc = debounce(calc, 150);
    window.addEventListener("resize", debouncedCalc);
    return () => window.removeEventListener("resize", debouncedCalc);
  }, []);

  // GSAP: Intro animations — runs ONCE after layout is calculated
  useEffect(() => {
    if (introPlayedRef.current) return;
    // Only run after layout calc has actually computed values (not null initial state)
    if (!layout || !layoutReadyRef.current) return;

    // Wait one extra frame so VerticalWord useEffect has applied widths from new fontSize
    const rafId = requestAnimationFrame(() => {
      if (introPlayedRef.current) return;
      introPlayedRef.current = true;

      const tl = gsap.timeline();
      introTlRef.current = tl;

      // Use React state for visibility (survives re-renders), not classList
      tl.call(() => { setScianaVisible(true); }, [], 0.3);
      tl.to(`.${styles.vWord}:nth-child(1) .${styles.char}`, {
        y: 0, duration: 0.45, ease: "power4.out", stagger: 0.055,
      }, 0.3);

      tl.call(() => { setKameraVisible(true); }, [], 1.1);
      tl.to(`.${styles.vWord}:nth-child(2) .${styles.char}`, {
        y: 0, duration: 0.45, ease: "power4.out", stagger: 0.055,
      }, 1.1);

      tl.call(() => { setAkcjaVisible(true); }, [], 1.9);
      tl.to(`.${styles.vWord}:nth-child(3) .${styles.char}`, {
        y: 0, duration: 0.45, ease: "power4.out", stagger: 0.055,
      }, 1.9);

      tl.to(botRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 2.8);

      // Glitch wave — stored in ref for cleanup
      tl.call(() => {
        const allEls: HTMLElement[] = [];
        if (scianaRef.current) allEls.push(scianaRef.current);
        if (kameraRef.current) allEls.push(kameraRef.current);
        if (akcjaRef.current) allEls.push(akcjaRef.current);
        if (!allEls.length) return;

        let waveIdx = 0;
        const tick = () => {
          allEls.forEach((el) => el.classList.remove(styles.glitchNow));
          allEls[waveIdx % allEls.length].classList.add(styles.glitchNow);
          allEls[(waveIdx + 1) % allEls.length].classList.add(styles.glitchNow);
          waveIdx = (waveIdx + 1) % allEls.length;
        };
        tick();
        glitchIntervalRef.current = setInterval(tick, 800);
      }, [], 3.0);
    });

    return () => {
      cancelAnimationFrame(rafId);
      if (introTlRef.current) {
        introTlRef.current.kill();
        introTlRef.current = null;
      }
      if (glitchIntervalRef.current) {
        clearInterval(glitchIntervalRef.current);
        glitchIntervalRef.current = null;
      }
    };
  }, [layout]);

  return (
    <div className={styles.hero} data-style={highlightStyle}>
      {/* SVG filter for V3 displacement warp — used by combined variant */}
      <svg width="0" height="0" style={{ position: "absolute", pointerEvents: "none" }} aria-hidden>
        <defs>
          <filter id="glitch-warp">
            <feTurbulence type="fractalNoise" baseFrequency="0.015 0.4" numOctaves="2" seed="5">
              <animate attributeName="baseFrequency" dur="10s" values="0.015 0.4;0.03 0.7;0.015 0.4" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" scale="5" />
          </filter>
        </defs>
      </svg>
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/images/hero-poster.webp"
        className={`${styles.video} ${videoReady ? styles.videoReady : ""}`}
        onLoadedData={() => setVideoReady(true)}
      >
        {videoSources && (
          <>
            <source src={videoSources.webm} type="video/webm" />
            <source src={videoSources.mp4} type="video/mp4" />
          </>
        )}
      </video>

      <div className={styles.videoGrad} />
      <div className={styles.bottomFade} />

      <div ref={koRef} className={styles.koHalf}>
        <div ref={vColRef} className={styles.vCol}>
          {layout && (
            <>
              <VerticalWord text="śCIANA" fontSize={layout.vFontSize} visible={scianaVisible} refCallback={setScianaRef} />
              <VerticalWord text="KAMERA" fontSize={layout.vFontSize} visible={kameraVisible} refCallback={setKameraRef} />
              <VerticalWord text="AKCJA" fontSize={layout.vFontSize} visible={akcjaVisible} refCallback={setAkcjaRef} />
            </>
          )}
        </div>
      </div>

      <div ref={botRef} className={styles.bot}>
        <p className={styles.copy}>
          Dostajesz <strong>mural, który przyciąga wzrok</strong> — i{" "}
          <strong>profesjonalny film z ujęciami z drona</strong>, który przyciąga obserwujących.
        </p>
        <div className={styles.row}>
          <a href="/kontakt" className={styles.btnO}>Bezpłatna wycena &rarr;</a>
          <div className={styles.micro}>
            <span>25+ lat doświadczenia</span>
            <span>Film gratis</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlitchedVideoHero;
