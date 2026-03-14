import React from "react";
import Collaborations from "./Collaborations";

const TrustedBy = () => {
  return (
    <section className="py-12 px-4">
      <div className="flex flex-row justify-center items-center pb-6">
        <span className="border-b border-solid border-white/20 w-8 h-1" />
        <h3 className="text-center px-4 text-white">Zaufały Mi Silne Marki:</h3>
        <span className="border-b border-solid border-white/20 w-8 h-1" />
      </div>
      <Collaborations />
    </section>
  );
};

export default TrustedBy;
