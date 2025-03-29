import Image from 'next/image'
import React from 'react'

const WhoAmI = () => {
  return (
    <div className="flex flex-col py-10 max-w-5xl mx-auto  px-3 xxsm:px-6 sm:px-8  ">
        <div className="flex flex-col  font-semibold">
          <h3 className="text-right  text-red-400">Kim jestem?</h3>
          
        </div>
        <div className="flex flex-col sm:flex-row items-center">  
            <div className="relative w-full sm:w-1/2 aspect-square">
                <Image src='/images/profilowe.jpg' alt='zdjęcie profilowe' fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"/>
            </div>
            <div className="flex flex-col justify-items-center gap-2 sm:gap-4  sm:w-1/2">
                <h2 className="font-bold text-2xl sm:text-3xl ">Mam na imię Mateusz... </h2>    
                <p className="text-gray-600 text-md xs:text-lg">Graffiti to moja pasja którą realizuję od 2010 roku. Operuję różnymi technikami malarskimi. Szczególnie dobrze czuję się malując przyrodę i zwierzęta. </p>
            </div>
        </div>
    </div>
  )
}

export default WhoAmI
