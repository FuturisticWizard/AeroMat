import React from "react";
import MapComponent from "./MapComponent";
import Image from "next/image";
import HeadingSection from "./HeadingSection";

const MuralsMap = () => {
  return (
    <div className="relative max-w-7xl mx-auto justify-center items-center px-8 lsm:px-8 py-8 md:py-16">
      <HeadingSection
        subheading="Gdzie są moje murale?"
        heading="Przeglądaj naszą interaktywną mapę, aby odkryć piękno street artu w mieście."
        content="Murale AeroMat to nie tylko dzieła sztuki, ale także elementy, które ożywiają przestrzeń publiczną i tworzą unikalny charakter miasta. Na AeroMapie znajdziesz wiele moich murali, każdy jest opisany i zlokalizowany,dzięki czemu możesz łatwo odnaleźć je podczas spaceru po mieście."
        img="yellow"
      />
      <MapComponent />
    </div>
  );
};

export default MuralsMap;
