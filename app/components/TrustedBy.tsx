import React from "react";
import Collaborations from "./Collaborations";

const TrustedBy = () => {
  return (
    <section className="py-12 md:py-16 px-4 sm:px-8">
      <div className="flex flex-row justify-center items-center pb-6">
        <span className="border-b border-solid border-white/20 w-8 h-1" />
        <h3 className="text-center px-4 text-white">Zaufały Mi Silne Marki:</h3>
        <span className="border-b border-solid border-white/20 w-8 h-1" />
      </div>
      <div className="relative">
        {/* Aurora wash behind logos — variant 34b (magenta / orange / amber) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 z-0"
          style={{
            height: "220px",
            background: `
              radial-gradient(ellipse 35% 70% at 25% 50%, rgba(236,72,153,0.75) 0%, rgba(236,72,153,0) 55%),
              radial-gradient(ellipse 35% 70% at 50% 50%, rgba(255,115,2,0.85) 0%, rgba(255,115,2,0) 55%),
              radial-gradient(ellipse 35% 70% at 75% 50%, rgba(255,200,0,0.75) 0%, rgba(255,200,0,0) 55%)
            `,
          }}
        />
        <Collaborations />
      </div>
    </section>
  );
};

export default TrustedBy;
