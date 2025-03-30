import Image from 'next/image'
import React from 'react'


const WhoAmI2 = () => {
  return (
    <div className='h-full w-full  grid grid-cols-1 sm:grid-cols-2  items-center max-w-6xl mx-auto px-8  lg:px-0  py-20 xs:py-16 md:py-36 gap-2 sm:gap-4 lsm:gap-16 md:gap-28 mt-28 '>

 
      <div className='flex flex-col order-2 sm:order-1 py-12 z-30 '>
        <h2 className='text-red-400 text-lg text-semibold'>Kim jestem?</h2>
        <h3 className='text-2xl sm:text-2xl lsm:text-3xl  font-semibold leading-snug py-2 z-30' >
        Nazywam się Mateusz, malarstwo  <br/> <span className='text-[#FF6800]'>to moja pasja i sposób na życie.</span>
        </h3>
        <p className='text-sm xsm:text-base md:text-md lg:text-lg text-semibold text-gray-600 pr-0 sm:pr-12 z-30'>
        Od ponad 25 lat zajmuję się tym, co kocham, i dzięki zaufaniu moich klientów miałem okazję sprawdzić się w różnych technikach i kombinacjach. Podejmowanie nowych wyzwań pozwalało mi stale przekraczać własne granice i odkrywać nowe obszary mojej kreatywności.
        </p>
      </div>
      {/* Decorative line */}

      {/* <div 
        className='absolute w-full h-[320px] bg-no-repeat bg-center bg-contain top-0 left-0 ' 
        style={{ backgroundImage: "url('/pngs/line.png')" }}
        /> */}
        <div className='absolute col-span-2 flex justify-center -left-0  lg: py-4 z-10'>
            <Image 
            src='/pngs/line.png'
            alt='decorative line' 
            width={1800} 
            height={250} 
            className='z-20'
            />
        </div>

      <div className=' order-1  md:order-2 py-6 flex justify-center items-center '>
        <div className='relative aspect-square size-72 md:size-96 flex  justify-center items-center '>
            <div className={`absolute w-[500px] h-[500px] -top-36 xs:w-[600px] xs:h-[600px]  sm:w-[700px] sm:h-[700px] md:w-[750px] md:h-[750px] sm:-top-36 md:-top-36 md:-left-54 lg:-top-36 lg:-left-54 z-10`}>
                  <Image 
                    src={`/pngs/spreje2.png`}
                    alt='black paint spray splash'
                    fill
                    style={{
                        objectFit: 'cover'
                    }} 
                  />
                                      {/* */}
            </div>
            <Image 
            src='/pngs/mati-shape.png'
            alt=''
            fill
            className='absolute z-30 '
        />
        </div> 
        {/* <div className='relative aspect-square size-84'>   
            
        </div> */}

      </div>
    </div> 
  )
} 
export default WhoAmI2
