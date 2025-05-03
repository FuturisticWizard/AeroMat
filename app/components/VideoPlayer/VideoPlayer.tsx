"use client";
import dynamic from "next/dynamic";
import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Slider,
  FormattedTime,
  Direction,
} from "react-player-controls";
import "./VideoPlayer.css";

import PlayWhiteIcon from "../icons/PlayWhiteIcon";

import PauseWhiteIcon from "../icons/PauseWhiteIcon";

import SoundOnWhite from "../icons/SoundOnWhite";

import SoundOffWhite from "../icons/SoundOffWhite";
import MinimizeWhite from "../icons/MinimizeWhite";
import MaximizeWhite from "../icons/MaximizeWhite";
import { ReactPlayerProps } from "react-player";

interface VideoPlayerProps {
  url: string; // Define the type for the `url` prop
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
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const playerRef = useRef<ReactPlayerProps | null>(null);
  const { elementRef, isFullscreen, toggleFullscreen } = useFullscreen();
  const hideControlsTimeout = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const showControls = () => {
    setControlsVisible(true);
    if (hideControlsTimeout.current) {
      clearTimeout(hideControlsTimeout.current);
    }
    hideControlsTimeout.current = setTimeout(
      () => setControlsVisible(false),
      3000,
    );
  };
  useEffect(() => {
    setVolume(0.5);
    const handleUserInteraction = () => showControls();
    const playerElement = elementRef.current;
    if (!playerElement) return;

    playerElement.addEventListener("mousemove", handleUserInteraction);
    playerElement.addEventListener("touchstart", handleUserInteraction);

    return () => {
      if (playerElement) {
        playerElement.removeEventListener("mousemove", handleUserInteraction);
        playerElement.removeEventListener("touchstart", handleUserInteraction);
      }
    };
  }, [elementRef]);

  return (
    <div
      className={`video-container justify-center items-center ${
        isFullscreen ? "fullscreen" : ""
      }`}
      ref={elementRef}
    >
      <ReactPlayer
        url={url}
        playing={playing}
        muted={muted}
        volume={volume}
        controls={true}
        onProgress={({ played }) => setPlayed(played)}
        onDuration={setDuration}
        width="100%"
        height="100%"
        config={{
          file: {
            attributes: { playsInline: true, webkitplaysinline: "true" },
          },
        }}
      />
    </div>
  );
};

export default VideoPlayer;
