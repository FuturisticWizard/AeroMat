// 'use client'
// import React, { useState, useEffect } from 'react'
// import { ChevronLeft, ChevronRight } from "lucide-react"
// import Image from 'next/image'

// interface CarouselPhotoHeroProps {
//     images: string[]
//     interval?: number
//   }


// const CarouselPhotoHero: React.FC<CarouselPhotoHeroProps>  = ({ images, interval = 5000 }) => {
//     const [currentIndex, setCurrentIndex] = useState(0);

//     useEffect(() => {
//         const timer = setInterval(() => {
//           setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
//         }, interval)
    
//         return () => clearInterval(timer)
//       }, [images.length, interval])
    

//     const goToPrevious = () => {
//         setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length )
//     }
    
//     const goToNext = () => {
//         setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length )
//     }


//   return (
//     <div className=" flex w-full max-h-[1020px] min-w-screen xl:min-w-7xl">
//     <div className="overflow-hidden rounded-lg aspect-video">
//       {images.map((image, index) => (
        
//             <div className='' key={index}>
//                 <div className=' w-full h-screen bg-black/50 z-30'/>
//                 <Image
//                 key={index}
//                 fill
//                 src={image.path || "/placeholder.png"}
//                 alt={`Slide ${index + 1}`}
//                 className={`absolute  w-full h-full object-cover transition-opacity duration-500 ${
//                     index === currentIndex ? "opacity-100" : "opacity-0"
//                 }`}
//                 />
//                 <h1 className={`absolute top-3/4 left-2/3 justify-center text-white anton text-8xl ${
//                     index === currentIndex ? "opacity-100" : "opacity-0"
//                 }`}>{image.title}</h1>
//                 </div>
      

//       ))}
     
//     </div>
//     <button
//       onClick={goToPrevious}
//       className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
//       aria-label="Previous slide"
//     >
//       <ChevronLeft className="w-6 h-6" />
//     </button>
//     <button
//       onClick={goToNext}
//       className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
//       aria-label="Next slide"
//     >
//       <ChevronRight className="w-6 h-6" />
//     </button>
//     <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
//       {images.map((_, index) => (
//         <button
//           key={index}
//           onClick={() => setCurrentIndex(index)}
//           className={`w-3 h-3 rounded-full ${index === currentIndex ? "bg-white" : "bg-white bg-opacity-50"}`}
//           aria-label={`Go to slide ${index + 1}`}
//         />
//       ))}
//     </div>
//   </div>
//   )
// }

// export default CarouselPhotoHero
