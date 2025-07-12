"use client";
import React from "react";

import VideoPlayer from "./VideoPlayer/VideoPlayer";
import Process from "./Process";
import Image from "next/image";
import HeadingSection from "./HeadingSection";

const HowItWorks = () => {
  return (
    <div className="relative w-full h-full">
      {/* <div className="absolute bg-black w-full bottom-0 h-1/3" /> */}
      <div className="relative px-8  lmd:px-8 lg:px-0 max-w-7xl h-auto mx-auto">
        <HeadingSection
            subheading="Jak pracuję?"
            heading="Tworzę murale które ozdabiają przestrzeń i przynoszą korzyści
                Twojemu biznesowi."
            content="Pracuję z materiałami wybranymi z najwyższą starannością,
                  uwzględniając środowisko i jego wpływ na dzieło. Posiadam
                  doświadczenie z farbami antysmogowymi i UV. Wykorzystuję różne
                  techniki: pędzel, wałek, spray, aerograf i flamastry,
                  dobierając je zawsze do konkretnego projektu."
            img="purple"
          />
        <Process />
        <div className=" relative max-w-full max-h-[320px] md:max-h-[580px] z-30">
          <VideoPlayer url="/movies/reel_output.mp4" />
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
      {/* <div className="hidden sm:absolute  h-[200px] bg-black bottom-0  w-full z-10" /> */}
    </div>
  );
};

export default HowItWorks;
