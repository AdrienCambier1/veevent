import ProfileImg from "@/components/images/profile-img/profile-img";
import "./event-head.scss";
import { MapPin, Calendar, Bookmark, BookmarkSolid } from "iconoir-react";
import ThemeTag from "@/components/tags/theme-tag/theme-tag";
import { BaseCategory, BaseUser } from "@/types";
import { useEffect, useState } from "react";

interface EventHeadProps {
  id: number;
  title: string;
  location: string;
  date: string;
  price: number | undefined;
  organizer: BaseUser;
  categories: BaseCategory[];
}

export default function EventHead({
  id: eventId,
  title,
  location,
  date,
  price,
  organizer,
  categories,
}: EventHeadProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!eventId) return;
    const favs = JSON.parse(localStorage.getItem("vv-fav-events") || "[]");
    setIsFavorite(favs.includes(eventId));
  }, [eventId]);

  const handleToggleFavorite = () => {
    if (!eventId) return;
    const favs = JSON.parse(localStorage.getItem("vv-fav-events") || "[]");
    let newFavs;
    if (favs.includes(eventId)) {
      newFavs = favs.filter((id: number) => id !== eventId);
    } else {
      newFavs = [...favs, eventId];
    }
    localStorage.setItem("vv-fav-events", JSON.stringify(newFavs));
    setIsFavorite(newFavs.includes(eventId));
  };

  return (
    <section className="event-head wrapper">
      <div className="flex flex-wrap gap-2">
        {categories.map((category: BaseCategory, index: number) => (
          <ThemeTag
            key={`${category.key}-${index}`}
            category={category.key}
            name={category.name}
            onEventCard={true}
          />
        ))}
      </div>
      <h1>{title}</h1>
      <ProfileImg name={organizer.pseudo || ""} note={organizer.note} />
      <div className="flex flex-col gap-2">
        <div className="info">
          <MapPin className="icon-small" />
          <span>{location}</span>
        </div>
        <div className="info">
          <Calendar className="icon-small" />
          <span>
            Le{" "}
            {new Date(date).toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }) +
              " à " +
              new Date(date).toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="primary-btn flex-1" onClick={() => {
          const billetSection = document.getElementById("billet");
          if (billetSection) {
            billetSection.scrollIntoView({ behavior: "smooth" });
          }
        }}>
          {price === 0 ? (
            <span>Gratuit</span>
          ) : (
            <span>À partir de {price}€</span>
          )}
        </button>
        <button
          className={`secondary-btn flex-1 ${isFavorite ? "bg-primary-100 text-primary-700" : ""}`}
          onClick={handleToggleFavorite}
        >
          {isFavorite ? <BookmarkSolid /> : <Bookmark />}
          <span>{isFavorite ? "Retirer des favoris" : "Intéressé.e"}</span>
        </button>
      </div>
    </section>
  );
}
