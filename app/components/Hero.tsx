"use client";
import { Star } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const sliderImages = [
  {
    src: "/images/komeko1.jpg",
    alt: "Murale Reklamowe",
    title: "Murale Reklamowe ",
    desc: "Dzięki swojej unikalności przyciągają uwagę i budzą zainteresowanie, zapewniając skuteczną reklamę i pozytywny wizerunek marki.",
  },
  {
    src: "/images/folklor-mural.jpg",
    alt: "Murale Artystyczne",
    title: "Murale Artystyczne ",
    desc: "Nasze artystyczne murale to więcej niż zwykła dekoracja – to dzieła sztuki, które transformują przestrzenie i nadają im unikalny charakter. Poprzez malowanie murali, możesz stworzyć punkt centralny w pomieszczeniu, dodać koloru i tekstury, a także wyrazić swoją osobowość. Murale są idealnym sposobem na ożywienie wnętrz i stworzenie atmosfery, która inspiruje i angażuje",
  },
  {
    src: "/images/mural-lpec.jpg",
    alt: "Nature-inspired office mural",
    title: "Eko Murale",
    desc: "Murale oczyszczające powietrze, poprawiające jakość życia w mieście.",
  },
  {
    src: "/images/kinematografia2.jpg",
    alt: "School playground mural",
    title: "Kinematografia",
    desc: "Dzięki swojej unikalności i artystycznego podejścia Moje filmy przyciągają uwagę  i zapewniają skuteczną reklamę oraz gwarantują pozytywny wizerunek marki.",
  },
  {
    src: "/images/kinematografia2.jpg",
    alt: "School playground mural",
    title: "",
    desc: "Dzięki swojej unikalności i artystycznego podejścia Moje filmy przyciągają uwagę  i zapewniają skuteczną reklamę oraz gwarantują pozytywny wizerunek marki.",
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  // Autoplay functionality
  useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoplay]);

  const nextSlide = () => {
    setAutoplay(false);
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
  };

  const prevSlide = () => {
    setAutoplay(false);
    setCurrentSlide(
      (prev) => (prev - 1 + sliderImages.length) % sliderImages.length,
    );
  };

  const goToSlide = (index: number) => {
    setAutoplay(false);
    setCurrentSlide(index);
  };

  return (
    <section className="w-full bg-background">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text Column */}
          <div className="order-2 lg:order-1">
            <svg
              width="200"
              height="200"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {" "}
              <g clip-path="url(#clip0_221_10)">
                {" "}
                <path
                  d="M0 0H100C155.228 0 200 44.7715 200 100V200H100C44.7715 200 0 155.228 0 100V0Z"
                  fill="url(#paint0_linear_221_10)"
                />{" "}
              </g>{" "}
              <defs>
                {" "}
                <linearGradient
                  id="paint0_linear_221_10"
                  x1="100"
                  y1="0"
                  x2="100"
                  y2="200"
                  gradientUnits="userSpaceOnUse"
                >
                  {" "}
                  <stop stop-color="#A7B5FF" />{" "}
                  <stop offset="1" stop-color="#F3ACFF" />{" "}
                </linearGradient>{" "}
                <clipPath id="clip0_221_10">
                  {" "}
                  <rect width="200" height="200" fill="white" />{" "}
                </clipPath>{" "}
              </defs>{" "}
            </svg>

            <h2 className="text-2xl font-semibold md:text-3xl lg:text-4xl text-dark mb-4">
              <span className="text-5xl anton-regular text-orange-500">
                AEROMAT{" "}
              </span>{" "}
              to ...
            </h2>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 transition-opacity duration-300">
              {sliderImages[currentSlide].title}
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-xl">
              Tworzę niestandardowe murale, które opowiadają historię, inspirują
              odbiorców i przekształcają zwykłe ściany w niezwykłe dzieła
              sztuki.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button size="lg" className="font-medium">
                Zamów Darmową Wycenę
              </Button>

              <Button variant="outline" size="lg" className="font-medium">
                Zobacz Portfolio
              </Button>
            </div>

            <div className="flex items-center gap-4  ">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-10 w-10 rounded-full border-2 border-background overflow-hidden"
                  >
                    <Star key={i} className={`w-6 h-6 text-yellow-500`} />
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-bold text-foreground">
                  100+ projektów
                </span>{" "}
                ukończonych na całym świecie
              </p>
            </div>
          </div>

          {/* Slider Column */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative overflow-hidden rounded-xl shadow-xl aspect-[4/3]">
              {sliderImages.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    index === currentSlide
                      ? "opacity-100"
                      : "opacity-0 pointer-events-none"
                  }`}
                >
                  <Image
                    src={image.src || "/placeholder.svg"}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4"></div>
                </div>
              ))}

              {/* Slider Controls */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 backdrop-blur-sm transition-colors"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 backdrop-blur-sm transition-colors"
                aria-label="Next slide"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            {/* Slider Indicators */}
            <div className="flex justify-center mt-4 gap-2">
              {sliderImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentSlide ? "w-8 bg-primary" : "w-2 bg-muted"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={index === currentSlide ? "true" : "false"}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
