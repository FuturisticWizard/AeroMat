'use client'
import React, { useState } from 'react'
import  { motion } from 'framer-motion'
// import { LuRotateCcw } from "react-icons/lu";
import clsx from 'clsx';
// import Rotate from '@/public/icons/rotate.svg'

const Card = ({ imageFront='/images/SpaceCity.jpg', title='title', color = 'purple'}) => {
  const [ isFlipped, setIsFlipped ] = useState(false)
  const [ isAnimating, setIsAnimating ] = useState(false) 
  console.log(color)
  function handleFlip () {
    if(!isAnimating) {
      setIsFlipped(!isFlipped)
      setIsAnimating(true)
    }

  }

  return (
    <div className={clsx(`flex w-full h-full  items-center justify-center cursor-pointer overfow-hidden  `)}>
      
      <div className=" w-full h-full" onClick={handleFlip}> 
        
        <motion.div 
        className=' w-[100%] h-[100%] '
        initial="false"
        animate={{rotateY: isFlipped ? 180 : 360}}
        transition={{ duration: 0.6, animationDirection: "normal"}}
        onAnimationComplete={() => setIsAnimating(false)}
        >
              <div 
              className='flex group w-[100%] h-[100%] md:h-full flex-col sm:bg-center bg-cover  border-[1px] text-white  p-4 '
              style={{ 
                backgroundImage: `url(${imageFront})`,
              }}
              >   
                <div className="absolute inset-0 h-full   " />
                  
                <div className=' flex w-full h-full justify-center items-center  text-white/70 z-10'> 
                    <div className='block md:hidden  group-hover:block '>
                      <div className='flex flex-col items-center text-center justify-center '>
                        <h2 className="items-center uppercase font-bold text-2xl z-20">{title}</h2>
                      </div>
                    </div>
                </div>  
               

              </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Card
