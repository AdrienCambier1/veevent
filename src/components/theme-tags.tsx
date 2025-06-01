import { Headset, Megaphone, Basketball, Book } from "iconoir-react";
import { ReactNode } from "react";

type ThemeItem = string | { name: string; [key: string]: any };

interface ThemeTagsProps {
  theme?: ThemeItem[];
}

interface ThemeIcons {
  [key: string]: ReactNode;
}

export default function ThemeTags({ theme = [] }: ThemeTagsProps) {
  const themeIcons: ThemeIcons = {
    musique: <Headset />,
    sponsorisé: <Megaphone />,
    sport: <Basketball />,
    learning: <Book />,
  };

  const getNormalizedKey = (themeName: string): string => {
    return themeName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  const getThemeIcon = (themeName: string): ReactNode => {
    const normalizedName = getNormalizedKey(themeName);
    return themeIcons[normalizedName] || null;
  };

  return (
    <div className="flex flex-wrap gap-2 absolute top-2 left-2">
      {theme.map((item, index) => {
        const themeName = typeof item === "string" ? item : item.name;
        return (
          <div key={index} className="green-tag">
            {getThemeIcon(themeName)}
            <span>{themeName}</span>
          </div>
        );
      })}
    </div>
  );
}
