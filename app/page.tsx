"use client";
import React, { useEffect } from "react";
import VideoHero from "./components/hero/VideoHero";
import Portfolio from "./components/Portfolio";
import TrustedBy from "./components/TrustedBy";
import HowItWorks from "./components/HowItWorks";
import WhoAmI2 from "./components/WhoAmI2";
import Services from "./components/Services";
import MuralsMap from "./components/MuralsMap";
import { portfolioPhotos, PtasieMurale } from "@/app/lib/photos";
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
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

    // 
    gsap.registerPlugin(ScrollTrigger, SplitText);
    console.log("Plugins registered");
    // setTimeout(() => {
    //   setupMarqueeAnimation();
    // }, 100);

    // Mobile: wyłączamy ciężkie animacje (pin/ScrollTrigger/SplitText) i zostawiamy statyczny slider
    if (isMobile) {
      setupMarqueeAnimation();
      // Upewnij się, że treści są widoczne bez animacji
      gsap.set(".card-title .char span", { x: "0%" });
      gsap.set(".card-content .card-description", { x: 0, opacity: 1 });
      return;
    }
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    const cards = gsap.utils.toArray<HTMLElement>(".card");
    const introCard = cards[0];
    const titles = gsap.utils.toArray<HTMLElement>(".card-title h1");
    titles.forEach((title) => {
      const split = new SplitText(title, {
        type: "chars",
        charsClass: "char",
        tag: "div",
      });
      split.chars.forEach((char) => {
        char.innerHTML = `<span>${char.textContent}</span>`;
      });
    });
        // Ukryj wszystkie znaki tytułów i opisy na starcie
        gsap.set(".card-title .char span", { x: "100%" });
        gsap.set(".card-content .card-description", { x: "40px", opacity: 0 });
    // Sprawdź co znajduje
    const allSpans = document.querySelectorAll(".card-title .char span");
    console.log("Znaleziono spanów:", allSpans.length);
    console.log("Spany:", allSpans);
    
    const cardImgWrapper = introCard.querySelector(".card-img");
    const cardImg = introCard.querySelector(".card-img img");
    gsap.set(cardImgWrapper, { scale: 0.5, borderRadius: "400px" });
    gsap.set(cardImg, { scale: 1.5 });

    const marquee = introCard.querySelector(".card-marquee .marquee");
    const titleChars = introCard.querySelectorAll(".char span");
    const description = introCard.querySelector(".card-description");
    let introContentRevealed = false;

    ScrollTrigger.create({
      trigger: introCard,
      start: "top top",
      end: "+=300vh",
      onUpdate: (self) => {
        const progress = self.progress;
        const imgScale = 0.5 + progress * 0.5;
        const borderRadius = 400 - progress * 375;
        const innerImgScale = 1.5 - progress * 0.5;

        gsap.set(cardImgWrapper, {
          scale: imgScale,
          borderRadius: borderRadius + "px",
        });
        gsap.set(cardImg, { scale: innerImgScale });

        if (imgScale >= 0.5 && imgScale <= 0.75) {
          const fadeProgress = (imgScale - 0.5) / (0.75 - 0.5);
          gsap.set(marquee, { opacity: 1 - fadeProgress });
        } else if (imgScale < 0.5) {
          gsap.set(marquee, { opacity: 1 });
        } else if (imgScale > 0.75) {
          gsap.set(marquee, { opacity: 0 });
        }

        if (progress >= 1 && !introContentRevealed) {
          introContentRevealed = true;
          animateContentIn(titleChars, description);
        }
        if (progress < 1 && introContentRevealed) {
          introContentRevealed = false;
          animateContentOut(titleChars, description);
        }
      },
    });

    cards.forEach((card, index) => {
      const cardEl = card as HTMLElement;
      const isLastCard = index === cards.length - 1;
      const isPanorama = cardEl.classList?.contains("panorama-card");
      
      ScrollTrigger.create({
        trigger: card,
        start: "top top",
        // Panorama potrzebuje dłuższego pinowania na wewnętrzny scroll
        end: isPanorama ? "+=200%" : (isLastCard ? "+=100vh" : "top top"),
        endTrigger: (isLastCard || isPanorama) ? null : cards[cards.length - 1],
        pin: true,
        // pinSpacing false powodowało nakładanie się na hero; włączone dla wszystkich
        pinSpacing: true,
      });
    });

    cards.forEach((card, index) => {
      if (index < cards.length - 1) {
        const cardWrapper = card.querySelector(".card-wrapper");
        ScrollTrigger.create({
          trigger: cards[index + 1],
          start: "top bottom",
          end: "top top",
          onUpdate: (self) => {
            const progress = self.progress;
            gsap.set(cardWrapper, {
              scale: 1 - progress * 0.25,
              opacity: 1 - progress,
            });
          },
        });
      }
    });

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
        
        ScrollTrigger.create({
          trigger: card,
          start: "top bottom",
          end: "top top",
          onUpdate: (self) => {
            const progress = self.progress;
            if (cardImg) gsap.set(cardImg, { scale: 2 - progress });
            if (imgContainer) gsap.set(imgContainer, { borderRadius: 150 - progress * 125 + "px" });
          },
        });
      }
    });

    cards.forEach((card, index) => {
      if (index === 0) return;

      const cardDescription = card.querySelector(".card-description");
      const cardTitleChars = card.querySelectorAll(".char span");

      ScrollTrigger.create({
        trigger: card,
        start: "top top",
        onEnter: () => animateContentIn(cardTitleChars, cardDescription),
        onLeaveBack: () => animateContentOut(cardTitleChars, cardDescription),
      });
    });

    setupMarqueeAnimation();
   // Cleanup function - wywoła się przy unmount komponentu
    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, []); // Pusta tablica zależności = wykona się raz po zamontowaniu



  return (
    <div className="flex flex-col font-[family-name:var(--font-geist-sans)] min-h-screen  mt-20 antialiased">
      <main className="flex-1 items-center sm:items-start min-h-screen overflow-visible">
        <VideoHero />
        <Intro />
        <Cards />
        <PanoramaScroll />
        <Outro />

        <Portfolio 
          data={portfolioPhotos} 
        />
        
        {/* <Services /> */}

        <Portfolio 
          data={PtasieMurale} 
        />
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
