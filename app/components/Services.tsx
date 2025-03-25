import { BackgroundGradient } from '@/components/ui/background-gradient'
import Image from 'next/image'
import React, { ReactNode } from 'react'
import { Tabs } from './ui/tabs'
import Link from 'next/link'


const services = [
    {   
        title: "Murale Reklamowe",
        image: "/images/"
    },
    {
        title: "Murale Artystyczne"
    },
    {
        title: "Malowanie Pojazdów"
    },
    {
        title: "Artystyczne malowanie wnętrz"
    },
]
const DummyContent = ({image}) => {
    return (
      <Image
        src={`${image}`}
        alt="dummy image"
        fill
        className="object-cover object-center  h-[60%]  md:h-[90%] absolute -bottom-10 inset-x-0 -inset-y-1  w-[90%] rounded-xl mx-auto z-10"
      />
    )
  }
  
  
const tabs = [
    {
      title: "Murale Reklamowe",
      value: "product",
      content: (
        <div className="w-full overflow-hidden relative h-full border-solid border-1 border-gray-400 rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-">
          {/* <p className='service-tab2 z-40 relative  text-black'>Murale Reklamowe</p> */}
          <div className='absolute bottom-0 right-0 bg-[#0e2f56]  z-40 inline-block w-1/2 px-2  py-4  sm:px-10 sm:py-8'>
            <h3 className='text-2xl uppercase'>Murale Reklamowe</h3>
            <p className='text-base'>Pozwolają skutecznie się wyróżnić i przyciągnąć klientów.</p>
            <Link href='#portfolio'>Zobacz więcej</Link>
          </div>
          <DummyContent image='/images/lpec.jpg' />
        </div>
      ),
    },
    {
      title: "Murale Artystyczne",
      value: "services",
      content: (
        <div className="w-full overflow-hidden relative h-full border-solid border-1 border-gray-400 rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-">
          {/* <p className='service-tab2 z-40 relative  text-black'>Murale Artystyczne</p> */}
          <div className='absolute bottom-0 right-0 bg-[#0e2f56]  z-40 inline-block w-1/2 px-2  py-4  sm:px-10 sm:py-8'>
            <h3 className='text-2xl uppercase'>Murale Artystyczne</h3>
            <p className='text-base'>Pozwolają skutecznie się wyróżnić i przyciągnąć klientów.</p>
            <Link href='#portfolio'>Zobacz więcej</Link>
          </div>
          <DummyContent image='/images/staremiasto.jpg' />
        </div>
      ),
    },
    {
      title: "Malowanie Pojazdów",
      value: "playground",
      content: (
        <div className="w-full overflow-hidden relative h-full border-solid border-1 border-gray-400 rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-">
          {/* <p className='service-tab2 z-40 relative text-black'>Malowanie Pojazdów</p> */}
          <div className='absolute bottom-0 right-0 bg-[#0e2f56]  z-40 inline-block w-1/2 px-2 py-4 sm:px-10 sm:py-8'>
            <h3 className='text-2xl uppercase'>Malowanie Pojazdów</h3>
            <p className='text-base '>Pozwolają skutecznie się wyróżnić i przyciągnąć klientów.</p>
            <Link href='#portfolio'>Zobacz więcej</Link>
          </div>
          <DummyContent image='/images/camper.jpg' />
        </div>
      ),
    },
    {
      title: "Malowanie Wnętrz",
      value: "content",
      content: (
        <div className="w-full overflow-hidden relative h-full border-solid border-1 border-gray-400 rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-">
           */}
          <div className='absolute bottom-0 right-0 bg-[#0e2f56]  z-40 inline-block w-1/2 px-2 py-4  sm:px-10 sm:py-8'>
            <h3 className='text-2xl uppercase'>Malowanie Wnętrz</h3>
            <p className='text-base'>Pozwolają skutecznie się wyróżnić i przyciągnąć klientów.</p>
            <Link href='#portfolio'>Zobacz więcej</Link>
          </div>
          <DummyContent image='/images/basen1.jpg'/>
        </div>
      ),
    },
]

const Services = () => {
//   return (
//     <div id='card' className=' flex flex-col sm:flex-row max-w-5xl mx-auto justify-center items-center gap-2 '>


//     {
//         services.map( (service, index) => (
//             <div key={index} className=''>
//                 <BackgroundGradient className='flex h-64 w-full justify-center items-center px-8'>
//                     <h2 className='text-center font-bold uppercase text-xl anton-regular'>{service.title}</h2>

//                 </BackgroundGradient>
//             </div>
//         ))
//     }


//     </div>
//   )

    return (
      <div>
        
        <div className="h-[40rem] [perspective:1000px] relative b flex flex-col max-w-5xl mx-auto w-full  items-start justify-start my-40 px-8 lg:px-0">
        <span className='font-semibold text-red-400 text-md uppercase py-1'>co robię?</span>
          <Tabs tabs={tabs} />
        </div>
      </div>

    )
}

export default Services
