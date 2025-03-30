import VideoHero from "./components/hero/VideoHero";
import TestimonialsCarousel2 from './components/Testimonials2';
import Portfolio2 from './components/Portfolio2';
import TrustedBy from "./components/TrustedBy";
import HowItWorks from "./components/HowItWorks";
import WhoAmI2 from "./components/WhoAmI2";
import Services from "./components/Services";
import MuralsMap from "./components/MuralsMap";


// import Hero from "./components/Hero";
// <a href="https://www.vecteezy.com/free-png/paint-roller">Paint Roller PNGs by Vecteezy</a>


export default function Home() {
  return (
    <div className="flex flex-col   font-[family-name:var(--font-geist-sans)] min-h-screen  mt-20 antialiased">
      <main className=" flex-1 items-center sm:items-start  h-screen overflow-hidden">

        <VideoHero />
        <TrustedBy />
        <WhoAmI2 />
        <Services />

        <HowItWorks />

        <Portfolio2 />
        <MuralsMap />


        <section id="testimonials" className=" max-w-6xl mx-auto items-center justify-center px-8 md:px-0 py-20">
            <h2 className='xxs:text-2xl px-4 text-center'>Opinie</h2>
            <TestimonialsCarousel2 />
            
        </section>

      </main>
    </div>

  );
}
