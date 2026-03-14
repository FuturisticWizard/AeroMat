"use client";
import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAudio } from "@/app/context/AudioContext";
import dynamic from "next/dynamic";

// Register ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Ensure video player is only on client if needed, or stick to native <video> for simplicity in overlay
const WindowOverlay = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoContainerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const { muted } = useAudio();

    useEffect(() => {
        const container = containerRef.current;
        const videoContainer = videoContainerRef.current;
        const video = videoRef.current;

        if (!container || !videoContainer || !video) return;

        // Mobile check - adjust scale factor
        const isMobile = window.innerWidth < 768;
        const maxScale = isMobile ? 80 : 50; 

        // Initial setup
        // We set the mask image on the video container
        // The mask is the window shape.
        // Initially, the mask size is small (the window icon size).
        // As we scroll, we scale the entire container (or just the mask size) UP.
        
        // Let's rely on scaling the container with a counter-scale on the video? 
        // No, simplest is `mask-size` or `clip-path`.
        
        // CLIP-PATH approach (smoother performance usually):
        // Start: clip-path: inset(40% 45% 40% 45% round 10px) -> tiny window
        // End: clip-path: inset(0% 0% 0% 0% round 0px) -> full screen
        
        // MASK-IMAGE approach (for complex shapes like the provided SVG):
        // Start: mask-size: 20%
        // End: mask-size: 300% (or huge enough to cover screen)
        // Note: `mask-repeat: no-repeat`, `mask-position: center`

        // We will animate `maskSize`.
        
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: container,
                start: "top top",
                end: "bottom bottom",
                scrub: 1, 
                pin: true, // Pin the container itself (it's h-[300vh] so wait... pinning container pins it for duration of scrollTop)
                // Actually, standard pattern: 
                // Outer container: h-[300vh] (scroll space)
                // Inner Sticky: h-screen top-0
                // Pin trigger: Outer container. Pin target: Inner Sticky.
            }
        });

        // Current implementation tries to pin the inner sticky div relative to the viewing area.
        // Let's refine the structure below in JSX.

        // Animate the mask size of the video container
        // We need to use `webkitMaskSize` as well for compatibility.
        // from 10% (small window) to 300% (full reveals)
        // Wait, if mask-size grows, the window hole grows. 
        // The content (video) stays same size (cover).
        // This effectively "zooms into the window".
        
        tl.fromTo(videoContainer, 
            { 
                maskSize: "20%",
                webkitMaskSize: "20%",
                maskImage: "url(/window.svg)",
                webkitMaskImage: "url(/window.svg)",
                maskRepeat: "no-repeat",
                webkitMaskRepeat: "no-repeat",
                maskPosition: "center",
                webkitMaskPosition: "center"
            },
            {
                maskSize: "500%", // Scale until it covers screen
                webkitMaskSize: "500%",
                ease: "power2.inOut",
                duration: 1
            }
        );

        return () => {
            if (tl.scrollTrigger) tl.scrollTrigger.kill();
            tl.kill();
        };

    }, []);

    return (
        <div ref={containerRef} className="relative w-full h-[300vh] bg-black">
            <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">
                
                {/* The Video Container that gets masked */}
                <div 
                    ref={videoContainerRef}
                    className="relative w-full h-full bg-black flex items-center justify-center"
                    style={{
                        // Default styles (overridden by GSAP)
                        maskImage: "url(/window.svg)",
                        WebkitMaskImage: "url(/window.svg)",
                        maskRepeat: "no-repeat",
                        WebkitMaskRepeat: "no-repeat",
                        maskPosition: "center",
                        WebkitMaskPosition: "center",
                        maskSize: "20%",
                        WebkitMaskSize: "20%"
                     }}
                >
                    <video
                        ref={videoRef}
                        autoPlay
                        muted={muted}
                        loop
                        playsInline
                        className="absolute w-full h-full object-cover"
                        style={{ objectFit: "cover" }}
                    >
                        <source src="/movies/hero_compressed.mp4" type="video/mp4" />
                    </video>
                    {/* Optional overlay on video itself */}
                    <div className="absolute inset-0 bg-black/10 pointer-events-none" />
                </div>

                {/* Optional "Wall" text or framing elements that fade out? 
                    Current design: Black background of parent is visible OUTSIDE the mask.
                    So it looks like a black wall with a video window.
                */}
            </div>
        </div>
    );
};

export default WindowOverlay;
