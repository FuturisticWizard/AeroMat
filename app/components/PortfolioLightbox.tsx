"use client";
import Lightbox from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

interface PortfolioLightboxProps {
  slides: { src: string }[];
  index: number;
  close: () => void;
}

export default function PortfolioLightbox({ slides, index, close }: PortfolioLightboxProps) {
  return (
    <Lightbox
      slides={slides}
      open
      index={index}
      close={close}
      plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
    />
  );
}
