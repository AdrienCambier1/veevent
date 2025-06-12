import ProfileImg from "@/components/images/profile-img/profile-img";
import "./event-head.scss";
import { MapPin, Calendar, Bookmark } from "iconoir-react";
import ThemeTag from "@/components/tags/theme-tag/theme-tag";

interface EventHeadProps {
  title: string;
  location: string;
  date: string;
  price: number;
  interested?: number;
}

export default function EventHead({
  title,
  location,
  date,
  price,
  interested,
}: EventHeadProps) {
  return (
    <section className="event-head wrapper">
      <ThemeTag category="music" onEventCard={true} /> <h1>{title}</h1>
      <ProfileImg name="Marie N." note={4} />
      <div className="flex flex-col gap-2">
        <div className="info">
          <MapPin className="icon-small" />
          <span>{location}</span>
        </div>
        <div className="info">
          <Calendar className="icon-small" />
          <span>{date}</span>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="primary-btn flex-1">
          <span>À partir de {price}€</span>
        </button>
        <button className="secondary-btn flex-1">
          <Bookmark />
          <span>Intéressé.e</span>
        </button>
      </div>
      {interested && (
        <p className="interested">
          <span>{interested}</span> sont intéressé·e·s
        </p>
      )}
    </section>
  );
}
