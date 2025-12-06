"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/app/components/ui/button";
import { motion } from "framer-motion";
import { FlipWords } from "@/app/components/ui/flip-words";
import { useRouter } from "next/navigation";
import CallButtonPortal from "../CallButtonPortal";
import { useAudio } from "@/app/context/AudioContext";

const VideoHero = ({
  videoUrl = "/movies/hero_compressed.mp4",
  title = "Przekształć swoją przestrzeń ",
  subtitle = "w dzieło sztuki",
  ctaText = "Zadzwoń",
}) => {
  const { muted } = useAudio();
  const [videoReady, setVideoReady] = useState(false);
  const videoVolumeRef = useRef<HTMLVideoElement>(null);
  const words = [
    "przyciągają wzrok i klientów",
    "pomagają w budowaniu silnego wizerunku",
    "zwiększają widoczność Twojej marki",
  ];
  const router = useRouter(); 

  // Synchronizuj stan muted z video elementem
  useEffect(() => {
    if (videoVolumeRef.current && videoReady) {
      if (!muted) {
        videoVolumeRef.current.muted = false;
        videoVolumeRef.current.volume = 0.2;
      } else {
        videoVolumeRef.current.muted = true;
      }
    }
  }, [muted, videoReady]);
  
  // Wymuszenie odtwarzania wideo po zamontowaniu
  useEffect(() => {
    const video = videoVolumeRef.current;
    if (!video) return;
    
    const attemptPlay = async () => {
      try {
        video.muted = true;
        await video.play();
        console.log("Video autoplay started successfully");
      } catch (error) {
        console.log("Autoplay failed:", error);
      }
    };
    
    if (video.readyState >= 3) {
      attemptPlay();
    } else {
      video.addEventListener('canplay', attemptPlay, { once: true });
    }
  }, []);

  return (
    <div className="relative w-full h-screen max-w-8xl justify-center items-center overflow-hidden bg-black">
      {/* Video Background - zawsze renderowane, opacity kontroluje widoczność */}
      <video
        ref={videoVolumeRef}
        autoPlay
        muted
        loop
        preload="auto"
        playsInline
        webkit-playsinline="true"
        className={`w-full h-full object-cover object-center transition-opacity duration-1000 ease-out ${
          videoReady ? "opacity-100" : "opacity-0"
        }`}
      onCanPlay={() => {
        console.log("Video can play");
        setVideoReady(true);
      }}
      onLoadedData={() => {
        // Niektóre przeglądarki szybciej wywołują loadeddata niż canplay
        if (!videoReady) {
          setVideoReady(true);
        }
      }}
      onCanPlayThrough={() => {
        if (!videoReady) {
          setVideoReady(true);
        }
      }}
      onError={(e) => {
        console.error("Video error:", e);
        // Pokazujemy co mamy – unikamy wiecznego opacity-0
        setVideoReady(true);
      }}
      >
        <source src="/movies/hero_compressed.mp4" type="video/mp4" />
        <source src="/movies/hero_compressed.webm" type="video/webm" />
      </video>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 h-full bg-gradient-to-b from-black/10 via-black/20 to-black z-10" />

      {/* Heading Section */}
      <div className=" absolute inset-x-0 bottom-40 lsm:bottom-20 z-20 flex flex-col items-center justify-center text-center px-4 mx-auto lg:bottom-20 gap-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative mb-6"
        >
          {/* <div className="absolute left-0 -top-4 border-t-4 border-l-4 border-solid border-white w-16 h-16" />
          <div className="absolute right-0 -top-4 border-t-4 border-r-4 border-solid border-white w-16 h-16" /> */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="h-[75px] w-[250px] sm:h-[75px] sm:w-[400px] mx-auto "
          >
            {/* Subheading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative  text-left font-bold text-white xxs:text-md xs:text-md  md:text-md lg:text-md  z-20 px-4 "
            >
              Tworzę murale które...
            </motion.h2>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative text-left font-bold text-white xxs:text-md xs:text-md  md:text-md lg:text-md z-20 px-4 "
            >
              <FlipWords
                words={words}
                duration={2500}
                className="px-0 text-white text-[#FE9100]"
              />
            </motion.h2>
          </motion.div>
          {/* Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="my-2 pl-4 text-left flex flex-row items-center w-full sm:w-1/2"
          >
            {/* <Button
              variant="outline"
              size="lg"
              className="bg-white/90 hover:bg-white font-bold shadow-inner transition-transform duration-300  text-black hover:text-black/95 border-black/20"
              style={{
                transform: "translate3d(0, 0, 0)", // Force GPU rendering
                backfaceVisibility: "hidden", // Prevent rendering artifacts
                WebkitFontSmoothing: "antialiased", // Improve font clarity
                MozOsxFontSmoothing: "grayscale", // Optimize font rendering in Firefox
              }}
            >
              {ctaText}
            </Button> */}
            {/* Call Button for Mobile - Portal Version (Top Layer Guaranteed) */}
            <CallButtonPortal phoneNumber="+48780428883" />
            <div className="leading-tight flex flex-row">
            <button
              className="mt-2 px-4 py-2 bg-[#FE9100] text-white font-bold rounded-lg shadow-md hover:bg-[#e87f00] transition-colors duration-300"
              onClick={() => router.push("/kontakt")} 
            >
              Kontakt
            </button>
              <p className="text-red-500 text-tiny text-left pl-3  ">
                Zaufało Mi już 200+ klientów!
              </p>
            </div>
          </motion.div>
          {/* <div className="absolute left-0 -bottom-4 border-b-4 border-l-4 border-solid border-white w-16 h-16" />
          <div className="absolute right-0 -bottom-4 border-b-4 border-r-4 border-solid border-white w-16 h-16" /> */}
        </motion.div>
      </div>

    </div>
  );
};

export default VideoHero;
