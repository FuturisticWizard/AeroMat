import React from "react";
import MapComponent from "./MapComponent";
import Image from "next/image";
import HeadingSection from "./HeadingSection";

const MuralsMap = () => {
  return (
    <div className="relative max-w-7xl mx-auto justify-center items-center px-8 lsm:px-8 py-8 md:py-16">
      {/*
      <div className="absolute -top-16 -left-16 lg:-top-4 lg:-left-20 w-[320px] h-[320px] z-0 opacity-90 ">
        <Image
          src="/pngs/yellow-spray.png"
          alt="Black spray paint splash"
          height={400}
          width={400}
          className="z-0"
        />
      </div>

     
      <div className="relative z-10">
        <h2 className="text-red-400 text-lg text-semibold">Gdzie są moje murale?</h2>
        <div className="flex flex-row order-2 sm:order-1 pb-4 lsm:pb-8 gap-4">
          <div className="w-1/2">
            <h3 className="text-2xl sm:text-2xl lsm:text-3xl font-semibold leading-snug">
              Przeglądaj naszą interaktywną mapę, aby odkryć piękno street artu w mieście.
            </h3>
          </div>

          <p className="text-sm xsm:text-base md:text-md lg:text-lg text-semibold text-gray-600 w-1/2">
            Murale AeroMat to nie tylko dzieła sztuki, ale także elementy, które ożywiają przestrzeń publiczną i tworzą
            unikalny charakter miasta. Na AeroMapie znajdziesz wiele moich murali, każdy jest opisany i zlokalizowany,
            dzięki czemu możesz łatwo odnaleźć je podczas spaceru po mieście.
          </p>
        </div>
      </div> */}
      <HeadingSection
        subheading="Gdzie są moje murale?"
        heading="Przeglądaj naszą interaktywną mapę, aby odkryć piękno street artu w mieście."
        content="Murale AeroMat to nie tylko dzieła sztuki, ale także elementy, które ożywiają przestrzeń publiczną i tworzą unikalny charakter miasta. Na AeroMapie znajdziesz wiele moich murali, każdy jest opisany i zlokalizowany,dzięki czemu możesz łatwo odnaleźć je podczas spaceru po mieście."
      />
      <MapComponent />
    </div>
  );
};

export default MuralsMap;
