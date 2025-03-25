// "use client"
// import React from 'react'
// import { motion } from "framer-motion";
// import { Button } from "@/app/components/ui/button";

// const HeadingAnton = ({ firstPart, secondPart, ctaText = 'Skontaktuj się'}) => {
//   return (
//     <div className='flex flex-col w-full'>
//       <div className='relative flex flex-col'>
//       <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, delay: 0.4 }}
//         >
//         {/* Heading with higher z-index */}
//         <motion.h1
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           className='flex anton-regular shadow-inner outline-1 outline-orange-400 text-orange-600 xxs:text-5xl xl:text-8xl' // Added z-index
//         >
//           AEROMAT
//         </motion.h1>

//         {/* Subheading */}
//         <motion.h2
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           className={`relative xxs:right-4 xxs:bottom-56 xxs:pl-12 lg:pl-24 w-full xxs:pr-4 justify-end leading-tight text-3xl md:text-3xl text-right font-bold anton-regular-strokeW uppercase`}
//         >
//           <div className="absolute -top-1 xl:-top-2 right-0 w-10 h-12 xl:h-16 border-t-2 border-r-8 border-solid border-orange-600" />
//           {firstPart} <br />
//           {secondPart}
//         </motion.h2>

//         {/* Button */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, delay: 0.4 }}
//         >
//           <Button
//             variant="outline"
//             size="lg"
//             className="bg-white/10 hover:bg-white/20 text-white border-white/20 mt-4" // Added margin-top for spacing
//           >
//             {ctaText}
//           </Button>
//         </motion.div>
//         </motion.div>
//       </div>
//     </div>
//   )
// }

// export default HeadingAnton;
"use client"
import { motion } from "framer-motion"
import { Button } from "@/app/components/ui/button";

const HeadingAnton = ({ firstPart='firstpart', secondPart='secondpart', ctaText = "Skontaktuj się" }) => {
  return (
    <div className="flex flex-col w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative"
      >
        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="anton-regular shadow-inner outline-1 outline-orange-400 text-orange-600 xxs:text-5xl xl:text-8xl z-10"
        >
          AEROMAT
        </motion.h1>

        {/* Subheading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mt-4 text-right font-bold anton-regular-strokeW uppercase xxs:text-3xl md:text-3xl lg:text-4xl z-20"
        >
          <div className="absolute -top-1 xl:-top-2 right-0 w-10 h-12 xl:h-16 border-t-2 border-r-8 border-solid border-orange-600" />
          {firstPart} <br />
          {secondPart}
        </motion.h2>

        {/* Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8 text-right"
        >
          <Button variant="outline" size="lg" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
            {ctaText}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default HeadingAnton

