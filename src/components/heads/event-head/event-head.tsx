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

// Fonction pour formater la date de manière plus lisible
const formatEventDate = (dateString: string) => {
  try {
    // Si la date est déjà formatée en français, l'afficher directement
    if (dateString.includes('à') && (dateString.includes('lundi') || dateString.includes('mardi') || dateString.includes('mercredi') || dateString.includes('jeudi') || dateString.includes('vendredi') || dateString.includes('samedi') || dateString.includes('dimanche'))) {
      return dateString;
    }
    
    // Essayer différents formats de parsing
    let date: Date;
    
    // Essayer de parser la date ISO
    date = new Date(dateString);
    
    // Si ça ne marche pas, essayer d'autres formats
    if (isNaN(date.getTime())) {
      // Essayer avec des formats alternatifs
      const formats = [
        dateString.replace('T', ' '), // Enlever le T
        dateString.replace('T', ' ').replace('Z', ''), // Enlever le T et Z
      ];
      
      for (const format of formats) {
        date = new Date(format);
        if (!isNaN(date.getTime())) break;
      }
    }
    
    // Vérifier si la date est valide
    if (isNaN(date.getTime())) {
      return "Date non disponible";
    }
    
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Vérifier si c'est aujourd'hui
    const isToday = date.toDateString() === now.toDateString();
    // Vérifier si c'est demain
    const isTomorrow = date.toDateString() === tomorrow.toDateString();
    
    // Formater la date
    const dayName = date.toLocaleDateString("fr-FR", { weekday: "long" });
    const dayNumber = date.toLocaleDateString("fr-FR", { day: "numeric" });
    const month = date.toLocaleDateString("fr-FR", { month: "long" });
    const year = date.getFullYear();
    const time = date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit"
    });
    
    // Construire le texte de la date
    let dateText = "";
    
    if (isToday) {
      dateText = `Aujourd'hui à ${time}`;
    } else if (isTomorrow) {
      dateText = `Demain à ${time}`;
    } else {
      // Si c'est cette année, ne pas afficher l'année
      if (year === now.getFullYear()) {
        dateText = `${dayName} ${dayNumber} ${month} à ${time}`;
      } else {
        dateText = `${dayName} ${dayNumber} ${month} ${year} à ${time}`;
      }
    }
    
    return dateText;
  } catch (error) {
    return "Date non disponible";
  }
};

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
          <span>{formatEventDate(date)}</span>
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
