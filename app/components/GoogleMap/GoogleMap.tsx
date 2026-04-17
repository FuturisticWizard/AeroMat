"use client";
import React, { useEffect, useState, useRef, useCallback, Suspense, memo } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import {
  APIProvider,
  Map,
  useMap,
  MapCameraChangedEvent,
} from "@vis.gl/react-google-maps";
import { MarkerClusterer } from "@googlemaps/markerclusterer";

// Lazy load video player to improve performance
const VideoPlayer = dynamic(() => import("../VideoPlayer/VideoPlayer"), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-200 w-full h-64">Loading video...</div>
});
type Poi = {
  key: string;
  location: google.maps.LatLngLiteral;
  name: string; // Name of the place
  src: string; // URL of the image
};
const locations: Poi[] = [
  {
    key: "komeko-mural",
    location: { lat: 51.240019578067155, lng: 22.63971477127678 },
    name: "Mural dla KOM-EKO - Największy mural w Lublinie!",
    src: "https://www.youtube.com/embed/Y8-QLpd97bo",
  },
  {
    key: "lpec-kostka",
    location: { lat: 51.256905603294754, lng: 22.532630754596873 },
    name: "Mural dla LPEC \"kostka\" - Mural przy ul.Puławskiej 34",
    src: "https://www.youtube.com/embed/hNWmk-VJZ6c",
  },
  {
    key: "lpec-antysmogowy",
    location: { lat: 51.25626810489018, lng: 22.532542268736847 },
    name: "Mural Antysmogowy LPEC - przy ul.Puławskiej 28",
    src: "https://www.youtube.com/embed/_Ur0BpsVwQE",
  },
  {
    key: "lpec-pulawska",
    location: { lat: 51.25477083428302, lng: 22.530092576626114 },
    name: "Mural LPEC - przy ul.Puławskiej 20",
    src: "https://www.youtube.com/embed/kuZWqDKxAS8",
  },
  {
    key: "stare-miasto",
    location: { lat: 51.241060927362945, lng: 22.54938907874886 },
    name: "Lublin Stare Miasto - Mural przy ul.Wiercieńskiego 5",
    src: "https://www.youtube.com/embed/FpFBhlD7cOU",
  },
  {
    key: "ptasi-mural",
    location: { lat: 51.21787486892107, lng: 22.545706416185283 },
    name: "Ptasi Mural 1 - Mural artystyczny",
    src: "https://www.youtube.com/embed/u6u1kGA8uGE",
  },
  {
    key: "ptasi-mural-2",
    location: { lat: 51.217645559309446, lng: 22.545560966211973 },
    name: "Ptasi Mural 2 - Zmiany",
    src: "https://www.youtube.com/embed/1fEvHbd5tTI",
  },
  {
    key: "copenhagen-strain",
    location: { lat: 51.23905990960437, lng: 22.508048564012203 },
    name: "Mural Copenhagen S-Train",
    src: "https://www.youtube.com/embed/_Ww_hEQBIos",
  },
  {
    key: "przedszkole-junior",
    location: { lat: 51.241771783177576, lng: 22.53444259892882 },
    name: "Mural na przedszkolu Junior",
    src: "https://www.youtube.com/embed/oE7ucKq4of8",
  },
  {
    key: "tifosi",
    location: { lat: 51.24540935667581, lng: 22.5555330500593 },
    name: "Mural Tifosi",
    src: "https://www.youtube.com/embed/ZUph96wwU2g",
  },
  {
    key: "dom-kultury-jastkowice",
    location: { lat: 50.602685190705124, lng: 22.105993626179597 },
    name: "Dom Kultury Jastkowice",
    src: "https://www.youtube.com/embed/8mX0dX03usA",
  },
  {
    key: "opole-lubelskie",
    location: { lat: 51.146616094983955, lng: 21.974377044347392 },
    name: "Mural historyczny w Opolu Lubelskim",
    src: "https://www.youtube.com/embed/nLrFVfav05g",
  },
  {
    key: "akwarium-24",
    location: { lat: 51.23511014563301, lng: 22.5763315040532 },
    name: "Mural z Rybą - Akwarium24",
    src: "https://www.youtube.com/embed/HBrLvcUcGfg",
  },
  {
    key: "apis",
    location: { lat: 51.214706, lng: 22.548721 },
    name: "Mural APIS",
    src: "https://www.youtube.com/embed/IuAl1eqrCCA",
  },
  {
    key: "bieluch",
    location: { lat: 51.14572, lng: 23.48539 },
    name: "Mural Bieluch",
    src: "https://www.youtube.com/embed/5Ba1XizIDnc",
  },
];
const PoiMarkers = memo((props: { pois: Poi[]; onSelectPoi: (poi: Poi) => void }) => {
  const map = useMap();
  const [markers, setMarkers] = useState<{ [key: string]: google.maps.Marker }>({});
  const clusterer = useRef<MarkerClusterer | null>(null);

  useEffect(() => {
    if (!map) return;

    Object.values(markers).forEach(marker => marker.setMap(null));

    const newMarkers: { [key: string]: google.maps.Marker } = {};

    props.pois.forEach((poi) => {
      const marker = new google.maps.Marker({
        position: poi.location,
        map: map,
        title: poi.name,
        icon: {
          url: "/pngs/aeromatka-refactored.webp",
          scaledSize: new google.maps.Size(40, 40),
        },
      });

      marker.addListener("click", () => {
        map.panTo(poi.location);
        props.onSelectPoi(poi);
      });

      newMarkers[poi.key] = marker;
    });

    setMarkers(newMarkers);

    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({
        map,
        markers: Object.values(newMarkers)
      });
    } else {
      clusterer.current.clearMarkers();
      clusterer.current.addMarkers(Object.values(newMarkers));
    }

    return () => {
      Object.values(newMarkers).forEach(marker => marker.setMap(null));
    };
  }, [map, props.pois]);

  return null;
});

PoiMarkers.displayName = 'PoiMarkers';

// Error boundary component
class MapErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Google Maps error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center w-full h-64 bg-gray-100 rounded">
          <p className="text-gray-600 mb-2">Unable to load map</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading component
const MapLoading = () => (
  <div className="flex items-center justify-center w-full h-64 bg-neutral-900 rounded animate-pulse">
    <div className="text-gray-400">Ładowanie mapy...</div>
  </div>
);

// Dark mode styles for Google Maps
const darkModeStyles = [
  { elementType: "geometry", stylers: [{ color: "#212121" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#757575" }] },
  { featureType: "administrative.country", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
  { featureType: "administrative.land_parcel", stylers: [{ visibility: "off" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#bdbdbd" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#181818" }] },
  { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
  { featureType: "road", elementType: "geometry.fill", stylers: [{ color: "#2c2c2c" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#8a8a8a" }] },
  { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#373737" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#3c3c3c" }] },
  { featureType: "road.highway.controlled_access", elementType: "geometry", stylers: [{ color: "#4e4e4e" }] },
  { featureType: "road.local", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
  { featureType: "transit", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#000000" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#3d3d3d" }] },
];

const GoogleMapInner = memo(() => {
  const [isClient, setIsClient] = useState(false);
  const [apiLoaded, setApiLoaded] = useState(false);
  const [selectedPoi, setSelectedPoi] = useState<Poi | null>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleApiLoad = useCallback(() => {
    setApiLoaded(true);
  }, []);

  const handleSelectPoi = useCallback((poi: Poi) => {
    setSelectedPoi(poi);
  }, []);

  if (!isClient) {
    return <MapLoading />;
  }

  return (
    <MapErrorBoundary>
      <APIProvider
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
        onLoad={handleApiLoad}
      >
        <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[800px] rounded overflow-hidden">
          <Map
            defaultZoom={9}
            defaultCenter={{ lat: 51.1, lng: 22.7 }}
            onCameraChanged={(ev: MapCameraChangedEvent) => {}}
            className="w-full h-full"
            styles={resolvedTheme === "light" ? undefined : darkModeStyles}
          >
            {apiLoaded && <PoiMarkers pois={locations} onSelectPoi={handleSelectPoi} />}
          </Map>

          {/* Custom overlay — centered on map */}
          {selectedPoi && (
            <div
              className="absolute inset-0 z-10 flex items-center justify-center bg-black/30"
              onClick={() => setSelectedPoi(null)}
            >
              <div
                className="w-[280px] sm:w-[380px] md:w-[480px] lg:w-[560px] bg-neutral-900 rounded-xl overflow-hidden shadow-2xl shadow-black/60 border border-neutral-700 animate-infowindow-grow"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedPoi(null)}
                  className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/75 border border-white/30 flex items-center justify-center hover:bg-accent hover:border-accent transition-colors"
                  aria-label="Zamknij"
                >
                  <span className="text-white text-sm font-bold">✕</span>
                </button>
                <div className="relative w-full pb-[56.25%] overflow-hidden">
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={selectedPoi.src}
                    title={selectedPoi.name}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
                <div className="px-3 py-2 sm:px-4 sm:py-3">
                  <p className="text-sm sm:text-base font-semibold text-white leading-snug">{selectedPoi.name}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </APIProvider>
    </MapErrorBoundary>
  );
});

GoogleMapInner.displayName = 'GoogleMapInner';
const GoogleMap = () => {
  return (
    <div className="flex flex-col mx-auto h-auto w-full items-center sm:max-w-5xl md:max-w-6xl border border-neutral-700 rounded-lg shadow-sm">
      <Suspense fallback={<MapLoading />}>
        <GoogleMapInner />
      </Suspense>
    </div>
  );
};

export default GoogleMap;
