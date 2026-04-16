"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAudio } from "@/app/context/AudioContext";
import styles from "./GlitchedVideoHero.module.css";

// Word sequence (always ściana → kamera → akcja, duplicated for seamless loop)
const WORDS = ["śCIANA", "KAMERA", "AKCJA", "śCIANA", "KAMERA", "AKCJA"];

const FilmStrip = ({ side, words }: { side: "left" | "right"; words: string[] }) => (
  <div className={`${styles.strip} ${side === "left" ? styles.stripLeft : styles.stripRight}`}>
    <div className={styles.track}>
      {/* content + duplicate for seamless marquee */}
      {[...words, ...words].map((w, i) => (
        <React.Fragment key={i}>
          <span className={styles.txt}>{w}</span>
          <span className={styles.dot} />
        </React.Fragment>
      ))}
    </div>
  </div>
);

const GlitchedVideoHero = () => {
  const { muted } = useAudio();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoSources, setVideoSources] = useState<{ webm: string; mp4: string } | null>(null);

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    setVideoSources(
      isMobile
        ? { webm: "/movies/hero_mini.webm", mp4: "/movies/hero_mini.mp4" }
        : { webm: "/movies/hero_medium.webm", mp4: "/movies/hero_compressed.mp4" }
    );
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
    const play = async () => { try { v.muted = true; await v.play(); } catch (_) {} };
    if (v.readyState >= 3) play();
    else v.addEventListener("canplay", play, { once: true });
  }, []);

  return (
    <div className={styles.hero}>
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/images/hero-poster.webp"
        className={styles.video}
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

      <FilmStrip side="left"  words={WORDS} />
      <FilmStrip side="right" words={WORDS} />

      <div className={styles.bot}>
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
