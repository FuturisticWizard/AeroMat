import React from "react";
import Image from "next/image";

const Designing = () => {
  return (
    <div className="relative w-8 h-8 lsm:w-10 lsm:h-10">
      <Image
        alt="Projetkowanie"
        fill
        src="/icons/designing.png"
        sizes="40px"
      />
    </div>
  );
};

export default Designing;
