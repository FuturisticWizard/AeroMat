
import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import type { UseEmblaCarouselType } from "embla-carousel-react";
import { Fragment } from "react";

// Testimonial data with work images
const testimonials = [
    {
      id: 1,
      type: "Szyld",
      name: "Janusz Berbelucha ",
      role: "Zacierowy",
      company: "Riders Pub",
      image: "/Collaborations/logo8.png",
      content:
        "Mateusz odjebał kawał dobrej roboty. Szyld przyciaga motocyklistów z całej gminy! I to wszystko za kilka flaszek naszego bimberku!",
      rating: 5,
      workImage: "/Collaborations/riders_szyld.jpg",
      workTitle: "Szyld dla Riders Pub",
    },
    {
      id: 2,
      type: "Szyld",
      name: "Michał  Golob",
      role: "Manager",
      company: "Tifosi pizza pub",
      image: "/Collaborations/logo13.jpg",
      content:
        "Mateusz jest bardzo utalentowanym artystą. Troche za dużo pije (do południa pół litra), ale za to później doskonale trafia przetrawioną pizzą do miednicy :D ",
      rating: 4,
      workImage: "/images/szyld4.jpg",
      workTitle: "Szyld dla pizzeri Tifosi",
    },
    {
      id: 3,
      type: "Logo",
      name: "Emily Rodriguez",
      role: "Product Manager",
      company: "Schronisko dla zwierząt w Radysach",
      image: "/Collaborations/logo7.png",
      content:
        "Zależało nam na tanim logo dla naszego schroniska. Mateusz zrobił to za darmo, bo mu się psiak spodobał. Potem mówił że bardzo smaczny. Polecamy!",
      rating: 5,
      workImage: "/images/logo1.jpg",
      workTitle: "Logo dla Schroniska dla zwierząt w Radysach",
    },
    {
      id: 4,
      type: "Mural",
      name: "David Kim",
      role: "CTO",
      company: "Premium Auto Partner",
      image: "/Collaborations/images.jpg",
      content:
        "Mateusz poradził sobie z tym zadaniem doskonale. Zostało nam troche czarnej farby więc postanowiliśmy ją wykorzystac.",
      rating: 5,
      workImage: "/images/szyld2.jpg",
      workTitle: "Mural dla Premium Auto Partner",
    },
    {
      id: 5,
      type: "Mural",
      name: "Lisa Patel",
      role: "UX Designer",
      company: "Magiczny Świat",
      image: "/Collaborations/logo6.png",
      content: "Doskonały mural, dzieciaki co chwila wbiegają w ścianę w miejscu gdzie jest wjazd do tunelu ...  ",
      rating: 4,
      workImage: "/images/magiczny-swiat.jpg",
      workTitle: "Mural dla Magiczny Świat",
    },
  ]

// Star Rating component
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-0.5 mt-2">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`w-4 h-4 ${i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} />
      ))}
    </div>
  );
};

export default function TestimonialsCarousel3() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [api, setApi] = useState<UseEmblaCarouselType[1]>();
  const containerRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const [wheelPosition, setWheelPosition] = useState(0);
  
  // Calculate how much to move the wheel by (one avatar height + margin)
  const moveWheelBy = 18 * 2; // 14px (avatar) + 4px (margin) * 2

  // Handle navigation to a specific index
  const scrollToIndex = (index: number) => {
    if (!api) return;
    api.scrollTo(index);
  };

  // Handle when carousel slide changes
  const onSelect = () => {
    if (!api) return;
    setActiveIndex(api.selectedScrollSnap());
  };

  // Set up event listeners
  const setupApi = (emblaApi: UseEmblaCarouselType[1]) => {
    if (!emblaApi) return;
    
    // Set onSelect listener
    emblaApi.on("select", onSelect);
    emblaApi.reInit({ loop: true });
    // Initial selection
    setActiveIndex(emblaApi.selectedScrollSnap());
    
    // Cleanup
    return () => {
      emblaApi.off("select", onSelect);
    };
  };

  // Manually move the wheel up or down
  const moveWheel = (direction: 'up' | 'down') => {
    if (!wheelRef.current) return;
    
    // Calculate new position
    let newPosition;
    if (direction === 'up') {
      newPosition = wheelPosition - moveWheelBy;
    } else {
      newPosition = wheelPosition + moveWheelBy;
    }
    
    // Apply new position with animation
    wheelRef.current.style.transition = 'transform 0.5s ease';
    wheelRef.current.style.transform = `translateY(${newPosition}px)`;
    setWheelPosition(newPosition);
    
    // Reset if we've moved too far
    const maxOffset = -moveWheelBy * testimonials.length;
    if (newPosition <= maxOffset || newPosition > 0) {
      // Wait for animation to complete then reset position without animation
      setTimeout(() => {
        if (!wheelRef.current) return;
        wheelRef.current.style.transition = 'none';
        const resetPosition = direction === 'up' ? 0 : maxOffset + moveWheelBy;
        wheelRef.current.style.transform = `translateY(${resetPosition}px)`;
        setWheelPosition(resetPosition);
      }, 500);
    }
  };

  // Custom navigation handlers
  const handlePrev = () => {
    api?.scrollPrev();
    moveWheel('down');
  };

  const handleNext = () => {
    api?.scrollNext();
    moveWheel('up');
  };

  return (
    <div className="max-w-7xl mx-auto py-6 bg-background overflow-hidden">
      <Carousel 
        setApi={(emblaApi) => {
          setApi(emblaApi);
          if (emblaApi) setupApi(emblaApi);
        }} 
        className="w-full flex flex-row"
      >
        {/* Testimonial navigation wheel */}
        <div className="flex flex-col gap-2 items-center justify-center relative w-20">
          <div className="static transform-none mx-4">
            <CarouselPrevious className="static transform-none mx-4" onClick={handlePrev} />
          </div>

          {/* Navigation buttons container with controlled wheel effect */}
          <div ref={containerRef} className="relative h-[336px] w-full overflow-hidden px-4 flex items-center justify-center">
            {/* Mask for top fade effect */}
            <div className="absolute top-0 left-0 right-0 h-[80px] bg-gradient-to-b from-background to-transparent z-10 pointer-events-none"></div>

            {/* Mask for bottom fade effect */}
            <div className="absolute bottom-0 left-0 right-0 h-[80px] bg-gradient-to-t from-background to-transparent z-10 pointer-events-none"></div>

            {/* Controlled scrolling wheel */}
            <div className="absolute inset-0 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]">
              <div 
                ref={wheelRef} 
                className="flex flex-col transition-transform duration-500"
              >
                {/* Duplicate the testimonials for the wrapped effect */}
                {[...new Array(3)].map((_, i) => (
                  <Fragment key={i}>
                    {testimonials.map((item, index) => {
                      const isActive = activeIndex === index;
                      
                      return (
                        <button
                          key={`nav-${item.id}-${i}`}
                          className={`w-14 h-14 my-2 rounded-full transition-all duration-300 relative ${
                            isActive && i === 1 ? "z-20 scale-105 opacity-100" : "opacity-75 hover:opacity-100 z-10"
                          }`}
                          onClick={() => {
                            scrollToIndex(index);
                            // Adjust wheel position to center the selected item
                            const newPosition = -index * moveWheelBy - moveWheelBy;
                            if (wheelRef.current) {
                              wheelRef.current.style.transition = 'transform 0.5s ease';
                              wheelRef.current.style.transform = `translateY(${newPosition}px)`;
                              setWheelPosition(newPosition);
                            }
                          }}
                          aria-label={`Go to testimonial ${index + 1}`}
                        >
                          <div 
                            className={`w-full h-full rounded-full overflow-hidden transition-all duration-300 ${
                              isActive && i === 1 ? "scale-105 shadow-md" : ""
                            }`}
                          >
                            <img
                              src={item.image}
                              alt=""
                              className={`w-full h-full ${
                                isActive && i === 1 ? "scale-105" : "opacity-70"
                              } object-cover`}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </Fragment>
                ))}
              </div>
            </div>
          </div>

          <div className="static transform-none mx-4">
            <CarouselNext className="static transform-none mx-4" onClick={handleNext} />
          </div>
        </div>

        <CarouselContent className="w-full">
          {testimonials.map((testimonial, index) => (
            <CarouselItem key={`slide-${testimonial.id}`} className="w-full">
              <div className="relative min-w-[220px] h-full xxs:h-[350px] md:h-[400px] lg:h-[600px] rounded-xl overflow-hidden">
                {/* Full-size background image */}
                <img
                  src={testimonial.workImage}
                  alt={testimonial.workTitle}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Gradient overlay for better text visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent via-60%" />

                {/* Content overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12">
                  <Badge className="mb-4 self-start">{testimonial.type}</Badge>
                  <h3 className="text-white font-bold text-sm sm:text-2xl md:text-3xl mb-4">{testimonial.workTitle}</h3>

                  {/* Testimonial card */}
                  <Card className="bg-transparent backdrop-blur-sm border-0 shadow-lg w-full md:max-w-[600px]">
                    <CardContent className="p-2 sm:p-6">
                      <div className="flex items-start gap-2 sm:gap-4 mb-2 sm:mb-4">
                        <Avatar className="h-12 w-12 border-2 border-primary/10 text-sm">
                          <AvatarImage src={testimonial.image} alt={testimonial.name} />
                          <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="text-gray-200 font-semibold text-sm sm:text-lg">{testimonial.name}</h4>
                          <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-1 sm:gap-2">
                            <span className="text-gray-400">{testimonial.role}</span>
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
      </Carousel>
    </div>
  );
}
