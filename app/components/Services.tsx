import React from 'react'

import Flipcard from './Flipcard'

const cards = [
    {
        title: 'Murale',
        desc: 'Przyciągnij uwagę unikalnymi muralami, które ożywią przestrzeń i wyróżnią Twoją markę. Tworzymy artystyczne dzieła, które inspirują i budują pozytywne emocje.',
        icon: '/icons/graffiti-64.png',
        imageFront: '/images/',
        imageBack: '/images/mural-lpec.jpg',
        color: 'magenta-light'
    },
    {
        title: 'Szyldy reklamowe',
        desc: "Zwiększ widoczność swojej firmy dzięki profesjonalnym szyldom reklamowym. Nasze projekty są estetyczne, trwałe i skutecznie przyciągają klientów.",
        icon: '/icons/szyld1.png',
        imageFront: '/images/',
        imageBack: '/images/szyld3.jpg',
        color: 'yellow-medium'
    },
    {
        title: 'Samochody osobowe ',
        desc: 'Zamień swój pojazd w mobilną reklamę! Oferujemy profesjonalne malowanie samochodów , które zwiększy rozpoznawalność Twojej marki w każdym miejscu.',
        icon: '/icons/car-painting.png',
        imageFront: '/images/',
        imageBack: '/images/samochod1.jpg',
        color: 'red-light'
    },
    {
        title: 'Wnętrza',
        desc: 'Stwórz wyjątkowe wnętrza, które zachwycą Twoich klientów i pracowników. Nasze dekoracje ścienne i wykończenia dodadzą charakteru każdej przestrzeni.',
        icon: '/icons/paint-roller-96.png',
        imageFront: '/images/',
        imageBack: '/images/mural-lester.jpg',
        color: 'teal-light'
    },
    {
        title: 'Systemy informacji wizualnej',
        desc: 'Ułatw orientację i popraw komunikację dzięki naszym systemom informacji wizualnej. Tworzymy czytelne i estetyczne rozwiązania dla każdej przestrzeni.',
        icon: '/icons/exit-96.png',
        imageFront: '/images/',
        imageBack: '/images/visual-information-system.jpg',
        color: 'purple-light'
    },
    {
            title: 'Kinematografia',
            desc: 'Filmy i zdjęcia, zarówno z ziemi jak i powietrza. Tworzę kinematografię na najwyższym poziomie! ',
            icon: '/icons/icons8-camera-100.png',
            imageFront: '/images/',
            imageBack: '/images/',
            color: 'green-medium',
            video: 'https://www.youtube.com/watch?v=eZf9TLA2Ur8'
    },

]
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
    <div className='px-8 py-16 lg:px-0 flex flex-col   max-w-6xl mx-auto '>
        <div className='py-8 md:py-16'>
            <h2 className='text-red-500  text-lg text-bold' >Moje Usługi</h2>
            <div className='flex flex-col lsm:flex-row py-2 gap-2 md:gap-4'>
                {/* Header */}
                <div className='flex flex-col lsm:w-1/2'>
                    <h3 className='font-bold text-2xl sm:text-3xl '> Świadczę całą paletę usług dzięki którym poprawisz wizerunek, zwiększysz rozpoznawalność oraz sprzedaż Twojego biznesu.</h3>
                </div>
                {/* Paragraph */}
                <div className='flex lsm:w-1/2'>  
                    <p className='font text-gray-600 text-sm xsm:text-base md:text-md lg:text-md '>
                    Od tworzenia unikalnych murali i profesjonalnych grafik ściennych po filmy i kinematografię na najwyższym poziomie, każde zlecenie jest dla mnie okazją do stworzenia czegoś wyjątkowego. Dzięki moim usługom możesz nie tylko poprawić wizerunek swojej firmy, ale także zwiększyć zaufanie klientów i przyciągnąć nowych. 
                    </p>
                </div>
            </div>
            
        </div>


        {/* Cards */}
        <div className='grid grid-cols-1 xsm:grid-cols-2  md:grid-cols-3 w-full h-full content-center gap-2 md:gap-8'>
        {
            cards.map((card, index) => (
                <div
                    key={index}
                    className="flex items-center justify-center w-full h-full"
                >
                <Flipcard  title={card.title} icon={card.icon} description={card.desc} color={card.color} imageFront={card.imageFront} imageBack={card.imageBack} classname='w-[352px] h-[458px] '/>

                
                </div>

            ))
        }
        </div>

    </div>
  )
}

export default Services
