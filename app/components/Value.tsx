import React from "react";
import Collaborations from "./Collaborations";
import Image from "next/image";

// const items = [
//   {
//     number: '99%',
//     title: 'Zadowolonych klientów',
//     description: 'Nasze unikalne projekty oraz indywidualne podejście do każdego zlecenia gwarantują, że Twoje oczekiwania zostaną w pełni zrealizowane.',
//     color: '#00AFBE'
//   },
//   {
//     image: <Image src='/images/happy_customer_squere.jpg' fill alt="Promo movies" />,
//   },
//   {
//     number: '10+',
//     title: 'Lat doświadczenia',
//     description: 'Dzięki ponad dziesięcioletniemu doświadczeniu w branży, AeroMat zdobył wiedzę i umiejętności, które pozwalają na realizację projektów na najwyższym poziomie',
//     color: '#F6A81F'
//   },
//   {
//     image: <Image src='/images/happy_customer_squere.jpg' fill alt="Promo movies" />,
//   },
//   {
//     image: <Image src='/images/happy_customer_squere.jpg' fill alt="Promo movies" />,
//   },
//   {
//     number: '200+',
//     title: 'Unikalnych projektów',
//     description: 'Wybierając AeroMat, inwestujesz w unikalne rozwiązania, które skutecznie przyciągają uwagę i wzmacniają wizerunek Twojej marki!',
//     color: '#E85623'
//   },
//   {
//     image: <Image src='/images/happy_customer_squere.jpg' fill alt="Promo movies" />,
//   },
//   {
//     number: '100+',
//     title: 'Filmów Promocyjnych',
//     description: 'Dzięki nowoczesnym technologiom i kreatywnemu podejściu, tworzymy filmy, które wyróżniają się na tle konkurencji i zapadają w pamięć odbiorców',
//     color: '#63B547'
//   },

// ]

const items = [
  {
    number: "99%",
    title: "Zadowolonych klientów",
    description:
      "Nasze unikalne projekty oraz indywidualne podejście do każdego zlecenia gwarantują, że Twoje oczekiwania zostaną w pełni zrealizowane.",
    image: (
      <Image src="/images/happy_customer_squere.jpg" fill alt="Promo movies" />
    ),
    color: "#00AFBE",
  },
  {
    number: "10+",
    title: "Lat doświadczenia",
    description:
      "Dzięki ponad dziesięcioletniemu doświadczeniu w branży, AeroMat zdobył wiedzę i umiejętności, które pozwalają na realizację projektów na najwyższym poziomie",
    image: (
      <Image src="/images/happy_customer_squere.jpg" fill alt="Promo movies" />
    ),
    color: "#F6A81F",
  },
  {
    number: "200+",
    title: "Unikalnych projektów",
    description:
      "Wybierając AeroMat, inwestujesz w unikalne rozwiązania, które skutecznie przyciągają uwagę i wzmacniają wizerunek Twojej marki!",
    image: (
      <Image src="/images/happy_customer_squere.jpg" fill alt="Promo movies" />
    ),
    color: "#E85623",
  },
  {
    number: "100+",
    title: "Filmów Promocyjnych",
    description:
      "Dzięki nowoczesnym technologiom i kreatywnemu podejściu, tworzymy filmy, które wyróżniają się na tle konkurencji i zapadają w pamięć odbiorców",
    image: (
      <Image src="/images/happy_customer_squere.jpg" fill alt="Promo movies" />
    ),
    color: "#63B547",
  },
];

const Value = () => {
  return (
    <div className="relative  h-screen justify-center text-center">
      <div className="flex pt-16 pb-2">
        <Collaborations />
      </div>
      <div className="relative  grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mx-auto justify-center items-center">
        {items.map((item, index) => (
          <div
            key={index}
            className={`relative h-[444px] w-[222px] flex flex-col justify-center items-center text-white`}
          >
            <div
              className={`flex flex-col w-[222px] h-[222px] justify-center items-center bg-[${item.color}]`}
            >
              {item.number && (
                <h2 className="font-bold text-3xl">{item.number}</h2>
              )}
              {item.title && (
                <h3 className="font-bold text-2xl">{item.title}</h3>
              )}
            </div>
            {item.image && (
              <div className="relative w-[222px] flex h-[222px]">
                {item.image}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Value;
