'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const Card = ({
  imageFront = '/images/SpaceCity.jpg',
  imageBack = '/images/BackImage.jpg',
  title = 'Title',
  color = 'purple',
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleFlip = () => {
    if (!isAnimating) {
      setIsFlipped(!isFlipped);
      setIsAnimating(true);
    }
  };

  return (
    <div className={clsx('relative w-full h-full flex items-center justify-center cursor-pointer overflow-hidden')}>
      <div className="relative w-full h-full" onClick={handleFlip}>
        <motion.div
          className="relative w-full h-full"
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
          onAnimationComplete={() => setIsAnimating(false)}
          style={{
            transformStyle: 'preserve-3d', // Ensures 3D flipping
          }}
        >
          {/* Front Side */}
          <div
            className="absolute w-full h-full backface-hidden flex flex-col bg-cover bg-center border-[1px] text-white p-4"
            style={{
              backgroundImage: `url(${imageFront})`,
              backfaceVisibility: 'hidden', // Hides the back side when flipped
            }}
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

          {/* Back Side */}
          <div
            className="absolute w-full h-full backface-hidden flex flex-col bg-cover bg-center border-[1px] text-white p-4"
            style={{
              backgroundImage: `url(${imageBack})`,
              transform: 'rotateY(180deg)', // Rotates the back side
              backfaceVisibility: 'hidden', // Hides the front side when flipped
            }}
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