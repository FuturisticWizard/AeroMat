import React from "react";

import Flipcard from "./Flipcard";
import HeadingSection from "./HeadingSection";

const cards2 = [
  {
    title: "Murale",
    desc: "Unikalne murale, które ożywią przestrzeń i wyróżnią Twoją markę, budując pozytywne emocje.",
    icon: "/icons/graffiti-64.png",
    imageFront: "/images/",
    imageBack: "/images/mural-lpec.jpg",
    color: "magenta-light",
  },
  {
    title: "Szyldy reklamowe",
    desc: "Profesjonalne szyldy zwiększające widoczność firmy, estetyczne i trwałe, przyciągające klientów.",
    icon: "/icons/szyld1.png",
    imageFront: "/images/",
    imageBack: "/images/szyld3.jpg",
    color: "yellow-medium",
  },
  {
    title: "Samochody",
    desc: "Malowanie samochodów jako mobilna reklama, zwiększająca rozpoznawalność marki wszędzie.",
    icon: "/icons/car-painting.png",
    imageFront: "/images/",
    imageBack: "/images/samochod1.jpg",
    color: "red-light",
  },
  {
    title: "Wnętrza",
    desc: "Wyjątkowe dekoracje ścienne i wykończenia, które dodają charakteru i zachwycają klientów.",
    icon: "/icons/paint-roller-96.png",
    imageFront: "/images/",
    imageBack: "/images/mural-lester.jpg",
    color: "teal-light",
  },
  {
    title: "Systemy informacji wizualnej",
    desc: "Czytelne i estetyczne systemy informacji ułatwiające orientację i komunikację w przestrzeni.",
    icon: "/icons/exit-96.png",
    imageFront: "/images/",
    imageBack: "/images/visual-information-system.jpg",
    color: "purple-light",
  },
  {
    title: "Projekty Niestandardowe",
    desc: "Realizujemy unikalne projekty dopasowane do indywidualnych potrzeb i oczekiwań.",
    icon: "/icons/impossible-shapes.png",
    imageFront: "/images/",
    imageBack: "/images/",
    color: "green-medium",
  },
];

const cards = [
  {
    title: "Murale",
    desc: "Przyciągnij uwagę unikalnymi muralami, które ożywią przestrzeń i wyróżnią Twoją markę. Tworzymy artystyczne dzieła, które inspirują i budują pozytywne emocje.",
    icon: "/icons/graffiti-64.png",
    imageFront: "/images/",
    imageBack: "/images/mural-lpec.jpg",
    color: "magenta-light",
  },
  {
    title: "Szyldy reklamowe",
    desc: "Zwiększ widoczność swojej firmy dzięki profesjonalnym szyldom reklamowym. Moje projekty są estetyczne, trwałe i skutecznie przyciągają klientów.",
    icon: "/icons/szyld1.png",
    imageFront: "/images/",
    imageBack: "/images/szyld3.jpg",
    color: "yellow-medium",
  },
  {
    title: "Samochody",
    desc: "Zamień swój pojazd w mobilną reklamę! Oferujemy profesjonalne malowanie samochodów , które zwiększy rozpoznawalność Twojej marki w każdym miejscu.",
    icon: "/icons/car-painting.png",
    imageFront: "/images/",
    imageBack: "/images/samochod1.jpg",
    color: "red-light",
  },
  {
    title: "Wnętrza",
    desc: "Stwórz wyjątkowe wnętrza, które zachwycą Twoich klientów i pracowników. Nasze dekoracje ścienne i wykończenia dodadzą charakteru każdej przestrzeni.",
    icon: "/icons/paint-roller-96.png",
    imageFront: "/images/",
    imageBack: "/images/mural-lester.jpg",
    color: "teal-light",
  },
  {
    title: "Systemy informacji wizualnej",
    desc: "Ułatw orientację i popraw komunikację dzięki naszym systemom informacji wizualnej. Tworzymy czytelne i estetyczne rozwiązania dla każdej przestrzeni.",
    icon: "/icons/exit-96.png",
    imageFront: "/images/",
    imageBack: "/images/visual-information-system.jpg",
    color: "purple-light",
  },
  {
    title: "Projekty Niestandardowe",
    desc: "Masz nietypowy pomysł? Zrealizujemy go! Specjalizujemy się w unikalnych projektach, które spełniają indywidualne potrzeby i przekraczają oczekiwania.",
    icon: "/icons/impossible-shapes.png",
    imageFront: "/images/",
    imageBack: "/images/",
    color: "green-medium",
  },
  // {
  //         title: 'Kinematografia',
  //         desc: 'Filmy i zdjęcia, zarówno z ziemi jak i powietrza. Tworzę kinematografię na najwyższym poziomie! ',
  //         icon: '/icons/icons8-camera-100.png',
  //         imageFront: '/images/',
  //         imageBack: '/images/',
  //         color: 'green-medium',
  //         video: 'https://www.youtube.com/watch?v=eZf9TLA2Ur8'
  // },
];
// {
//     title: 'Projekty Niestandardowe',
//     desc: 'Masz nietypowy pomysł? Zrealizujemy go! Specjalizujemy się w unikalnych projektach, które spełniają indywidualne potrzeby i przekraczają oczekiwania.',
//     icon: '/icons/impossible-shapes.png',
//     imageFront: '/images/',
//     imageBack: '/images/',
//     color: 'green-medium'
// },

const Services = () => {
  return (
    <div className="px-8 py-16 lg:px-0 flex flex-col   max-w-7xl mx-auto ">
      <HeadingSection
        subheading="Co robię?"
        heading="Oferuję paletę usług, które poprawią wizerunek, zwiększą rozpoznawalność i sprzedaż Twojego biznesu."
        content="Tworzę unikalne murale, profesjonalne grafiki ścienne oraz filmy na najwyższym poziomie. Moje usługi pomagają poprawić wizerunek firmy, zwiększyć zaufanie klientów i przyciągnąć nowych."
        img="black"
      />
      {/* Cards */}
      <div className="grid grid-cols-1 xsm:grid-cols-2  md:grid-cols-3 w-full h-full content-center gap-2 md:gap-8">
        {cards2.map((card, index) => (
          <div
            key={index}
            className="flex items-center justify-center w-full h-full"
          >
            <Flipcard
              title={card.title}
              icon={card.icon}
              description={card.desc}
              color={card.color}
              imageFront={card.imageFront}
              imageBack={card.imageBack}
              classname="w-[352px] h-[458px] "
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
