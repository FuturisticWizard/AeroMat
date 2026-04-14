import Image from "next/image";
import { Fragment } from "react";

const logos = [
  "/logo/clients_logos/1P.png",
  "/logo/clients_logos/2P.png",
  "/logo/clients_logos/3P.png",
  "/logo/clients_logos/4P.png",
  "/logo/clients_logos/5P.png",
  "/logo/clients_logos/6P.png",
  "/logo/clients_logos/7P.png",
  "/logo/clients_logos/8P.png",
  "/logo/clients_logos/9P.png",
  "/logo/clients_logos/10P.png",
  "/logo/clients_logos/11P.png",
  "/logo/clients_logos/12P.png",
];

const TapeRightSection = () => {
  return (
    <div className="relative w-full overflow-x-clips md:px-12 z-10">
      <div className="bg-transparent text-dark -mx-1">
        <div className="flex [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex flex-none gap-24 pr-4 py-3 animate-move-right [animation-duration:60s] hover:paused">
            {[...new Array(2)].fill(0).map((_, i) => (
              <Fragment key={i}>
                {logos.map((logo, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center hover:scale-[1.2] transition-transform duration-300 ease-out"
                  >
                    <Image
                      src={logo}
                      alt={`Logo ${index + 1}`}
                      sizes="84px"
                      width="84"
                      height="0"
                      style={{ height: "auto" }}
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

export default TapeRightSection;
