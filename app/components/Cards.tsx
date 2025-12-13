"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const Cards = () => {
  const desktopImages = [
    "/images/s2a.jpg",
    "/images/magiczny-swiat.jpg",
    "/images/mural-starowka.jpg",
    "/images/5.jpg",
  ];

  const mobileImages = [
    "/images/CZAPLA3.jpg",
    "/images/D1a.jpg",
    "/images/D5a.jpg",
    "/images/kogut.jpg",
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

  return (
    <section className="cards">
        <div className="card">
            <div className="card-marquee">
                <div className="marquee">
                    <h1>Sztuka na Murach</h1>
                    <h1>Kolor Zmienia Przestrzeń</h1>
                    <h1>Tworzę z Pasją</h1>
                    <h1>Graffiti z Duszą</h1>
                </div>
            </div>
            <div className="card-wrapper">
                <div className="card-img">
                    <Image
                        src={imgs[0]}
                        alt="Murale Wielkoformatowe"
                        fill
                        priority
                        sizes="100vw"
                        style={{ objectFit: "cover" }}
                        onLoadingComplete={() => ScrollTrigger.refresh()}
                    />
                </div>
                <div className="card-dim" aria-hidden />
                <div className={"card-content"}>
                    <div className="card-title">
                        <h1>Murale Wielkoformatowe</h1>
                    </div>
                    <div className="card-description">
                        <p>Przekształcam szare ściany w żywe dzieła sztuki. Każdy mural to opowieść wyrażona kolorem i formą na wielkim płótnie miasta.</p>
                    </div>
                </div>
            </div>
        </div>
        <div className="card">
            <div className="card-wrapper">
                <div className="card-img">
                    <Image
                        src={imgs[1]}
                        alt="Szyldy i Logotypy"
                        fill
                        sizes="100vw"
                        style={{ objectFit: "cover" }}
                        onLoadingComplete={() => ScrollTrigger.refresh()}
                    />
                </div>
                <div className="card-dim" aria-hidden />
                <div className="card-content">
                    <div className="card-title">
                        <h1>Szyldy i Logotypy</h1>
                    </div>
                    <div className="card-description">
                        <p>Ręcznie malowane szyldy i logotypy, które wyróżnią Twój biznes. Unikalne projekty łączące tradycyjne rzemiosło z nowoczesnym designem.</p>
                    </div>
                </div>
            </div>
        </div>
        <div className="card">
            <div className="card-wrapper">
                <div className="card-img">
                    <Image
                        src={imgs[2]}
                        alt="Wnętrza i Dekoracje"
                        fill
                        sizes="100vw"
                        style={{ objectFit: "cover" }}
                        onLoadingComplete={() => ScrollTrigger.refresh()}
                    />
                </div>
                <div className="card-dim" aria-hidden />
                <div className="card-content">
                    <div className="card-title">
                        <h1>Wnętrza i Dekoracje</h1>
                    </div>
                    <div className="card-description">
                        <p>Artystyczne malunki ścienne do domu, biura czy lokalu. Tworzę niepowtarzalne klimaty – od subtelnych wzorów po odważne kompozycje.</p>
                    </div>
                </div>
            </div>
        </div>
        <div className="card">
            <div className="card-wrapper">
                <div className="card-img">
                    <Image
                        src={imgs[3]}
                        alt="Projekty Specjalne"
                        fill
                        sizes="100vw"
                        style={{ objectFit: "cover" }}
                        onLoadingComplete={() => ScrollTrigger.refresh()}
                    />
                </div>
                <div className="card-dim" aria-hidden />
                <div className="card-content">
                    <div className="card-title">
                        <h1>Projekty Specjalne</h1>
                    </div>
                    <div className="card-description">
                        <p>Eventy, festiwale, akcje artystyczne. Realizuję niestandardowe projekty – live painting, warsztaty graffiti i współpraca z markami.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
};

export default Cards;