import Link from "next/link";
import Image from "next/image";
import "./organizer-photo-card.scss";
import img from "@/assets/images/nice.jpg";

interface OrganizerPhotoCardProps {
    name: string;
    imageUrl: string;
    href: string;
}

export default function OrganizerPhotoCard({name, imageUrl, href}: OrganizerPhotoCardProps) {
  const imageToShow = imageUrl || img;
  return (
    <Link href={href}>
      <div className="organizer-photo-card">
        <div className="photo-card-image">
          <Image 
            src={imageToShow} 
            alt={name} 
            width={200}
            height={200}
            className="rounded-full object-cover"
          />
        </div>
        <div className="photo-card-name">{name}</div>
      </div>
    </Link>
  );
}