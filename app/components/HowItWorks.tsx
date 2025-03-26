import Image from 'next/image'
import React from 'react'
import { GiLargePaintBrush } from "react-icons/gi";
import { TbConfetti } from "react-icons/tb";
import { MdRocketLaunch } from "react-icons/md"; //<MdRocketLaunch />
import RocketLaunch from './icons/RocketLaunch';
import Designing from './icons/Designing';
import Revisions from './icons/Revisions';

const steps = [
    {   
        id: 1,
        title: "Zamów usługę",
        desc: "Zainicjuj współpracę, skontaktuj się z nami, aby omówić Twoje potrzeby i wizję.",
        icon: <RocketLaunch />
    },
    {   
        id: 2,
        title: "Dopracowany projekt - zawsze na czas!",
        desc: "Otrzymasz kompletny projekt muralu, przygotowany z uwzględnieniem Twoich preferencji i terminów.",
        icon: <Designing />
    },
    {   
        id: 3,
        title: "Wprowadzanie zmian i akceptacja",
        desc: "Razem wprowadzimy ewentualne poprawki, aby projekt idealnie odpowiadał Twoim oczekiwaniom.",
        icon: <Revisions />
    },
    {   
        id: 4,
        title: "Do dzieła!",
        desc: "Rozpoczniemy realizację muralu, korzystając z najlepszych materiałów i technik.",
        icon: <GiLargePaintBrush className='size-10'/>
    },
    {   
        id: 5,
        title: "Show Time",
        desc: "Odbierz gotowy mural i ciesz się nowym wyglądem Twojej przestrzeni!",
        icon: <TbConfetti  className='size-10' />
    },
]

const HowItWorks = () => {
  return (
    <div className='px-8 py-8 md:px-0 sm:py-12 md:py-24 max-w-6xl mx-auto  '>
        <div className='flex flex-col pb-10  '>
            <span className='font-semibold text-red-400 text-md uppercase'>jak pracuję?</span>
            <div className='grid grid-cols-1 xsm:grid-cols-2  justify-center gap-2 sm:gap-4 m '>
                <div className=''>
                    <h2 className='font-bold text-2xl sm:text-3xl '>Tworzę murale, które ozdabiają przestrzeń i przynoszą korzyści Twojemu biznesowi.</h2>
                </div>
                <div className=' text-gray-600 text-md xs:text-lg '>
                    <div >
                        <p>Moje prace są zaprojektowane tak, aby zapewnić maksymalną wartość i satysfakcję, łącząc estetykę z funkcjonalnością.</p>
                    </div>
                </div>
            </div>
        </div>
        <div className='image-container'>
            <Image 
                src='/images/mural-starowka-zwyzka.jpg' 
                alt='zdjęcie przedstawiające aeromat w pracy' 
                fill 
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"                                                          
                quality={100} // Adjust quality to 100 for better image quality
                unoptimized={true}
            />
        </div>
    </div>
  )
}

export default HowItWorks
