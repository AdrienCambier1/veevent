import { CinemaOld, LogOut, Settings, SoccerBall } from "iconoir-react";
import ProfilImg from "../images/profil-img/profil-img";
import "./profile-head.scss";
import Link from "next/link";
import ThemeTag from "@/components/tags/theme-tag/theme-tag";

interface ProfileHeadProps {
  isMe?: boolean;
}

export default function ProfileHead({ isMe }: ProfileHeadProps) {
  return (
    <div className="profile-head">
      <div className="grid gap-2 grid-cols-[auto,1fr] items-center">
        <div className="profile-image">
          <ProfilImg name="Jean-Baptiste" size="base" />
        </div>
        <div className="profile-info">
          <div className="name">Jean-Baptiste Sainte-Beuve</div>
          <div className="username">@jb05sb</div>
        </div>
      </div>
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
        <div>
          <span>4 </span>myVeevent
        </div>
      </div>

      <div className="profile-bio">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
          semper commodo velit ac facilisis. Nullam augue dui, bibendum vel
          congue vitae, lacinia vel nunc.
        </p>
      </div>
      {isMe && (
        <div className="profile-actions">
          <div className="flex gap-2 items-center">
            <Link href={"/profile/edit"}>Modifier le profil</Link>
            <Link href="/settings">
              <Settings /> Paramètres
            </Link>
          </div>
          <div className="logout">
            <LogOut /> Se déconnecter
          </div>
        </div>
      )}

      <div className="profile-themes">
        <ThemeTag category="cinema" />
        <ThemeTag category="soccer" name="FootSalle" />
        <ThemeTag category="blabla" name="FootSalle" />
        <ThemeTag category="yoga" />
        <ThemeTag>Aquaponey</ThemeTag>
      </div>
    </div>
  );
}
