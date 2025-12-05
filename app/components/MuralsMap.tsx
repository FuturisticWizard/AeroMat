import React from "react";
import HeadingSection from "./HeadingSection";
import { LazyMuralsMapWithIntersection } from "./LazyComponents";

const MuralsMap = () => {
  return (
    <div className="relative max-w-7xl mx-auto justify-center items-center px-8 lsm:px-8 py-8 md:py-16 sm:mt-24 md:mt-8 lg:mt-28 xl:mt-32">
      <HeadingSection
        subheading="Gdzie są moje murale?"
        heading="Przeglądaj naszą interaktywną mapę, aby odkryć piękno street artu w mieście."
        content="Murale AeroMat to nie tylko dzieła sztuki, ale także elementy, które ożywiają przestrzeń publiczną i tworzą unikalny charakter miasta. Na AeroMapie znajdziesz wiele moich murali, każdy jest opisany i zlokalizowany,dzięki czemu możesz łatwo odnaleźć je podczas spaceru po mieście."
        img="yellow"
      />
      <LazyMuralsMapWithIntersection />
    </div>
  );
};

export default MuralsMap;
