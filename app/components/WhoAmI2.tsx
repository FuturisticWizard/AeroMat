import Image from "next/image";
import React from "react";
import HeadingSection from "./HeadingSection";

const WhoAmI2 = () => {
  return (
    <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 items-center max-w-7xl mx-auto px-8 lsm:px-8 py-8 md:py-16 gap-4 sm:gap-8 lg:gap-32 mt-12">
      <div className="flex relative flex-col order-1 sm:order-2 py-12 z-30 ">
      <div className="absolute -top-12 -left-32 lg:-top-6 lg:-left-25 w-[320px] h-[320px] z-0 opacity-70 ">
              <Image
                src={`/pngs/yellow-spray.png`}
                alt={`Yellow spray paint splash`}
                height={400}
                width={400}
                className="z-0"
              />
      </div>
        <h2 className="text-red-800 text-lg font-bold">Kim jestem?</h2>
        <h3 className="text-2xl sm:text-2xl lsm:text-3xl  font-semibold leading-snug py-1 z-30">
          Nazywam się Mateusz, malarstwo to moja pasja<br />{" "}
          <span className="text-[#FF6800]">
            i sposób na życie.
          </span>
        </h3>
        <p className="text-sm xsm:text-base md:text-md lg:text-lg text-semibold text-gray-600 pr-2 sm:pr-0 z-30">
          Od ponad 25 lat zajmuję się tym , co kocham, i dzięki zaufaniu moich
          klientów miałem okazję sprawdzić się w różnych technikach i
          kombinacjach. Podejmowanie nowych wyzwań pozwalało mi stale
          przekraczać własne granice i odkrywać nowe obszary mojej kreatywności.
        </p>
      </div>
       {/* <HeadingSection
        subheading="Kim jestem?"
        heading="Przeglądaj naszą interaktywną mapę, aby odkryć piękno street artu w mieście."
        content="Murale AeroMat to nie tylko dzieła sztuki, ale także elementy, które ożywiają przestrzeń publiczną i tworzą unikalny charakter miasta. Na AeroMapie znajdziesz wiele moich murali, każdy jest opisany i zlokalizowany,dzięki czemu możesz łatwo odnaleźć je podczas spaceru po mieście."
        img="yellow"
      /> */}
      {/* Decorative line */}

      {/* <div 
        className='absolute w-full h-[320px] bg-no-repeat bg-center bg-contain top-0 left-0 ' 
        style={{ backgroundImage: "url('/pngs/line.png')" }}
        /> */}
      {/* <div className="absolute col-span-2 flex justify-center -left-0  lg: py-4 z-10">
        <Image
          src="/pngs/line.png"
          alt="decorative line"
          width={1800}
          height={250}
          className="z-20"
        />
      </div> */}
        {/* Image */}
      <div className="order-2 sm:oder-1 py-6 flex justify-center items-center ">
        <div className="relative aspect-square size-72 md:size-96 flex  justify-center items-center ">
          {/* <div
            className={`absolute w-[500px] h-[500px] -top-36 xs:w-[600px] xs:h-[600px]  sm:w-[700px] sm:h-[700px] md:w-[750px] md:h-[750px] sm:-top-36 md:-top-36 md:-left-54 lg:-top-36 lg:-left-54 z-10`}
          >
            <Image
              src={`/pngs/spreje2.png`}
              alt="black paint spray splash"
              fill
              style={{
                objectFit: "cover",
              }}
            />

          </div> */}
          <div
            className="relative w-full h-full z-40"
            style={{
              WebkitMaskImage: "url('/pngs/mati-shape.png')", // Mask image
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskSize: "cover",
              maskImage: "url('/pngs/mati-shape.png')", // Fallback for other browsers
              maskRepeat: "no-repeat",
              maskSize: "cover",
            }} 
          >
            {/* Content inside the mask */}
            <Image
              src="/images/zwyzka.jpg"
              alt="Masked content"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>

        </div>
        {/* <div className='relative aspect-square size-84'>   
            
        </div> */}
      </div>
    </div>
  );
};
export default WhoAmI2;
