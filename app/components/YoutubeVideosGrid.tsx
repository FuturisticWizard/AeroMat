"use client"

import { useState, useRef, useEffect, type KeyboardEvent } from "react"
import Image from "next/image"
import Link from "next/link"
import { Play, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface VideoItem {
  id: string
  title: string
  description: string
}

interface YouTubeGridProps {
  videos?: VideoItem[]
  title?: string
  subtitle?: string
  cta?: { href: string; label: string }
}

const DEFAULT_VIDEOS: VideoItem[] = [
  {
    id: "FpFBhlD7cOU",
    title: "Tworzenie muralu - Lublin Stare Miasto ",
    description: "Przegląd mojego projektu - Stare Miasto w Lublinie",
  },
  {
    id: "Y8-QLpd97bo",
    title: "Mural EKOPAK - KomeEko Lublin",
    description: "Nagranie z prac przy 85 metrowym muralu EKOPAK - KomEko Lublin ul.Metalurgiczna 9b",
  },
  {
    id: "_Ur0BpsVwQE",
    title: "Mural Antysmogowy - LPEC Lublin",
    description: "Nagranie z prac przy muralu Antysmogowym - LPEC Lublin ul.Puławska 28 w Lublinie",
  },
  {
    id: "hNWmk-VJZ6c",
    title: "Mural z okazji 60 lecia LPEC",
    description: "Mural powstał z okazji 60-lecia firmy LPEC, z którą mam zaszczyt i przyjemność współpracować od ponad 10-ciu lat.",
  },
  {
    id: "u6u1kGA8uGE",
    title: "Mural z ptasiej serii pt. Początek",
    description: "Pierwszy mural z ptasiej serii pt. Początek",
  },
  {
    id: "1fEvHbd5tTI",
    title: "Mural z ptasiej serii pt. Zmiany",
    description: "Drugi mural z ptasiej serii pt. Zmiany",
  },
  {
    id: "oE7ucKq4of8",
    title: "Mural na przedszkolu 'Junior'",
    description: "Mural na przedszkolu 'Junior'",
  }, {
    id: "nLrFVfav05g",
    title: "Mural historyczny w Opolu Lubelskim",
    description: "Mural poświęcony II Batalionowi 16 Pułku Piechoty Liniowej został namalowany w Opolu Lubelskim przy ul. Fabrycznej.",
  }, {
    id: "HBrLvcUcGfg",
    title: "Mural z Rybą w sklepie Akwarium24",
    description: "Realizacje wykonałem dla sklepu https://www.akwarium24.pl/",
  },
]

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isDesktop;
}

export default function YouTubeGrid({
  videos = DEFAULT_VIDEOS,
  title = "FILMY",
  subtitle = "Zobacz jak powstają moje prace.",
  cta,
}: YouTubeGridProps = {}) {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const expandedRef = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop();

  // Lock body scroll when video is open
  useEffect(() => {
    if (activeVideo) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [activeVideo]);

  return (
    <section id="w-akcji" className="py-16 md:py-24 max-w-7xl mx-auto mb-12 scroll-mt-24">
      <div className="container px-4 mx-auto relative">
        <div className="py-4">
          <h2 className="text-7xl md:text-8xl font-[family-name:var(--font-bebas)] text-left tracking-tight transform origin-right whitespace-nowrap text-[#ff7302]">
          {title}
          </h2>

          <p className="text-lg text-gray-200">
          {subtitle}
          </p>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                isActive={activeVideo?.id === video.id}
                onPlay={() => isDesktop ? setActiveVideo(video) : undefined}
                isMobile={!isDesktop}
              />
            ))}
          </div>

          {cta && (
            <div className="mt-10 flex justify-center">
              <Link
                href={cta.href}
                className="group inline-flex items-center gap-3 rounded-full bg-[#ff7302] px-8 py-4 text-lg font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-[#ff7302]"
              >
                {cta.label}
                <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
              </Link>
            </div>
          )}

          {/* Overlay player — na pierwszym planie, na całą szerokość */}
          <AnimatePresence>
            {activeVideo && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70"
                onClick={() => setActiveVideo(null)}
              >
                <motion.div
                  ref={expandedRef}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="w-[94%] max-w-5xl rounded-xl overflow-hidden bg-neutral-900 border border-[#ff7302]/40 shadow-2xl shadow-orange-500/30"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="relative pb-[56.25%]">
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src={`https://www.youtube-nocookie.com/embed/${activeVideo.id}?autoplay=1`}
                      title={activeVideo.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                    <button
                      onClick={() => setActiveVideo(null)}
                      className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/70 hover:bg-[#ff7302] text-white flex items-center justify-center transition-colors duration-200"
                      aria-label="Zamknij wideo"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1 text-white">{activeVideo.title}</h3>
                    <p className="text-gray-300 text-[0.9375rem] leading-relaxed">{activeVideo.description}</p>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}


function VideoCard({ video, isActive, onPlay, isMobile }: { video: VideoItem; isActive: boolean; onPlay: () => void; isMobile: boolean }) {
    const [inlinePlay, setInlinePlay] = useState(false);

    const handleClick = () => {
      if (isMobile) {
        setInlinePlay(true);
      } else {
        onPlay();
      }
    };

    // Gdy kafelek nie odtwarza jeszcze filmu, działa jak przycisk — dostępny
    // z klawiatury (Tab + Enter/Spacja) i opisany dla czytników ekranu.
    const interactiveProps = !inlinePlay
      ? {
          role: "button" as const,
          tabIndex: 0,
          "aria-label": `Odtwórz film: ${video.title}`,
          onClick: handleClick,
          onKeyDown: (e: KeyboardEvent) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleClick();
            }
          },
        }
      : {};

    return (
      <div
        {...interactiveProps}
        className={`group relative overflow-hidden rounded-xl shadow-md transition-all duration-300 bg-neutral-900/80 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7302] focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
          isActive
            ? "border-[#ff7302] shadow-orange-500/20"
            : "border-neutral-700 hover:shadow-xl hover:shadow-orange-500/10 hover:border-[#ff7302]/40"
        } ${!inlinePlay ? "cursor-pointer" : ""}`}
      >
        <div className="relative pb-[56.25%] overflow-hidden">
          {inlinePlay ? (
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube-nocookie.com/embed/${video.id}?playsinline=1&rel=0`}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
              sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
            ></iframe>
          ) : (
            <div className="absolute top-0 left-0 w-full h-full">
              <Image
                src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                alt={`${video.title} thumbnail`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[#ff7302] flex items-center justify-center shadow-lg shadow-orange-500/30 transform group-hover:scale-110 transition-transform duration-300">
                  <Play className="w-8 h-8 text-white fill-current ml-1" />
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1 text-white">{video.title}</h3>
          <p className="text-gray-300 text-[0.9375rem] leading-relaxed">{video.description}</p>
        </div>
      </div>
    );
  }