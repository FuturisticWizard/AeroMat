"use client";
import React, { useState, MouseEventHandler } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

interface CardProps {
  image?: string;
  title?: string;
  color?: string;
  onClick?: MouseEventHandler<HTMLDivElement>; // Type for the onClick handler
}

const Card: React.FC<CardProps> = ({
  image = "/images/SpaceCity.jpg",
  title = "Title",
  color = "purple",
  onClick,
}) => {
  return (
    <div
      className={clsx(
        "relative w-full h-full flex items-center justify-center cursor-pointer overflow-hidden",
      )}
    >
      <div className="relative w-full h-full">
        <motion.div className="relative w-full h-full">
          {/* Front Side */}
          <div
            className="absolute w-full h-full flex flex-col bg-cover bg-center border-[1px] text-white p-4"
            style={{
              backgroundImage: `url(${image})`,
              backfaceVisibility: "hidden", // Hides the back side when flipped
            }}
            onClick={onClick}
          >
            <div className="absolute inset-0 h-full" />
            <div className="flex w-full h-full justify-center items-center text-white/70 z-10">
              <div className="block md:hidden">
                <div className="flex flex-col items-center text-center justify-center">
                  <h2 className="uppercase font-bold text-2xl z-20">{title}</h2>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Card;
