import Link from "next/link";
import { Headset, Basketball, Book } from "iconoir-react";
import { FC, SVGProps } from "react";
import "./theme-card.scss";

type ThemeType = "musique" | "sport" | "learning";

type IconoirIconType = FC<SVGProps<SVGSVGElement>>;

interface ThemeCardProps {
  theme?: ThemeType;
}

export default function ThemeCard({ theme = "musique" }: ThemeCardProps) {
  const themeIcons: Record<string, IconoirIconType> = {
    musique: Headset,
    sport: Basketball,
    learning: Book,
  };

  const getNormalizedKey = (themeName: string): string => {
    return themeName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  const getThemeIcon = (themeName: string) => {
    const normalizedName = getNormalizedKey(themeName);
    const IconComponent = themeIcons[normalizedName];

    return IconComponent ? <IconComponent className="icon" /> : null;
  };

  return (
    <Link href="#" className="theme-card">
      {getThemeIcon(theme)}
      <span>{theme}</span>
    </Link>
  );
}
