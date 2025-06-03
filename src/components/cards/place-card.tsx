import "@/assets/styles/place-card.scss";
import { Place } from "@/types";
import { MapPin, Shop } from "iconoir-react";
import Image from "next/image";
import img from "@/assets/images/nice.jpg";
interface PlaceCardProps {
  place?: Place;
  index?: number;
}

export default function PlaceCard({ place, index }: PlaceCardProps) {
  if (!place) {
    return null;
  }
  return (
    <div className="place-card">
      {index && <div className="number">{index}</div>}
      <div className="place-card-container">
        <div className="place-card-image">
          <Image src={img} alt={place.name} />
        </div>
        <div className="place-card-content">
          <div className="place-card-name">{place.name}</div>
          <div className="place-card-specs">
            <div className="place-card-specs-item">
              <MapPin />
              <span>{place.address}</span>
            </div>
            <div className="place-card-specs-item">
              <Shop />
              <span>{place.category}</span>
            </div>
          </div>
          <div className="place-card-events">
            {place.eventsCount} évènement{place.eventsCount > 1 ? "s" : ""}
          </div>
          <div className="place-card-link">Voir le lieu</div>
        </div>
      </div>
    </div>
  );
}
