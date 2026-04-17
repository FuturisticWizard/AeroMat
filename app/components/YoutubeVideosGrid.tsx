"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Play } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface VideoItem {
  id: string
  title: string
  description: string
}

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

export default function YouTubeGrid() {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const expandedRef = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop();

  const videos: VideoItem[] = [
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
          <h2 className="text-7xl md:text-8xl font-[family-name:var(--font-bebas)] text-left tracking-tight transform origin-right whitespace-nowrap text-accent">
          FILMY
          </h2>

          <p className="text-lg text-gray-200">
          Zobacz jak powstają moje prace.
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
                  className="w-[94%] max-w-5xl rounded-xl overflow-hidden bg-neutral-900 border border-accent/40 shadow-2xl shadow-orange-500/30"
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
                      className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/70 hover:bg-accent text-white flex items-center justify-center transition-colors duration-200"
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

    return (
      <div
        onClick={!inlinePlay ? handleClick : undefined}
        className={`group relative overflow-hidden rounded-xl shadow-md transition-all duration-300 bg-neutral-900/80 border ${
          isActive
            ? "border-accent shadow-orange-500/20"
            : "border-neutral-700 hover:shadow-xl hover:shadow-orange-500/10 hover:border-accent/40"
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
                <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center shadow-lg shadow-orange-500/30 transform group-hover:scale-110 transition-transform duration-300">
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