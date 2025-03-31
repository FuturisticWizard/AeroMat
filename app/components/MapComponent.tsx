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
      zoom: 12,
      pitch: 60,
    });

    mapRef.current = map; // Store the map instance in the ref

    map.addControl(new maplibregl.NavigationControl());

    // Define marker data with popup content
    const markersData = [
        {
            longitude: 22.639776012728912,
            latitude: 51.24014353801986,
            popupContent: `
            <div style=" max-width: 600px;">
                <button id="close-popup" className='px-2 py-2' >X</button>
                <p>Mural dla KOM-EKO - Największy mural w Lublinie!</p>
                <iframe width="560" height="315" src="https://www.youtube.com/embed/Y8-QLpd97bo" title="mural Kom-Eko" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            </div>
            `,

          },
      {
        longitude: 22.5321568429688,
        latitude: 51.25610918106192,
        popupContent: `
            <div style=" max-width: 600px;">
                <button id="close-popup" className='px-2 py-2 ' >X</button>
                <p>Mural Antysmogowy dla LPEC - Mural antysmogowy przy  ul.Puławskiej 28 </p>
                <iframe width="560" height="315" src="https://www.youtube.com/embed/hNWmk-VJZ6c" title="mural Kom-Eko" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            </div>
        `,

      },
      {
        longitude: 22.549362477912645,
        latitude: 51.24115775093139,
        popupContent: `
            <div style=" max-width: 600px;">
                <button id="close-popup" className='px-2 py-2' >X</button>
                <p>Lublin Stare Miasto - Mural przy ul. Wiercieńskiego 5 </p>
                <iframe width="560" height="315" src="https://www.youtube.com/embed/FpFBhlD7cOU" title="mural Kom-Eko" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            </div>
        `,

      },
    ];

    // Add markers to the map
    markersData.forEach((markerData) => {
      const popup = new maplibregl.Popup({ 
        offset: 25,
        closeButton: false,
     }).setMaxWidth('600px').setHTML(
        markerData.popupContent,
      ).addTo(map);

      new maplibregl.Marker()
        .setLngLat([markerData.longitude, markerData.latitude])
        .setPopup(popup) // sets a popup on this marker
        .addTo(map)
        .getElement().className += ' cursor-pointer';
        ;

      // Explicitly handle close button click (if necessary)
        popup.on('open', () => {
            const closeButton = document.getElementById('close-popup');
            if (closeButton) {
            closeButton.addEventListener('click', () => {
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