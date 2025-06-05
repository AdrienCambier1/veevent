import { ArrowUpRight } from "iconoir-react";
import Image from "next/image";
import niceImage from "@/assets/images/nice.jpg";
import "./city-card.scss";
import React from "react";
import Link from "next/link";

interface CityCardProps {
  city: string;
  events?: number;
  isCard?: boolean;
}

export default function CityCard({
  city,
  events,
  isCard = true,
}: CityCardProps) {
  return (
    <Link
      href={`/cities/${city.toLocaleLowerCase()}`}
      className={`city-card group ${isCard ? "is-card" : ""}`}
    >
      <div className="flex items-center">
        <p className="title">{city}</p>
        <Image src={niceImage} alt={`${city} image`} className="city-img" />
      </div>
      {events && events > 0 && (
        <div className="flex items-center justify-between gap-2 text-secondary-400">
          <p>{events} événements</p>
          <ArrowUpRight className="group-hover:-translate-y-1 transition icon" />
        </div>
      )}
    </Link>
  );
}
