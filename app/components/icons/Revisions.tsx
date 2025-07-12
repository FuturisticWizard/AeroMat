import React from "react";
import Image from "next/image";

const Revisions = () => {
  return (
    <div className="relative w-8 h-8 lsm:w-10 lsm:h-10">
      <Image
        alt="Poprawki"
        fill
        src="/icons/revisions.png"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
};

export default Revisions;
