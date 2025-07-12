"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  APIProvider,
  Map,
  useMap,
  AdvancedMarker,
  MapCameraChangedEvent,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import type { Marker } from "@googlemaps/markerclusterer";
import { Circle } from "./Circle";
import VideoPlayer from "../VideoPlayer/VideoPlayer";
type Poi = {
  key: string;
  location: google.maps.LatLngLiteral;
  name: string; // Name of the place
  src: string; // URL of the image
};
const locations: Poi[] = [
  {
    key: "Stare Miasto w Lublinie - ul.Wiercieńskiego 5",
    location: { lat: 51.241060927362945, lng: 22.54938907874886 },
    name: "Lublin Stare Miasto - Mural przy ul. Wiercieńskiego 5",
    src: "https://www.youtube.com/embed/FpFBhlD7cOU",
  },
];
const PoiMarkers = (props: { pois: Poi[] }) => {
  const map = useMap();
  const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});
  const [selectedPoi, setSelectedPoi] = useState<Poi | null>(null);
  const clusterer = useRef<MarkerClusterer | null>(null);
  const [circleCenter, setCircleCenter] = useState(null);
  const [infoWindowOpen, setInfoWindowOpen] = useState(false);
  const [infoWindowPosition, setInfoWindowPosition] =
    useState<google.maps.LatLng | null>(null); // Position of the InfoWindow
  const handleClick = useCallback(
    (poi: Poi) => {
      if (!map) return;
      map.panTo(poi.location); // Pan the map to the marker's location
      // Optionally set the circle center
      setSelectedPoi(poi); // Update the state with the clicked marker's details
      setInfoWindowOpen(true);
    },
    [map, setSelectedPoi],
  );
  const handleMarkerClick = useCallback(() => {
    setInfoWindowOpen(true);
  }, []);

  const handleInfoWindowClose = useCallback(() => {
    setInfoWindowOpen(false);
  }, []);
  // Initialize MarkerClusterer, if the map has changed
  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map });
    }
  }, [map]);

  // Update markers, if the markers array has changed
  useEffect(() => {
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers));
  }, [markers]);

  const setMarkerRef = (marker: Marker | null, key: string) => {
    if (marker && markers[key]) return;
    if (!marker && !markers[key]) return;

    setMarkers((prev) => {
      if (marker) {
        return { ...prev, [key]: marker };
      } else {
        const newMarkers = { ...prev };
        delete newMarkers[key];
        return newMarkers;
      }
    });
  };

  return (
    <>
      {props.pois.map((poi: Poi) => (
        <AdvancedMarker
          key={poi.key}
          position={poi.location}
          ref={(marker) => setMarkerRef(marker, poi.key)}
          clickable={true}
          onClick={() => handleClick(poi)} // Pass poi for specific marker click handling
        >
          {/* Custom marker content: an image icon */}
          <img
            src="/pngs/aeromatka-refactored.png" // Replace with your icon URL or import
            alt={poi.name}
            style={{ width: 40, height: 40, cursor: "pointer" }}
          />

          {/* Show InfoWindow only for the selected marker */}
          {selectedPoi?.key === poi.key && infoWindowOpen && (
            <InfoWindow position={poi.location} onClose={handleInfoWindowClose}>
              <div style={{ maxWidth: 600 }}>
                <p className="text-xl font-bold">{poi.name}</p>
                <iframe
                  width="560"
                  height="415"
                  src={poi.src}
                  title={poi.name}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </InfoWindow>
          )}
        </AdvancedMarker>
      ))}
    </>
  );
};

const GoogleMap = () => {
  return (
    <div className="flex flex-col mx-auto h-auto w-full items-center sm:max-w-5xl md:max-w-6xl border border-0.5 border-black">
      <APIProvider
        apiKey={"AIzaSyAR7h_0EaMtlx3FtElu7aVAL3z0VX5d1hg"}
        onLoad={() => {}}
      >
        <div className="w-full h-[400px] sm:h-[500px] lg:h-[800px]">
          {" "}
          {/* Responsive height */}
          <Map
            defaultZoom={11}
            defaultCenter={{ lat: 51.2469, lng: 22.5833 }}
            onCameraChanged={(ev: MapCameraChangedEvent) => {}}
            mapId="da37f3254c6a6d1c"
            className="relative w-full h-full" // Ensure the map takes up the full container
          >
            <PoiMarkers pois={locations} />
          </Map>
        </div>
      </APIProvider>
    </div>
  );
};

export default GoogleMap;
