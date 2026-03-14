import Image from "next/image";
import React from "react";

const SpraySplash = ({
  width = "250px",
  height = "250px",
  color = "black",
}) => {
  return (
    <div className={`absolute w-[${width}] h-[${height}] inset- z-10`}>
      <Image
        src={`/pngs/${color}-spray.webp`}
        alt="black paint spray splash"
        fill
      />
    </div>
  );
};

export default SpraySplash;
