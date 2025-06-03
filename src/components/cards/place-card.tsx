import "@/assets/styles/place-card.scss";
import Image from "next/image";
import img from "@/assets/images/nice.jpg";
import { MapPin, Shop } from "iconoir-react";

interface PlaceCardProps {
  number?: number;
  location: string;
  category: string;
  name: string;
}

export default function PlaceCard({
  number,
  location,
  category,
  name,
}: PlaceCardProps) {
  return (
    <div className="place-card">
      {number && <div className="number">{number}</div>}
      <div className="place-card-container">
        <div className="place-card-image">
          <Image src={img} alt={name} />
        </div>
        <div className="place-card-content">
          <div className="place-card-name">{name}</div>
          <div className="place-card-specs">
            <div className="place-card-specs-item">
              <MapPin />
              <span>{location}</span>
            </div>
            <div className="place-card-specs-item">
              <Shop />
              <span>{category}</span>
            </div>
          </div>
          <div className="place-card-events">24 évènements</div>
          <div className="place-card-link">Voir le lieu</div>
        </div>
      </div>
    </div>
  );
}
