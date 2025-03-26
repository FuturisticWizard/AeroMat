"use client"
import VideoHero from "./components/hero/VideoHero";
import Hero from "./components/Hero"
import Hero3 from "./components/Hero3"
import TestimonialsCarousel from './components/Testimonials';
import TestimonialsCarousel2 from './components/Testimonials2';
import TestimonialsCarousel3 from './components/Testimonials3';
import TextImageRight from './components/TextImageRight';
import Portfolio from './components/Portfolio';
import Portfolio2 from './components/Portfolio2';
import InNumbers from './components/InNumbers';
import TextImageLeft from './components/TextImageLeft';
import TextImageRight2 from "./components/TextImageRight2";
import TrustedBy from "./components/TrustedBy";
import HowItWorks from "./components/HowItWorks";
import MuralsMap from "./components/MuralsMap";
import MapComponent from "./components/MapComponent";
import WhoAmI from "./components/WhoAmI";
import WhoAmI2 from "./components/WhoAmI2";
import Services from "./components/Services";
import Services2 from "./components/Services2";
// import Hero from "./components/Hero";
// <a href="https://www.vecteezy.com/free-png/paint-roller">Paint Roller PNGs by Vecteezy</a>


export default function Home() {
  return (
    <div className="flex flex-col   font-[family-name:var(--font-geist-sans)] min-h-screen  mt-20 antialiased">
      <main className=" flex-1 items-center sm:items-start  h-screen overflow-hidden">

        <VideoHero />
        <TrustedBy />
        <WhoAmI2 />
        <Services2 />
        <HowItWorks />
        {/* <section className=" flex justify-center items-center  py-20  ">
          <TextImageRight number='01' imageSrc='/images/szyld4.jpg' accentColor="#0C8FC3" title="Przyciągnij klientów!" subtitle='Stwórz miejsce, które przyciąga uwagę i zwiększ sprzedaż.' description='Zwiększaj widoczność i przyciągaj klientów dzięki unikalnym muralom i szyldom. Nasze rozwiązania pomagają zwiększyć ruch w Twoim lokalu i poprawić wyniki sprzedażowe.' />
        </section> 
        <section className=" flex justify-center items-center  py-20  ">
          <TextImageLeft number='02' imageSrc='/images/szyld2.jpg' accentColor="#FFA725" title="Wyróżnij Swoją Markę!" subtitle='Przekształć przestrzenie, wykreuj silną markę.' description='Kreatywne rozwiązania wizualne pozwalają wyróżnić się na tle innych firm, przyciągając nowych klientów i wzmacniając wizerunek marki.' />
        </section>  */}

        {/* <section className=" py-8   overflow-hidden">
          <InNumbers />
        </section> */}
        {/* <TextImageRight2 /> */}
       {/*  snap nie dzila na md +  z powodu snapow wewnatrz ? */}
        {/* <div className=" ">
        <Portfolio />
        </div> */}
        <section className="w-full bg-black">
        <h3 className="text-white text-3xl text-center pt-12 font-bold uppercase ">Portfolio</h3>
        <div id='portfolio' className="container pt-12 pb-24 max-w-6xl mx-auto ">
         <Portfolio2 />
        </div>
        </section>
 
      
        {/* <MuralsMap /> */}
        <MapComponent />
        {/* <CarouselPhotoHero images={images}/> */}

        <section id="testimonials" className=" max-w-6xl mx-auto px-8 md:px-0 py-20">
            <h2 className='xxs:text-2xl px-4 text-center'>Opinie</h2>
            <TestimonialsCarousel2 />
            
        </section>

      </main>
    </div>

  );
}
