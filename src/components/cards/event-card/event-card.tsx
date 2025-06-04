import niceImage from "@/assets/images/nice.jpg";
import ProfilImages from "@/components/images/profil-images/profil-images";
import ProfilImg from "@/components/images/profil-img/profil-img";
import ThemeTag from "@/components/tags/theme-tag/theme-tag";
import { ArrowUpRight, Bookmark, Calendar, MapPin } from "iconoir-react";
import Image from "next/image";
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

const themes: string[] = [
  "live_music",
  "cinema",
  "sport",
  "education",
  "sponsored",
];

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
        <div className="theme-tags">
          {themes.map((theme, index) => {
            return <ThemeTag key={index} category={theme} onEventCard={true} />;
          })}
        </div>
        <Image src={niceImage} className="banner" alt="Event image" />
      </div>
      <div className="flex flex-col gap-2 p-2">
        <div className="flex items-center justify-between gap-2">
          <div className="title">{title}</div>
          <Bookmark className="icon" />
        </div>
        <ProfilImg name="Marie N." note={4} />
        <div className="flex flex-wrap gap-2">
          <div className="info">
            <MapPin className="icon-small" />
            <span>{location}</span>
          </div>
          <div className="info">
            <Calendar className="icon-small" />
            <span>{date}</span>
          </div>
        </div>
        {!minify && description && <p className="description">{description}</p>}
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
