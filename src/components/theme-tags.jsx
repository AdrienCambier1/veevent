import { Headset, Megaphone, Basketball, Book } from "iconoir-react";

export default function ThemeTags({ theme = [] }) {
  const themeIcons = {
    musique: <Headset className="h-4 w-4" />,
    sponsorisé: <Megaphone className="h-4 w-4" />,
    sport: <Basketball className="h-4 w-4" />,
    learning: <Book className="h-4 w-4" />,
  };

  const getNormalizedKey = (themeName) => {
    return themeName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  const getThemeIcon = (themeName) => {
    const normalizedName = getNormalizedKey(themeName);
    return themeIcons[normalizedName] || null;
  };

  return (
    <div className="flex flex-wrap gap-2 w-full">
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
