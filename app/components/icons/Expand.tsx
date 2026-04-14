import React from "react";
import Image from "next/image";

const Expand = () => {
  return (
    <div className="relative  size-6 lsm:size-8">
      <Image
        alt="Expand"
        fill
        src="/icons/icons8-expand-100.png"
        sizes="40px"
      />
    </div>
  );
};

export default Expand;
