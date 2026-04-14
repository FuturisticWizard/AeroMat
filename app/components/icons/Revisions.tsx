import React from "react";
import Image from "next/image";

const Revisions = () => {
  return (
    <div className="relative w-8 h-8 lsm:w-10 lsm:h-10">
      <Image
        alt="Poprawki"
        fill
        src="/icons/revisions.png"
        sizes="40px"
      />
    </div>
  );
};

export default Revisions;
