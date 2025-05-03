import Image from "next/image";
import { Fragment } from "react";

const logos = [
  "/Collaborations/logo1.png",
  "/Collaborations/logo2.png",
  "/Collaborations/logo3.png",
  "/Collaborations/logo5.jpg",
  "/Collaborations/logo6.png",
  "/Collaborations/logo7.png",
  "/Collaborations/logo8.png",
  "/Collaborations/logo9.png",
  "/Collaborations/logo10.png",
  "/Collaborations/logo11.jpg",
  "/Collaborations/logo12.png",
  "/Collaborations/logo13.jpg",
];

const TapeLeftSection = () => {
  return (
    <div className="relative w-full py-16 overflow-x-clip  md:px-12 ">
      <div className="bg-white text-dark -mx-1">
        <div className="flex [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex flex-none gap-24 pr-4 py-3 animate-move-left [animation-duration:50s]">
            {[...new Array(2)].fill(0).map((_, i) => (
              <Fragment key={i}>
                {logos.map((logo, index) => (
                  <div key={index} className="inline-flex gap-4 items-center">
                    <Image
                      src={logo}
                      alt={`Logo ${index + 1}`}
                      height={36}
                      width={100}
                    />
                    {/* <span className="text-warmGray-950 uppercase font-extrabold text-sm">{word}</span> */}
                  </div>
                ))}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TapeLeftSection;
