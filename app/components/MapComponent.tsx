"use client"
import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css"; // Import styles

const MapComponent = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null); // Ref for the map container
  const mapRef = useRef<maplibregl.Map | null>(null); // Ref to store the map instance

  useEffect(() => {
    if (mapRef.current) return; // Prevent re-initialization if map already exists
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style:
        "https://api.maptiler.com/maps/streets/style.json?key=9S9fXnl3QBvnUZXAddkV",
      center: [22.5833, 51.2469], // Center of Lublin, Poland
      zoom: 10,
      pitch: 60,
    });

    mapRef.current = map; // Store the map instance in the ref

    map.addControl(new maplibregl.NavigationControl());

    // Define marker data with popup content
    const markersData = [
        {
            longitude: 22.63971477127678,
            latitude: 51.240019578067155,
            popupContent: `
            <div style="max-width: 600px; font-size: 1.2rem;">
                <button id="close-popup" >
                  <img src="/pngs/icons8-close-24.png" alt="aeromatka" className="w-8 h-8" />
                </button>
                <p   id="marker-title">Mural dla KOM-EKO - Największy mural w Lublinie!</p>
                <iframe width="560" height="315" src="https://www.youtube.com/embed/Y8-QLpd97bo&t=10s" title="mural Kom-Eko" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            </div>
            `,
          },
      {
        longitude: 22.532630754596873,
        latitude: 51.256905603294754, 
        popupContent: `
            <div style=" max-width: 600px; font-size: 1.2rem;">
                <button id="close-popup"   >
                  <img src="/pngs/icons8-close-24.png" alt="aeromatka" className="w-8 h-8" />
                </button>
                <p  id="marker-title">Mural dla LPEC "kostka" - Mural przy  ul.Puławskiej 34 </p>
                <iframe width="560" height="315" src="https://www.youtube.com/embed/hNWmk-VJZ6c" title="mural lpec kostka" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            </div>
        `,
      },
      {
        longitude:  22.532542268736847,
        latitude: 51.25626810489018,
        popupContent: `
            <div style=" max-width: 600px; font-size: 1.2rem;">
                <button id="close-popup"  >
                  <img src="/pngs/icons8-close-24.png" alt="aeromatka" className="w-8 h-8" />
                </button>
                <p id="marker-title">Mural Antysmogowy LPEC - przy  ul.Puławskiej 28 </p>
                <iframe width="560" height="315" src="https://www.youtube.com/embed/_Ur0BpsVwQE" title="mural lpec Antysmogowy" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            </div>
        `,
      },
      {
        longitude: 22.530092576626114,
        latitude: 51.25477083428302,
        popupContent: `
            <div style=" max-width: 600px; font-size: 1.2rem;">
                <button id="close-popup" >
                  <img src="/pngs/icons8-close-24.png" alt="aeromatka" className="w-8 h-8" />
                </button>
                <p  id="marker-title">Mural LPEC - przy  ul.Puławskiej 20 </p>
                <iframe width="560" height="315" src="https://www.youtube.com/embed/kuZWqDKxAS8" title="mural Lpec" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            </div>
        `,
      },
      {
        longitude: 22.54938907874886,
        latitude: 51.241060927362945,
        popupContent: `
            <div style=" position: relative; max-width: 600px; font-size: 1.2rem; ">
                <button id="close-popup"    >
                  <img src="/pngs/icons8-close-24.png" alt="aeromatka" className="w-8 h-8" />
                </button>
                <p id="marker-title">Lublin Stare Miasto - Mural przy ul.Wiercieńskiego 5 </p>
                <iframe width="560" height="315" src="https://www.youtube.com/embed/FpFBhlD7cOU" title="Stare Miasto - Mural przy ul.Wiercieńskiego 5" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            </div>
        `,
      },
      {
        longitude: 22.545706416185283,
        latitude: 51.21787486892107,
        popupContent: `
            <div style=" max-width: 600px; font-size: 1.2rem;">
                <button id="close-popup"  >
                  <img src="/pngs/icons8-close-24.png" alt="aeromatka" className="w-8 h-8" />
                </button>
                <p  id="marker-title">Ptasi Mural 1  - Mural przy ul. </p>
                <iframe width="560" height="315" src="https://www.youtube.com/embed/u6u1kGA8uGE" title="mural Kom-Eko" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            </div>
        `,
      },
    ];

    // // Add markers to the map
    // markersData.forEach((markerData) => {
    //    // Create a DOM element for the custom marker
    //     const el = document.createElement('div');
    //     el.style.backgroundImage = 'url(/pngs/aeromatka-refactored.png)'; // Replace with your PNG path
    //     el.style.width = '40px';  // Set marker width
    //     el.style.height = '40px'; // Set marker height
    //     el.style.backgroundSize = 'contain';
    //     el.style.backgroundRepeat = 'no-repeat';
    //     el.style.cursor = 'pointer';


    //   const popup = new maplibregl.Popup({ 
    //     offset: 25,
    //     closeButton: false,
    //  }).setMaxWidth('600px').setHTML(
    //     markerData.popupContent,
    //   );

    //   const marker = new maplibregl.Marker()
    //     .setLngLat([markerData.longitude, markerData.latitude])
    //     .setPopup(popup) // sets a popup on this marker
    //     .addTo(map);
    //     // Add click event to open popup on marker click
    //   el.addEventListener('click', () => {
    //     popup.addTo(map);
    //     popup.setLngLat([markerData.longitude, markerData.latitude]);
    //   });
  
    //   // Explicitly handle close button click (if necessary)
    //     popup.on('open', () => {
    //         const closeButton = document.getElementById('close-popup');
    //         if (closeButton) {
    //         closeButton.addEventListener('click', () => {
    //             popup.remove();
    //         });
    //         }
    //     });
    // });
    markersData.forEach((markerData) => {
      // Create a DOM element for the custom marker
      const el = document.createElement("div");
      el.style.backgroundImage = "url(/pngs/aeromatka-refactored.png)"; // Replace with your PNG path
      el.style.width = "40px"; // Set marker width
      el.style.height = "40px"; // Set marker height
      el.style.backgroundSize = "contain";
      el.style.backgroundRepeat = "no-repeat";
      el.style.cursor = "pointer";
    
      // Create a popup
      const popup = new maplibregl.Popup({
        offset: [0, 25],
        closeButton: false,
      })
        .setMaxWidth("600px")
        .setHTML(markerData.popupContent);
    
      // Create a marker with the custom element
      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([markerData.longitude, markerData.latitude])
        .setPopup(popup) 
        .addTo(map);

    
      // Explicitly handle close button click (if necessary)
      popup.on("open", () => {
        const closeButton = document.getElementById("close-popup");
        if (closeButton) {
          closeButton.addEventListener("click", () => {
            popup.remove();
          });
        }
      });
    });

    // Clean up on unmount
    return () => {
      markersData.forEach((markerData) => {
        const element = document.querySelector(
          `.maplibregl-marker[data-longitude="${markerData.longitude}"][data-latitude="${markerData.latitude}"]`,
        );

        if (element) {
          
          element.remove();
        }
      });

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null; // Reset the ref
      }
      
    };
  }, []);

  return (
    <div
      ref={mapContainer}
      style={{
        height: "600px",
        maxWidth: "72rem",
        margin: "0 auto",
        border: "1px solid black ",
      }}
    />
  );
};

export default MapComponent;