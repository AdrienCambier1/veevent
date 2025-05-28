import { Bookmark, MapPin, Calendar } from "iconoir-react";
import Image from "next/image";
import niceImage from "@/assets/images/nice.jpg";
import ThemeTags from "../theme-tags";
import ProfilImages from "../profil-images";
import ProfilImg from "../profil-img";

export default function EventCard({
  title,
  description,
  location,
  date,
  price,
  imageUrl,
}) {
  return (
    <div className="event-card">
      <div className="image-container">
        <ThemeTags theme={["musique", "sponsorisé", "sport", "learning"]} />
        <Image src={niceImage} className="banner" alt="Event image" />
      </div>
      <div className="flex flex-col gap-2 p-2">
        <div className="flex items-center justify-between gap-2">
          <h3>{title}</h3>
          <Bookmark className="logo" />
        </div>
        <ProfilImg name="Marie N." note={4} />
        <div className="flex flex-wrap gap-2">
          <div className="tag">
            <MapPin />
            <span>{location}</span>
          </div>
          <div className="tag">
            <Calendar />
            <span>{date}</span>
          </div>
        </div>
        <p className="line-clamp-2">{description}</p>
        <div className="flex items-center justify-between gap-2">
          <ProfilImages totalCount={8} />
          <p className="price">
            À partir de <span>{price} €</span>
          </p>
        </div>
      </div>
    </div>
  );
}
