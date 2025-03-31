"use client";
import "react-photo-album/rows.css";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
// import optional lightbox plugins
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RowsPhotoAlbum } from "react-photo-album";
import { portfolioPhotos } from "@/app/lib/photos";
import Lightbox from "yet-another-react-lightbox";

export default function PhotoPortfolio() {
  const categories = ["Wszystkie", "Murale", "Wnętrza", "Samochody"];
  const [index, setIndex] = useState(-1);

  return (
    <div className="min-h-screen bg-background py-8 mt-12">
      <header className="container mx-auto py-12 px-4 md:py-20">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            AeroMat - Kreatywność Bez Granic
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            W AeroMat nie ma granic dla Twojej wyobraźni. Tworzymy unikalne murale, wykorzystując różnorodne techniki
            malarskie, aby ożywić przestrzeń i wyróżnić Twoją markę. Od tradycyjnych pędzli po nowoczesne techniki
            sprayu i aerografu, nasze dzieła sztuki są wyrazem nieograniczonej kreatywności.
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
            <h2 className="text-3xl font-bold py-2">Moje prace</h2>
            <TabsList>
              {categories.map((category) => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {categories.map((category) => (
            <TabsContent key={category} value={category} className="mt-0">
              <RowsPhotoAlbum
                photos={portfolioPhotos.filter(
                  (photo) => category === "Wszystkie" || photo.category === category
                )}
                targetRowHeight={250}
                onClick={({ index }) => setIndex(index)}
              />
              <Lightbox
                slides={portfolioPhotos.filter(
                  (photo) => category === "Wszystkie" || photo.category === category
                )}
                open={index >= 0}
                index={index}
                close={() => setIndex(-1)}
                plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
              />
            </TabsContent>
          ))}
        </Tabs>

        <section className="bg-muted rounded-xl p-8 md:p-12 overflow-hidden ">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="container flex flex-col px-4">
              <h2 className="text-3xl font-bold pb-4">Chcesz nawiązać kontakt ?</h2>
              <p className="text-muted-foreground pb-6">
                Niezależnie od tego, czy potrzebujesz fotografii produktowej dla swojego sklepu internetowego,
                profesjonalnych portretów dla swojego zespołu czy relacja z wydarzenia, jesteśmy tutaj, aby ożywić Twoją
                wizję.
              </p>
              <Button className="w-auto">
                <Link href="/contact">Kontakt</Link>
              </Button>
            </div>
            <div className="relative w-72 h-64 max-h-[60%]">
              <Image
                src="/images/wall-painting.jpg"
                alt="Photographer at work"
                fill
                className="rounded-lg"
                objectFit="cover"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}