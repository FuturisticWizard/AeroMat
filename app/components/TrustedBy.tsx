import React from "react";
import Collaborations from "./Collaborations";

const TrustedBy = () => {
  return (
    <div className="flex flex-col justify-center items-center py-10 max-w-5xl mx-auto ">
      <div className="flex flex-row justify-center items-center py-2">
        <span className="border-b border-solid border-black/10 w-8 h-1" />
        <h3 className="text-center px-4">Zaufały Mi Silne Marki:</h3>{" "}
        <span className="border-b border-solid border-black/10 w-8 h-1" />
      </div>
      <div className="absolute w-full mt-36 z-30">
        <Collaborations />
      </div>
    </div>
  );
};

export default TrustedBy;
