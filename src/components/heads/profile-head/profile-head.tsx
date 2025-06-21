import { CinemaOld, LogOut, Settings, SoccerBall } from "iconoir-react";
import ProfileImg from "@/components/images/profile-img/profile-img";
import "./profile-head.scss";
import Link from "next/link";
import ThemeTag from "@/components/tags/theme-tag/theme-tag";
import { useAuth } from "@/contexts/auth-context";
import { CategoryData, UserData } from "@/types";

interface ProfileHeadProps {
  isMe?: boolean;
  user: UserData | null;
}

export default function ProfileHead({ isMe, user }: ProfileHeadProps) {
  if (!user) {
    return null;
  }
  const { logout } = useAuth();

  const isOrganizer =
    user.role === "Organizer" ||
    user.role === "Admin" ||
    user.role === "AuthService";

  return (
    <div className="profile-head">
      <div className="grid gap-2 grid-cols-[auto,1fr] items-center">
        <div className="profile-image">
          <ProfileImg name="Jean-Baptiste" size="base" />
        </div>
        <div className="profile-info">
          <div className="name">
            {user.firstName} {user.lastName}
          </div>
          <div className="username">@{user.pseudo}</div>
        </div>
      </div>
      <div className="profile-stats">
        {/* <div>
          <span>28</span> abonnements
        </div>
        <div>
          <span>12</span> abonnés
        </div> */}
        {isOrganizer && (
          <div>
            <span>{user.eventsCount} </span>événements
          </div>
        )}
        <div>
          <span>{user.eventPastCount} </span>myVeevent
        </div>
      </div>
      {user.description && (
        <div className="profile-bio">
          <p>{user.description}</p>
        </div>
      )}
      {user.categories && (
        <div className="profile-themes">
          {user.categories.map((category: CategoryData) => (
            <ThemeTag
              key={category.key}
              category={category.key}
              name={category.name}
            />
          ))}
        </div>
      )}
      {isMe && (
        <div className="profile-actions">
          <div className="flex gap-2 items-center">
            <Link href={"/compte/modifier"} className="user-btn-variant">
              Modifier le profil
            </Link>
            <Link href="/compte/parametres" className="user-btn-variant">
              <Settings /> Paramètres
            </Link>
          </div>
          <button onClick={logout} className="user-btn">
            <LogOut /> Se déconnecter
          </button>
        </div>
      )}
    </div>
  );
}
