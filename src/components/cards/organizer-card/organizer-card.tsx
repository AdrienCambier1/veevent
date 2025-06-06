import { ArrowUpRight } from "iconoir-react";
import Image from "next/image";
import niceImage from "@/assets/images/nice.jpg";
import "./organizer-card.scss";
import React from "react";
import Link from "next/link";
import ProfileImg from "@/components/images/profile-img/profile-img";
import EventCardLine from "../event-card-line/event-card-line";

interface OrganizerCardProps {
  name: string;
}

export default function OrganizerCard({ name }: OrganizerCardProps) {
  return (
    <Link href={`/organisateurs/${name.toLocaleLowerCase()}`}>
      <div className="organizer-card">
        <ProfileImg name={name} note={4} />
        <div className="profile-stats">
          <div>
            <span>28</span> abonnements
          </div>
          <div>
            <span>12</span> abonnés
          </div>
          <div>
            <span>3 </span>événements
          </div>
        </div>
        <div className="flex flex-col w-full">
          <EventCardLine />
          <EventCardLine />
        </div>

        <span className="text-primary-600 font-medium underline">
          Voir le profil
        </span>
      </div>
    </Link>
  );
}
