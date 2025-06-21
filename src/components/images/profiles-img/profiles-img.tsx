import Image from "next/image";
import profilePicture from "@/assets/images/profile-pic.jpg";
import { StaticImageData } from "next/image";

interface ProfilesImgProps {
  images?: (StaticImageData | string)[];
  totalCount?: number;
}

export default function ProfilesImg({
  images = [profilePicture, profilePicture, profilePicture],
  totalCount,
}: ProfilesImgProps) {
  const visibleImages = images.slice(0, 3);
  const actualTotalCount = totalCount ?? images.length;

  const remaining =
    actualTotalCount > visibleImages.length
      ? actualTotalCount - visibleImages.length
      : 0;

  if (totalCount === 0 || actualTotalCount === 0) {
    return <p className="text-primary-600 font-medium ">Aucun participant</p>;
  }

  return (
    <div className="flex items-center gap-2 relative">
      <div className="flex -space-x-2">
        {visibleImages.map((src, index) => (
          <Image
            key={index}
            src={src}
            alt={`Profile picture ${index + 1}`}
            className="profile-pic-sm"
          />
        ))}
      </div>

      {remaining > 0 && (
        <p className="text-primary-600 font-bold text-sm">+ {remaining}</p>
      )}
    </div>
  );
}
