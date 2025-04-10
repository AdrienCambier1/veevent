import profilPicture from "@/assets/images/profil-pic.jpg";
import Image from "next/image";
import RatingStar from "./rating-stars";
import Link from "next/link";
import { NavArrowRight } from "iconoir-react";

export default function OrganiserCard({
  name,
  id,
  note,
  subscribers,
  events,
  href = "",
}) {
  return (
    <div className="white-card p-4 flex gap-4">
      <Image
        src={profilPicture}
        alt="Profil picture"
        className="rounded-full object-cover w-20 h-20"
      />
      <div className="flex flex-col gap-4 w-full">
        <h3 className="text-[var(--secondary-blue)]">{name}</h3>
        <div className="flex items-center gap-2">
          <p className="blue-text">{id}</p>
          <RatingStar note={note} />
        </div>
        <p>
          {subscribers} abonnés | {events} événements
        </p>
        <div className="w-full flex justify-end">
          <Link href={href} className="secondary-btn">
            <span>Voir le profil</span>
            <NavArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
}
