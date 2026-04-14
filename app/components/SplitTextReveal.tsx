"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

interface Props {
  children: ReactNode;
  selector?: string;
  stagger?: number;
  duration?: number;
  className?: string;
}

const useIsoEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const SplitTextReveal = ({
  children,
  selector = "h1, h2, h3",
  stagger = 0.02,
  duration = 0.9,
  className = "",
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useIsoEffect(() => {
    gsap.registerPlugin(ScrollTrigger, SplitText);
    const container = ref.current;
    if (!container) return;

    const headings = Array.from(container.querySelectorAll<HTMLElement>(selector));
    if (headings.length === 0) {
      setReady(true);
      return;
    }

    const splits: SplitText[] = [];
    headings.forEach((h) => {
      const split = new SplitText(h, {
        type: "chars",
        charsClass: "split-char",
        tag: "div",
      });
      split.chars.forEach((c) => {
        const text = c.textContent ?? "";
        c.textContent = "";
        const span = document.createElement("span");
        span.textContent = text;
        c.appendChild(span);
      });
      splits.push(split);
    });

    const allChars = container.querySelectorAll(".split-char span");
    gsap.set(allChars, { x: "110%" });
    setReady(true);

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: "top 80%",
      once: true,
      onEnter: () => {
        gsap.to(allChars, {
          x: "0%",
          duration,
          ease: "power3.out",
          stagger,
        });
      },
    });

    return () => {
      trigger.kill();
      splits.forEach((s) => s.revert());
    };
  }, [selector, stagger, duration]);

  const combined = ready ? className : `${className} split-pending`.trim();

  return (
    <div ref={ref} className={combined}>
      {children}
    </div>
  );
};

export default SplitTextReveal;
