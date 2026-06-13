"use client";
import "react-photo-album/rows.css";
import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/app/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { RowsPhotoAlbum, type RenderImageProps, type RenderImageContext } from "react-photo-album";
import { allPhotos } from "@/app/lib/photos";

// Lightbox (~140 KB z wtyczkami + CSS) ładowany leniwie — dopiero po kliknięciu w zdjęcie.
const PortfolioLightbox = dynamic(() => import("@/app/components/PortfolioLightbox"), {
  ssr: false,
});

// Renderuje kafelki galerii przez Next/Image (optymalizator Next.js) zamiast
// surowych <img>. Dzięki temu przeglądarka pobiera wersje zmniejszone do rozmiaru
// wyświetlania (~250 px) w formacie avif/webp — ~20-100 KB zamiast 0,5-1,5 MB.
// Eliminuje "czarne" kafelki (przeciążenie ~45 MB surowych zdjęć w zakładce
// "Wszystkie") i mocno przyspiesza ładowanie.
function renderNextImage(
  { alt = "", title }: RenderImageProps,
  { photo, width, height }: RenderImageContext,
) {
  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: `${width} / ${height}` }}>
      <Image
        fill
        src={photo.src}
        alt={alt}
        title={title}
        sizes="(max-width: 768px) 50vw, 33vw"
        className="object-cover"
      />
    </div>
  );
}

export default function PhotoPortfolio() {
  const categories = ["Wszystkie", "Murale", "Wnętrza", "Ptasia galeria", "Inne"];
  const [index, setIndex] = useState(-1);

  return (
    <div className="min-h-screen bg-black py-8 mt-20">
      <header className="container mx-auto py-12 px-4 md:py-20">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-white">
            AeroMat - Kreatywność Bez Granic
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Dla AeroMat nie ma granic wyobraźni. Tworzę unikalne
            murale, wykorzystując różnorodne techniki malarskie, aby ożywić
            przestrzeń i wyróżnić Twoją markę. Od tradycyjnych pędzli po
            nowoczesne techniki sprayu i aerografu, moje prace są
            wyrazem nieograniczonej kreatywności.
          </p>
          {/* <Button size="lg" className="group">
            Zobacz nasze usługi
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button> */}
        </div>
      </header>

      <main className="container mx-auto px-4 pb-20">
        <Tabs defaultValue="Wszystkie" className="mb-12">
          <div className="flex flex-col py-2 xsm:flex-row items-center justify-between mb-8">
            <h2 className="text-3xl font-bold py-2 text-white">Moje prace</h2>
            <TabsList className="bg-neutral-800 border border-neutral-700">
              {categories.map((category) => (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  className="text-gray-300 data-[state=active]:bg-[#ff7302] data-[state=active]:text-white"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {categories.map((category) => {
            const filtered = allPhotos
              .filter(
                (photo) =>
                  category === "Wszystkie" || photo.category === category,
              )
              .map(({ title, ...rest }) => ({ ...rest, alt: title }));

            return (
              <TabsContent key={category} value={category} className="mt-0">
                <RowsPhotoAlbum
                  photos={filtered}
                  targetRowHeight={250}
                  render={{ image: renderNextImage }}
                  onClick={({ index }) => setIndex(index)}
                />
                {index >= 0 && (
                  <PortfolioLightbox
                    slides={filtered}
                    index={index}
                    close={() => setIndex(-1)}
                  />
                )}
              </TabsContent>
            );
          })}
        </Tabs>

        <section className="bg-neutral-900 border border-neutral-700 rounded-xl p-8 md:p-12 overflow-hidden">
          <div className="grid grid-cols-1 gap-8 items-center">
            <div className="container flex flex-col px-4">
              <h2 className="text-3xl font-bold pb-4 text-white">
                Chcesz nawiązać kontakt ?
              </h2>
              <p className="text-gray-300 pb-6">
                Niezależnie od tego, czy potrzebujesz muralu dla swojego biura,
                profesjonalnego malowania fasady czy unikalnej dekoracji wnętrz,
                jesteśmy tutaj, aby ożywić Twoją przestrzeń.
              </p>
              <Button className="inline-block bg-[#ff7302] hover:bg-[#e56502] text-white w-fit">
                <Link href="/kontakt">Kontakt</Link>
              </Button>
            </div>
            {/* <div className="relative flex  mx-auto  aspect-video  w-[280px] h-[220px] sm:w-[540px] sm:h-[440px]   md:w-[440px] md:h-[340px] justify-center items-center ">
              <Image
                src="/images/wall-painting.webp"
                alt="Photographer at work"
                fill
                className="rounded-lg"
                objectFit="cover"
              />
            </div> */}
            {/* <Compare
                    firstImage="/images/komeko-old.webp"
                    secondImage="/images/komeko-new.webp"
                    firstImageClassName="object-cover object-left-top"
                    secondImageClassname="object-cover object-left-top"
                    className="h-[150px] w-[300px] xsm:h-[250px] xsm:w-[500px] md:h-[400px] md:w-[900px] lg:h-[500px] lg:w-[1280px] mx-auto "
                    slideMode="hover"
                  /> */}
          </div>
        </section>
      </main>
    </div>
  );
}
