"use client";
import React, { useEffect } from "react";
import VideoHero from "./components/hero/VideoHero";
import Portfolio from "./components/Portfolio";
import PortfolioCard from "./components/PortfolioCard";
import TrustedBy from "./components/TrustedBy";
import HowItWorks from "./components/HowItWorks";
import WhoAmI2 from "./components/WhoAmI2";
import Services from "./components/Services";
import MuralsMap from "./components/MuralsMap";
import { portfolioPhotos, komunikacjaWizualnaPhotos, wnetrzaPhotos, projektySpecjalnePhotos } from "@/app/lib/photos";
import { LazyYouTubeGridWithIntersection } from "./components/LazyComponents";
import Intro from "./components/Intro";
import Outro from "./components/Outro";
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
import { Noto_Sans_Multani } from "next/font/google";
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
      
      gsap.ticker.add((time) => lenis!.raf(time * 1000));
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
    gsap.set(cardImgWrapper, { scale: startWrapperScale, borderRadius: "420px" });
    if (introDim) {
      gsap.set(introDim, {
        scale: startWrapperScale,
        borderRadius: "420px",
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
        const borderRadius = 420 - progress * 420;
        const innerImgScale = startInnerScale - progress * (startInnerScale - endInnerScale);

        gsap.set(cardImgWrapper, {
          scale: imgScale,
          borderRadius: borderRadius + "px",
        });
        if (introDim) {
          gsap.set(introDim, {
            scale: imgScale,
            borderRadius: borderRadius + "px",
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
        const showAt = endWrapperScale - 0.03;
        const hideAt = endWrapperScale - 0.08;
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

        // Remaining cards - normal pinning
        const st = ScrollTrigger.create({
          trigger: card,
          start: "top top",
          end: isPanorama ? "+=300%" : isLastCard ? "+=100vh" : "top top",
          endTrigger: isLastCard || isPanorama ? null : cards[cards.length - 1],
          pin: true,
          pinSpacing: isLastCard || isPanorama,
          onToggle: (self) => {
            if (self.isActive) {
              console.log("[Card pin][desktop] active card index", cardIndex);
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

    // Remove the desktop text triggers on mobile
    if (!isMobile) {
      cards.forEach((card) => {
        const cardDescription = card.querySelector<HTMLElement>(".card-description");
        const cardTitleChars = card.querySelectorAll<HTMLElement>(".card-title .char span");
        const dimLayer = card.querySelector<HTMLElement>(".card-dim");
        if (!cardTitleChars.length) return;

        const st = ScrollTrigger.create({
          trigger: card,
          start: "top top",
          onEnter: () => animateContentIn(cardTitleChars, cardDescription, dimLayer),
          onEnterBack: () => animateContentIn(cardTitleChars, cardDescription, dimLayer),
          onLeave: () => animateContentOut(cardTitleChars, cardDescription, dimLayer),
          onLeaveBack: () => animateContentOut(cardTitleChars, cardDescription, dimLayer),
        });

        textTriggers.push({ st, titleChars: cardTitleChars, description: cardDescription });
      });
    }

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

    setupMarqueeAnimation();
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
        gsap.ticker.remove((time) => lenis!.raf(time * 1000));
      } else {
        ScrollTrigger.defaults({ scroller: window });
      }
      window.removeEventListener("load", onLoadRefresh);
      ScrollTrigger.removeEventListener("refresh", revealActiveTexts);
      if (lenis) {
        gsap.ticker.remove((time) => lenis!.raf(time * 1000));
      }
    };
  }, []); // Pusta tablica zależności = wykona się raz po zamontowaniu



  return (
    <div className="flex flex-col font-[family-name:var(--font-geist-sans)] min-h-screen  mt-20 antialiased">
      {/* ScrollTrigger needs actual scrolling. `h-screen overflow-hidden` can prevent scroll on mobile,
          making all scroll-based animations appear "not working". */}
      <main className="flex-1 items-center sm:items-start min-h-screen overflow-x-hidden">
        <VideoHero />
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

        <div className="relative z-[80]">
          <PanoramaScroll />
        </div>
        <Outro />

        {/* Portfolio  /> 

        <Portfolio
          data={PtasieMurale}
        />

        */}

        <LazyYouTubeGridWithIntersection />
        <TrustedBy />
        {/* <WhoAmI2 />

        <HowItWorks /> */}

        <MuralsMap />
        {/* 
        <section id="testimonials" className=" max-w-6xl mx-auto items-center justify-center px-8 md:px-0 py-20">
            <h2 className='xxs:text-2xl px-4 text-center'>Opinie</h2>
       
            
        </section> */}
        {/* <LazyThreeCanvasWithIntersection /> */}
      </main>
    </div>
  );
}
