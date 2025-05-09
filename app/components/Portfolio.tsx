"use client";
import Image from "next/image";
import React, { useState } from "react";

import Masonry from "react-masonry-css";
import Card from "./Card";
import CardFlip from "./CardFlip";
import { FC } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { portfolioPhotos } from "@/app/lib/photos";
import Images from "./Images";

interface ImagesProps {
  data: {
    index: number;
    src: string;
    title: string;
    category: string;
    width: number;
    height: number;
    smcolspan: number;
    smrowspan: number;
    colspan: number;
    rowspan: number;
    gridArea: string;
  }[];
  onClick: (index: number) => void;
}
interface PortfolioProps {
  data: {
    index: number;
    src: string;
    title: string;
    category: string;
    width: number;
    height: number;
    smcolspan: number;
    smrowspan: number;
    colspan: number;
    rowspan: number;
    gridArea: string;
  }[];
}

const Portfolio = ({ data = portfolioPhotos}: PortfolioProps) => {
  // const { data, onClick } = props;
  const [index, setIndex] = useState<number>(-1);
  // const handleClickImage = (index: number) => {
  //   onClick(index);
  // };

  return (
    // <div className='flex flex-col mx-auto h-[100vh] w-full items-center xxs:max-w-sm sm:max-w-5xl lg:max-w-full xxs:py-4 xl:py-2 px-2'>
    //   <div className={`grid xxs:grid-cols-1 sm:grid-cols-2 xss:grid-rows-${portfolioPhotos.length } md:grid-cols-3 md:row-auto  gap-1 sm:gap-2 md:gap-4 lg:gap-2 h-full w-full py-2`} >
    //     {/* <div className='col-span-1 row-span-1 md:col-span-10 md:row-span-6 h-[600px] md:h-auto'><Card title={items[5].title} image={items[5].image} color={items[5].color} /></div>
    //     <div className='col-span-1 row-span-1 md:col-span-3 md:row-span-12 h-[600px] md:h-auto'><Card title={items[0].title} image={items[0].image}  color={items[0].color}/></div>
    //     <div className='col-span-1 row-span-1 md:col-span-2 md:row-span-6 h-[600px] md:h-auto'><Card title={items[1].title} image={items[1].image}  color={items[1].color}/></div>
    //     <div className='col-span-1 row-span-1 md:col-span-5 md:row-span-6 h-[600px] md:h-auto'><Card title={items[2].title} image={items[2].image} color={items[2].color}/></div> */}
    //     {
    //       data.map((item) => (
    //         <div key={item.index} className={`col-span-1 row-span-1 md:col-span-${item.colspan} md:row-span-${item.rowspan} h-[600px] md:h-auto`}>
    //           <Card
    //             image={item.src}
    //             onClick={() => handleClickImage(index)}
    //           />

    //         </div>
    //       ))
    //     }
    //     <Lightbox
    //       slides={portfolioPhotos}
    //       open={index >= 0}
    //       index={index}
    //       close={() => setIndex(-1)}
    //       // enable optional lightbox plugins
    //       plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
    //       />
    //   </div>
    // </div>
    <div className="xl:mx-auto xl:max-w-7xl">
      <Images
        data={data}
        onClick={(currentIndex) => setIndex(currentIndex)}
        length={portfolioPhotos.length}
      />
      <Lightbox
        slides={data}
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        // enable optional lightbox plugins
        plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
      />
    </div>
  );
};

export default Portfolio;
