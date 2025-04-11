import profilPicture from "@/assets/images/profil-pic.jpg";
import Image from "next/image";
import RatingStar from "../rating-stars";
import Link from "next/link";
import { UserStar } from "iconoir-react";

export default function ReviewCard({ name, note, date, review, event }) {
  return (
    <div className="white-card p-4 flex gap-4">
      <Image
        src={profilPicture}
        alt="Profil picture"
        className="profil-pic-xl"
      />
      <div className="flex flex-col gap-4 overflow-hidden">
        <h3 className="text-[var(--secondary-blue)]">{name}</h3>
        <div className="flex flex-col">
          <p className="dark-text">Note attribuée</p>
          <RatingStar note={note} />
        </div>
        <p className="blue-text">{date}</p>
        <p>{review}</p>
        <Link href="" className="green-tag">
          <UserStar />
          <span>{event}</span>
        </Link>
      </div>
    </div>
  );
}
