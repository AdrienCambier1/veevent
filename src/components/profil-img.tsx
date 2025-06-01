import Image from "next/image";
import profilPicture from "@/assets/images/profil-pic.jpg";
import RatingStars from "./rating-stars";

interface ProfilImgProps {
  imageUrl?: string;
  name: string;
  note: number;
}

export default function ProfilImg({ imageUrl, name, note }: ProfilImgProps) {
  return (
    <div className="flex items-center gap-2">
      <Image
        src={imageUrl || profilPicture}
        alt={`Profile picture of ${name}`}
        className="profil-pic"
      />
      <div className="flex flex-col justify-center">
        <p className="text-base font-medium">{name}</p>
        <RatingStars note={note} size="xs" />
      </div>
    </div>
  );
}
