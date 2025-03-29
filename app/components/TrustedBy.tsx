import Image from 'next/image'
import React from 'react'

const icons = [
    {
        name: "Lpec",
        icon: "/Collaborations/logo2.png"
    },
    {
        name: 'Fabryka Okien',
        icon: "/Collaborations/logo10.png"
    },
    {
        name: "Stock",
        icon: "/Collaborations/logo9.png"
    }
]

const TrustedBy = () => {
  return (
    <div className='flex flex-col justify-center items-center py-10 max-w-5xl mx-auto '>
        <div className='flex flex-row justify-center items-center py-2'>
            <span className='border-b border-solid border-black/10 w-8 h-1'/><h3 className='text-center px-4'>Zaufały Mi Silne Marki:</h3> <span className='border-b border-solid border-black/10 w-8 h-1'/>
        </div>
 
      <div className='flex flex-row justify-center items-center bg-gray-400/5 backdrop-blur-sm  py-2 px-10 rounded-lg '>
        {
            icons.map((item, index) => (
                <div key={index} className='flex flex-row justify-center items-center'>
                    {/* <p>{item.name}</p> */}
                    <Image key={index} src={item.icon} alt={item.name} width={96} height={48} className='w-24 h-12 mx-4 hover:scale-105  transition-transform duration-300 ease-in-out'/>
                </div>
            ))
        }
      </div>
    </div>
  )
}

export default TrustedBy
