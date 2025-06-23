import "./place-card.scss";
import { Place } from "@/types";
import { MapPin, Shop } from "iconoir-react";
import Image from "next/image";
import img from "@/assets/images/nice.jpg";
import Link from "next/link";
import { useSlugify } from "@/hooks/commons/use-slugify";
interface PlaceCardProps {
  place?: Place;
  index?: number;
}

export default function PlaceCard({ place, index }: PlaceCardProps) {
  if (!place) {
    return null;
  }

  const nameSlug = useSlugify(place.name);
  return (
    <Link href={`/lieux/${place.id}/${nameSlug}`}>
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
                <span>{place.type}</span>
              </div>
            </div>
            <div className="place-card-events">
              {place.eventsCount} évènement{place.eventsCount > 1 ? "s" : ""}
            </div>
            <div className="place-card-link">Voir le lieu</div>
          </div>
        </div>
      </div>
    </Link>
  );
}
