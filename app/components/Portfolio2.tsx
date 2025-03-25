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

const photos = [
    {
        src: '/Portfolio/image01.jpg',
        alt: '',
        width: 9315,
        height: 2196,
    },
    {
        src: '/Portfolio/image02.jpg',
        alt: '',
        width: 3868,
        height: 2928,
    },
    {
        src: '/Portfolio/image03.jpg',
        alt: '',
        width: 4480,
        height: 2289,
    },
    {
        src: '/Portfolio/image04.jpg',
        alt: '',
        width: 4336,
        height: 5776,
    },
    {
        src: '/Portfolio/image05.jpg',
        alt: '',
        width: 2949,
        height: 4915,
    },
    {
        src: '/Portfolio/image06.jpg',
        alt: '',
        width: 4336,
        height: 5776,
    },
    {
        src: '/Portfolio/image07.jpg',
        alt: '',
        width: 5776,
        height: 4214,
    },
        {
        src: '/Portfolio/image08.jpg',
        alt: '',
        width: 4235,
        height: 5294,
    },
]


const Portfolio2 = () => {
  const [index, setIndex] = useState(-1);

  return (
    <>
    <RowsPhotoAlbum photos={photos} targetRowHeight={250} onClick={({ index }) => setIndex(index)} />

    <Lightbox
      slides={photos}
      open={index >= 0}
      index={index}
      close={() => setIndex(-1)}
      // enable optional lightbox plugins
      plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
    />
  </>                                                                                                                                                                               
  )
}

export default Portfolio2

