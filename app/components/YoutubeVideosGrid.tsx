"use client"

import { useState, useRef, useEffect } from "react"
import { Play } from "lucide-react"

interface VideoItem {
  id: string
  title: string
  description: string
}

export default function YouTubeGrid() {
  
  // Instead of conditionally rendering iframes, we'll use a more direct approach
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

  return (
    <section className="py-16 from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 max-w-7xl mx-auto mb-12">
      <div className="container px-4 mx-auto relative">
        {/* <div className="absolute -left-10 top-1/4  transform -translate-y-1/2 -translate-x-full hidden lg:block" >
          <h2 className="text-8xl anton-regular font-bold tracking-tight transform -rotate-90 origin-right whitespace-nowrap text-gray-800 opacity-10">
          ZA KULISAMI
          </h2>
        </div> */}
        
        {/* Mobile/tablet heading (visible on smaller screens) */}
        <div className=" py-4  " > 
        
          <h2 className="text-7xl md:text-8xl anton-regular text-left font-bold tracking-tight transform origin-right whitespace-nowrap text-gray-800 opacity-10">
          ZA KULISAMI
          </h2>
        
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Podejrzyj zakulisowe nagrania z moich projektów, które pokazują proces twórczy i efekty końcowe.
          </p>
        </div>

        {/* Desktop description (visible only on large screens) */}
        {/* <div className="hidden lg:block max-w-6xl mx-auto text-left mb-12">
          <p className="text-lg text-slate-600 dark:text-slate-400">
          Podejrzyj zakulisowe nagrania z moich projektów, które pokazują proces twórczy i efekty końcowe.
          </p>
        </div> */}
        

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 " >
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </div>
    </section>
  )
}


function VideoCard({ video }: { video: VideoItem }) {
    const [isPlaying, setIsPlaying] = useState(false);
  
    const handlePlay = () => {
      console.log(`Playing video: ${video.id}`);
      setIsPlaying(true);
    };
  
    return (
      <div className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800">
        {/* Ensure the aspect ratio is maintained */}
        <div className="relative pb-[56.25%] overflow-hidden">
          {!isPlaying ? (
            // Thumbnail with play button
            <div
              className="absolute top-0 left-0 w-full h-full cursor-pointer"
              onClick={handlePlay}
            >
              <img
                src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                alt={`${video.title} thumbnail`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                  <Play className="w-8 h-8 text-white fill-current ml-1" />
                </div>
              </div>
            </div>
          ) : (
            // Direct iframe embed
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1">{video.title}</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm">{video.description}</p>
        </div>
      </div>
    );
  }