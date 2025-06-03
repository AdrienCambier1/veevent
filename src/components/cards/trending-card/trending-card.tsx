import Link from "next/link";
import Image from "next/image";
import niceImage from "@/assets/images/nice.jpg";
import { ArrowUpRightCircleSolid } from "iconoir-react";
import "./trending-card.scss";

interface TrendingCardProps {
  organizer: string;
  city: string;
  description: string;
}

export default function TrendingCard({
  organizer,
  city,
  description,
}: TrendingCardProps) {
  return (
    <Link href="#" className="trending-card group">
      <Image src={niceImage} alt="Trending image" fill />

      <div className="content">
        <div className="flex justify-between items-center">
          <p className="font-semibold">{organizer}</p>
          <p className="font-extrabold">{city}</p>
        </div>

        <div className="flex items-end gap-8">
          <p className="text-lg font-semibold flex-1">{description}</p>
          <ArrowUpRightCircleSolid className="group-hover:-translate-y-1 transition icon" />
        </div>
      </div>

      <div className="gradient blue" />
      <div className="gradient black" />
    </Link>
  );
}
