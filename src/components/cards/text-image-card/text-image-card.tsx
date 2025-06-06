import { ArrowUpRight } from "iconoir-react";
import Image from "next/image";
import Link from "next/link";
import "./text-image-card.scss";

interface TextImageCardProps {
  title: string;
  image: string;
  href: string;
  subtitle?: string;
  isCard?: boolean;
}

export default function TextImageCard({
  title,
  image,
  href,
  subtitle,
  isCard = true,
}: TextImageCardProps) {
  return (
    <Link href={href} className={`city-card group ${isCard ? "is-card" : ""}`}>
      <div className="flex items-center">
        <p className="title">{title}</p>
        <Image src={image} alt={`${title} image`} className="city-img" />
      </div>
      {subtitle && (
        <div className="flex items-center justify-between gap-2 text-secondary-400">
          <p>{subtitle}</p>
          <ArrowUpRight className="group-hover:-translate-y-1 transition icon" />
        </div>
      )}
    </Link>
  );
}
