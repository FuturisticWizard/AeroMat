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
                <RowsPhotoAlbum photos={portfolioPhotos} targetRowHeight={250} onClick={({ index }) => setIndex(index)} />

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

