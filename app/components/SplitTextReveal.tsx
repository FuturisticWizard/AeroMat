"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

interface Props {
  children: ReactNode;
  selector?: string;
  /* Elementy z dluzszym tekstem (akapity) - takze dzielone po literce. */
  paragraphSelector?: string;
  /* Laczny czas rozjazdu fali (sekundy) rozlozony rowno na WSZYSTKIE litery -
     dzieki temu dlugosc tekstu nie wydluza animacji. */
  staggerAmount?: number;
  duration?: number;
  className?: string;
}

const useIsoEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const SplitTextReveal = ({
  children,
  selector = "h1, h2, h3",
  paragraphSelector,
  staggerAmount = 1.2,
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
    const paragraphs = paragraphSelector
      ? Array.from(container.querySelectorAll<HTMLElement>(paragraphSelector))
      : [];
    if (headings.length === 0 && paragraphs.length === 0) {
      setReady(true);
      return;
    }

    const wrapInSpan = (el: Element) => {
      const text = el.textContent ?? "";
      el.textContent = "";
      const span = document.createElement("span");
      span.textContent = text;
      el.appendChild(span);
    };

    const splits: SplitText[] = [];
    headings.forEach((h) => {
      const split = new SplitText(h, {
        type: "chars",
        charsClass: "split-char",
        tag: "div",
      });
      split.chars.forEach(wrapInSpan);
      splits.push(split);
    });
    /* Akapity: podzial na slowa + litery; slowo trzyma litery razem (split-word
       z white-space: nowrap), wiec wiersze lamia sie tylko miedzy slowami. */
    paragraphs.forEach((p) => {
      const split = new SplitText(p, {
        type: "words,chars",
        charsClass: "split-char",
        wordsClass: "split-word",
        tag: "div",
      });
      split.chars.forEach(wrapInSpan);
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
          stagger: { amount: staggerAmount },
        });
      },
    });

    return () => {
      trigger.kill();
      splits.forEach((s) => s.revert());
    };
  }, [selector, paragraphSelector, staggerAmount, duration]);

  const combined = ready ? className : `${className} split-pending`.trim();

  return (
    <div ref={ref} className={combined}>
      {children}
    </div>
  );
};

export default SplitTextReveal;
