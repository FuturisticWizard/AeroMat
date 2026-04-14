import React from "react";
import Image from "next/image";

const RocketLaunch = () => {
  return (
    <div className="relative w-8 h-8 lsm:w-10 lsm:h-10">
      <Image
        alt="Start"
        fill
        src="/icons/rocket_start.png"
        sizes="40px"
      />
    </div>
  );
};

export default RocketLaunch;
