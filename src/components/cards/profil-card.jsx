import profilPicture from "@/assets/images/profil-pic.jpg";
import RatingStar from "@/components/rating-stars";
import Image from "next/image";

export default function ProfilCard({ name, id, note }) {
  return (
    <div className="bg-white dark-shadow w-full max-w-[500px] absolute -translate-y-1/2 rounded-full h-fit p-4 flex gap-4 items-center">
      <Image
        src={profilPicture}
        alt="Profil picture"
        className="profil-pic-xl"
      />
      <div className="flex flex-col gap-2 overflow-hidden">
        <h2 className="truncate">{name}</h2>
        <div className="flex gap-2 items-center">
          <p className="blue-text">{id}</p>
          <RatingStar note={note} />
        </div>
      </div>
    </div>
  );
}
