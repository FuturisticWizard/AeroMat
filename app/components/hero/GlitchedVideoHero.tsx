"use client";

import { useEffect, useRef, useState } from "react";
import { useAudio } from "@/app/context/AudioContext";
import styles from "./GlitchedVideoHero.module.css";

const GlitchedVideoHero = () => {
  const { muted } = useAudio();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoSources, setVideoSources] = useState<{ webm: string; mp4: string } | null>(null);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    // Defer video source assignment until browser is idle.
    // Poster is LCP, video kicks in after first paint — keeps LCP ~poster-fast.
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const sources = isMobile
      ? { webm: "/movies/hero_mini.webm", mp4: "/movies/hero_mini.mp4" }
      : { webm: "/movies/hero_medium.webm", mp4: "/movies/hero_compressed.mp4" };

    type IdleWindow = Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
    const w = window as IdleWindow;
    let handle: number;
    let timer: ReturnType<typeof setTimeout> | null = null;
    if (typeof w.requestIdleCallback === "function") {
      handle = w.requestIdleCallback(() => setVideoSources(sources), { timeout: 2000 });
    } else {
      timer = setTimeout(() => setVideoSources(sources), 1500);
    }
    return () => {
      if (typeof w.cancelIdleCallback === "function" && handle !== undefined) {
        w.cancelIdleCallback(handle);
      }
      if (timer) clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = muted;
    v.defaultMuted = muted;
    if (!muted) v.volume = 0.1;
  }, [muted]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.defaultMuted = true;
    const onReady = () => {
      setVideoReady(true);
      v.muted = true;
      v.play().catch(() => {});
    };
    if (v.readyState >= 3) onReady();
    else v.addEventListener("canplay", onReady, { once: true });
  }, [videoSources]);

  return (
    <div className={styles.hero}>
      {/* Poster as plain <img> (NOT next/image) so the URL matches the
          <link rel="preload"> in layout.tsx exactly. next/image served via
          /_next/image?url=... would be a different URL and skip the preload. */}
      <img
        src="/images/hero-poster.webp"
        alt=""
        aria-hidden
        width={1280}
        height={720}
        decoding="sync"
        fetchPriority="high"
        className={styles.poster}
      />
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        className={`${styles.video} ${videoReady ? styles.videoReady : ""}`}
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

      <div className={styles.bot}>
        <h1 className={styles.headline}>Murale które przyciągają wzrok</h1>
        {/* <p className={styles.copy}>
          Dostajesz <strong>mural, który przyciąga wzrok</strong> — i{" "}
          <strong>profesjonalny film z ujęciami z drona</strong>, który przyciąga obserwujących.
        </p> */}
        <div className={styles.row}>
          <a href="/kontakt" className={styles.btnO}>Bezpłatna wycena &rarr;</a>
          <div className={styles.micro}>
            <span>25+ lat doświadczenia</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlitchedVideoHero;
