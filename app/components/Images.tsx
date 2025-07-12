"use client";
import React, { useCallback } from "react";
import Image from "next/image";
import { FC } from "react";
import { useEffect, useState } from "react";


// interface ImagesProps {
//   data: {
//     index: number;
//     src: string;
//     title: string;
//     category: string;
//     width: number;
//     height: number;
//     smcolspan: number;
//     smrowspan: number;
//     colspan: number;
//     rowspan: number;
//     gridArea: string;
//   }[];
//   onClick: (index: number) => void;
//   length: number;
// }

// // const gridStyles = css`
// //   display: grid;
// //   gap: 20px;

// //   @media (max-width: 768px) {
// //     grid-template-columns: repeat(1, 1fr);
// //   }

// //   @media (min-width: 768px) {
// //     grid-template-columns: repeat(3, 1fr);
// //   }
// // `;
// const Images: FC<ImagesProps> = (props) => {
//   const { data, onClick, length } = props;
//   const [isXsmScreen, setIsXsmScreen] = useState(false);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsXsmScreen(window.innerWidth >= 625 && window.innerWidth < 768); // Adjust the range for xsm screens
//     };

//     handleResize(); // Check on initial render
//     window.addEventListener("resize", handleResize);

//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, []);

//   const handleClickImage = (index: number) => {
//     onClick(index);
//   };

//   return (
//     <div className="flex flex-col mx-auto h-auto w-full items-center sm:max-w-6xl lg:max-w-full xxs:py-4 px-2">
//       {/* <div className={`grid xxs:grid-cols-1 grid-rows-${length} xsm:grid-cols-10 xsm:auto-rows-auto md:grid-cols-10 md:auto-rows-[minmax(100px, auto)] gap-1 sm:gap-2 md:gap-4 lg:gap-2 w-full py-2`}>
//         {data.map((slide, index) => (

//           <div
//             onClick={() => handleClickImage(index)}
//             key={index}
//             className={`relative xxs:col-span-1 xxs:row-span-1 `}
//             style={
//               isXsmScreen
//                 ? { gridColumn: `span ${slide.smcolspan} / span ${slide.smrowspan}` }
//                 : { gridColumn: `span ${slide.colspan} / span ${slide.rowspan}` }
//             }
//           >
//             <Image
//               src={slide.src} 
//               alt={slide.title} 
//               width={slide.width}
//               height={slide.height} 
//               className="w-full h-full object-cover"
//               />
//           </div>
//         ))}
//       </div> */}
//       <div className={`grid grid-container`}>
//         {data.map((slide, index) => (
//           <div
//             onClick={() => handleClickImage(index)}
//             key={index}
//             className={`relative`}
//             style={{ gridArea: `${slide.gridArea}` }}
//           >
//             <Image
//               src={slide.src}
//               alt={slide.title}
//               width={slide.width}
//               height={slide.height}
//               className="w-full h-full object-cover cursor-pointer"
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Images;
import { motion } from "framer-motion";


interface Slide {
  src: string;
  title: string;
  width: number;
  height: number;
  gridArea: string;
}

interface ImageSlideProps {
  data: Slide[];
  onClick: (index: number) => void;
}

const Images: FC<ImageSlideProps> = (props) => {
  const { data, onClick } = props;

  const handleClickImage = useCallback((index: number) => {
    onClick(index);
  }, [onClick]);

  const fadeAnimationVariants = {
    initial: { opacity: 0, y: 100 },
    animate: (index: number) => ({ 
      opacity: 1, 
      y: 40,
      transition: {
        delay: 0.05 * index, // Each image delays by 0.15s more than the previous
      }
    }),
  }
  return (
    <div className="flex flex-col mx-auto h-auto w-full items-center sm:max-w-6xl lg:max-w-full xxs:py-4 px-2">
      <div className="grid grid-container">
        {data.map((slide, index) => (
          <motion.div
            key={index}
            onClick={() => handleClickImage(index)}
            className="relative"
            style={{ gridArea: `${slide.gridArea}` }}
            variants={fadeAnimationVariants}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            custom={index}
          >
            <Image
              src={slide.src}
              alt={slide.title}
              width={slide.width}
              height={slide.height}
              className="w-full h-full object-cover cursor-pointer"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Images;