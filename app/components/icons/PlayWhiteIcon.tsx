import React from "react";
import Image from "next/image";

const PlayWhiteIcon = () => {
  return (
    <div className="relative  size-6 lsm:size-8 ">
      <Image
        alt="Play"
        fill
        src="/icons/icons8-play-white-100.png"
        sizes="40px"
      />
    </div>
  );
};

export default PlayWhiteIcon;
