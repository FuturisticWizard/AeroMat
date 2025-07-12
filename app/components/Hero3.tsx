import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const Hero3 = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "200%"]);

  return (
    <div
      ref={ref}
      className="w-full h-[80svh] overflow-hidden relative grid place-items-center "
    >
      <motion.h1
        style={{ y: textY }}
        className="anton-regular  text-white text-7xl md:text-9xl relative z-10"
      >
        AEROMAT
      </motion.h1>
      <motion.div
        className="absolute inset-0 z-0 bg-no-repeat"
        style={{
          backgroundImage: "url(/images/mur1.png)",
          backgroundPosition: "bottom",
          backgroundSize: "cover",
          y: backgroundY,
        }}
      />

      <motion.div
        className="absolute inset-0 z-20"
        style={{
          backgroundRepeat: "no-repeat",
          backgroundImage: "url(/images/mati.png)",
          backgroundPosition: "bottom",
          backgroundSize: "cover",
        }}
      />
    </div>
  );
};

export default Hero3;
