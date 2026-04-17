"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/app/components/ui/button";

/**
 * Sun <-> Moon morph inspired by https://codepen.io/wgao19/pen/vMzOgQ
 *
 * The sun body is a full circle masked by a second "cutout" circle.
 * In dark mode the cutout circle moves into the upper-right quadrant,
 * biting a crescent out of the disc. Rays collapse and fade simultaneously.
 */
function SunMoonIcon({ isDark }: { isDark: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="theme-toggle-icon"
      data-mode={isDark ? "dark" : "light"}
      aria-hidden="true"
    >
      <mask id="theme-toggle-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
        <rect x="0" y="0" width="24" height="24" fill="white" />
        <circle className="theme-toggle-cutout" cx="24" cy="0" r="7" fill="black" />
      </mask>
      <circle
        className="theme-toggle-disc"
        cx="12"
        cy="12"
        r="5"
        mask="url(#theme-toggle-mask)"
        fill="currentColor"
        stroke="none"
      />
      <g className="theme-toggle-rays">
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </g>
    </svg>
  );
}

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full h-10 w-10 bg-secondary text-foreground transition-colors"
        aria-hidden="true"
        tabIndex={-1}
      >
        <SunMoonIcon isDark={false} />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full h-10 w-10 bg-secondary hover:bg-accent text-foreground hover:text-white transition-colors"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Włącz tryb jasny" : "Włącz tryb ciemny"}
    >
      <SunMoonIcon isDark={!isDark} />
    </Button>
  );
}
