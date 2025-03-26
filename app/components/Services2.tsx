import React from 'react'
import CardFlip from './CardFlip'
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
        title: 'Projekty Niestandardowe',
        desc: 'Masz nietypowy pomysł? Zrealizujemy go! Specjalizujemy się w unikalnych projektach, które spełniają indywidualne potrzeby i przekraczają oczekiwania.',
        icon: '/icons/impossible-shapes.png',
        imageFront: '/images/',
        imageBack: '/images/',
        color: 'green-medium'
    },

]


const Services2 = () => {
  return (
    <div className='px-8 py-24 md:px-0 flex flex-col max-w-6xl mx-auto '>
        
        <div className='py-4 md:py-8 text-center '>
            <span className='text-red-500  text-base text-semibold' >Moje Usługi</span>
            <h2 className='text-2xl text-bold max-w-xl mx-auto'>Różne usługi, które świadczymy, aby zwiększyć rozpoznawalność Twojej firmy</h2>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2  md:grid-cols-3 w-full h-full content-center gap-2 md:gap-8'>
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

export default Services2
