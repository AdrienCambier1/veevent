import Image from "next/image";
import profilPicture from "@/assets/images/profil-pic.jpg";

export default function ProfilImages({
  images = [profilPicture, profilPicture, profilPicture],
  totalCount = images.length,
}) {
  const visibleImages = images.slice(0, 3);

  const remaining =
    totalCount > visibleImages.length ? totalCount - visibleImages.length : 0;

  return (
    <div className="flex items-center gap-2 relative">
      <div className="flex -space-x-3">
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
        <p className="blue-text font-bold !text-xs">+ {remaining}</p>
      )}
    </div>
  );
}
