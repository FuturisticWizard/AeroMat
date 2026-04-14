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
  colspan?: number;
  smcolspan?: number;
}

// Compute responsive sizes from colspan (out of 10) per-slide so Next.js
// picks the right srcset variant and panoramas don't get served undersized.
// Floor at 33vw desktop / 50vw mobile — below that browser picks 384px imageSizes
// variant which is too soft for detailed photography on retina displays.
const computeSizes = (slide: Slide): string => {
  const desktopVw = slide.colspan ? Math.min(100, Math.round((slide.colspan / 10) * 100)) : 100;
  const mobileVw = slide.smcolspan ? Math.min(100, Math.round((slide.smcolspan / 10) * 100)) : 100;
  const desktopFinal = Math.max(desktopVw, 33);
  const mobileFinal = Math.max(mobileVw, 50);
  return `(max-width: 768px) ${mobileFinal}vw, ${desktopFinal}vw`;
};

interface ImageSlideProps {
  data: Slide[];
  onClick: (index: number) => void;
  fullWidth?: boolean;
  /** If true, starts hidden and animates via GSAP ScrollTrigger linked to intro card */
  waitForTrigger?: boolean;
  /** Grid layout variant: "11", "7", "7sq", or undefined for default */
  gridVariant?: string;
}

// Konfiguracja animacji — snappy slide + scale-in
const ANIMATION_CONFIG = {
  duration: 0.8,
  stagger: 0.06,
  xOffset: 80,
  yOffset: 40,
  startScale: 0.94,
  // cubic-bezier(0.22, 1, 0.36, 1) — modern snappy ease
  ease: "expo.out",
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

    // Hide items with side offset + scale-down (B. scale-in entry)
    items.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const isLeft = rect.left + rect.width / 2 - containerRect.left < containerCenterX;
      gsap.set(item, {
        opacity: 0,
        x: isLeft ? -ANIMATION_CONFIG.xOffset : ANIMATION_CONFIG.xOffset,
        scale: ANIMATION_CONFIG.startScale,
        transformOrigin: "center center",
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
              scale: 1,
              delay: 0.25,
              stagger: ANIMATION_CONFIG.stagger,
              duration: ANIMATION_CONFIG.duration,
              ease: ANIMATION_CONFIG.ease,
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
                sizes={computeSizes(slide)}
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
