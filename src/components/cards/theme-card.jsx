import Link from "next/link";
import { Headset, Basketball, Book } from "iconoir-react";

export default function ThemeCard({ theme = "musique" }) {
  const iconClasses = "group-hover:text-white";

  const themeIcons = {
    musique: Headset,
    sport: Basketball,
    learning: Book,
  };

  const getNormalizedKey = (themeName) => {
    return themeName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  const getThemeIcon = (themeName) => {
    const normalizedName = getNormalizedKey(themeName);
    const IconComponent = themeIcons[normalizedName];

    return IconComponent ? <IconComponent className={iconClasses} /> : null;
  };

  return (
    <Link
      href={`/activities/events?theme=${theme}`}
      className="theme-card group"
    >
      <div className="flex flex-col items-center justify-center gap-2">
        {getThemeIcon(theme)}
        <p className="group-hover:text-white transition">{theme}</p>
      </div>
    </Link>
  );
}
