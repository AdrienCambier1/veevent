import Image from "next/image";
import { User } from "iconoir-react";
import { useState } from "react";

interface ProfileImageProps {
  src?: string | null;
  alt?: string;
  size?: "xs" | "sm" | "base" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  xs: "w-8 h-8",
  sm: "w-10 h-10",
  base: "w-16 h-16",
  lg: "w-20 h-20",
  xl: "w-24 h-24",
};

const iconSizes = {
  xs: "w-4 h-4",
  sm: "w-5 h-5",
  base: "w-8 h-8",
  lg: "w-10 h-10",
  xl: "w-12 h-12",
};

export default function ProfileImage({
  src,
  alt = "Profile picture",
  size = "base",
  className = "",
}: ProfileImageProps) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  // Si pas d'image ou erreur, afficher l'icône par défaut
  if (!src || imageError) {
    return (
      <div
        className={`${sizeClasses[size]} bg-primary-100 flex items-center justify-center rounded-full ${className}`}
      >
        <User className={`${iconSizes[size]} text-primary-600`} />
      </div>
    );
  }

  // Afficher l'image de profil
  return (
    <Image
      src={src}
      alt={alt}
      width={parseInt(sizeClasses[size].split(" ")[0].replace("w-", "")) * 4} // Convertir Tailwind en pixels
      height={parseInt(sizeClasses[size].split(" ")[1].replace("h-", "")) * 4}
      className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
      onError={handleImageError}
    />
  );
} 