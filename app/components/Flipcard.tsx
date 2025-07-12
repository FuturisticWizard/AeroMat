"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { LuRotateCcw } from "react-icons/lu";
import clsx from "clsx";
import Image from "next/image";
import { Button } from "./ui/button";
// import Rotate from '@/public/icons/rotate.svg'

const colorMap = {
  "green-light": "rgba(140, 255, 140, 0.5)",
  "green-medium": "rgba(120, 255, 120, 0.5)",
  "green-dark": "rgba(100, 255, 100, 0.5)",
  "yellow-light": "rgba(255, 255, 140, 0.5)",
  "yellow-medium": "rgba(255, 255, 120, 0.5)",
  "yellow-dark": "rgba(255, 255, 100, 0.5)",
  "blue-light": "rgba(140, 140, 255, 0.5)",
  "blue-medium": "rgba(120, 120, 255, 0.5)",
  "blue-dark": "rgba(100, 100, 255, 0.5)",
  "red-light": "rgba(255, 140, 140, 0.5)",
  "red-medium": "rgba(255, 120, 120, 0.5)",
  "red-dark": "rgba(255, 100, 100, 0.5)",
  "purple-light": "rgba(200, 140, 255, 0.5)",
  "purple-medium": "rgba(180, 120, 255, 0.5)",
  "purple-dark": "rgba(160, 100, 255, 0.5)",
  "orange-light": "rgba(255, 200, 140, 0.5)",
  "orange-medium": "rgba(255, 180, 120, 0.5)",
  "orange-dark": "rgba(255, 160, 100, 0.5)",
  "teal-light": "rgba(140, 255, 200, 0.5)",
  "teal-medium": "rgba(120, 255, 180, 0.5)",
  "teal-dark": "rgba(100, 255, 160, 0.5)",
  "cyan-light": "rgba(140, 255, 255, 0.5)",
  "cyan-medium": "rgba(120, 255, 255, 0.5)",
  "cyan-dark": "rgba(100, 255, 255, 0.5)",
  "magenta-light": "rgba(255, 140, 255, 0.5)",
  "magenta-medium": "rgba(255, 120, 255, 0.5)",
  "magenta-dark": "rgba(255, 100, 255, 0.5)",
  "brown-light": "rgba(200, 180, 140, 0.5)",
  "brown-medium": "rgba(180, 160, 120, 0.5)",
  "brown-dark": "rgba(160, 140, 100, 0.5)",
};

interface FlipcardProps {
  icon: string; // Assuming the icon is a string (e.g., a URL or path to an image)
  imageFront: string;
  imageBack: string;
  title: string;
  description: string;
  color: keyof typeof colorMap | string;
  classname?: string; // Optional prop
  video?: boolean;
}

const Flipcard: React.FC<FlipcardProps> = ({
  icon,
  imageFront,
  imageBack,
  title,
  description,
  color,
  classname,
  video = true,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  function handleFlip() {
    if (!isAnimating) {
      setIsFlipped(!isFlipped);
      setIsAnimating(true);
    }
  }

  return (
    <div
      className={clsx(
        `grid grid-cols-1 items-center justify-center cursor-pointer`,
        classname,
      )}
    >
      <div className="flip-card w-full h-full rounded-md" onClick={handleFlip}>
        <motion.div
          className="flip-card-inner group grid grid-rows-[1fr_2fr_1fr] gap-2 py-4 border-[1px] rounded-xl w-[100%] h-[100%]"
          initial="false"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
          onAnimationComplete={() => setIsAnimating(false)}
        >
          {/* Front Side */}
          <div
            className="flip-card-front bg-white lsm:group-hover:bg-[#4C40F7] lsm:group-hover:text-white inner-shadow shadow-lg transition-colors duration-600 ease-in-out w-[100%] h-[100%] grid grid-rows-subgrid gap-2 rounded-xl"
            style={{
              backgroundImage: `url(${imageFront})`,
            }}
          >
            <div className="flex items-center justify-center">
              <div
                className={`lsm:group-hover:bg-white rounded-full px-4 py-4 bg-${color}`}
              >
                <Image src={icon} alt={title} width={64} height={64} />
              </div>
            </div>
            <div className="flex flex-col items-center justify-center min-h-[200px] text-center">
              <h3 className="text-2xl font-semibold pt-4 pb-2 ">{title}</h3>
              <p className="lg:text-lg text-[#6B6B6B] lsm:group-hover:text-white leading-normal px-4 py-4">
                {description}
              </p>
            </div>
            <Button
              size="icon"
              className={`py-2 px-2  bg-${color} shadow-inner border-1 border-gray-500 border-solid mx-auto rounded-full lsm:group-hover:bg-red-600 `}
              style={{
                transform: "translate3d(0, 0, 0)", // Force GPU rendering
                backfaceVisibility: "hidden", // Prevent rendering artifacts
                boxShadow: `0 4px 6px ${color in colorMap ? colorMap[color as keyof typeof colorMap] : "rgba(0, 0, 0, 0.5)"}`,
                WebkitFontSmoothing: "antialiased", // Improve font clarity
                MozOsxFontSmoothing: "grayscale", // Optimize font rendering in Firefox
              }}
            >
              <LuRotateCcw size={48} />
            </Button>
          </div>

          {/* Back Side */}
          <div
            className={`flip-card-back w-[100%] h-[100%] flex flex-col bg-cover bg-right border-[1px] text-white/90 rounded-lg p-2 z-10 hover`}
            style={{
              backgroundImage: `url(${imageBack})`,
            }}
          >
            {/* <div className="absolute inset-0 h-full rounded-md opacity-90" style={{ backgroundColor: `#${color}` }} />
            <div className="flex flex-col h-full px-4 text-center font-semibold justify-center items-center z-20">
              <p className="px-2 py-2">{description}</p>
            </div> */}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Flipcard;
