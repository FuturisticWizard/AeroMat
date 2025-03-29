"use client"
import React, { useCallback, useMemo, useRef, useState } from 'react'
// import {Map, Marker} from 'react-map-gl/maplibre';
import {Map, Marker} from '@vis.gl/react-maplibre';
import maplibregl from 'maplibre-gl';
// import 'mapbox-gl/dist/mapbox-gl.css';        

const MAPBOX_TOKEN = '9S9fXnl3QBvnUZXAddkV'; // Set your mapbox token here
import 'maplibre-gl/dist/maplibre-gl.css';
import Image from 'next/image';


const MuralsMap = () => {
    // const [viewState, setViewState] = useState({
    //     longitude: -100,
    //     latitude: 40,
    //     zoom: 3.5
    //   });
    // const [isMounted, setIsMounted] = useState(false);

    // useEffect(() => {
    //   setIsMounted(true);
    // }, []);

    const markerRef = useRef<maplibregl.Marker>(null);
    const mapRef = useRef(null);

    const [showPopup, setShowPopup] = useState<boolean>(false);
    // const popup = useMemo(() => {
    //   return new maplibregl.Popup().setHTML('<div className="relative w-full h-full !maplibre-popup-content"><Image src="/images/mural-starowka.jpg" alt="pin" className="maplibre-popup-content" fill style="width: 600px; height: 300px;" />Mural dla kogoś z okazji czegoś przy ulicy Wiercieńskiego</div>');
    // }, [])
    // const togglePopup = useCallback(() => {
    //   setShowPopup((prev) => !prev);
    //   console.log(showPopup)
    //   markerRef.current?.togglePopup();
    //   console.log("clicked")
    // }, [showPopup]);
    const togglePopup = useCallback(() => {
      setShowPopup(!showPopup);
    }, [showPopup]);

    const popup = useMemo(() => {
      return new maplibregl.Popup()
        .setMaxWidth("600px")
        .setHTML(`
          <div class="relative">
            <img src="/images/mural-starowka.jpg" alt="pin" style="width: 100%; height: auto;" />
            Mural dla kogoś z okazji czegoś przy ulicy Wiercieńskiego
          </div>
        `);
    }, []);

  return (
     <div className='relative  w-full h-[500px] xs:w-full xs:h-[500px] xxsm:w-full xxsm:h-[500px] sm:w-full sm:h-[500px] lsm:w-full lsm:h-[500px] md:w-[1200px] md:h-[600px] flex justify-center items-center max-w-5xl mx-auto'>
      <Map
      ref={mapRef}
      initialViewState={{
        longitude: 22.568445,
        latitude: 51.246452,
        zoom: 10
      }}
      style={{width: '100%', height: '100%'}}
      mapStyle={`https://api.maptiler.com/maps/basic-v2/style.json?key=${MAPBOX_TOKEN}`}
      >
          <Marker  popup={popup}  longitude={22.549362477912645} latitude={51.24115775093139} anchor="bottom" ref={markerRef} >
            <button onClick={togglePopup}>
              <Image src="/pin2.png" alt="pin" width={64} height={64} className='' />
            </button>
            {/* {showPopup && (
                        <Popup
                            longitude={22.549362477912645}
                            latitude={51.24115775093139}
                            anchor="center"
                            onClose={() => setShowPopup(!showPopup)}
                            ref={popupRef}
                            className=''

                        >    
                          <div className='relative w-64 h-64 '>
                            <Image src="/images/mural-starowka.jpg" alt="" fill />
                          </div>
                            
                        </Popup>         
            )} */}
          </Marker>
          <Marker longitude={22.639776012728912} latitude={51.24014353801986} anchor="bottom" >
            <Image src="/pin2.png" alt="pin" width={64} height={64} className='' />
          </Marker>
          <Marker longitude={22.5321568429688} latitude={51.25610918106192} anchor="bottom" >
            <Image src="/pin2.png" alt="pin" width={64} height={64} className='' />
          </Marker>
      </Map>

    </div>
  )
}

export default MuralsMap