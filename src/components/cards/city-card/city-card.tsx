import { ArrowUpRight } from "iconoir-react";
import Image from "next/image";
import niceImage from "@/assets/images/nice.jpg";
import "./city-card.scss";
import React from "react";

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
    <div className={`city-card ${isCard ? "is-card" : ""}`}>
      <div className="flex items-center">
        <p className="title">{city}</p>
        <Image src={niceImage} alt={`${city} image`} className="city-img" />
      </div>
      {events && events > 0 && (
        <div className="flex items-center justify-between gap-4 text-secondary-400">
          <p>{events} événements</p>
          <ArrowUpRight className="icon" />
        </div>
      )}
    </div>
  );
}
