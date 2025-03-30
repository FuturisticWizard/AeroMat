'use client'
import React from 'react'

import VideoPlayer from './VideoPlayer/VideoPlayer'
import Process from './Process'



const HowItWorks = () => {
  return (
    <div className='relative w-full'>

  
    <div className='relative px-8  lmd:px-0  pt-12 md:pt-24 lg:pt-36 pb-12 sm:pb-36 md:pb-12 lg:pb-48 xl:pb-56 max-w-6xl h-auto mx-auto'>
        <div className='flex flex-col pb-10'>
            <h2 className=' text-red-400 text-lg '>Jak pracuję?</h2>
            <div className='grid grid-cols-1 xsm:grid-cols-2  justify-center gap-2 sm:gap-4 '>
                <div className=''>
                    <h3 className='font-bold text-2xl sm:text-3xl '>Tworzę murale które ozdabiają przestrzeń i przynoszą korzyści Twojemu biznesowi.</h3>
                </div>
                <div className=' text-gray-600 text-sm xsm:text-base md:text-md lg:text-lg'>
                    <div >
                        <p>
                            Pracuję z materiałami wybranymi z najwyższą starannością, uwzględniając środowisko i jego wpływ na dzieło. Posiadam doświadczenie z farbami antysmogowymi i UV. Wykorzystuję różne techniki: pędzel, wałek, spray, aerograf i flamastry, dobierając je zawsze do konkretnego projektu.
                        </p>
                        <p>
                            
                        </p>
                    </div>
                </div>
            </div>
        </div>
        {/* <div className='image-container'>
            <Image 
                src='/images/mural-starowka-zwyzka.jpg' 
                alt='zdjęcie przedstawiające aeromat w pracy' 
                fill 
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"                                                          
                quality={100} // Adjust quality to 100 for better image quality
                unoptimized={true}
            />
        </div> */}

        {/* Images___Slider */}

        {/* <ImagesSlider className="h-[30rem]" images={images}>
            <motion.div
                initial={{
                opacity: 0,
                y: -80,
                }}
                animate={{
                opacity: 1,
                y: 0,
                }}
                transition={{
                duration: 0.6,
                }}
                className="z-50 flex flex-col justify-center items-center"
            >
               <motion.p className="font-bold text-xl md:text-6xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 py-4">
                The hero section slideshow <br /> nobody asked for
                </motion.p>
                <button className="px-4 py-2 backdrop-blur-sm border bg-emerald-300/10 border-emerald-500/20 text-white mx-auto text-center rounded-full relative mt-4">
                <span>Join now →</span>
                <div className="absolute inset-x-0  h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-emerald-500 to-transparent" />
                </button> 
            </motion.div>
        </ImagesSlider> */}
        <Process />
        <div className=' relative max-w-full max-h-[320px] md:max-h-[580px] z-30'>
            <VideoPlayer url='/movies/reel.mov' />
            
        </div>
        
       
    </div>
    <div className='absolute h-[200px] bg-black bottom-0  w-full z-10' />
    </div>
  )
}

export default HowItWorks
