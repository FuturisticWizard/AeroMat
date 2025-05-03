import Image from "next/image";
import React from "react";

const HeadingSection = ({
  img = "/pngs/yellow-spray.png",
  subheading = "Subheading",
  content = "Content",
  heading = "Heading",
}) => {
  return (
    <div className="relative max-w-6xl mx-auto justify-center items-center px-4 lsm:px-8 py-8 md:py-16">
      {/* Spray splash */}
      <div className="absolute -top-10 -left-20 lg:top-2 lg:-left-16 w-[280px] h-[280px] z-0 opacity-80 ">
        <Image
          src={img}
          alt="Black spray paint splash"
          height={400}
          width={400}
          className="z-0"
        />
      </div>

      {/* Content */}
      <div className="relative  z-10">
        <h2 id="subheading" className="text-red-400 text-lg font-bold">
          {subheading}
        </h2>
        <div className="flex flex flex-col sm:flex-row order-2 sm:order-1 pb-4 lsm:pb-8 gap-4">
          <div className="sm:w-1/2">
            <h3 className="text-2xl sm:text-2xl lsm:text-3xl font-semibold leading-snug">
              {heading}
            </h3>
          </div>

          <p className="text-sm xsm:text-base md:text-md lg:text-lg text-semibold text-gray-600 sm:w-1/2">
            {content}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeadingSection;
