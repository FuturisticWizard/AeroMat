"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { LuRotateCcw } from "react-icons/lu";
import clsx from "clsx";
import Image from "next/image";
import { Button } from "./ui/button";
// import Rotate from '@/public/icons/rotate.svg'

const CardFlip = ({
  icon = "/placeholders/64x64.svg",
  imageBack = "/images/lpec-dom1.jpg",
  imageFront = "/images/lpec-dom2.jpg",
  title = "title",
  description = "description",
  color = "purple",
  classname = "",
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
        `grid grid-cols-1  items-center justify-center cursor-pointer `,
        classname,
      )}
    >
      <div className="flip-card rounded-md" onClick={handleFlip}>
        <motion.div
          className="flip-card-inner  w-full h-full grid grid-rows-subgrid gap-2 grid-auto-row py-4 border-[1px] rounded-xl w-[100%] h-[100%]  "
          initial="false"
          animate={{ rotateY: isFlipped ? 180 : 360 }}
          transition={{ duration: 0.6, animationDirection: "normal" }}
          onAnimationComplete={() => setIsAnimating(false)}
        >
          <div
            className="group flip-card-front bg-white hover:bg-[#4C40F7] hover:text-white inner-shadow shadow-lg  transition-colors duration-600 ease-in-out w-[100%] h-[100%] md:h-full flex-col sm:bg-center bg-cover  border-[1px] rounded-xl "
            style={{
              backgroundImage: `url(${imageFront})`,
            }}
          >
            {/* Card Content */}
            <div className="p-11">
              <div className={`w-full flex items-center justify-center `}>
                <div
                  className={`rounded-full px-4 py-4  group-hover:bg-white bg-${color} `}
                >
                  <Image src={icon} alt={title} width={64} height={64} />
                </div>
              </div>
              {/* <h3 className='lg:text-xl font-semibold pt-11 pb-4 w-full text-center '>{title}</h3> */}
              {/* <div className='w-full flex flex-col items-center justify-center text-center'>
                    <p className='lg:text-lg text-[#6B6B6B] group-hover:text-white leading-normal'>{description}</p>
                  </div> */}
            </div>

            <div className="w-full flex flex-col items-center justify-center ">
              {/* Icon */}
              <div
                className={`rounded-full px-4 py-4 group-hover:bg-white bg-${color}`}
              >
                <Image src={icon} alt={title} width={64} height={64} />
              </div>
              <h3
                className="text-2xl lg:text-xl font-semibold pt-4 pb-2 w-full text-center"
                style={{
                  transform: "translate3d(0, 0, 0)", // Force GPU rendering
                  backfaceVisibility: "hidden", // Prevent rendering artifacts
                  WebkitFontSmoothing: "antialiased", // Improve font clarity
                  MozOsxFontSmoothing: "grayscale", // Optimize font rendering in Firefox
                }}
              >
                {title}
              </h3>
            </div>

            <div className="w-full flex flex-col items-center justify-start text-center ">
              <p
                className="lg:text-lg text-[#6B6B6B] group-hover:text-white leading-normal px-4 py-4"
                style={{
                  transform: "translate3d(0, 0, 0)", // Force GPU rendering
                  backfaceVisibility: "hidden", // Prevent rendering artifacts
                  WebkitFontSmoothing: "antialiased", // Improve font clarity
                  MozOsxFontSmoothing: "grayscale", // Optimize font rendering in Firefox
                }}
              >
                {description}
              </p>
              <Button
                size="lg"
                className={`py-6 px-2  bg-${color} shadow-inner `}
                style={{
                  transform: "translate3d(0, 0, 0)", // Force GPU rendering
                  backfaceVisibility: "hidden", // Prevent rendering artifacts
                  WebkitFontSmoothing: "antialiased", // Improve font clarity
                  MozOsxFontSmoothing: "grayscale", // Optimize font rendering in Firefox
                }}
              >
                <LuRotateCcw size={48} />
              </Button>
            </div>

            <div className="absolute inset-0 h-full bg-gradient-to-tr from-transparent via-black/40 to-black/80 rounded-md " />

            <div className="relative inline-block justify-center text-center sm:justify-end sm:text-end">
              <div className="relative px-4 ">
                <h3 className="text-2xl ">{title}</h3>
              </div>
            </div>

            <div className=" flex w-full h-full justify-center items-center  text-white/70 z-10">
              <div
                className={`absolute inset-0 h-full  hidden md:group-hover:block md:group-hover:opacity-75 z-10`}
                style={{ backgroundColor: `#${color}` }}
              />
              <div className="block md:hidden  group-hover:block ">
                <LuRotateCcw size={72} />
                <div className="flex flex-col items-center text-center justify-center ">
                  <h2 className="items-center uppercase font-bold text-2xl z-20">
                    {title}
                  </h2>
                  <p></p>
                </div>
              </div>
            </div>
          </div>

          <div
            className="flex group flip-card-back w-[100%] h-[100%] flex-col bg-cover bg-right  border-[1px] text-white/90 rounded-lg p-4 z-10 hover"
            style={{
              backgroundImage: `url(${imageBack})`,
            }}
          >
            <div
              className="absolute inset-0 h-full rounded-md opacity-90 "
              style={{ backgroundColor: `#${color}` }}
            />

            <div className="flex flex-col h-full px-14 xxs:text-base xxs:text-start xxs:px-2  text-center font-semibold  justify-center items-center z-20">
              <p className="px-2 py-2">{description}</p>
            </div>

            <div
              id="flip"
              className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2  text-white/70 group-hover:z-40 "
            >
              <div className="hidden group-hover:block transition-all ease-in-out [animation-duration:3s] ">
                <LuRotateCcw size={72} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CardFlip;
