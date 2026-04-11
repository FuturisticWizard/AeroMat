"use client";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/app/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/app/components/ui/carousel";
import { Badge } from "@/app/components/ui/badge";
import { Star } from "lucide-react";
import type { UseEmblaCarouselType } from "embla-carousel-react";
// Testimonial data — real references from clients
const testimonials = [
  {
    id: 1,
    type: "Mural",
    name: "Paweł Suszek",
    role: "Członek Zarządu",
    company: "Ekopak Sp. z o.o.",
    image: "/logo/clients_logos/1P.png",
    content:
      "Projekt został wykonany kompleksowo — od koncepcji graficznej, przez przygotowanie ściany, aż po finalne wykonanie muralu. Wykonawca wykazał się profesjonalizmem, elastycznością oraz bardzo dobrym zrozumieniem tematyki ekologicznej. Efekt końcowy spełnił nasze oczekiwania zarówno pod względem wizualnym, jak i wizerunkowym.",
    rating: 5,
    workImage: "/Portfolio/murale/7B.webp",
    workTitle: "Mural ekologiczny dla Ekopak",
  },
  {
    id: 2,
    type: "Mural",
    name: "Teresa Stępniak-Romanek",
    role: "Kierownik Działu Strategii i Komunikacji",
    company: "LPEC S.A.",
    image: "/logo/clients_logos/2P.png",
    content:
      "Wszystkie prace zostały wykonane zgodnie z ustaleniami, z należytą starannością, terminowo oraz na wysokim poziomie estetycznym i technicznym. Współpraca przebiegała bez zastrzeżeń. Z pełnym przekonaniem możemy polecić wykonawcę jako solidnego i godnego zaufania partnera.",
    rating: 5,
    workImage: "/Portfolio/murale/10.webp",
    workTitle: "Murale dla LPEC w Lublinie",
  },
  {
    id: 3,
    type: "Mural",
    name: "Paweł Rysak",
    role: "Prezes Zarządu",
    company: "SM Bieluch w Chełmie",
    image: "/logo/clients_logos/4P.png",
    content:
      "Firma Aeromat zrealizowała usługę w sposób w pełni profesjonalny, rzetelny i kompleksowy. Kolorystyka muralu jest intensywna, wyrazista i zgodna z projektem. Powstały mural stanowi atrakcyjną, a zarazem nienachalną formę promocji — przyciąga uwagę przechodniów, którzy chętnie zatrzymują się, aby go obejrzeć.",
    rating: 5,
    workImage: "/Portfolio/murale/13.webp",
    workTitle: "Mural promocyjny dla SM Bieluch",
  },
];

// Star Rating component
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-0.5 mt-2">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
        />
      ))}
    </div>
  );
};

export default function TestimonialsCarousel3() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [api, setApi] = useState<UseEmblaCarouselType[1]>();
  // const [direction, setDirection] = useState(0) // 1 for forward, -1 for backward
  const buttonHeight = 96; // Height of button (80px) + gap (16px)
  const buttonContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const totalTestimonials = testimonials.length;

  // Create a circular wheel by adding extra items for seamless looping
  const createCircularWheel = () => {
    // Show enough items for seamless looping
    const visibleCount = Math.min(3, totalTestimonials);

    const wheel = [];

    // Add items from the end to the beginning for seamless backward scrolling
    for (let i = totalTestimonials - visibleCount; i < totalTestimonials; i++) {
      wheel.push({
        ...testimonials[i],
        key: `before-${i}`,
      });
    }

    // Add all original items
    wheel.push(
      ...testimonials.map((item, i) => ({
        ...item,
        key: `original-${i}`,
      })),
    );

    // Add items from the beginning to the end for seamless forward scrolling
    for (let i = 0; i < visibleCount; i++) {
      wheel.push({
        ...testimonials[i],
        key: `after-${i}`,
      });
    }
    return wheel;
  };

  const circularWheel = createCircularWheel();

  useEffect(() => {
    if (!api) return;

    const handleSelect = () => {
      const newIndex = api.selectedScrollSnap();

      // If at the last item, go to the first
      if (newIndex === totalTestimonials) {
        api.scrollTo(0, false); // Transition to the first item
        setActiveIndex(0);
      }
      // If at the first item and going backward, go to the last
      else if (newIndex === -1) {
        api.scrollTo(totalTestimonials - 1, false); // Transition to the last item
        setActiveIndex(totalTestimonials - 1);
      } else {
        setActiveIndex(newIndex);
      }
    };

    api.on("select", handleSelect);

    return () => {
      api?.off("select", handleSelect);
    };
  }, [api, activeIndex, totalTestimonials]);
  // Calculate the position for the current active index to center it
  const calculatePosition = () => {
    if (!containerRef.current) return 0;

    const containerHeight = containerRef.current.clientHeight;
    const middlePosition = containerHeight / 2;
    const activeButtonOffset = activeIndex * buttonHeight;

    return middlePosition - buttonHeight / 2 - activeButtonOffset;
  };

  return (
    <div className="max-w-[1600px] mx-auto py-6 bg-background flex items-center overflow-hidden px-4 sm:px-8">
      <Carousel
        setApi={setApi}
        opts={{ loop: true }}
        className="w-full flex flex-row"
      >
        <div className="flex flex-col gap-2 items-center md:justify-center shrink-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="static transform-none mx-4"
          >
            <CarouselPrevious className="static transform-none mx-4 bg-neutral-800 border-neutral-600 text-white hover:bg-[#ff7302] hover:border-[#ff7302] hover:text-white" />
          </motion.div>

          {/* Navigation buttons container - circular wheel style */}
          <div
            ref={containerRef}
            className="relative h-[336px] w-24 overflow-visible px-4 flex items-center"
          >
            {/* Mask for top fade effect */}
            <div className="absolute top-0 left-0 right-0 h-[80px] bg-gradient-to-b from-background to-transparent z-10 pointer-events-none"></div>

            {/* Mask for bottom fade effect */}
            <div className="absolute bottom-0 left-0 right-0 h-[80px] bg-gradient-to-t from-background to-transparent z-10 pointer-events-none"></div>

            {/* Container for the wheel with overflow hidden */}
            <div className="absolute inset-0 overflow-hidden ">
              {/* Circular wheel */}
              <motion.div
                ref={buttonContainerRef}
                className="flex flex-col gap-4 absolute left-0 right-0 justify-center items-center"
                animate={{
                  y: calculatePosition(),
                }}
                transition={{
                  type: "spring",
                  stiffness: 70,
                  damping: 20,
                  duration: 0.8,
                }}
              >
                {circularWheel.map((item, wheelIndex) => {
                  // Calculate the real index in the original testimonials array
                  const realIndex = wheelIndex % totalTestimonials;

                  // Normalize the index to be within the bounds of the original array
                  const normalizedIndex =
                    ((realIndex % totalTestimonials) + totalTestimonials) %
                    totalTestimonials;

                  return (
                    <motion.button
                      key={item.key}
                      className={`w-20 h-20 rounded-full transition-all duration-300 relative ${
                        activeIndex === normalizedIndex
                          ? " z-20 scale-105 opacity-100  "
                          : "opacity-75 hover:opacity-100 z-10"
                      }`}
                      onClick={() => api?.scrollTo(normalizedIndex)}
                      aria-label={`Go to testimonial ${normalizedIndex + 1}`}
                    >
                      <div
                        className={`w-full h-full rounded-full overflow-hidden transition-all duration-300 ${
                          activeIndex === wheelIndex
                            ? " scale-105 shadow-md "
                            : ""
                        }`}
                      >
                        <Image
                          src={
                            testimonials[normalizedIndex].image ||
                            "/placeholder.svg"
                          }
                          alt=""
                          width={380}
                          height={380}
                          className={`w-full h-full p-2 ${
                            activeIndex === normalizedIndex
                              ? "scale-105"
                              : " opacity-70"
                          } object-contain`}
                        />
                      </div>
                    </motion.button>
                  );
                })}
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="static transform-none mx-4"
          >
            <CarouselNext className="static transform-none mx-4 bg-neutral-800 border-neutral-600 text-white hover:bg-[#ff7302] hover:border-[#ff7302] hover:text-white" />
          </motion.div>
        </div>
        <div className="flex-1 min-w-0">
        <CarouselContent className="w-full">
          {testimonials.map((testimonial) => (
            <CarouselItem key={testimonial.id} className="w-full">
              <div className="relative min-w-[220px] h-full xxs:h-[350px] md:h-[500px] lg:h-[700px] rounded-xl overflow-hidden">
                {/* Full-size background image */}
                <Image
                  src={testimonial.workImage || "/placeholder.svg"}
                  alt={testimonial.workTitle}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  loading="lazy"
                />

                {/* Gradient overlay for better text visibility */}
                <div className="absolute -inset-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent via-60%" />

                {/* Content overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12">
                  <Badge className="mb-4 self-start">{testimonial.type}</Badge>
                  <h3 className="text-white font-bold text-sm sm:text-2xl md:text-3xl mb-4">
                    {testimonial.workTitle}
                  </h3>

                  {/* Testimonial card */}
                  <Card className="bg-transparent backdrop-blur-sm border-0 shadow-lg w-full md:max-w-[700px] xl:max-w-[800px]">
                    <CardContent className="p-2 sm:p-6">
                      <div className="flex items-start gap-2 sm:gap-4 mb-2 sm:mb-4">
                        <Avatar className="h-12 w-12 border-2 border-primary/10 text-sm">
                          <AvatarImage
                            src={testimonial.image}
                            alt={testimonial.name}
                          />
                          <AvatarFallback>
                            {testimonial.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="text-gray-200 font-semibold text-sm sm:text-lg">
                            {testimonial.name}
                          </h4>
                          <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-1 sm:gap-2">
                            <span className="text-gray-400">
                              {testimonial.role}
                            </span>
                            <span className="text-xs">•</span>
                            <Badge variant="secondary" className="font-normal">
                              {testimonial.company}
                            </Badge>
                          </div>
                          <StarRating rating={testimonial.rating} />
                        </div>
                      </div>
                      <blockquote className="text-white/90 text-sm sm:text-lg italic">
                        &quot;{testimonial.content}&quot;
                      </blockquote>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        </div>
      </Carousel>
    </div>
  );
}
