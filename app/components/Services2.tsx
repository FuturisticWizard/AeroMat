import React from 'react'
import CardFlip from './CardFlip'

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
        desc: 'Zamień swój pojazd w mobilną reklamę! Oferujemy profesjonalne oklejanie samochodów, które zwiększy rozpoznawalność Twojej marki w każdym miejscu.',
        icon: '/icons/car-painting.png',
        imageFront: '/images/',
        imageBack: '/images/camper.jpg',
        color: 'red-light'
    },
    {
        title: 'Wnętrza',
        desc: 'Stwórz wyjątkowe wnętrza, które zachwycą Twoich klientów i pracowników. Nasze dekoracje ścienne i wykończenia dodadzą charakteru każdej przestrzeni.',
        icon: '/icons/paint-roller-96.png',
        imageFront: '/images/mural-lester.jpg',
        imageBack: '/images/',
        color: 'teal-light'
    },
    {
        title: 'Systemy informacji wizualnej',
        desc: 'Ułatw orientację i popraw komunikację dzięki naszym systemom informacji wizualnej. Tworzymy czytelne i estetyczne rozwiązania dla każdej przestrzeni.',
        icon: '/icons/exit-96.png',
        imageFront: '/images/',
        imageBack: '/images/',
        color: 'purple-light'
    },
    {
        title: 'Projekty Niestandardowe',
        desc: 'Masz nietypowy pomysł? Zrealizujemy go! Specjalizujemy się w unikalnych projektach, które spełniają indywidualne potrzeby i przekraczają oczekiwania.',
        icon: '/icons/impossible-shapes.png',
        imageFront: '/images/',
        imageBack: '/images/',
        color: 'green-light'
    },

]


const Services2 = () => {
  return (
    <div className='px-8 py-16 md:px-0 flex max-w-6xl mx-auto '>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full h-full gap-x-8 gap-y-4'>
        {
            cards.map((card, index) => (
                <CardFlip key={index} title={card.title} icon={card.icon} description={card.desc} color={card.color} imageFront={card.imageFront} imageBack={card.imageBack} classname='w-[352px] h-[458px] '/>
            ))
        }
        </div>

    </div>
  )
}

export default Services2
