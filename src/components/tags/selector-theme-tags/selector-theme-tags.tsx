import { Headset, Megaphone, Basketball, Book } from "iconoir-react";
import { ReactNode, useState } from "react";
import "./selector-theme-tags.scss";

type ThemeItem = string | { name: string; [key: string]: any };

interface SelectorThemeTagsProps {
  availableThemes?: ThemeItem[];
  selectedThemes?: string[];
  onSelectionChange?: (selectedThemes: string[]) => void;
}

interface ThemeIcons {
  [key: string]: ReactNode;
}

export default function SelectorThemeTags({
  availableThemes = [],
  selectedThemes = [],
  onSelectionChange,
}: SelectorThemeTagsProps) {
  const [internalSelected, setInternalSelected] =
    useState<string[]>(selectedThemes);

  const themeIcons: ThemeIcons = {
    musique: <Headset />,
    sponsorise: <Megaphone />,
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

  const handleTagClick = (themeName: string) => {
    let newSelection: string[];

    if (internalSelected.includes(themeName)) {
      // Désélectionner le tag
      newSelection = internalSelected.filter((theme) => theme !== themeName);
    } else {
      // Sélectionner le tag (avec limite optionnelle)

      newSelection = [...internalSelected, themeName];
    }

    setInternalSelected(newSelection);
    onSelectionChange?.(newSelection);
  };

  const isSelected = (themeName: string): boolean => {
    return internalSelected.includes(themeName);
  };

  return (
    <div className="selector-theme-tags">
      {availableThemes.map((item, index) => {
        const themeName = typeof item === "string" ? item : item.name;
        const selected = isSelected(themeName);

        return (
          <button
            key={index}
            type="button"
            onClick={() => handleTagClick(themeName)}
            className={`
              ${selected && "selected"} 
              tag
            `}
          >
            {getThemeIcon(themeName)}
            <span>{themeName}</span>
          </button>
        );
      })}
    </div>
  );
}
