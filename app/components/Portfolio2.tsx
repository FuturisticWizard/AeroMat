"use client"
import { useState } from "react";
import { RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

// import optional lightbox plugins
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import {portfolioPhotos} from "@/app/lib/photos"
const photos = [
    {
        src: '/Portfolio/mural-komeko.jpg',
        alt: '',
        width: 9315,
        height: 2196,
    },
    {
        src: '/Portfolio/mural-ptak.jpg',
        alt: '',
        width: 3868,
        height: 2928,
    },
    {
        src: '/Portfolio/mural-morze.jpg',
        alt: '',
        width: 4480,
        height: 2289,
    },
    {
        src: '/Portfolio/mural-stare-miasto-lublin.jpg',
        alt: '',
        width: 4336,
        height: 5776,
    },
    {
        src: '/Portfolio/mural-stare-miasto.jpg',
        alt: '',
        width: 5776,
        height: 4337,
    },
    {
        src: '/Portfolio/mural-lpec-dom.jpg',
        alt: '',
        width: 2949,
        height: 4915,
    },
    {
        src: '/Portfolio/mural-magic-boxes.jpg',
        alt: '',
        width: 4336,
        height: 5776,
    },
    {
        src: '/Portfolio/mural-akwarium.jpg',
        alt: '',
        width: 5776,
        height: 4214,
    },
    {
        src: '/Portfolio/mural-rybka.jpg',
        alt: '',
        width: 4235,
        height: 5294,
    },
    {
        src: '/Portfolio/mural-pieski.jpg',
        alt: '',
        width: 5776,
        height: 4337,
    },
    {
        src: '/Portfolio/mural-mario.jpg',
        alt: '',
        width: 5776,
        height: 4337,
    },
    {
        src: '/Portfolio/mural-spongebob.jpg',
        alt: '',
        width: 4337,
        height: 5776,
    },
    {
        src: '/Portfolio/mural-samochod.jpg',
        alt: '',
        width: 4032,
        height: 3084,
    },
    {
        src: '/Portfolio/mural-samochod2.jpg',
        alt: '',
        width: 4032,
        height: 3084,
    },
    {
        src: '/Portfolio/mural-soldats.jpg',
        alt: '',
        width: 5076,
        height: 3368,
    },


]


const Portfolio2 = () => {
  const [index, setIndex] = useState(-1);

  return (

    <div id="portfolio" className=' pb-24 w-full bg-black  items-center ' >
        <div className=' px-8 lg:px-0 max-w-6xl mx-auto'>
            {/* Header */}
            <div className='pb-8  '>
                <p className=" text-lg text-red-400 text-center pt-12 pb-2 ">Moje Prace</p>
                <h3 className="text-white text-2xl text-center font ">Zobacz moje ukończone realizacje</h3>
            </div>
            <div className='px-8 lg:px-0'>
                <RowsPhotoAlbum photos={photos} targetRowHeight={250} onClick={({ index }) => setIndex(index)} />

                <Lightbox
                slides={portfolioPhotos}
                open={index >= 0}
                index={index}
                close={() => setIndex(-1)}
                // enable optional lightbox plugins
                plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
                />
            </div>

        </div>
    </div>                                                                                                                                                                               
  )
}

export default Portfolio2

