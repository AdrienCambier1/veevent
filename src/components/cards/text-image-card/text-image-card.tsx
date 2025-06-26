import { ArrowUpRight } from "iconoir-react";
import Image from "next/image";
import Link from "next/link";
import "./text-image-card.scss";
import img from "@/assets/images/nice.jpg"

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
    <Link
      href={href}
      className={`text-image-card group ${isCard ? "is-card" : ""}`}
    >
      <div className="flex items-center">
        <p className="title">{title}</p>
        <Image src={img} alt={`${title} image`} />
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
