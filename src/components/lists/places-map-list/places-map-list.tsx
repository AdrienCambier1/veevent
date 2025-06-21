import PlaceCard from "@/components/cards/place-card/place-card";
import Gmaps from "./gmap";
import { Place } from "@/types";
import img from "@/assets/images/nice.jpg";
import { useRef, useState } from "react";
import "./places-map-list.scss";

// const locations: Place[] = [
//   {
//     id: "1",
//     name: "Bar des artistes",
//     address: "Antibes",
//     category: "Bar",
//     location: {
//       lat: 43.5803,
//       lng: 7.1251,
//     },
//     imageUrl: img,
//     eventsCount: 5,
//   },
//   {
//     id: "2",
//     name: "Maison 13",
//     address: "Cannes",
//     category: "Théâtre",
//     location: {
//       lat: 43.5511,
//       lng: 7.0128,
//     },
//     imageUrl: img,
//     eventsCount: 3,
//   },
//   {
//     id: "3",
//     name: "Scène 55",
//     address: "Mougins",
//     category: "Salle de concert",
//     location: {
//       lat: 43.5861,
//       lng: 6.9885,
//     },
//     imageUrl: img,
//     eventsCount: 8,
//   },
// ];

export interface PlaceMapListProps {
  locations: Place[];
}

export default function PlacesMapList({ locations }: PlaceMapListProps) {
  const [selectedPlaceId, setSelectedPlaceId] = useState<number | null>(null);
  const placeRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleMarkerClick = (placeId: number) => {
    setSelectedPlaceId(placeId);
  };

  const setPlaceRef = (placeId: number, ref: HTMLDivElement | null) => {
    placeRefs.current[placeId] = ref;
  };

  return (
    <div className="places-map-list">
      <Gmaps locations={locations} onMarkerClick={handleMarkerClick} />
      <div className="places-list">
        {locations.map((place, index) => (
          <div
            key={place.id}
            ref={(ref) => setPlaceRef(place.id, ref)}
            className={
              selectedPlaceId === place.id
                ? "ring-2 ring-blue-500 rounded-[var(--vv-border-radius)]"
                : ""
            }
          >
            <PlaceCard index={index + 1} place={place} />
          </div>
        ))}
      </div>
    </div>
  );
}
