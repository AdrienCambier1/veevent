import { Bookmark, MapPin, Calendar, ArrowUpRight } from "iconoir-react";
import Image from "next/image";
import niceImage from "@/assets/images/nice.jpg";
import ThemeTags from "@/components/tags/theme-tags/theme-tags";
import ProfilImages from "@/components/images/profil-images/profil-images";
import ProfilImg from "@/components/images/profil-img/profil-img";
import "./event-card.scss";

interface EventCardProps {
  title: string;
  description?: string;
  location: string;
  date: string;
  price: number;
  minify?: boolean;
  imageUrl?: string; // Optional since it's not being used currently
}

export default function EventCard({
  title,
  description,
  location,
  date,
  price,
  minify,
  imageUrl,
}: EventCardProps) {
  return (
    <div className={`event-card ${minify ? "minify" : ""}`}>
      <div className="image-container">
        <ThemeTags theme={["musique", "sponsorisé", "sport", "learning"]} />
        <Image src={niceImage} className="banner" alt="Event image" />
      </div>
      <div className="flex flex-col gap-2 p-2">
        <div className="flex items-center justify-between gap-2">
          <div className="title">{title}</div>
          <Bookmark className="icon" />
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
        {!minify && description && (
          <p className="line-clamp-2">{description}</p>
        )}
        <div className="flex items-center justify-between gap-2">
          {!minify && <ProfilImages totalCount={8} />}
          <p className="price">
            À partir de <span>{price} €</span>
          </p>
          {minify && <ArrowUpRight className="text-lg" />}
        </div>
      </div>
    </div>
  );
}
