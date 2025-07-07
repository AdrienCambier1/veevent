import Link from "next/link";
import Image from "next/image";
import niceImage from "@/assets/images/nice.jpg";
import { ArrowUpRight } from "iconoir-react";
import "./trending-card.scss";
import { Event } from "@/types";

interface TrendingCardProps {
  event: Event;
}

const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // Supprimer les caractères spéciaux
      .replace(/\s+/g, "-") // Remplacer les espaces par des tirets
      .replace(/-+/g, "-") // Remplacer les tirets multiples par un seul
      .trim(); // Supprimer les espaces au début et à la fin
  };

export default function TrendingCard({
  event,
}: TrendingCardProps) {
  const imageToShow = event.imageUrl || niceImage;
  return (
    <Link href={`/evenements/${event.id}/${slugify(event.name)}`} className="trending-card group">
      <Image
        src={imageToShow}
        alt="Trending image"
        fill
        priority
      />

      <div className="content">
        <div className="flex justify-between items-center">
          <p className="font-semibold">{event.organizer?.firstName + " " + event.organizer?.lastName || ""}</p>
          <p className="font-extrabold">{event.cityName || ""}</p>
        </div>

        <div className="flex items-end gap-8">
          <p className="text-lg font-semibold flex-1">{event.description.length > 50
              ? event.description.substring(0, 50) + "..."
              : event.description}</p>
          <ArrowUpRight className="group-hover:-translate-y-1 transition icon" />
        </div>
      </div>

      <div className="gradient blue" />
      <div className="gradient black" />
    </Link>
  );
}
