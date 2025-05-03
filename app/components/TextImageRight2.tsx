import Image from "next/image";
import React from "react";

const TextImageRight2 = () => {
  return (
    <div className="flex w-full h-full  py-20  bg-[#E2E3E3]">
      <div className="flex flex-col sm:flex-row sm:mx-auto max-w-7xl    gap-8 items-center sm:justify-center">
        <div className="flex flex-col w-full px-6 lsm:w-1/2">
          <h2 className="flex text-3xl font-bold text-[#4D4D4D] pb-4">
            Murale standardowe
          </h2>
          <p className="text-base lsm:text-xl">
            Są to murale reklamowe namalowane na ścianach budynków w widocznych
            miejscach w przestrzeni miejskiej. Ich imponujący wygląd przyciąga
            uwagę znacznie bardziej, niż typowe formy reklamowe. Sam etap
            wykonania takiego muralu (np. film z malowania) może być formą
            kampanii promocyjnej marki. Zajmujemy się wykonaniem takich reklam
            od projektu, aż po ostatnią kroplę farby na ścianie lokalizacji,
            którą wspólnie wybierzemy tak, aby idealnie pasowała do kampanii.
          </p>
        </div>

        <div className="flex  lsm:w-1/2 justify-center">
          <Image
            src="/images/folklor-mural.png"
            alt="image"
            width="800"
            height="800"
            className="w-full h-full lsm:max-w-[600px] lsm:max-h-[600px]  md:max-w-[700px] md:max-h-[700px]"
            style={{
              objectFit: "contain",
              height: "auto",
              width: "auto",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TextImageRight2;
