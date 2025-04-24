import React from 'react'
import MapComponent from "./MapComponent";

const MuralsMap = () => {
  return (
    <div className='max-w-6xl mx-auto justify-center items-center px-8 lsm:px-0 py-8 md:py-16'>
      <h2 className='text-red-400 text-lg text-semibold'>Gdzie są moje murale?</h2>
      <div className='flex flex-row order-2 sm:order-1 z-30 pb-4 lsm:pb-8 gap-4'>
        <div className='w-1/2'>
          <h3 className='text-2xl sm:text-2xl lsm:text-3xl  font-semibold leading-snug  z-30' >
          Przeglądaj naszą interaktywną mapę, aby odkryć piękno street artu w mieście. 
          </h3>
        </div>

        <p className='text-sm xsm:text-base md:text-md lg:text-lg text-semibold text-gray-600 z-30 w-1/2'>
        Murale AeroMat to nie tylko dzieła sztuki, ale także elementy, które ożywiają przestrzeń publiczną i tworzą unikalny charakter miasta. Na AeroMapie znajdziesz wiele moich murali,każdy jest opisany i zlokalizowany, dzięki czemu możesz łatwo odnaleźć je podczas spaceru po mieście.
        </p>
      </div>
      <MapComponent />
    
    </div>
  )
}

export default MuralsMap
