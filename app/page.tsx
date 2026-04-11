import GlitchedVideoHero from "./components/hero/GlitchedVideoHero";
import Portfolio from "./components/Portfolio";
import PortfolioCard from "./components/PortfolioCard";
import TrustedBy from "./components/TrustedBy";
import HowItWorks from "./components/HowItWorks";
import WhoAmI2 from "./components/WhoAmI2";
import Services from "./components/Services";
import MuralsMap from "./components/MuralsMap";
import { portfolioPhotos, komunikacjaWizualnaPhotos, wnetrzaPhotos, projektySpecjalnePhotos } from "@/app/lib/photos";
import { LazyYouTubeGridWithIntersection, LazyPanoramaScrollWithIntersection, LazyTestimonialsWithIntersection } from "./components/LazyComponents";
import Intro from "./components/Intro";
import Outro from "./components/Outro";
import AboutMe from "./components/AboutMe";
import Cards from "./components/Cards";
import PanoramaScroll from "./components/PanoramaScroll";
import HomeAnimations from "./components/HomeAnimations";
import WhyChooseMe from "./components/WhyChooseMe";

export default function Home() {
  return (
    <HomeAnimations>
      <div className="flex flex-col min-h-screen mt-20 antialiased">
        <main className="flex-1 items-center sm:items-start min-h-screen overflow-x-hidden">
          <GlitchedVideoHero highlightStyle="stroke" />
          <Intro />

          {/* Card 0: Murale Wielkoformatowe */}
          <div className="relative z-10">
            <Cards startIndex={0} endIndex={0} />
          </div>

          {/* Spacer - intro card "hold" period (provides scroll distance for expand animation) */}
          <div className="intro-hold-spacer h-[80vh]" aria-hidden="true" />

          {/* Portfolio 1: po Murale Wielkoformatowe */}
          <PortfolioCard data={portfolioPhotos} id="murale" gridVariant="11" className="z-20" />

          {/* Card 1: Szyldy i Logotypy */}
          <div className="relative z-30">
            <Cards startIndex={1} endIndex={1} />
          </div>

          {/* Portfolio 2: po Szyldy i Logotypy */}
          <PortfolioCard data={komunikacjaWizualnaPhotos} id="szyldy" gridVariant="7" className="z-40" />

          {/* Card 2: Wnętrza i Dekoracje */}
          <div className="relative z-50">
            <Cards startIndex={2} endIndex={2} />
          </div>

          {/* Portfolio 3: po Wnętrza i Dekoracje */}
          <PortfolioCard data={wnetrzaPhotos} id="wnetrza" gridVariant="11" className="z-[55]" />

          {/* Card 3: Projekty Specjalne */}
          <div className="relative z-[60]">
            <Cards startIndex={3} endIndex={3} />
          </div>

          {/* Portfolio 4: po Projekty Specjalne */}
          <PortfolioCard data={projektySpecjalnePhotos} id="projekty" gridVariant="7sq" className="z-[70]" />

          <div className="relative z-[90]">
            <PanoramaScroll />
          </div>
          <Outro />
          <AboutMe />
          <WhyChooseMe />

          <LazyYouTubeGridWithIntersection />
          <TrustedBy />
          <LazyTestimonialsWithIntersection />

          <MuralsMap />
        </main>
      </div>
    </HomeAnimations>
  );
}
