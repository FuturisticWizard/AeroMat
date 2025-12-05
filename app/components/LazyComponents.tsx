"use client";
import dynamic from "next/dynamic";
import React, { Suspense } from "react";

// Loading components
const MapLoadingPlaceholder = () => (
  <div className="flex flex-col mx-auto h-96 w-full max-w-5xl items-center justify-center border border-gray-200 rounded-lg shadow-sm bg-gray-50 animate-pulse">
    <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-4"></div>
    <div className="text-gray-600 text-sm">Loading interactive map...</div>
    <div className="text-gray-500 text-xs mt-2">This may take a few seconds</div>
  </div>
);

const ThreeLoadingPlaceholder = () => (
  <div className="flex items-center justify-center w-full h-96 bg-gray-50 rounded-lg animate-pulse">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
      <div className="text-gray-600 text-sm">Loading 3D scene...</div>
    </div>
  </div>
);

const YouTubeLoadingPlaceholder = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
    {Array.from({ length: 6 }, (_, i) => (
      <div key={i} className="bg-gray-200 rounded-lg h-48"></div>
    ))}
  </div>
);

const VideoPlayerLoadingPlaceholder = () => (
  <div className="flex items-center justify-center w-full h-64 bg-gray-200 rounded animate-pulse">
    <div className="text-center">
      <div className="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-2"></div>
      <div className="text-gray-500 text-sm">Loading video...</div>
    </div>
  </div>
);

// Lazy-loaded components with optimized loading
export const LazyGoogleMap = dynamic(
  () => import("./GoogleMap/GoogleMap"),
  {
    ssr: false,
    loading: () => <MapLoadingPlaceholder />
  }
);

export const LazyThreeCanvas = dynamic(
  () => import("./ThreeCanvas"),
  {
    ssr: false,
    loading: () => <ThreeLoadingPlaceholder />
  }
);

export const LazyYouTubeGrid = dynamic(
  () => import("./YoutubeVideosGrid"),
  {
    ssr: false,
    loading: () => <YouTubeLoadingPlaceholder />
  }
);

export const LazyVideoPlayer = dynamic(
  () => import("./VideoPlayer/VideoPlayer"),
  {
    ssr: false,
    loading: () => <VideoPlayerLoadingPlaceholder />
  }
);

// High-order component for intersection observer lazy loading
export const LazyWithIntersection = ({ 
  children, 
  fallback, 
  rootMargin = "100px" 
}: {
  children: React.ReactNode;
  fallback: React.ReactNode;
  rootMargin?: string;
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref}>
      {isVisible ? children : fallback}
    </div>
  );
};

// Optimized lazy wrappers
export const LazyMuralsMapWithIntersection = () => (
  <LazyWithIntersection 
    fallback={<MapLoadingPlaceholder />}
    rootMargin="200px"
  >
    <Suspense fallback={<MapLoadingPlaceholder />}>
      <LazyGoogleMap />
    </Suspense>
  </LazyWithIntersection>
);

export const LazyThreeCanvasWithIntersection = () => (
  <LazyWithIntersection 
    fallback={<ThreeLoadingPlaceholder />}
    rootMargin="150px"
  >
    <Suspense fallback={<ThreeLoadingPlaceholder />}>
      <LazyThreeCanvas />
    </Suspense>
  </LazyWithIntersection>
);

export const LazyYouTubeGridWithIntersection = () => (
  <LazyWithIntersection 
    fallback={<YouTubeLoadingPlaceholder />}
    rootMargin="200px"
  >
    <Suspense fallback={<YouTubeLoadingPlaceholder />}>
      <LazyYouTubeGrid />
    </Suspense>
  </LazyWithIntersection>
);