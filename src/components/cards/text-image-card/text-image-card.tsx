import { ArrowUpRight } from "iconoir-react";
import Image from "next/image";
import Link from "next/link";
import "./text-image-card.scss";
import img from "@/assets/images/nice.jpg";

interface TextImageCardProps {
  title: string;
  image: string;
  href: string;
  subtitle?: string;
  isCard?: boolean;
  onClick?: () => void;
}

export default function TextImageCard({
  title,
  image,
  href,
  subtitle,
  isCard = true,
  onClick,
}: TextImageCardProps) {
  const imageToShow = image || img;
  return (
    <Link
      href={href}
      className={`text-image-card group ${isCard ? "is-card" : ""}`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <p className="title">{title}</p>
        <Image
          src={imageToShow}
          alt={`${title} image`}
          width={100}
          height={100}
          priority
        />
      </div>
      {subtitle && isCard && (
        <div className="flex items-center justify-between gap-2 text-secondary-400">
          <p>{subtitle}</p>
          <ArrowUpRight className="group-hover:-translate-y-1 transition icon" />
        </div>
      )}
    </Link>
  );
}
