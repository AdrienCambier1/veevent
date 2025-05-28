import Link from "next/link";
import { Headset, Basketball, Book } from "iconoir-react";

export default function ThemeCard({ theme = "musique" }) {
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

    return IconComponent && <IconComponent className="logo" />;
  };

  return (
    <Link href="#" className="theme-card">
      {getThemeIcon(theme)}
      <span>{theme}</span>
    </Link>
  );
}
