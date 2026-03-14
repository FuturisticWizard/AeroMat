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
    gridArea: string;
  }[];
  fullWidth?: boolean;
  waitForTrigger?: boolean;
  gridVariant?: string;
}

const Portfolio = ({ data = portfolioPhotos, fullWidth = false, waitForTrigger = false, gridVariant }: PortfolioProps) => {
  const [index, setIndex] = useState<number>(-1);

  const containerClass = fullWidth ? "w-full" : "xl:mx-auto xl:max-w-7xl";

  return (
    <div className={containerClass}>
      <Images
        data={data}
        onClick={(currentIndex) => setIndex(currentIndex)}
        fullWidth={fullWidth}
        waitForTrigger={waitForTrigger}
        gridVariant={gridVariant}
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
