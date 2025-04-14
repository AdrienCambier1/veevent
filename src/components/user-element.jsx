import profilPicture from "@/assets/images/profil-pic.jpg";
import { Trash, UserStar } from "iconoir-react";
import Image from "next/image";

export default function UserElement({
  name,
  id,
  type = "participant",
  canEdit = false,
}) {
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
          <div className="flex items-center gap-2">
            {type === "organiser" && (
              <>
                <div className="green-tag !hidden sm:!flex">
                  <span>Organisateur</span>
                  <UserStar />
                </div>
                <div className="green-tag sm:!hidden !p-1.5">
                  <UserStar />
                </div>
              </>
            )}
            <p className="blue-text truncate">{id}</p>
          </div>
        </div>
        <button className="trash-btn">
          <Trash />
        </button>
      </div>
    </div>
  );
}
