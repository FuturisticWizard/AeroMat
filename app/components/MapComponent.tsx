"use client"
import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css"; // Import styles

const MapComponent = () => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null); // Ref to store the map instance

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
                <button id="close-popup">Close</button>
                <p>Mural dla kogoś z okazji czegoś przy ulicy Wiercieńskiego</p>
                <iframe width="100%" height="220" src="https://www.youtube.com/embed/FpFBhlD7cOU" frameborder="0" allowfullscreen></iframe>
                <a href="https://example.com/mural-details">Learn More</a>
                
            </div>
            `,
          },
      {
        longitude: 22.5321568429688,
        latitude: 51.25610918106192,
        popupContent: `
          <div class="relative">
            <button id="close-popup">Close</button>
            <img src="/images/mural-starowka.jpg" alt="pin" style="width: 100%; height: auto;" />
            ul.Wiercieńskiego 
          </div>
        `,
      },
      {
        longitude: 22.549362477912645,
        latitude: 51.24115775093139,
        popupContent: `
          <div class="relative">
            <button id="close-popup">Close</button>
            <img src="/images/mural-starowka.jpg" alt="pin" style="width: 100%; height: auto;" />
            Mural dla kogoś z okazji czegoś przy ulicy Wiercieńskiego
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
        .addTo(map);

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
        maxWidth: "64rem",
        margin: "0 auto",
        padding: "0 24",
        border: "1px solid black",
      }}
    />
  );
};

export default MapComponent;


// import { useEffect, useRef } from "react";
// import maplibregl from "maplibre-gl";

// const MapComponent = () => {
//   const mapContainer = useRef(null);

//   useEffect(() => {
//     if (!mapContainer.current) return;

//     // Initialize the map
//     const map = new maplibregl.Map({
//       container: mapContainer.current, // container element
//       style: "https://api.maptiler.com/maps/streets/style.json?key=9S9fXnl3QBvnUZXAddkV", // style URL
//       center: [22.568445, 51.246452], // starting position [lng, lat]
//       zoom: 16, // starting zoom
//       pitch: 60, // pitch to show 3D buildings
//     });

//     // Add navigation control
//     map.addControl(new maplibregl.NavigationControl());

//     // Clean up on unmount
//     return () => {
//       if (map) map.remove();
//     };
//   }, []);

//   return (
//     <div
//       ref={mapContainer}
//       style={{
//         height: "600px",
//         width: "100%",
//         border: "1px solid black",
//       }}
//     />
//   );
// };

// export default MapComponent;
