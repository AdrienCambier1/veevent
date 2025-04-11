import Link from "next/link";
import Image from "next/image";
import niceImage from "@/assets/images/nice.jpg";
import { ArrowUpRightCircleSolid } from "iconoir-react";

export default function CityCard({ city, events, changeCity }) {
  return (
    <Link
      href="/activities/events"
      className="city-card group"
      onClick={changeCity}
    >
      <Image src={niceImage} alt="City image" fill className="object-cover" />

      <div className="p-4 h-full w-full flex flex-col gap-24 z-10">
        <div className="flex justify-between items-center">
          <p>{events} événements</p>
          <p className="!font-extrabold">{city}</p>
        </div>

        <div className="flex items-end gap-8">
          <p className="!text-lg flex-1 text-start">
            Découvrez les événements de {city}
          </p>
          <ArrowUpRightCircleSolid className="group-hover:-translate-y-1 transition" />
        </div>
      </div>

      <div className="absolute bg-gradient-to-tr from-transparent to-[var(--secondary-blue)] opacity-50 h-full w-full"></div>
      <div className="absolute bg-gradient-to-bl from-transparent to-black opacity-50 h-full w-full"></div>
    </Link>
  );
}
