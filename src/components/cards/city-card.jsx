import { ArrowUpRight } from "iconoir-react";
import Image from "next/image";
import niceImage from "@/assets/images/nice.jpg";

export default function CityCard({ city, events }) {
  return (
    <div className="city-card">
      <div className="flex items-center">
        <p className="title">{city}</p>
        <Image src={niceImage} alt={`${city} image`} className="city-img" />
      </div>
      <div className="flex items-center justify-between gap-4 text-[var(--primary-green)]">
        <p>{events} événements</p>
        <ArrowUpRight className="icon" />
      </div>
    </div>
  );
}
