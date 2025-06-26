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
  return (
    <Link href={href}>
      <div className="organizer-photo-card">
        <div className="photo-card-image">
        <Image src={img} alt={name} />
        </div>
        <div className="photo-card-name">{name}</div>
      </div>
    </Link>
  );
}