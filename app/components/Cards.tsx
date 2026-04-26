"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface CardsProps {
  /** Start index (inclusive), default 0 */
  startIndex?: number;
  /** End index (inclusive), default all cards */
  endIndex?: number;
}

const Cards = ({ startIndex = 0, endIndex }: CardsProps) => {
  const desktopImages = [
    "/Animation/Murale_Wielkoformatowe/TitleCard/desktop.webp",
    "/Animation/Komunikacja_Wizualna/TitleCard/desktop.webp",
    "/Animation/Wnetrza_i_Dekoracje/TitleCard/desktop.webp",
    "/Animation/Projekty_Specjalne/TitleCard/desktop.webp",
  ];

  const mobileImages = [
    "/Animation/Murale_Wielkoformatowe/TitleCard/mobile.webp",
    "/Animation/Komunikacja_Wizualna/TitleCard/mobile.webp",
    "/Animation/Wnetrza_i_Dekoracje/TitleCard/mobile.webp",
    "/Animation/Projekty_Specjalne/TitleCard/mobile.webp",
  ];

  const cardsData = [
    {
      title: "Murale Wielkoformatowe",
      description: "Przekształcam szare ściany w żywe dzieła sztuki. Każdy mural to opowieść wyrażona kolorem i formą na wielkim płótnie miasta.",
      hasMarquee: true,
    },
    {
      title: "Komunikacja Wizualna",
      description: "Ręcznie malowane szyldy i logotypy, które wyróżnią Twój biznes. Unikalne projekty łączące tradycyjne rzemiosło z nowoczesnym designem.",
      hasMarquee: false,
    },
    {
      title: "Wnętrza i Dekoracje",
      description: "Artystyczne malunki ścienne do domu, biura czy lokalu. Tworzę niepowtarzalne klimaty – od subtelnych wzorów po odważne kompozycje.",
      hasMarquee: false,
    },
    {
      title: "Inne",
      description: "Realizuję niestandardowe projekty i współpraca z markami.",
      hasMarquee: false,
    },
  ];

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const imgs = isMobile ? mobileImages : desktopImages;
  const actualEndIndex = endIndex ?? cardsData.length - 1;
  const visibleCards = cardsData.slice(startIndex, actualEndIndex + 1);

  return (
    <section className="cards">
      {visibleCards.map((card, idx) => {
        const originalIndex = startIndex + idx;
        const isFirst = originalIndex === 0;
        return (
          <div className="card" key={originalIndex} data-card-index={originalIndex}>
            {card.hasMarquee && (
              <div className="card-marquee">
                <div className="marquee">
                  {/* Duplicated 2× so totalWidth > viewport even on 4K/ultrawide —
                      prevents the GSAP horizontalLoop from leaving a gap that
                      makes a phrase pop into view statically after some cycles. */}
                  {[0, 1].flatMap((rep) => [
                    <h1 key={`${rep}-0`}>Sztuka na Murach</h1>,
                    <h1 key={`${rep}-1`}>Kolor Zmienia Przestrzeń</h1>,
                    <h1 key={`${rep}-2`}>Tworzę z Pasją</h1>,
                    <h1 key={`${rep}-3`}>Graffiti z Duszą</h1>,
                  ])}
                </div>
              </div>
            )}
            <div className="card-wrapper">
              <div className="card-img">
                <Image
                  src={imgs[originalIndex]}
                  alt={card.title}
                  fill
                  priority={isFirst}
                  sizes="100vw"
                  style={{ objectFit: "cover" }}
                  onLoadingComplete={() => ScrollTrigger.refresh()}
                />
              </div>
              <div className="card-dim" aria-hidden />
              <div className="card-content">
                <div className="card-title">
                  <h1>{card.title}</h1>
                </div>
                <div className="card-description">
                  <p>{card.description}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default Cards;