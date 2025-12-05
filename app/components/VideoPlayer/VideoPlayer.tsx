"use client";
import dynamic from "next/dynamic";
import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import "./VideoPlayer.css";

import PlayWhiteIcon from "../icons/PlayWhiteIcon";
import PauseWhiteIcon from "../icons/PauseWhiteIcon";
import SoundOnWhite from "../icons/SoundOnWhite";
import SoundOffWhite from "../icons/SoundOffWhite";
import MinimizeWhite from "../icons/MinimizeWhite";
import MaximizeWhite from "../icons/MaximizeWhite";

interface VideoPlayerProps {
  url: string; // Define the type for the `url` prop
}

interface ProgressState {
  played: number;
  playedSeconds: number;
  loaded: number;
  loadedSeconds: number;
}

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

const useFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const elementRef = useRef<HTMLDivElement | null>(null);
  const toggleFullscreen = () => {
    if (
      !document.fullscreenElement &&
      !document.webkitFullscreenElement &&
      !isFullscreen
    ) {
      if (elementRef.current?.requestFullscreen) {
        elementRef.current.requestFullscreen();
      } else if (elementRef.current?.webkitRequestFullscreen) {
        elementRef.current.webkitRequestFullscreen();
      } else if (elementRef.current) {
        // Fallback for iOS & mobile browsers
        elementRef.current.style.position = "fixed";
        elementRef.current.style.top = "0";
        elementRef.current.style.left = "0";
        elementRef.current.style.width = "100vw";
        elementRef.current.style.height = "100vh";
        elementRef.current.style.zIndex = "9999";
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (elementRef.current) {
        // Remove mobile fullscreen fallback styles
        elementRef.current.style.position = "";
        elementRef.current.style.top = "";
        elementRef.current.style.left = "";
        elementRef.current.style.width = "";
        elementRef.current.style.height = "";
        elementRef.current.style.zIndex = "";
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  return { elementRef, isFullscreen, toggleFullscreen };
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url }) => {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true); // Start muted for autoplay
  const [volume, setVolume] = useState(0.5);
  const playerRef = useRef<any>(null);
  const { elementRef, isFullscreen, toggleFullscreen } = useFullscreen();

  return (
    <div
      className={`video-container justify-center items-center ${
        isFullscreen ? "fullscreen" : ""
      }`}
      ref={elementRef}
    >
      <ReactPlayer
        ref={playerRef}
        url={url}
        playing={playing}
        muted={muted}
        volume={volume}
        controls={true}
        width="100%"
        height="100%"
        config={useMemo(() => ({
          file: {
            attributes: { 
              playsInline: true, 
              webkitplaysinline: "true",
              preload: "metadata"
            },
          },
        }), [])}
        onReady={() => {
          console.log("Video player ready");
        }}
        onError={(error) => {
          console.error("Video player error:", error);
        }}
      />
    </div>
  );
};

export default VideoPlayer;
