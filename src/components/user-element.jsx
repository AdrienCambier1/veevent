import profilPicture from "@/assets/images/profil-pic.jpg";
import { Trash, UserStar } from "iconoir-react";
import Image from "next/image";

export default function UserElement({ name, id, canEdit = false }) {
  return (
    <div className="flex items-center gap-4 w-full">
      <Image
        src={profilPicture}
        alt="Profil picture"
        className="profil-pic-lg"
      />
      <div className="w-full flex items-center justify-between gap-2 py-3 border-b border-[var(--secondary-border-col)]">
        <div className="flex flex-col gap-2">
          <p className="dark-text">{name}</p>
          <p className="blue-text truncate">{id}</p>
        </div>
        {canEdit && (
          <button className="trash-btn">
            <Trash />
          </button>
        )}
      </div>
    </div>
  );
}
