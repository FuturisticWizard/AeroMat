"use client";
import React, { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { FC } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";

interface Slide {
  src: string;
  title: string;
  width: number;
  height: number;
  gridArea: string;
  objectPosition?: string;
}

interface ImageSlideProps {
  data: Slide[];
  onClick: (index: number) => void;
  fullWidth?: boolean;
  /** If true, starts hidden and animates via GSAP ScrollTrigger linked to intro card */
  waitForTrigger?: boolean;
  /** Grid layout variant: "11", "7", "7sq", or undefined for default */
  gridVariant?: string;
}

// Konfiguracja animacji - slide in from sides
const ANIMATION_CONFIG = {
  duration: 1.2,        // Dłuższa animacja dla dramatycznego efektu
  stagger: 0.15,        // Większy odstęp między elementami
  xOffset: 200,         // Przesunięcie z boku (px) - nie za dużo żeby było płynne
  yOffset: 120,         // Fallback dla domyślnego trybu
  ease: "power3.out",   // Naturalny ease - szybki start, łagodne zakończenie
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: ANIMATION_CONFIG.stagger,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: ANIMATION_CONFIG.yOffset,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: ANIMATION_CONFIG.duration,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const Images: FC<ImageSlideProps> = (props) => {
  const { data, onClick, fullWidth = false, waitForTrigger = false, gridVariant } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  const handleClickImage = useCallback(
    (index: number) => {
      onClick(index);
    },
    [onClick]
  );

  // Hide items initially, then reveal with stagger when section enters viewport.
  // Uses IntersectionObserver (not ScrollTrigger) to avoid scroller/pin conflicts.
  useEffect(() => {
    if (!waitForTrigger || !containerRef.current) return;

    const container = containerRef.current;
    const section = container.closest(".portfolio-break") || container;
    const items = container.querySelectorAll<HTMLElement>(".portfolio-item");
    if (!items.length) return;

    const containerRect = container.getBoundingClientRect();
    const containerCenterX = containerRect.width / 2;

    // Hide items with offset
    items.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const isLeft = rect.left + rect.width / 2 - containerRect.left < containerCenterX;
      gsap.set(item, {
        opacity: 0,
        x: isLeft ? -ANIMATION_CONFIG.xOffset : ANIMATION_CONFIG.xOffset,
      });
    });

    // Reveal at 10% from bottom of viewport
    let revealed = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (revealed) return;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            revealed = true;
            gsap.to(items, {
              opacity: 1,
              x: 0,
              stagger: 0.20,
              duration: 1.6,
              ease: "power2.out",
              overwrite: true,
            });
            observer.disconnect();
            break;
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px" } // fires when section reaches middle of viewport
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, [waitForTrigger]);

  const containerClass = fullWidth
    ? "flex flex-col h-auto w-full"
    : "flex flex-col mx-auto h-auto w-full items-center sm:max-w-6xl lg:max-w-full xxs:py-4 px-2";

  const gridClassMap: Record<string, string> = {
    "11": "grid grid-small-container",
    "7": "grid grid-small-7",
    "7sq": "grid grid-small-7sq",
  };
  const gridClass = gridVariant ? (gridClassMap[gridVariant] || "grid grid-container") : "grid grid-container";

  // GSAP-controlled version (waitForTrigger mode)
  if (waitForTrigger) {
    return (
      <div className={containerClass}>
        <div ref={containerRef} className={gridClass}>
          {data.map((slide, index) => (
            <div
              key={index}
              onClick={() => handleClickImage(index)}
              className="relative gpu-accelerated portfolio-item"
              style={{ gridArea: slide.gridArea }}
            >
              <Image
                src={slide.src}
                alt={slide.title}
                width={slide.width}
                height={slide.height}
                className="w-full h-full object-cover cursor-pointer hover:animate-wiggle transition-transform"
                style={slide.objectPosition ? { objectPosition: slide.objectPosition } : undefined}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                quality={85}
                priority={false}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Framer Motion version (default)
  return (
    <div className={containerClass}>
      <motion.div
        className={gridClass}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15, margin: "-100px 0px 0px 0px" }}
      >
        {data.map((slide, index) => (
          <motion.div
            key={index}
            onClick={() => handleClickImage(index)}
            className="relative gpu-accelerated"
            style={{ gridArea: slide.gridArea }}
            variants={itemVariants}
          >
            <Image
              src={slide.src}
              alt={slide.title}
              width={slide.width}
              height={slide.height}
              className="w-full h-full object-cover cursor-pointer hover:animate-wiggle transition-transform"
              style={slide.objectPosition ? { objectPosition: slide.objectPosition } : undefined}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              quality={85}
              priority={false}
              loading="lazy"
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Images;
