import { ArrowUpRight } from "iconoir-react";
import Image from "next/image";
import niceImage from "@/assets/images/nice.jpg";
import "./organizer-card.scss";
import React from "react";
import Link from "next/link";

interface OrganizerCardProps {
  name: string;
  date: string;
}

export default function OrganizerCard({ name, date }: OrganizerCardProps) {
  return (
    <Link
      href={`/organisateurs/${name.toLocaleLowerCase()}`}
      className="organizer-card group"
    >
      <div className="flex items-center">
        <p className="title">{name}</p>
        <Image
          src={niceImage}
          alt={`${name} image`}
          className="organizer-img"
        />
      </div>

      <div className="flex items-center justify-between gap-2 text-secondary-400">
        <p>le {date}</p>
        <ArrowUpRight className="group-hover:-translate-y-1 transition icon" />
      </div>
    </Link>
  );
}
