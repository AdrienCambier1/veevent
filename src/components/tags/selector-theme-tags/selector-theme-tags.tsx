import { useState } from "react";
import ThemeTag from "../theme-tag/theme-tag";

interface SelectorThemeTagsProps {
  availableThemes?: string[];
  selectedThemes?: string[];
  onSelectionChange?: (selectedThemes: string[]) => void;
}

export default function SelectorThemeTags({
  availableThemes = [],
  selectedThemes = [],
  onSelectionChange,
}: SelectorThemeTagsProps) {
  const [internalSelected, setInternalSelected] =
    useState<string[]>(selectedThemes);

  const handleTagClick = (themeName: string) => {
    let newSelection: string[];

    if (internalSelected.includes(themeName)) {
      newSelection = internalSelected.filter((theme) => theme !== themeName);
    } else {
      newSelection = [...internalSelected, themeName];
    }

    setInternalSelected(newSelection);
    onSelectionChange?.(newSelection);
  };

  const isSelected = (themeName: string): boolean => {
    return internalSelected.includes(themeName);
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {availableThemes.map((item, index) => {
        const selected = isSelected(item);
        return (
          <button
            key={index}
            type="button"
            onClick={() => handleTagClick(item)}
          >
            <ThemeTag category={item} name={item} isSelected={selected} />
          </button>
        );
      })}
    </div>
  );
}
