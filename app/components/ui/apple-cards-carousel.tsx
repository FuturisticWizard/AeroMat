"use client";
import React, {
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
} from "react";
import {
  IconArrowNarrowLeft,
  IconArrowNarrowRight,
  IconX,
} from "@tabler/icons-react";
import { cn } from "@/app/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Image, { ImageProps } from "next/image";
import { useOutsideClick } from "@/app/hooks/use-outside-click";

// Z-Index Constants - Clean hierarchy
const Z_INDEX = {
  MODAL_BACKDROP: 1000,
  MODAL_CONTENT: 1010,
  CARD_HOVERED: 50,
  CARD_DEFAULT: 10,
  CARD_CONTENT: 20,
  NAVIGATION: 30,
  BEHIND_MODAL: 1,
} as const;

interface CarouselProps {
  items: JSX.Element[];
  initialScroll?: number;
}

type Card = {
  src: string;
  title: string;
  category: string;
  content: React.ReactNode;
};

export const CarouselContext = createContext<{
  onCardClose: (index: number) => void;
  currentIndex: number;
  hoveredIndex: number | null;
  setHoveredIndex: (index: number | null) => void;
  openModalIndex: number | null;
  setOpenModalIndex: (index: number | null) => void;
  items: JSX.Element[];
}>({
  onCardClose: () => {},
  currentIndex: 0,
  hoveredIndex: null,
  setHoveredIndex: () => {},
  openModalIndex: null,
  setOpenModalIndex: () => {},
  items: [],
});

export const Carousel = ({ items, initialScroll = 0 }: CarouselProps) => {
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [openModalIndex, setOpenModalIndex] = useState<number | null>(null);

  // Helper function - check if modal is open
  const isModalOpen = openModalIndex !== null;

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll;
      checkScrollability();
    }
  }, [initialScroll]);

  useEffect(() => {
    const handleResize = () => {
      checkScrollability();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  const scrollLeft = () => {
    if (isModalOpen) {
      // Navigate to previous modal
      const prevIndex = openModalIndex > 0 ? openModalIndex - 1 : items.length - 1;
      setOpenModalIndex(prevIndex);
    } else if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (isModalOpen) {
      // Navigate to next modal
      const nextIndex = openModalIndex < items.length - 1 ? openModalIndex + 1 : 0;
      setOpenModalIndex(nextIndex);
    } else if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const handleCardClose = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = isMobile() ? 230 : 384;
      const gap = isMobile() ? 4 : 8;
      const scrollPosition = (cardWidth + gap) * (index + 1);
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
      setCurrentIndex(index);
    }
  };

  const isMobile = () => {
    return typeof window !== 'undefined' && window.innerWidth < 768;
  };

  // Calculate z-index for elements
  const getElementZIndex = (baseZIndex: number) => {
    return isModalOpen ? Z_INDEX.BEHIND_MODAL : baseZIndex;
  };

  return (
    <CarouselContext.Provider
      value={{ onCardClose: handleCardClose, currentIndex, hoveredIndex, setHoveredIndex, openModalIndex, setOpenModalIndex, items }}
    >
      <div className="relative w-full overflow-x-hidden md:overflow-visible">
        <div
          className="flex w-full overflow-x-scroll overscroll-x-auto scroll-smooth py-10 [scrollbar-width:none] md:py-20 md:overflow-visible md:block"
          ref={carouselRef}
          onScroll={checkScrollability}
        >
          <div
            className="absolute right-0 h-auto w-[5%] overflow-hidden bg-gradient-to-l md:hidden"
            style={{ zIndex: getElementZIndex(Z_INDEX.NAVIGATION) }}
          />

          <div
            className={cn(
              "flex flex-row justify-start gap-4 pl-4",
              "md:grid md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-5 md:gap-6 md:pl-0 md:px-4 md:justify-items-center",
              "overflow-visible"
            )}
          >
            {items.map((item, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  x: hoveredIndex !== null 
                    ? hoveredIndex < index 
                      ? "20%" 
                      : hoveredIndex === items.length - 1 && hoveredIndex > index 
                        ? "-20%" 
                        : 0
                    : 0,
                  transition: {
                    duration: hoveredIndex !== null ? 0.3 : 0.5,
                    delay: hoveredIndex !== null ? 0 : 0.2 * index,
                    ease: "easeOut",
                    once: hoveredIndex === null,
                  },
                }}
                key={"card" + index}
                className="rounded-3xl last:pr-[5%] md:last:pr-0 flex-shrink-0 md:flex-shrink-0"
                style={{
                  zIndex: getElementZIndex(
                    hoveredIndex === index ? Z_INDEX.CARD_HOVERED : Z_INDEX.CARD_DEFAULT
                  )
                }}
              >
                {React.cloneElement(item, { isLast: index === items.length - 1 })}
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="mr-10 flex justify-end gap-2 xl:hidden">
          <button
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 disabled:opacity-50"
            style={{ zIndex: getElementZIndex(Z_INDEX.NAVIGATION) }}
            onClick={scrollLeft}
            disabled={!canScrollLeft}
          >
            <IconArrowNarrowLeft className="h-6 w-6 text-gray-500" />
          </button>
          <button
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 disabled:opacity-50"
            style={{ zIndex: getElementZIndex(Z_INDEX.NAVIGATION) }}
            onClick={scrollRight}
            disabled={!canScrollRight}
          >
            <IconArrowNarrowRight className="h-6 w-6 text-gray-500" />
          </button>
        </div>
      </div>
    </CarouselContext.Provider>
  );
};

export const Card = ({
  card,
  index,
  layout = false,
  isLast = false,
}: {
  card: Card;
  index: number;
  layout?: boolean;
  isLast?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isTapped, setIsTapped] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const { onCardClose, currentIndex, hoveredIndex, setHoveredIndex, openModalIndex, setOpenModalIndex, items } = useContext(CarouselContext);

  // Helper functions
  const isModalOpen = openModalIndex !== null;
  const isThisCardOpen = openModalIndex === index;

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(typeof window !== 'undefined' && window.innerWidth >= 768);
    };
    
    checkDesktop();
    const handleResize = () => checkDesktop();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    if (open) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "auto";
    }

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  useOutsideClick(containerRef, () => handleClose());

  const handleOpen = () => {
    setOpen(true);
    setOpenModalIndex(index);
  };

  const handleClose = () => {
    setOpen(false);
    setOpenModalIndex(null);
    onCardClose(index);
  };

  const handleTouchClick = () => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    
    if (isMobile) {
      if (!isTapped) {
        setIsTapped(true);
        setIsHovered(true);
        setHoveredIndex(index);
      } else {
        handleOpen();
      }
    } else {
      handleOpen();
    }
  };

  // Reset tapped state when another card is tapped
  useEffect(() => {
    if (hoveredIndex !== null && hoveredIndex !== index) {
      setIsTapped(false);
      setIsHovered(false);
    }
  }, [hoveredIndex, index]);

  // Sync local state with global modal state
  useEffect(() => {
    setOpen(isThisCardOpen);
  }, [isThisCardOpen]);

  return (
    <>
      <AnimatePresence>
        {isThisCardOpen && (
          <div 
            className="fixed inset-0 h-screen overflow-auto"
            style={{ zIndex: Z_INDEX.MODAL_BACKDROP }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 h-full w-full bg-black/80"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              ref={containerRef}
              layoutId={layout ? `card-${card.title}` : undefined}
              className="relative mx-auto mt-20 mb-10 h-fit max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl rounded-3xl bg-white p-4 font-sans md:p-10 dark:bg-neutral-900"
              style={{ zIndex: Z_INDEX.MODAL_CONTENT }}
            >
              <button
                className="sticky top-4 right-0 ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-black dark:bg-white"
                onClick={handleClose}
              >
                <IconX className="h-6 w-6 text-neutral-100 dark:text-neutral-900" />
              </button>
              <motion.p
                layoutId={layout ? `category-${card.title}` : undefined}
                className="text-base font-semibold text-black dark:text-white"
              >
                {card.category}
              </motion.p>
              <motion.p
                layoutId={layout ? `title-${card.title}` : undefined}
                className="mt-4 text-base font-semibold text-neutral-700 md:text-3xl dark:text-white"
              >
                {card.title}
              </motion.p>
              <div className="py-10">{card.content}</div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.button
        layoutId={layout ? `card-${card.title}` : undefined}
        onClick={handleTouchClick}
        onMouseEnter={() => {
          setIsHovered(true);
          setHoveredIndex(index);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          setHoveredIndex(null);
        }}
        animate={{
          width: hoveredIndex === index 
            ? "min(600px, calc(100vw - 2rem))" 
            : isDesktop 
              ? "100%" 
              : "224px",
          x: hoveredIndex === index && isLast ? "-50%" : 0,
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="group relative flex h-80 w-56 flex-col items-start justify-start overflow-hidden rounded-3xl bg-gray-100 md:h-96 lg:h-[28rem] md:w-full md:max-w-sm lg:max-w-md xl:max-w-xl dark:bg-neutral-900"
        style={{
          zIndex: isModalOpen 
            ? Z_INDEX.BEHIND_MODAL 
            : (hoveredIndex === index ? Z_INDEX.CARD_HOVERED : Z_INDEX.CARD_DEFAULT)
        }}
      >
        <div 
          className="relative p-8"
          style={{ zIndex: Z_INDEX.CARD_CONTENT }}
        >
          <motion.p
            layoutId={layout ? `category-${card.category}` : undefined}
            className="text-left font-sans text-lg font-bold text-white group-hover:text-black/80 md:text-2xl"
          >
            {card.category}
          </motion.p>
          <motion.p
            layoutId={layout ? `title-${card.title}` : undefined}
            className="mt-2 max-w-xs text-left font-sans text-base font-bold [text-wrap:balance] text-white group-hover:hidden md:text-lg"
          >
            {card.title}
          </motion.p>
        </div>
        <BlurImage
          src={card.src}
          alt={card.title}
          fill
          isHovered={isHovered}
          cardIndex={index}
          className={cn(
            "absolute inset-0 object-cover transition-all duration-500",
            isHovered ? "blur-0 brightness-100" : "blur-sm brightness-[0.3] contrast-50 saturate-[0.1] hue-rotate(0deg)"
          )}
        />
      </motion.button>
    </>
  );
};

export const BlurImage = ({
  height,
  width,
  src,
  className,
  alt,
  fill,
  isHovered = false,
  cardIndex = 0,
  ...rest
}: ImageProps & { isHovered?: boolean; cardIndex?: number }) => {
  const [isLoading, setLoading] = useState(true);
  
  const hueRotations = [0, 60, 120, 180, 240, 300, 30, 90, 150, 210, 270, 330];
  const hueValue = hueRotations[cardIndex % hueRotations.length];
  
  const { blurDataURL, priority, quality, placeholder, ...imgProps } = rest;
  
  return (
    <img
      className={cn("h-full w-full transition-all duration-500", className)}
      onLoad={() => setLoading(false)}
      src={src as string}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      alt={alt ? alt : "Background of a beautiful view"}
      {...imgProps}
    />
  );
};
