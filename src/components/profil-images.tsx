import Image from "next/image";
import profilPicture from "@/assets/images/profil-pic.jpg";
import { StaticImageData } from "next/image";

interface ProfilImagesProps {
  images?: (StaticImageData | string)[];
  totalCount?: number;
}

export default function ProfilImages({
  images = [profilPicture, profilPicture, profilPicture],
  totalCount,
}: ProfilImagesProps) {
  const visibleImages = images.slice(0, 3);
  const actualTotalCount = totalCount ?? images.length;

  const remaining =
    actualTotalCount > visibleImages.length
      ? actualTotalCount - visibleImages.length
      : 0;

  return (
    <div className="flex items-center gap-2 relative">
      <div className="flex -space-x-2">
        {visibleImages.map((src, index) => (
          <Image
            key={index}
            src={src}
            alt={`Profil picture ${index + 1}`}
            className="profil-pic-sm"
          />
        ))}
      </div>

      {remaining > 0 && (
        <p className="text-primary-600 font-bold text-sm">+ {remaining}</p>
      )}
    </div>
  );
}
