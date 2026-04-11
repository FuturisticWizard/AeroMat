"use client";
import React, { useEffect } from "react";
// import VideoHero from "./components/hero/VideoHero";
import GlitchedVideoHero from "./components/hero/GlitchedVideoHero";
import Portfolio from "./components/Portfolio";
import PortfolioCard from "./components/PortfolioCard";
import TrustedBy from "./components/TrustedBy";
import HowItWorks from "./components/HowItWorks";
import WhoAmI2 from "./components/WhoAmI2";
import Services from "./components/Services";
import MuralsMap from "./components/MuralsMap";
import { portfolioPhotos, komunikacjaWizualnaPhotos, wnetrzaPhotos, projektySpecjalnePhotos } from "@/app/lib/photos";
import { LazyYouTubeGridWithIntersection, LazyPanoramaScrollWithIntersection, LazyTestimonialsWithIntersection } from "./components/LazyComponents";
import Intro from "./components/Intro";
import Outro from "./components/Outro";
import AboutMe from "./components/AboutMe";
import Cards from "./components/Cards";
import PanoramaScroll from "./components/PanoramaScroll";
import setupMarqueeAnimation from "./lib/marquee";
import {
  animateContentIn,
  animateContentOut,
} from "@/app/lib/animations";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis"; 
// import Hero from "./components/Hero";
// <a href="https://www.vecteezy.com/free-png/paint-roller">Paint Roller PNGs by Vecteezy</a>

export default function Home() {
  
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, SplitText);
    console.log("Plugins registered");
    const mm = gsap.matchMedia();
    const isMobile = window.innerWidth < 768;
    console.log("[Viewport] isMobile:", isMobile);

    let lenis: Lenis | null = null;
    let lenisRaf: ((time: number) => void) | null = null;
    let currentScroll = 0;
    const scroller = document.documentElement;

    if (!isMobile) {
      lenis = new Lenis();
      lenis.on("scroll", ({ scroll }) => {
        currentScroll = scroll;
        ScrollTrigger.update();
      });
      console.log("[Lenis] init, start scroll:", currentScroll);

      ScrollTrigger.scrollerProxy(scroller, {
        scrollTop(value) {
          if (arguments.length) {
            lenis!.scrollTo(value as number, { immediate: true, duration: 0 });
            console.log("[scrollerProxy] set scrollTop ->", value);
          }
          return currentScroll;
        },
        getBoundingClientRect() {
          return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight,
          };
        },
        pinType: scroller.style.transform ? "transform" : "fixed",
      });
      console.log("[ScrollTrigger] scrollerProxy set on <html>");

      ScrollTrigger.defaults({ scroller });
      ScrollTrigger.refresh();
      console.log("[ScrollTrigger] defaults set + refresh");
      
      lenisRaf = (time: number) => lenis!.raf(time * 1000);
      gsap.ticker.add(lenisRaf);
      gsap.ticker.lagSmoothing(0);
    } else {
      ScrollTrigger.defaults({ scroller: window });
      ScrollTrigger.refresh();
      console.log("[ScrollTrigger] mobile defaults set (no Lenis) + refresh");
    }

    const cards = gsap.utils.toArray<HTMLElement>(".card");
    const introCard = cards[0];
    console.log("[Cards] found:", cards.length);
    console.log("[Cards] isMobile:", isMobile);

    // Set z-index directly on .card elements so it works with position:fixed (GSAP pin).
    // Wrapper div z-index doesn't apply to pinned children.
    const cardZIndex: Record<number, number> = { 0: 10, 1: 30, 2: 50, 3: 60 };
    cards.forEach((card) => {
      const idx = parseInt(card.dataset.cardIndex || "-1", 10);
      if (card.classList.contains("panorama-card")) {
        gsap.set(card, { zIndex: 80 });
      } else if (cardZIndex[idx] !== undefined) {
        gsap.set(card, { zIndex: cardZIndex[idx] });
      }
    });
    
    const introEndValue = isMobile ? "+=120vh" : "+=300vh";
    if (isMobile) {
      gsap.set(".card", { height: "100vh", minHeight: "480px" });
      gsap.set(".card-img", { height: "100vh", minHeight: "480px" });
      gsap.set(".card-img img", { height: "100%", minHeight: "100%", scale: 1 });
      requestAnimationFrame(() => ScrollTrigger.refresh());
      setTimeout(() => ScrollTrigger.refresh(), 200);
    }
    
    const titles = gsap.utils.toArray<HTMLElement>(".card-title h1");
    console.log("[Titles] found:", titles.length);
    
    titles.forEach((title, index) => {
      console.log(`[Title ${index}] text:`, title.textContent);
      const split = new SplitText(title, {
        type: "chars",
        charsClass: "char",
        tag: "div",
      });
      console.log(`[Title ${index}] split chars:`, split.chars.length);
      split.chars.forEach((char) => {
        char.innerHTML = `<span>${char.textContent}</span>`;
      });
    });
    
    // Ukryj wszystkie znaki tytułów i opisy na starcie
    gsap.set(".card-title .char span", { x: "110%" });
    gsap.set(".card-content .card-description", { x: "40px", opacity: 0 });
    gsap.set(".card-dim", { opacity: 0 });
    
    // (debug logs removed)
    
    const cardImgWrapper = introCard.querySelector(".card-img");
    const cardImg = introCard.querySelector(".card-img img");
    const introDim = introCard.querySelector(".card-dim");
    const startWrapperScale = isMobile ? 0.35 : 0.5;
    const endWrapperScale = isMobile ? 1.05 : 1.0;
    const startInnerScale = isMobile ? 1.8 : 1.5;
    const endInnerScale = 1.0;
    gsap.set(cardImgWrapper, { scale: startWrapperScale, clipPath: "circle(closest-side at 50% 50%)", borderRadius: "0px" });
    if (introDim) {
      gsap.set(introDim, {
        scale: startWrapperScale,
        clipPath: "circle(closest-side at 50% 50%)",
        borderRadius: "0px",
        transformOrigin: "center",
      });
    }
    gsap.set(cardImg, { scale: startInnerScale });

    const marquee = introCard.querySelector(".card-marquee .marquee");
    const titleChars = introCard.querySelectorAll(".card-title .char span");
    const description = introCard.querySelector(".card-description");
    let introTextRevealed = false;

    ScrollTrigger.create({
      trigger: introCard,
      start: "top top",
      end: introEndValue,
      onUpdate: (self) => {
        const progress = self.progress;
        const imgScale = startWrapperScale + progress * (endWrapperScale - startWrapperScale);
        const innerImgScale = startInnerScale - progress * (startInnerScale - endInnerScale);

        // Stay circular via clip-path until 80% progress, then expand to full rectangle
        const radiusThreshold = 0.8;
        let clipPath: string;
        if (progress < radiusThreshold) {
          clipPath = "circle(closest-side at 50% 50%)";
        } else {
          // Transition from closest-side (~50vh) to farthest-corner (~71% diagonal)
          const radiusProgress = (progress - radiusThreshold) / (1 - radiusThreshold);
          // 50% = closest-side equivalent, expand to 75% which covers the full rectangle
          const radius = 50 + radiusProgress * 25;
          clipPath = `circle(${radius}% at 50% 50%)`;
        }

        gsap.set(cardImgWrapper, {
          scale: imgScale,
          clipPath: clipPath,
        });
        if (introDim) {
          gsap.set(introDim, {
            scale: imgScale,
            clipPath: clipPath,
          });
        }
        gsap.set(cardImg, { scale: innerImgScale });

        if (imgScale >= 0.5 && imgScale <= 0.75) {
          const fadeProgress = (imgScale - 0.5) / (0.75 - 0.5);
          gsap.set(marquee, { opacity: 1 - fadeProgress });
        } else if (imgScale < 0.5) {
          gsap.set(marquee, { opacity: 1 });
        } else if (imgScale > 0.75) {
          gsap.set(marquee, { opacity: 0 });
        }

        // Reveal intro text only once the image has (almost) reached fullscreen scale.
        // Use hysteresis to avoid flicker near the threshold when scrolling slowly.
        const showAt = endWrapperScale - 0.01;
        const hideAt = endWrapperScale - 0.05;
        if (!introTextRevealed && imgScale >= showAt) {
          introTextRevealed = true;
          animateContentIn(titleChars, description, introDim);
        } else if (introTextRevealed && imgScale <= hideAt) {
          introTextRevealed = false;
          animateContentOut(titleChars, description, introDim);
        }
      },
    });

    mm.add("(min-width: 768px)", () => {
      const pins: ScrollTrigger[] = [];

      cards.forEach((card, index) => {
        const cardEl = card as HTMLElement;
        const cardIndex = parseInt(cardEl.dataset.cardIndex || String(index), 10);
        const isIntroCard = cardIndex === 0;
        const isLastCard = index === cards.length - 1;
        const isPanorama = cardEl.classList?.contains("panorama-card");

        // Intro card: przypięta do ostatniej karty (jak inne karty)
        if (isIntroCard) {
          const st = ScrollTrigger.create({
            trigger: card,
            start: "top top",
            end: "top top",
            endTrigger: cards[cards.length - 1],
            pin: true,
            pinSpacing: false,
            onToggle: (self) => {
              if (self.isActive) {
                console.log("[Card pin][desktop] intro card active");
              }
            },
          });
          pins.push(st);
          return;
        }

        // Remaining cards - normal pinning + text reveal
        const cardTitleCharsPin = cardEl.querySelectorAll<HTMLElement>(".card-title .char span");
        const cardDescPin = cardEl.querySelector<HTMLElement>(".card-description");
        const cardDimPin = cardEl.querySelector<HTMLElement>(".card-dim");

        const st = ScrollTrigger.create({
          trigger: card,
          start: "top top",
          end: isPanorama ? "+=300%" : isLastCard ? "+=100vh" : "top top",
          endTrigger: isLastCard || isPanorama ? null : cards[cards.length - 1],
          pin: true,
          pinSpacing: isLastCard || isPanorama,
          scrub: isPanorama ? true : undefined,
          onUpdate: isPanorama ? (self) => {
            window.dispatchEvent(new CustomEvent("panorama-progress", { detail: self.progress }));
          } : undefined,
          onEnter: () => {
            if (cardTitleCharsPin.length && !isPanorama) {
              animateContentIn(cardTitleCharsPin, cardDescPin, cardDimPin);
            }
          },
          onEnterBack: () => {
            if (cardTitleCharsPin.length && !isPanorama) {
              animateContentIn(cardTitleCharsPin, cardDescPin, cardDimPin);
            }
          },
          onLeave: () => {
            if (cardTitleCharsPin.length && !isPanorama) {
              animateContentOut(cardTitleCharsPin, cardDescPin, cardDimPin);
            }
          },
          onLeaveBack: () => {
            if (cardTitleCharsPin.length && !isPanorama) {
              animateContentOut(cardTitleCharsPin, cardDescPin, cardDimPin);
            }
          },
        });
        pins.push(st);
      });
      return () => pins.forEach((st) => st.kill());
    });

    mm.add("(max-width: 767px)", () => {
      const pins: ScrollTrigger[] = [];
      const contentRevealStates: boolean[] = new Array(cards.length).fill(false);

      cards.forEach((card, index) => {
        const cardEl = card as HTMLElement;
        const cardIndex = parseInt(cardEl.dataset.cardIndex || String(index), 10);
        const isIntroCard = cardIndex === 0;
        const isLastCard = index === cards.length - 1;
        const isPanorama = cardEl.classList?.contains("panorama-card");

        // Panorama card handles its own pinning in PanoramaScroll.tsx
        if (isPanorama) {
          return;
        }

        const cardDescription = card.querySelector(".card-description");
        const cardTitleChars = card.querySelectorAll(".card-title .char span");
        const dimLayer = card.querySelector(".card-dim");
        const reveal = () => {
          if (contentRevealStates[index]) return;
          contentRevealStates[index] = true;
          if (cardTitleChars?.length) animateContentIn(cardTitleChars, cardDescription, dimLayer);
          else if (dimLayer) gsap.to(dimLayer, { opacity: 1, duration: 0.45, ease: "power2.out", overwrite: true });
        };
        const hide = () => {
          if (!contentRevealStates[index]) return;
          contentRevealStates[index] = false;
          if (cardTitleChars?.length) animateContentOut(cardTitleChars, cardDescription, dimLayer);
          else if (dimLayer) gsap.to(dimLayer, { opacity: 0, duration: 0.35, ease: "power2.out", overwrite: true });
        };

        // Intro card: pinned until last card (same as desktop) so portfolio can slide over it
        if (isIntroCard) {
          const st = ScrollTrigger.create({
            trigger: card,
            start: "top top",
            end: "top top",
            endTrigger: cards[cards.length - 1],
            pin: true,
            pinSpacing: false,
            anticipatePin: 0.6,
            onLeave: hide,
            onLeaveBack: hide,
          });
          pins.push(st);
          return;
        }

        const st = ScrollTrigger.create({
          trigger: card,
          start: "top top",
          end: isLastCard
            ? () => "+=" + window.innerHeight * 2.0
            : "bottom top+=80%",
          endTrigger: isLastCard ? null : (cards[index + 1] as HTMLElement),
          pin: true,
          pinSpacing: false,
          anticipatePin: 0.6,
          onEnter: reveal,
          onEnterBack: reveal,
          onLeave: hide,
          onLeaveBack: hide,
          onToggle: (self) => {
            if (self.isActive) {
              console.log("[Card pin][mobile] active card index", cardIndex);
            }
          },
        });

        pins.push(st);
      });
      return () => pins.forEach((st) => st.kill());
    });

    // Card→card fade/scale handled by portfolio prevCard animations (each portfolio
    // fades its preceding card). Direct card→card fade removed to avoid opacity reset conflicts.

    // Portfolio Cards - dynamic handling for multiple portfolio sections
    const portfolioCards = gsap.utils.toArray<HTMLElement>(".portfolio-break");

    // Set z-index on portfolio elements (position:fixed from GSAP pin needs explicit z-index)
    const portfolioZIndex: Record<string, number> = { murale: 20, szyldy: 40, wnetrza: 55, projekty: 70 };
    portfolioCards.forEach((el) => {
      const pid = el.dataset.portfolioId || "";
      if (portfolioZIndex[pid] !== undefined) {
        gsap.set(el, { zIndex: portfolioZIndex[pid] });
      }
    });
    const scaleFactor = isMobile ? 0.85 : 0.75;
    const yOffset = isMobile ? -50 : -100;

    // Map portfolio IDs to their previous/next card indices
    const portfolioMapping: Record<string, { prevCardIndex: number; nextCardIndex: number }> = {
      "murale": { prevCardIndex: 0, nextCardIndex: 1 },
      "szyldy": { prevCardIndex: 1, nextCardIndex: 2 },
      "wnetrza": { prevCardIndex: 2, nextCardIndex: 3 },
      "projekty": { prevCardIndex: 3, nextCardIndex: -1 }, // No next card, goes to PanoramaScroll
    };

    portfolioCards.forEach((portfolioEl) => {
      const portfolioId = portfolioEl.dataset.portfolioId || "";
      const portfolioWrapper = portfolioEl.querySelector(".portfolio-wrapper");
      const mapping = portfolioMapping[portfolioId];

      // Find the card BEFORE this portfolio using mapping
      const prevCard = mapping ? cards.find((c) => {
        const idx = parseInt((c as HTMLElement).dataset.cardIndex || "-1", 10);
        return idx === mapping.prevCardIndex;
      }) : null;

      // Find the card AFTER this portfolio using mapping
      const nextCard = mapping && mapping.nextCardIndex >= 0 ? cards.find((c) => {
        const idx = parseInt((c as HTMLElement).dataset.cardIndex || "-1", 10);
        return idx === mapping.nextCardIndex;
      }) : null;

      // Previous card fades when portfolio enters
      if (prevCard) {
        const prevCardWrapper = prevCard.querySelector(".card-wrapper");
        if (prevCardWrapper) {
          ScrollTrigger.create({
            trigger: portfolioEl,
            start: "top bottom",
            end: "top top",
            onUpdate: (self) => {
              const progress = self.progress;
              const scaleVal = 1 - progress * (1 - scaleFactor);
              const opacityVal = 1 - progress;
              gsap.set(prevCardWrapper, {
                scale: scaleVal,
                opacity: opacityVal,
              });
            },
          });
        }
      }

      // Portfolio PIN - pinned until last card
      // Portfolio PIN - pinned until last card (item reveal handled by IntersectionObserver in Images.tsx)
      ScrollTrigger.create({
        trigger: portfolioEl,
        start: "top top",
        end: "top top",
        endTrigger: cards[cards.length - 1],
        pin: true,
        pinSpacing: false,
      });

      // Portfolio fades when next card (or panorama) enters
      const fadeTarget = nextCard || cards.find((c) => (c as HTMLElement).classList.contains("panorama-card")) as HTMLElement | undefined;
      if (fadeTarget && portfolioWrapper) {
        ScrollTrigger.create({
          trigger: fadeTarget,
          start: "top bottom",
          end: "top top",
          onUpdate: (self) => {
            const progress = self.progress;
            const scaleVal = 1 - progress * (1 - scaleFactor);
            const opacityVal = 1 - progress;
            const yVal = progress * yOffset;

            gsap.set(portfolioWrapper, {
              scale: scaleVal,
              opacity: opacityVal,
              y: yVal,
            });
          },
        });
      }
    });

    // Delikatny scale obrazka podczas wyjazdu przypiętej karty (desktop + mobile)
    cards.forEach((card, index) => {
      if (index > 0) {
        const cardEl = card as HTMLElement;
        const isPanorama = cardEl.classList?.contains("panorama-card");
        const cardImg = isPanorama
          ? cardEl.querySelector(".panorama-canvas")
          : cardEl.querySelector(".card-img img");
        const imgContainer = isPanorama
          ? cardEl.querySelector(".panorama-img-wrapper")
          : cardEl.querySelector(".card-img");
        const endPos = "top top";
        const startScale = isMobile ? 1.05 : 2;
        const endScale = 1.0;
        
        ScrollTrigger.create({
          trigger: card,
          start: "top bottom",
          end: endPos,
          onUpdate: (self) => {
            const progress = self.progress;
            const scaleVal = startScale - progress * (startScale - endScale);
            if (cardImg) gsap.set(cardImg, { scale: scaleVal });
          },
        });
      }
    });

    // Teksty kart – główny trigger (desktop + mobile) + inicjalizacja po refresh/ładowaniu
    const textTriggers: {
      st: ScrollTrigger;
      titleChars: NodeListOf<HTMLElement>;
      description: HTMLElement | null;
    }[] = [];

    // Desktop text triggers are now integrated into the pin triggers above (mm.add desktop block).
    // No separate text triggers needed.

    const revealActiveTexts = () => {
      textTriggers.forEach(({ st, titleChars, description }) => {
        if (st.isActive) {
          animateContentIn(titleChars, description);
        }
      });
    };

    // Natychmiast po konfiguracji
    revealActiveTexts();
    // Krótki timeout na przypadek, gdy layout/refresh zmieni aktywne triggery
    setTimeout(revealActiveTexts, 50);

    // Intro neon reveal animation — realistic neon ignition
    const introWords = gsap.utils.toArray<HTMLElement>(".intro-word");
    if (introWords.length) {
      gsap.set(introWords, { opacity: 0.03 });

      const introTl = gsap.timeline({ paused: true });

      // "Maluję ściany," — new tube, ignites quickly with one small hiccup
      introTl.to(introWords[0], { opacity: 0.7, duration: 0.05, ease: "none" }, 0)
        .to(introWords[0], { opacity: 0.1,  duration: 0.04, ease: "none" })
        .to(introWords[0], { opacity: 1,    duration: 0.12, ease: "power2.out" });

      // "które" — smooth ignition, barely flickers
      introTl.to(introWords[1], { opacity: 0.5, duration: 0.04, ease: "none" }, "+=0.3")
        .to(introWords[1], { opacity: 0.15, duration: 0.03, ease: "none" })
        .to(introWords[1], { opacity: 1,    duration: 0.1,  ease: "power2.out" });

      // "opowiadają" — one clean flash, catches immediately
      introTl.to(introWords[2], { opacity: 0.4, duration: 0.04, ease: "none" }, "+=0.2")
        .to(introWords[2], { opacity: 0.08, duration: 0.03, ease: "none" })
        .to(introWords[2], { opacity: 0.9,  duration: 0.06, ease: "none" })
        .to(introWords[2], { opacity: 1,    duration: 0.1,  ease: "power2.out" });

      // "historie." — old tube, struggles to ignite, multiple failed attempts
      introTl.to(introWords[3], { opacity: 0.5,  duration: 0.05, ease: "none" }, "+=0.4")
        .to(introWords[3], { opacity: 0.04, duration: 0.04, ease: "none" })
        // pause — gas cools
        .to(introWords[3], { opacity: 0.04, duration: 0.15, ease: "none" })
        // second try
        .to(introWords[3], { opacity: 0.7,  duration: 0.05, ease: "none" })
        .to(introWords[3], { opacity: 0.1,  duration: 0.05, ease: "none" })
        .to(introWords[3], { opacity: 0.6,  duration: 0.04, ease: "none" })
        .to(introWords[3], { opacity: 0.05, duration: 0.06, ease: "none" })
        // longer pause
        .to(introWords[3], { opacity: 0.05, duration: 0.2,  ease: "none" })
        // third try — catches but flutters
        .to(introWords[3], { opacity: 0.8,  duration: 0.04, ease: "none" })
        .to(introWords[3], { opacity: 0.3,  duration: 0.03, ease: "none" })
        .to(introWords[3], { opacity: 0.9,  duration: 0.04, ease: "none" })
        .to(introWords[3], { opacity: 0.5,  duration: 0.03, ease: "none" })
        .to(introWords[3], { opacity: 0.85, duration: 0.05, ease: "none" })
        .to(introWords[3], { opacity: 0.6,  duration: 0.03, ease: "none" })
        .to(introWords[3], { opacity: 1,    duration: 0.2,  ease: "power2.out" });

      ScrollTrigger.create({
        trigger: ".intro",
        start: "center 66%",
        once: true,
        onEnter: () => introTl.play(),
      });
    }

    // Outro neon ignition animation (same style as intro)
    const outroWords = gsap.utils.toArray<HTMLElement>(".outro-word");
    if (outroWords.length) {
      gsap.set(outroWords, { opacity: 0.03 });

      const outroTl = gsap.timeline({ paused: true });

      // "Masz" — quick ignition
      outroTl.to(outroWords[0], { opacity: 0.7, duration: 0.05, ease: "none" }, 0)
        .to(outroWords[0], { opacity: 0.1,  duration: 0.04, ease: "none" })
        .to(outroWords[0], { opacity: 1,    duration: 0.12, ease: "power2.out" });

      // "ścianę?" — smooth
      outroTl.to(outroWords[1], { opacity: 0.5, duration: 0.04, ease: "none" }, "+=0.3")
        .to(outroWords[1], { opacity: 0.15, duration: 0.03, ease: "none" })
        .to(outroWords[1], { opacity: 1,    duration: 0.1,  ease: "power2.out" });

      // "Mam" — clean flash
      outroTl.to(outroWords[2], { opacity: 0.4, duration: 0.04, ease: "none" }, "+=0.2")
        .to(outroWords[2], { opacity: 0.08, duration: 0.03, ease: "none" })
        .to(outroWords[2], { opacity: 0.9,  duration: 0.06, ease: "none" })
        .to(outroWords[2], { opacity: 1,    duration: 0.1,  ease: "power2.out" });

      // "pomysł." — slight struggle
      outroTl.to(outroWords[3], { opacity: 0.6, duration: 0.05, ease: "none" }, "+=0.25")
        .to(outroWords[3], { opacity: 0.08, duration: 0.04, ease: "none" })
        .to(outroWords[3], { opacity: 0.04, duration: 0.1,  ease: "none" })
        .to(outroWords[3], { opacity: 0.8,  duration: 0.05, ease: "none" })
        .to(outroWords[3], { opacity: 0.4,  duration: 0.03, ease: "none" })
        .to(outroWords[3], { opacity: 1,    duration: 0.15, ease: "power2.out" });

      // "Porozmawiajmy." — old tube, struggles hard
      outroTl.to(outroWords[4], { opacity: 0.5,  duration: 0.05, ease: "none" }, "+=0.4")
        .to(outroWords[4], { opacity: 0.04, duration: 0.04, ease: "none" })
        .to(outroWords[4], { opacity: 0.04, duration: 0.15, ease: "none" })
        .to(outroWords[4], { opacity: 0.7,  duration: 0.05, ease: "none" })
        .to(outroWords[4], { opacity: 0.1,  duration: 0.05, ease: "none" })
        .to(outroWords[4], { opacity: 0.6,  duration: 0.04, ease: "none" })
        .to(outroWords[4], { opacity: 0.05, duration: 0.06, ease: "none" })
        .to(outroWords[4], { opacity: 0.05, duration: 0.2,  ease: "none" })
        .to(outroWords[4], { opacity: 0.8,  duration: 0.04, ease: "none" })
        .to(outroWords[4], { opacity: 0.3,  duration: 0.03, ease: "none" })
        .to(outroWords[4], { opacity: 0.9,  duration: 0.04, ease: "none" })
        .to(outroWords[4], { opacity: 0.5,  duration: 0.03, ease: "none" })
        .to(outroWords[4], { opacity: 1,    duration: 0.2,  ease: "power2.out" });

      // Use IntersectionObserver — reliable regardless of pinned sections above
      const outroSection = document.querySelector(".outro");
      if (outroSection) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                outroTl.play();
                observer.disconnect();
              }
            });
          },
          { threshold: 0.3 }
        );
        observer.observe(outroSection);
      }
    }

    setupMarqueeAnimation();

    // Marquee hover — highlight phrase under cursor (throttled with rAF)
    const marqueeH1s = gsap.utils.toArray<HTMLElement>(".card-marquee .marquee h1");
    const introCardEl = cards[0] as HTMLElement;
    let marqueeRafId = 0;
    let onMouseMove: ((e: MouseEvent) => void) | null = null;
    let onMouseLeave: (() => void) | null = null;
    if (introCardEl && marqueeH1s.length) {
      onMouseMove = (e: MouseEvent) => {
        if (marqueeRafId) return;
        marqueeRafId = requestAnimationFrame(() => {
          marqueeRafId = 0;
          const mx = e.clientX;
          const my = e.clientY;
          marqueeH1s.forEach((h1) => {
            const rect = h1.getBoundingClientRect();
            if (mx >= rect.left && mx <= rect.right && my >= rect.top && my <= rect.bottom) {
              h1.classList.add("marquee-hover");
            } else {
              h1.classList.remove("marquee-hover");
            }
          });
        });
      };
      onMouseLeave = () => {
        marqueeH1s.forEach((h1) => h1.classList.remove("marquee-hover"));
      };
      introCardEl.addEventListener("mousemove", onMouseMove);
      introCardEl.addEventListener("mouseleave", onMouseLeave);
    }

    // Refresh after load to recompute pin-spacer heights once images/fonts are ready
    const onLoadRefresh = () => {
      console.log("[ScrollTrigger] window load -> refresh");
      ScrollTrigger.refresh();
      revealActiveTexts();
    };
    window.addEventListener("load", onLoadRefresh, { once: true });
    ScrollTrigger.addEventListener("refresh", revealActiveTexts);

    if (isMobile) {
      // Upewnij się, że rozmiary pin-spacer są przeliczone po zmianie pinów
      ScrollTrigger.refresh();
    }
   // Cleanup function - wywoła się przy unmount komponentu
    return () => {
      mm.revert();
      if (lenis) {
        lenis.destroy();
        ScrollTrigger.defaults({ scroller: window });
        ScrollTrigger.scrollerProxy(scroller, {});
        if (lenisRaf) gsap.ticker.remove(lenisRaf);
      } else {
        ScrollTrigger.defaults({ scroller: window });
      }
      window.removeEventListener("load", onLoadRefresh);
      ScrollTrigger.removeEventListener("refresh", revealActiveTexts);
      if (introCardEl && onMouseMove) introCardEl.removeEventListener("mousemove", onMouseMove);
      if (introCardEl && onMouseLeave) introCardEl.removeEventListener("mouseleave", onMouseLeave);
      if (marqueeRafId) cancelAnimationFrame(marqueeRafId);
    };
  }, []); // Pusta tablica zależności = wykona się raz po zamontowaniu



  return (
    <div className="flex flex-col min-h-screen mt-20 antialiased">
      {/* ScrollTrigger needs actual scrolling. `h-screen overflow-hidden` can prevent scroll on mobile,
          making all scroll-based animations appear "not working". */}
      <main className="flex-1 items-center sm:items-start min-h-screen overflow-x-hidden">
        {/* <VideoHero /> */}
        <GlitchedVideoHero highlightStyle="stroke" />
        <Intro />

        {/* Card 0: Murale Wielkoformatowe */}
        <div className="relative z-10">
          <Cards startIndex={0} endIndex={0} />
        </div>

        {/* Spacer - intro card "hold" period (provides scroll distance for expand animation) */}
        <div className="intro-hold-spacer h-[80vh]" aria-hidden="true" />

        {/* Portfolio 1: po Murale Wielkoformatowe */}
        <PortfolioCard data={portfolioPhotos} id="murale" gridVariant="11" className="z-20" />

        {/* Card 1: Szyldy i Logotypy */}
        <div className="relative z-30">
          <Cards startIndex={1} endIndex={1} />
        </div>

        {/* Portfolio 2: po Szyldy i Logotypy */}
        <PortfolioCard data={komunikacjaWizualnaPhotos} id="szyldy" gridVariant="7" className="z-40" />

        {/* Card 2: Wnętrza i Dekoracje */}
        <div className="relative z-50">
          <Cards startIndex={2} endIndex={2} />
        </div>

        {/* Portfolio 3: po Wnętrza i Dekoracje */}
        <PortfolioCard data={wnetrzaPhotos} id="wnetrza" gridVariant="11" className="z-[55]" />

        {/* Card 3: Projekty Specjalne */}
        <div className="relative z-[60]">
          <Cards startIndex={3} endIndex={3} />
        </div>

        {/* Portfolio 4: po Projekty Specjalne */}
        <PortfolioCard data={projektySpecjalnePhotos} id="projekty" gridVariant="7sq" className="z-[70]" />

        <div className="relative z-[90]">
          <PanoramaScroll />
        </div>
        <Outro />
        <AboutMe />

        {/* Portfolio  />

        <Portfolio
          data={PtasieMurale}
        />

        */}

        <LazyYouTubeGridWithIntersection />
        <TrustedBy />
        <LazyTestimonialsWithIntersection />

        <MuralsMap />
        {/* <LazyThreeCanvasWithIntersection /> */}
      </main>
    </div>
  );
}
