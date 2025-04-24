'use client'
import React from 'react'

import VideoPlayer from './VideoPlayer/VideoPlayer'
import Process from './Process'
import Image from 'next/image'



const HowItWorks = () => {
  return (
    <div className='relative w-full'>
    <div className="absolute bg-black w-full bottom-0 h-1/3" />
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
                    </div>
                </div>
            </div>
        </div>

        <Process />
        <div className=' relative max-w-full max-h-[320px] md:max-h-[580px] z-30'>
            <VideoPlayer url='/movies/reel_compressed.mp4' />
        </div>
    </div>
    {/* <div className='relative w-[1200px] h-[280px] -top-64 right-0'>
        <Image
         src='/pngs/black-spill.png'
         alt='paint spill'
         fill
         objectFit='cover'
         />
    </div> */}
    <div className='absolute h-[200px] bg-black bottom-0  w-full z-10' />
    </div>
  )
}

export default HowItWorks
