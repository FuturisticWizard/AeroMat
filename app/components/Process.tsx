import Image from 'next/image'
import React from 'react'

const steps = [
    {
        title:"Przygotowanie projektu",
        icon: '/icons/icons8-design-100.png',
        desc: ''
    },
    {
        title: "Wizualizacja projektu ",
        icon: '/icons/mapping96.png',
        desc: ''
    },
    {
        title: "Wycena i podpisanie umowy",
        icon: '/icons/handshake.png',
        desc: ''
    },
    {
        title: "Realizacja",
        icon: '/icons/wall-painting.png',
        desc: ''
    },
    {
        title: "Rozliczenie",
        icon: '/icons/icons8-payment-100-color.png',
        desc: ''
    }
]

const Process = () => {
  return (
    <div className='flex flex-col sm:flex-row max-w-6xl mx-auto  justify-center items-center py-8 md:py-16 gap-6'>
      {
        steps.map((step, index) => (
            <div key={index} className='flex flex-col justify-center items-center px-4 py-2 max-w-md  '>
                <div className='relative w-16 h-16 ' >
                    <Image 
                    src={step.icon}
                    alt={step.title}
                    fill
                    object-fit='cover'
                    />
                </div>

                <h3 className='text-base'>{step.title}</h3>
            </div>
        ))
      }
    </div>
  )
}

export default Process
