import profilPicture from "@/assets/images/profil-pic.jpg";
import RatingStar from "@/components/rating-stars";
import Image from "next/image";
import { UserStar } from "iconoir-react";

export default function ProfilCard({ name, id, note, className, isOrganiser }) {
  return (
    <div
      className={`bg-white dark-shadow w-full max-w-[600px] absolute -translate-y-1/2 rounded-full h-fit p-4 flex gap-4 items-center ${className}`}
    >
      <Image
        src={profilPicture}
        alt="Profil picture"
        className="profil-pic-xl"
      />
      <div className="flex flex-col gap-2 overflow-hidden">
        <h2 className="truncate">{name}</h2>
        <div className="flex items-center gap-2">
          {isOrganiser && (
            <div className="green-tag !hidden sm:!flex">
              <span>Organisateur</span>
              <UserStar />
            </div>
          )}
          <div className="flex flex-col">
            <p className="blue-text">{id}</p>
            <RatingStar note={note} />
          </div>
        </div>
      </div>
    </div>
  );
}
