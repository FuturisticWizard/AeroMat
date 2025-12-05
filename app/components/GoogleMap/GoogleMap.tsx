"use client";
import React, { useEffect, useState, useRef, useCallback, Suspense, memo } from "react";
import dynamic from "next/dynamic";
import {
  APIProvider,
  Map,
  useMap,
  MapCameraChangedEvent,
  InfoWindow,
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
];
const PoiMarkers = memo((props: { pois: Poi[] }) => {
  const map = useMap();
  const [markers, setMarkers] = useState<{ [key: string]: google.maps.Marker }>({});
  const [selectedPoi, setSelectedPoi] = useState<Poi | null>(null);
  const clusterer = useRef<MarkerClusterer | null>(null);
  const [infoWindowOpen, setInfoWindowOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInfoWindowClose = useCallback(() => {
    setInfoWindowOpen(false);
    setSelectedPoi(null);
  }, []);

  // Create markers using native Google Maps API
  useEffect(() => {
    if (!map) return;

    // Clear existing markers
    Object.values(markers).forEach(marker => marker.setMap(null));

    const newMarkers: { [key: string]: google.maps.Marker } = {};

    props.pois.forEach((poi) => {
      const marker = new google.maps.Marker({
        position: poi.location,
        map: map,
        title: poi.name,
        icon: {
          url: "/pngs/aeromatka-refactored.png",
          scaledSize: new google.maps.Size(40, 40),
        },
      });

      marker.addListener("click", () => {
        map.panTo(poi.location);
        setSelectedPoi(poi);
        setInfoWindowOpen(true);
      });

      newMarkers[poi.key] = marker;
    });

    setMarkers(newMarkers);

    // Initialize clusterer
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

  return (
    <>
      {selectedPoi && infoWindowOpen && (
        <InfoWindow position={selectedPoi.location} onClose={handleInfoWindowClose}>
          <div className="w-full max-w-sm sm:max-w-md md:max-w-lg bg-neutral-900 p-4 rounded-lg">
            <p className="text-lg font-bold mb-2 text-white">{selectedPoi.name}</p>
            {isLoading ? (
              <div className="animate-pulse bg-neutral-800 w-full h-48 rounded">Ładowanie...</div>
            ) : (
              <div className="relative w-full h-0 pb-[56.25%] overflow-hidden rounded border border-neutral-700">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={selectedPoi.src}
                  title={selectedPoi.name}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            )}
          </div>
        </InfoWindow>
      )}
    </>
  );
});

// Add display name for debugging
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

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleApiLoad = useCallback(() => {
    setApiLoaded(true);
  }, []);

  if (!isClient) {
    return <MapLoading />;
  }

  return (
    <MapErrorBoundary>
      <APIProvider
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyAR7h_0EaMtlx3FtElu7aVAL3z0VX5d1hg"}
        onLoad={handleApiLoad}
      >
        <div className="w-full h-[400px] sm:h-[500px] lg:h-[800px] rounded overflow-hidden">
          <Map
            defaultZoom={11}
            defaultCenter={{ lat: 51.2469, lng: 22.5833 }}
            onCameraChanged={(ev: MapCameraChangedEvent) => {}}
            className="w-full h-full"
            styles={darkModeStyles}
          >
            {apiLoaded && <PoiMarkers pois={locations} />}
          </Map>
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
