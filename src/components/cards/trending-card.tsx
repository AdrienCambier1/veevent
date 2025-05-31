import Link from "next/link";
import Image from "next/image";
import niceImage from "@/assets/images/nice.jpg";
import { ArrowUpRightCircleSolid } from "iconoir-react";

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

      <div className="container">
        <div className="flex justify-between items-center">
          <p className="font-semibold">{organizer}</p>
          <p className="font-extrabold">{city}</p>
        </div>

        <div className="flex items-end gap-8">
          <p className="text-lg font-semibold flex-1">{description}</p>
          <ArrowUpRightCircleSolid className="group-hover:-translate-y-1 transition icon" />
        </div>
      </div>

      <div className="absolute bg-gradient-to-tr from-transparent to-[var(--secondary-blue)] opacity-50 inset-0" />
      <div className="absolute bg-gradient-to-bl from-transparent to-black opacity-50 inset-0" />
    </Link>
  );
}
