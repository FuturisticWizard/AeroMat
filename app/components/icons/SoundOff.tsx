import React from "react";
import Image from "next/image";

const SoundOffIcon = () => {
  return (
    <div className="relative  size-4 lsm:size-4">
      <Image
        alt="Play"
        fill
        src="/icons/icons8-sound-off-100.png"
        sizes="40px"
      />
    </div>
  );
};

export default SoundOffIcon;
