import React from "react";

import Image from "next/image";

const items = [
  {
    number: "99%",
    title: "Zadowolonych klientów",
    description:
      "Nasze unikalne projekty oraz indywidualne podejście do każdego zlecenia gwarantują, że Twoje oczekiwania zostaną w pełni zrealizowane.",
    icon: <Image src="/icons/smile.png" width={64} height={64} alt="smile" />,
    // width={64} height={64}
  },
  {
    number: "10+",
    title: "Lat doświadczenia",
    description:
      "Dzięki ponad dziesięcioletniemu doświadczeniu w branży, AeroMat zdobył wiedzę i umiejętności, które pozwalają na realizację projektów na najwyższym poziomie",
    icon: (
      <Image src="/icons/exp.png" width={64} height={64} alt="experience" />
    ),
  },
  {
    number: "200+",
    title: "Unikalnych projektów",
    description:
      "Wybierając AeroMat, inwestujesz w unikalne rozwiązania, które skutecznie przyciągają uwagę i wzmacniają wizerunek Twojej marki!",
    icon: (
      <Image
        src="/icons/diamond.png"
        width={64}
        height={64}
        alt="unique projects"
      />
    ),
  },
  {
    number: "100+",
    title: "Filmów Promocyjnych",
    description:
      "Dzięki nowoczesnym technologiom i kreatywnemu podejściu, tworzymy filmy, które wyróżniają się na tle konkurencji i zapadają w pamięć odbiorców",
    icon: (
      <Image
        src="/icons/clapperboard.png"
        width={64}
        height={64}
        alt="Promo movies"
      />
    ),
  },
  {
    number: "50+",
    title: "Współpracujących firm",
    description:
      "Dzięki ponad 50 zrealizowanym współpracom z różnorodnymi firmami, zdobyliśmy cenne doświadczenie i zaufanie w branży. ",
    icon: (
      <Image
        src="/icons/handshake.png"
        width={64}
        height={64}
        alt="collaborations"
      />
    ),
  },
];

const Achievements = () => {
  return (
    <div className="relative flex flex-col w-full px-4 sm:px-6  lg:px-8 xl:px-20 py-6 md:py-10 lg:py-12 bg-transparent  overflow-clip">
      <div className="absolute bottom-32 right-0 h-[400px] w-[404px] z-0">
        <Image
          src="/images/watercolor-splash-02.png"
          fill
          alt="watercolor-splash-01"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="blur-md opacity-40 "
        />
      </div>
      <div className="absolute xxs:-top-8  sm:-top-32 left-0 h-[444px] w-[444px] z-0 ">
        <Image
          src="/images/watercolor-splash-02.png"
          fill
          alt="watercolor-splash-01"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="blur-md opacity-40"
        />
      </div>
      <div className="flex flex-row flex-wrap gap-16  items-stretch xxs:gap-2 sm:gap-2 lg:gap-8 justify-center py-6 md:py-8 lg:py-16 xl:py-20 z-10">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex justify-center items-center px-2 py bg-white group rounded-lg hover:scale-105 transition-transform duration-300 ease-in-out border-1 border-solid border-black/20  outline outline-blue-500/50 outline-1 shadow-inner  xxs:w-[175px] xxs:min-h-[155px] hover:rotate-1 z-10"
          >
            <div className="flex flex-col items-center text-center xxs:gap-1 md:gap-3">
              <div className="rounded-full flex justify-center items-center size-10 ">
                <p>{item.icon}</p>
              </div>
              <div className="flex flex-col items-center">
                <h3 className="text-base lg:text-xl font-bold text-blue-800">
                  {item.number}
                </h3>
                <h3 className="text-base lg:text-xl font-bold text-blue-800">
                  {item.title}
                </h3>

                {/* <p className='text-sm lg:text-md flex-wrap text-gray-500  '>{item.description}</p> */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
