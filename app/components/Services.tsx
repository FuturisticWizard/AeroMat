import React from "react";

import Flipcard from "./Flipcard";
import HeadingSection from "./HeadingSection";
import { Carousel, Card} from "./ui/apple-cards-carousel";
type CardData = {
  src: string;
  title: string;
  category: string;
  content: React.ReactNode;

};

type Card = {
  card: CardData;
};


// const cards2 = [
//   {
//     category: "Murale",
//     title: "Unikalne murale, które ożywią przestrzeń i wyróżnią Twoją markę, budując pozytywne emocje.",
//     src: "/images/mural-lpec.jpg",
//     content: "magenta-light",
//   },
//   {
//     title: "Szyldy reklamowe",
//     desc: "Profesjonalne szyldy zwiększające widoczność firmy, estetyczne i trwałe, przyciągające klientów.",
//     icon: "/icons/szyld1.png",
//     src: "/images/szyld3.jpg",
//     content: "yellow-medium",
//   },
//   {
//     title: "Samochody",
//     desc: "Malowanie samochodów jako mobilna reklama, zwiększająca rozpoznawalność marki wszędzie.",
//     src: "/images/camper.jpg", // Fixed: replaced missing image with existing one
//     content: "red-light",
//   },
//   {
//     title: "Wnętrza",
//     desc: "Wyjątkowe dekoracje ścienne i wykończenia, które dodają charakteru i zachwycają klientów.",
//     src: "/images/mural-lester.jpg",
//     content: "teal-light",
//   },
//   {
//     title: "Systemy informacji wizualnej",
//     desc: "Czytelne i estetyczne systemy informacji ułatwiające orientację i komunikację w przestrzeni.",
//     src: "/images/visual-information-system.jpg",
//     content: "purple-light",
//   },
//   {
//     title: "Projekty Niestandardowe",
//     desc: "Realizujemy unikalne projekty dopasowane do indywidualnych potrzeb i oczekiwań.",
//     src: "", // Fixed: removed problematic path
//     content: "green-medium",
//   },
// ];

// const cards = [
//   {
//     title: "Murale",
//     desc: "Przyciągnij uwagę unikalnymi muralami, które ożywią przestrzeń i wyróżnią Twoją markę. Tworzymy artystyczne dzieła, które inspirują i budują pozytywne emocje.",
//     icon: "/icons/graffiti-64.png",
//     imageFront: "", // Fixed: removed problematic path
//     imageBack: "/images/mural-lpec.jpg",
//     color: "magenta-light",
//   },
//   {
//     title: "Szyldy reklamowe",
//     desc: "Zwiększ widoczność swojej firmy dzięki profesjonalnym szyldom reklamowym. Moje projekty są estetyczne, trwałe i skutecznie przyciągają klientów.",
//     icon: "/icons/szyld1.png",
//     imageFront: "", // Fixed: removed problematic path
//     imageBack: "/images/szyld3.jpg",
//     color: "yellow-medium",
//   },
//   {
//     title: "Samochody",
//     desc: "Zamień swój pojazd w mobilną reklamę! Oferujemy profesjonalne malowanie samochodów , które zwiększy rozpoznawalność Twojej marki w każdym miejscu.",
//     icon: "/icons/car-painting.png",
//     imageFront: "", // Fixed: removed problematic path
//     imageBack: "/images/camper.jpg", // Fixed: replaced missing image with existing one
//     color: "red-light",
//   },
//   {
//     title: "Wnętrza",
//     desc: "Stwórz wyjątkowe wnętrza, które zachwycą Twoich klientów i pracowników. Nasze dekoracje ścienne i wykończenia dodadzą charakteru każdej przestrzeni.",
//     icon: "/icons/paint-roller-96.png",
//     imageFront: "", // Fixed: removed problematic path
//     imageBack: "/images/mural-lester.jpg",
//     color: "teal-light",
//   },
//   {
//     title: "Systemy informacji wizualnej",
//     desc: "Ułatw orientację i popraw komunikację dzięki naszym systemom informacji wizualnej. Tworzymy czytelne i estetyczne rozwiązania dla każdej przestrzeni.",
//     icon: "/icons/exit-96.png",
//     imageFront: "", // Fixed: removed problematic path
//     imageBack: "/images/visual-information-system.jpg",
//     color: "purple-light",
//   },
//   {
//     title: "Projekty Niestandardowe",
//     desc: "Masz nietypowy pomysł? Zrealizujemy go! Specjalizujemy się w unikalnych projektach, które spełniają indywidualne potrzeby i przekraczają oczekiwania.",
//     icon: "/icons/impossible-shapes.png",
//     imageFront: "", // Fixed: removed problematic path
//     imageBack: "", // Fixed: removed problematic path
//     color: "green-medium",
//   },
//   // {
//   //         title: 'Kinematografia',
//   //         desc: 'Filmy i zdjęcia, zarówno z ziemi jak i powietrza. Tworzę kinematografię na najwyższym poziomie! ',
//   //         icon: '/icons/icons8-camera-100.png',
//   //         imageFront: '/images/',
//   //         imageBack: '/images/',
//   //         color: 'green-medium',
//   //         video: 'https://www.youtube.com/watch?v=eZf9TLA2Ur8'
//   // },
// ];
// {
//     title: 'Projekty Niestandardowe',
//     desc: 'Masz nietypowy pomysł? Zrealizujemy go! Specjalizujemy się w unikalnych projektach, które spełniają indywidualne potrzeby i przekraczają oczekiwania.',
//     icon: '/icons/impossible-shapes.png',
//     imageFront: '/images/',
//     imageBack: '/images/',
//     color: 'green-medium'
// },
const cards = [
  {
    category: "Murale",
    title: "Unikalne murale, które ożywią przestrzeń i wyróżnią Twoją markę, budując pozytywne emocje.",
    src: "/images/mural-lpec.jpg",
    content: (
      <div>
      <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
        Explore the possibilities of artificial intelligence and how it can enhance your workflow.
      </p>
      <img
        src="/images/ai-detailed.jpg"
        alt="AI visualization"
        height="500"
        width="500"
        className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain"
      />
    </div>
    ),
  },
  {
    category: "Szyldy reklamowe",
    title: "Profesjonalne szyldy zwiększające widoczność firmy, estetyczne i trwałe, przyciągające klientów.",
    src: "/images/szyld3.jpg",
    content: (
      <div>
      <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
        Explore the possibilities of artificial intelligence and how it can enhance your workflow.
      </p>
      <img
        src="/images/ai-detailed.jpg"
        alt="AI visualization"
        height="500"
        width="500"
        className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain"
      />
    </div>
    ),
  },
  {
    category: "Samochody",
    title: "Malowanie samochodów jako mobilna reklama, zwiększająca rozpoznawalność marki wszędzie.",
    src: "/images/camper.jpg", 
    content: (
      <div>
      <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
        Explore the possibilities of artificial intelligence and how it can enhance your workflow.
      </p>
      <img
        src="/images/ai-detailed.jpg"
        alt="AI visualization"
        height="500"
        width="500"
        className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain"
      />
    </div>
    ),
  },
  {
    category: "Wnętrza",
    title: "Wyjątkowe dekoracje ścienne i wykończenia, które dodają charakteru i zachwycają klientów.",
    src: "/images/mural-lester.jpg",
    content: (
      <div>
      <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
        Explore the possibilities of artificial intelligence and how it can enhance your workflow.
      </p>
      <img
        src="/images/ai-detailed.jpg"
        alt="AI visualization"
        height="500"
        width="500"
        className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain"
      />
    </div>
    ),
  },
  {
    category: "Systemy informacji wizualnej",
    title: "Czytelne i estetyczne systemy informacji ułatwiające orientację i komunikację w przestrzeni.",
    src: "/images/visual-information-system.jpg",
    content: (
      <div>
      <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
        Explore the possibilities of artificial intelligence and how it can enhance your workflow.
      </p>
      <img
        src="/images/ai-detailed.jpg"
        alt="AI visualization"
        height="500"
        width="500"
        className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain"
      />
    </div>
    ),
  },
];
const items = cards.map((card, index) => (
  <Card key={card.title} card={card} index={index} layout={true} />
));
const Services = () => {
  return (
    <div className="px-8 py-16 lg:px-0 flex flex-col  max-w-7xl  mx-auto overflow-visible">
      <HeadingSection
        subheading="Co robię?"
        heading="Oferuję paletę usług, które poprawią wizerunek, zwiększą rozpoznawalność i sprzedaż Twojego biznesu."
        content="Tworzę unikalne murale, profesjonalne grafiki ścienne oraz filmy na najwyższym poziomie. Moje usługi pomagają poprawić wizerunek firmy, zwiększyć zaufanie klientów i przyciągnąć nowych."
        img="black"
      />
      {/* Cards */}
      <div className="grid grid-cols-1 w-full h-full content-center gap-2 md:gap-8 overflow-visible">
        
        <Carousel 
          items={items}
          initialScroll={0}
        />
      </div>
    </div>
  );
};

export default Services;
