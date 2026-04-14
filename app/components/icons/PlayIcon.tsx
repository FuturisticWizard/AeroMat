import React from "react";
import Image from "next/image";

const PlayIcon = () => {
  return (
    <div className="relative  size-4 lsm:size-4 ">
      <Image
        alt="Play"
        fill
        src="/icons/icons8-play-96.png"
        sizes="40px"
      />
    </div>
  );
};

export default PlayIcon;
