import Image from "next/image";
import React from "react";
import { IoDiamondOutline } from "react-icons/io5";
import ExperienceIcon from "./icons/ExperienceIcon";
import { BiCameraMovie } from "react-icons/bi";
import Collaborations from "./Collaborations";

const items = [
  {
    number: "99%",
    title: "Zadowolonych klientów",
    description:
      "Nasze unikalne projekty oraz indywidualne podejście do każdego zlecenia gwarantują, że Twoje oczekiwania zostaną w pełni zrealizowane.",
    icon: (
      <Image
        src="/icons/VectorClients.png"
        sizes="100vw"
        width="48"
        height="0"
        style={{ height: "auto" }}
        alt="smile"
      />
    ),
    // width={64} height={64}
  },
  {
    number: "10+",
    title: "Lat doświadczenia",
    description:
      "Dzięki ponad dziesięcioletniemu doświadczeniu w branży, AeroMat zdobył wiedzę i umiejętności, które pozwalają na realizację projektów na najwyższym poziomie",
    icon: <ExperienceIcon />,
  },
  {
    number: "200+",
    title: "Unikalnych projektów",
    description:
      "Wybierając AeroMat, inwestujesz w unikalne rozwiązania, które skutecznie przyciągają uwagę i wzmacniają wizerunek Twojej marki!",
    icon: <IoDiamondOutline className="size-10 text-[#4CAF4F]" />,
  },
  {
    number: "100+",
    title: "Filmów Promocyjnych",
    description:
      "Dzięki nowoczesnym technologiom i kreatywnemu podejściu, tworzymy filmy, które wyróżniają się na tle konkurencji i zapadają w pamięć odbiorców",
    icon: <BiCameraMovie className="size-10 text-[#4CAF4F]" />,
  },
];

const InNumbers = () => {
  return (
    <div className="2xl:py-36 overflow-hidden ">
      <Collaborations />
      <div className="flex items-center bg-[#F5F7FA] w-full  ">
        <div className=" grid grid-cols-1 sm:grid-cols-2  max-w-7xl items-center justify-center mx-auto">
          <div className=" items-center px-6 sm:px-10 py-2 ">
            <h2 className="text-[#4D4D4D] font-semibold xl:text-3xl xxs:py-2 sm:py-0 ">
              Pomagamy lokalnym biznesom <br />
              <span className="text-[#4CAF4F] font-semibold xl:text-3xl ">
                wyróżnić się i przyciągnąć klienta
              </span>
            </h2>
            <p className="text-sm xl:text-base text-[#18191F] ">
              Dotarliśmy tutaj dzięki naszej ciężkiej pracy i poświęceniu
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 xl:gap-4  items-center justify-center xxs:py-2 sm:py-6  px-6 sm:px-10  md:mx-auto">
            {items.map((item, index) => (
              <div key={index} className="flex gap-2 items-center">
                <div className="flex flex-row gap-2 items-center ">
                  <div className="py-2 w-[52px] flex justify-center">
                    {item.icon}
                  </div>
                  <div className="flex flex-col ">
                    <h3 className="text-base lg:text-xl font-bold text-[#18191F]">
                      {item.number}
                    </h3>
                    <h3 className="lg:text-base text-[#18191F] text-nowrap">
                      {item.title}
                    </h3>

                    {/* <p className='text-sm lg:text-md flex-wrap text-gray-500  '>{item.description}</p> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InNumbers;
