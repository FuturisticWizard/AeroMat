import React from "react";
import Image from "next/image";

const Compress = () => {
  return (
    <div className="relative  size-4 lsm:size-4">
      <Image
        alt="Compress"
        fill
        src="/icons/icons8-compress-100.png"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
};

export default Compress;
