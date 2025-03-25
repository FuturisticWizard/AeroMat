"use client";
import React from 'react'
import Card from './Card'
import Masonry from 'react-masonry-css'
const items = [
   {
    title: 'Murale Artystyczne',
    color: 'ff8c0a',
    description: 'Nasze artystyczne murale to więcej niż zwykła dekoracja – to dzieła sztuki, które transformują przestrzenie i nadają im unikalny charakter. Poprzez malowanie murali, możesz stworzyć punkt centralny w pomieszczeniu, dodać koloru i tekstury, a także wyrazić swoją osobowość. Murale są idealnym sposobem na ożywienie wnętrz i stworzenie atmosfery, która inspiruje i angażuje',
    imageFront: '/images/mural-lpec.jpg',
    imageBack: '/images/lpec-detal.jpg'
   },
   {
    title: 'Murale Reklamowe',
    color: '94bdff',
    description: 'Dzięki swojej unikalności przyciągają uwagę i budzą zainteresowanie, zapewniając skuteczną reklamę i pozytywny wizerunek marki.',
    imageFront: '/images/kinematografia.jpg',
    imageBack: '/images/kinematografia2.jpg'
   },
   {
    title: 'Artystyczne malowanie wnętrz',
    color: '647ece',
    description: 'Nadaj przestrzeniom unikalny charakter, popraw estetykę i stwórz atmosferę sprzyjającą kreatywności.',
    imageFront: '/images/Fotografia3.jpg',
    imageBack: '/images/Fotografia2.jpg'
   },
   {
    title: 'Eko Murale',
    color: '938b39',
    description: 'Murale oczyszczające powietrze, poprawiające jakość życia w mieście.',
    imageFront: '/images/logo1.jpg',
    imageBack: '/images/typografia2.jpg'
   },
   {
    title: 'Filmy Reklamowe',
    color: 'ff0505',
    description: 'Nasze filmy reklamowe to klucz do sukcesu Twojej firmy w dzisiejszym cyfrowym świecie. Dzięki nim możesz zwiększyć rozpoznawalność marki, efektywnie przekazywać informacje o swoich produktach i budować emocjonalne więzi z klientami. Filmy reklamowe są niezastąpionym narzędziem w strategiach marketingowych, pozwalającym na wyróżnienie się na tle konkurencji i zwiększenie zaangażowania odbiorców.',
    imageFront: '/images/zaklikow_piekarnia.jpg',
    imageBack: '/images/komeko1.jpg'
   },
   {
    title: 'Misje Specjalne',
    color: '3e30f8',
    description: 'Nietypowe powierzchnie? Trudne umiejscowienie? zadzwoń ! Napewno coś wymyślimy',
    imageFront: '/images/komeko-mural.jpg',
    imageBack: '/images/komeko1.jpg'
   }

]

const Portfolio = () => {
  const breakpointColumnsObj = {
    default: 3,
    1200: 3,
    700: 2,
    500: 1
  };

  return (
      // <div className='flex flex-col mx-auto h-full md:h-svh w-full items-center  xxs:max-w-sm sm:max-w-5xl lg:max-w-7xl xxs:py-4 xl:py-2 ' >
      //   <div className={`grid xxs:grid-cols-1 sm:grid-cols-2 xss:grid-rows-${items.length } md:grid-cols-10 md:grid-rows-14 gap-1 sm:gap-2 md:gap-4 lg:gap-2 h-full w-full py-2`} >
      //     <div className='col-span-1 row-span-1 md:col-span-6 md:row-span-6 h-[600px] md:h-auto'><Card title={items[5].title} imageFront={items[5].imageFront} color={items[5].color} /></div>
      //     <div className='col-span-1 row-span-1 md:col-span-4 md:row-span-12 h-[600px] md:h-auto'><Card title={items[0].title} imageFront={items[0].imageFront} color={items[0].color}/></div>
      //     <div className='col-span-1 row-span-1 md:col-span-5 md:row-span-3 h-[600px] md:h-auto'><Card title={items[2].title} imageFront={items[2].imageFront} color={items[2].color} /></div>
      //     <div className='col-span-1 row-span-1 md:col-span-3 md:row-span-5 h-[600px] md:h-auto'><Card title={items[1].title} imageFront={items[1].imageFront} color={items[1].color} /></div>
      //     <div className='col-span-1 row-span-1 md:col-span-2 md:row-span-5 h-[600px] md:h-auto'><Card title={items[3].title} imageFront={items[3].imageFront} color={items[3].color} /></div>
      //     <div className='col-span-1 row-span-1 md:col-span-5 md:row-span-4 h-[600px] md:h-auto'><Card title={items[4].title} imageFront={items[4].imageFront} color={items[4].color}/></div>
      //   </div>
      // </div>

      <div className='py-48 bg-black'>
        <Masonry breakpointCols={breakpointColumnsObj} className="my-masonry-grid max-w-6xl mx-auto" columnClassName="my-masonry-grid_column">
          {items.map((item, index) => (
            <img key={index} src={item.imageFront} alt={item.title} />
          ))}
        </Masonry>
      </div>
  )
}

export default Portfolio
