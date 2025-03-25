"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ChevronLeft, ChevronRight, Download, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PhotoPortfolio() {
  const [activeImage, setActiveImage] = useState<number | null>(null)
  const categories = ["All", "Commercial", "Portrait", "Landscape", "Event"]

  const photos = [
    {
      id: 1,
      src: "/images/mural-folklor.jpg",
      alt: "Commercial photography of a product",
      category: "Commercial",
      title: "Product Showcase",
      description: "Premium product photography with attention to detail and lighting",
      width: 800,
      height: 600,
    },
    {
      id: 2,
      src: "/images/mural-lester.jpg",
      alt: "Portrait of a business professional",
      category: "Portrait",
      title: "Executive Portrait",
      description: "Professional headshot with natural lighting and composition",
      width: 600,
      height: 800,
    },
    {
      id: 3,
      src: "/images/mural-lpec.jpg",
      alt: "Landscape photography of mountains",
      category: "Landscape",
      title: "Mountain Vista",
      description: "Breathtaking landscape captured at golden hour",
      width: 900,
      height: 600,
    },
    {
      id: 4,
      src: "/images/camper.jpg",
      alt: "Corporate event photography",
      category: "Event",
      title: "Annual Conference",
      description: "Dynamic event coverage capturing key moments and atmosphere",
      width: 700,
      height: 700,
    },
    {
      id: 5,
      src: "/images/mural-starowka.jpg",
      alt: "Product arrangement for e-commerce",
      category: "Commercial",
      title: "E-commerce Collection",
      description: "Clean, consistent product photography for online retail",
      width: 800,
      height: 600,
    },
    {
      id: 6,
      src: "/images/szyld1.jpg",
      alt: "Portrait in urban setting",
      category: "Portrait",
      title: "Urban Portrait",
      description: "Stylish portrait using city architecture as backdrop",
      width: 600,
      height: 800,
    },
    {
      id: 7,
      src: "/images/szyld2.jpg",
      alt: "Coastal landscape at sunset",
      category: "Landscape",
      title: "Coastal Sunset",
      description: "Dramatic coastline with vibrant sunset colors",
      width: 900,
      height: 600,
    },
    {
      id: 8,
      src: "/images/typografia2.jpg",
      alt: "Corporate team building event",
      category: "Event",
      title: "Team Building",
      description: "Candid moments from corporate retreat activities",
      width: 700,
      height: 700,
    },
    {
      id: 9,
      src: "/images/zaklikow_piekarnia.jpg",
      alt: "Food photography for restaurant",
      category: "Commercial",
      title: "Culinary Showcase",
      description: "Appetizing food photography highlighting texture and presentation",
      width: 800,
      height: 800,
    },
  ]

  const handleImageClick = (index: number) => {
    setActiveImage(index)
  }

  const handleCloseModal = () => {
    setActiveImage(null)
  }

  const handlePrevImage = () => {
    if (activeImage !== null) {
      setActiveImage(activeImage === 0 ? photos.length - 1 : activeImage - 1)
    }
  }

  const handleNextImage = () => {
    if (activeImage !== null) {
      setActiveImage(activeImage === photos.length - 1 ? 0 : activeImage + 1)
    }
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <header className="container mx-auto py-12 px-4 md:py-20">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Rejestrowanie chwil, które opowiadają Twoją historię
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
          Profesjonalne usługi fotograficzne dla firm i osób prywatnych. Specjalizujemy się w fotografii reklamowej, portretowej,
          krajobrazie i fotografii eventowej.
          </p>
          <Button size="lg" className="group">
            Zobacz nasze usługi
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-20">
        <Tabs defaultValue="All" className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Moje prace</h2>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {photos
                  .filter((photo) => category === "All" || photo.category === category)
                  .map((photo, index) => (
                    <div
                      key={photo.id}
                      className="group relative overflow-hidden rounded-lg cursor-pointer transition-all hover:shadow-lg"
                      onClick={() => handleImageClick(index)}
                    >
                      <div className="aspect-square overflow-hidden">
                        <Image
                          src={photo.src || "/placeholder.svg"}
                          alt={photo.alt}
                          width={photo.width}
                          height={photo.height}
                          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                        <h3 className="text-white font-bold text-xl mb-1">{photo.title}</h3>
                        <p className="text-white/80 text-sm">{photo.description}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <section className="bg-muted rounded-xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Zacznijmy współpracować</h2>
              <p className="text-muted-foreground mb-6">
              Niezależnie od tego, czy potrzebujesz fotografii produktowej dla swojego sklepu internetowego, profesjonalnych portretów dla swojego zespołu czy
              relacja z wydarzenia, jesteśmy tutaj, aby ożywić Twoją wizję.
              </p>
              <Button asChild>
                <Link href="/contact">Kontakt</Link>
              </Button>
            </div>
            <div className="relative">
              <Image
                src="/placeholder.svg?height=600&width=800"
                alt="Photographer at work"
                width={800}
                height={600}
                className="rounded-lg"
              />
            </div>
          </div>
        </section>
      </main>

      {activeImage !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <div className="relative w-full max-w-5xl px-4">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
              onClick={handleCloseModal}
            >
              <X className="h-6 w-6" />
              <span className="sr-only">Close</span>
            </Button>

            <div className="relative">
              <Image
                src={photos[activeImage].src || "/placeholder.svg"}
                alt={photos[activeImage].alt}
                width={photos[activeImage].width}
                height={photos[activeImage].height}
                className="mx-auto max-h-[80vh] w-auto object-contain"
              />

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <h3 className="text-white font-bold text-xl">{photos[activeImage].title}</h3>
                <p className="text-white/80">{photos[activeImage].description}</p>
              </div>
            </div>

            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={handlePrevImage}>
                <ChevronLeft className="h-8 w-8" />
                <span className="sr-only">Previous image</span>
              </Button>
            </div>

            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={handleNextImage}>
                <ChevronRight className="h-8 w-8" />
                <span className="sr-only">Next image</span>
              </Button>
            </div>

            <div className="absolute bottom-4 right-4">
              <Button variant="outline" size="sm" className="text-white border-white hover:bg-white/20">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      )}

     
    </div>
  )
}

