"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/app/components/ui/button";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { FlipWords } from "@/app/components/ui/flip-words";
import { useRouter } from "next/navigation";

const VideoHero = ({
  videoUrl = "/movies/hero_compressed.mp4", // Changed to compressed version
  title = "Przekształć swoją przestrzeń ",
  subtitle = "w dzieło sztuki",
  ctaText = "Zadzwoń",
}) => {
  const [muted, setMuted] = useState(true);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const videoVolumeRef = useRef<HTMLVideoElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const words = [
    "przyciągają wzrok i klientów",
    "pomagają w budowaniu silnego wizerunku",
    "zwiększają widoczność Twojej marki",
  ];
  const router = useRouter(); 

  // Load video after component mounts (lazy loading)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldLoadVideo(true);
    }, 100); // Small delay to prioritize other page elements

    return () => clearTimeout(timer);
  }, []);

  // Preload the poster image
  useEffect(() => {
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.src = "/images/mural-starowka-zwyzka.jpg";
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = muted;
    }
    if (!muted && videoVolumeRef.current) {
      videoVolumeRef.current.volume = 0.2; // Set volume to half
    }
  }, [muted]);

  const toggleMute = () => {
    if (!muted && videoVolumeRef.current) {
      videoVolumeRef.current.volume = 0.2; // Set volume to half
    }
    setMuted(!muted);
  };

  return (
    <div className="relative w-full h-screen max-w-8xl justify-center items-center overflow-hidden">
      {/* Video Background */}
      {shouldLoadVideo ? (
        <motion.video
          ref={videoVolumeRef}
          autoPlay
          muted={muted}
          loop
          preload="metadata" // Changed from "auto" to "metadata"
          playsInline
          poster="/images/mural-starowka-zwyzka.jpg" // Add poster image while video loads
          className="w-full h-full object-cover object-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: imageLoaded ? 1 : 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          {/* Multiple sources for better compression */}
          <source src="/movies/hero_medium.webm" type="video/webm" />
        </motion.video>
      ) : (
        <motion.div 
          className="w-full h-full object-cover object-center bg-cover bg-center" 
          style={{ backgroundImage: 'url(/images/mural-starowka-zwyzka.jpg)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: imageLoaded ? 1 : 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      )}

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
          <div className="absolute left-0 -top-4 border-t-4 border-l-4 border-solid border-white w-16 h-16" />
          <div className="absolute right-0 -top-4 border-t-4 border-r-4 border-solid border-white w-16 h-16" />

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
            {/* Call Button for Mobile */}
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="fixed bottom-4 left-4 right-4 sm:hidden z-[90]"
          >
            <a
              href="tel:+48780428883"
              className="block w-full text-center bg-[#FE9100] text-white font-bold py-3 rounded-lg shadow-lg hover:bg-[#e87f00] transition-colors duration-300"
            >
              Zadzwoń: +48 780 428 883
            </a>
          </motion.div>
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
          <div className="absolute left-0 -bottom-4 border-b-4 border-l-4 border-solid border-white w-16 h-16" />
          <div className="absolute right-0 -bottom-4 border-b-4 border-r-4 border-solid border-white w-16 h-16" />
        </motion.div>
      </div>

      {/* Mute Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="absolute top-12 right-4 z-30"
      >
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-12 w-12 bg-black/80 hover:bg-white/10 text-white mt-12"
          onClick={toggleMute}
          aria-label={muted ? "Unmute video" : "Mute video"}
        >
          {muted ? (
            <VolumeX className="h-8 w-8" />
          ) : (
            <Volume2 className="h-8 w-8" />
          )}
        </Button>
      </motion.div>
    </div>
  );
};

export default VideoHero;
