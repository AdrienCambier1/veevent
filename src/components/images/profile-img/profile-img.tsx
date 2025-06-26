import Image from "next/image";
import profilePicture from "@/assets/images/profile-pic.jpg";
import RatingStars from "@/components/commons/rating-stars/rating-stars";

type SizeOption = "base" | "sm" | "xs";

interface ProfileImgProps {
  imageUrl?: string | null;
  name: string;
  note?: number | null;
  size?: SizeOption;
}

const sizeMap: Record<SizeOption, string> = {
  base: "icon",
  sm: "icon-small",
  xs: "icon-very-small",
};

export default function ProfileImg({
  imageUrl,
  name,
  note,
  size = "base",
}: ProfileImgProps) {
  const iconSize = sizeMap[size];

  return (
    <div className="flex items-center gap-2">
      <Image
        src={profilePicture}
        alt="Profile picture"
        className={`profile-pic ${iconSize}`}
      />

      {note !== null && (
        <div className="flex flex-col justify-center">
          <p className="text-base font-medium">{name}</p>
          <RatingStars note={note} size="xs" />
        </div>
      )}
    </div>
  );
}
