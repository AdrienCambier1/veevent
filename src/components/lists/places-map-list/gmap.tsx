import { useCallback, useEffect, useRef, useState } from "react";

import {
  AdvancedMarker,
  APIProvider,
  Map,
  Pin,
  useMap,
} from "@vis.gl/react-google-maps";

import type { Marker } from "@googlemaps/markerclusterer";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { Place } from "@/types";

interface GmapsProps {
  locations: Place[];
  onMarkerClick?: (placeId: number) => void;
}

export default function Gmaps({ locations, onMarkerClick }: GmapsProps) {
  const defaultCenter =
    locations.length > 0
      ? {
          lat: locations[0].location.latitude ?? 0,
          lng: locations[0].location.longitude ?? 0,
        }
      : { lat: 0, lng: 0 };

  return (
    <div className="w-full h-[250px] md:h-[500px] rounded-[var(--vv-border-radius)] overflow-hidden border-2 border-gray-300">
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
        <Map
          defaultZoom={13}
          defaultCenter={defaultCenter}
          mapId="da37f3254c6a6d1c"
          style={{ width: "100%", height: "100%" }}
        >
          <PoiMarkers pois={locations} onMarkerClick={onMarkerClick} />
        </Map>
      </APIProvider>
    </div>
  );
}

const PoiMarkers = (props: {
  pois: Place[];
  onMarkerClick?: (placeId: number) => void;
}) => {
  const map = useMap();
  const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});
  const clusterer = useRef<MarkerClusterer | null>(null);

  const handleClick = useCallback(
    (placeId: number) => {
      return (ev: google.maps.MapMouseEvent) => {
        if (!map) return;
        if (!ev.latLng) return;
        map.panTo(ev.latLng);
        // Remonter l'information du clic
        props.onMarkerClick?.(placeId);
      };
    },
    [map, props]
  );

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

  // Ajuster le zoom pour voir tous les marqueurs
  useEffect(() => {
    if (!map || props.pois.length === 0) return;

    const bounds = new google.maps.LatLngBounds();

    // Ajouter tous les points à la bounds
    props.pois.forEach((poi) => {
      bounds.extend(
        new google.maps.LatLng(
          poi.location.latitude ?? 0,
          poi.location.longitude ?? 0
        )
      );
    });

    // Ajuster la carte pour afficher tous les points
    map.fitBounds(bounds);

    // Optionnel : définir un zoom maximum pour éviter un zoom trop important avec un seul marqueur
    const listener = google.maps.event.addListener(
      map,
      "bounds_changed",
      () => {
        if (map.getZoom() && map.getZoom()! > 15) {
          map.setZoom(15);
        }
        google.maps.event.removeListener(listener);
      }
    );
  }, [map, props.pois]);

  const setMarkerRef = (marker: Marker | null, key: number) => {
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
      {props.pois.map((poi: Place, index: number) =>
        poi.location.latitude == null ||
        poi.location.longitude == null ? null : (
          <AdvancedMarker
            key={poi.id}
            position={{
              lat: poi.location.latitude ?? 0,
              lng: poi.location.longitude ?? 0,
            }}
            ref={(marker) => setMarkerRef(marker, poi.id)}
            clickable={true}
            onClick={handleClick(poi.id)}
          >
            <Pin
              background={"var(--secondary-400)"}
              glyphColor={"var(--primary-600)"}
              borderColor={"var(--primary-600)"}
              glyph={props.pois.length === 1 ? "" : `${index + 1}`}
            />
          </AdvancedMarker>
        )
      )}
    </>
  );
};
