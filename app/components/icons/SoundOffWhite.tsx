import React from "react";
import Image from "next/image";

const SoundOffWhiteIcon = () => {
  return (
    <div className="relative  size-6 lsm:size-8">
      <Image
        alt="Play"
        fill
        src="/icons/icons8-sound-off-white-100.png"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
};

export default SoundOffWhiteIcon;
