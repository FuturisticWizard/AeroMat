'use client'

import React from 'react';
import clsx from 'clsx';
import {portfolioPhotos} from "@/app/lib/photos"

const BentoGrid = () => {
  return (
    <div
      className="grid grid-cols-10 md:grid-rows-18 gap-4 w-full"
      
    >
      {portfolioPhotos.map((photo) => (
        <div
          key={photo.index}
          className={clsx(
            `col-span-${photo.colspan}`,
            `row-span-${photo.rowspan}`,
            'relative overflow-hidden rounded-lg'
          )}
        >
          <img
            src={photo.src}
            alt={photo.title}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );
};

export default BentoGrid;