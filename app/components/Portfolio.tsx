"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { portfolioPhotos } from "@/app/lib/photos";
import Images from "./Images";

const LazyLightbox = dynamic(() => import("./PortfolioLightbox"), {
  ssr: false,
});

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
      {index >= 0 && (
        <LazyLightbox
          slides={data}
          index={index}
          close={() => setIndex(-1)}
        />
      )}
    </div>
  );
};

export default Portfolio;
