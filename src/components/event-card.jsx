import { Bookmark } from "iconoir-react";
import profilPicture from "@/assets/images/profil-pic.jpg";
import RatingStar from "./rating-stars";
import ThemeTag from "./theme-tag";
import Image from "next/image";
import niceImage from "@/assets/images/nice.jpg";

export default function EventCard() {
  return (
    <div className="white-card">
      <Image
        src={niceImage}
        alt="Event image"
        className="object-cover rounded-t-xl aspect-[16/9]"
      />
      <div className="flex flex-col gap-4 p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-[var(--secondary-blue)]">
            Atelier fresque végétal
          </h3>
          <Bookmark className="text-[var(--primary-blue)] h-6 w-6" />
        </div>
        <div className="flex items-center gap-4">
          <Image
            src={profilPicture}
            alt="Profil picture"
            className="rounded-full object-cover w-12 h-12"
          />
          <div className="flex flex-col">
            <p className="dark-text">Jean Claude</p>
            <RatingStar note={4} />
          </div>
        </div>
        <p className="blue-text">Antibes | samedi 24 juin 2025 • 15h30 </p>
        <ThemeTag theme={["Musique", "Sponsorisé", "Sport", "Learning"]} />
        <p className="line-clamp-3">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
          semper commodo velit ac facilisis. Nullam augue dui, bibendum vel
          congue vitae, lacinia vel nunc. Cras tristique ac ipsum nec
          consectetur. 
        </p>
      </div>
    </div>
  );
}
