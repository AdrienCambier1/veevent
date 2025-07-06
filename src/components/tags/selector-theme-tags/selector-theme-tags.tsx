import { useState, useEffect } from "react";
import ThemeTag from "../theme-tag/theme-tag";
import { Category } from "@/types";

interface SelectorThemeTagsProps {
  availableThemes?: string[];
  categories?: Category[]; // Nouvelle prop pour les catégories complètes
  selectedThemes?: string[];
  onSelectionChange?: (selectedThemes: string[]) => void;
  itemsPerPage?: number; // Pour contrôler la pagination
  showMoreLabel?: string; // Texte du bouton "Afficher plus"
}

export default function SelectorThemeTags({
  availableThemes = [],
  categories = [],
  selectedThemes = [],
  onSelectionChange,
  itemsPerPage = 10,
  showMoreLabel = "Afficher plus",
}: SelectorThemeTagsProps) {
  const [internalSelected, setInternalSelected] =
    useState<string[]>(selectedThemes);
  const [displayedCount, setDisplayedCount] = useState(itemsPerPage);

  // Synchroniser l'état interne avec les props selectedThemes
  useEffect(() => {
    setInternalSelected(selectedThemes);
  }, [selectedThemes]);

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

  const showMoreItems = () => {
    const totalItems =
      categories.length > 0 ? categories.length : availableThemes.length;
    setDisplayedCount((prev) => Math.min(prev + itemsPerPage, totalItems));
  };

  // Utiliser les catégories si disponibles, sinon les thèmes simples
  const itemsToDisplay =
    categories.length > 0
      ? categories.slice(0, displayedCount)
      : availableThemes.slice(0, displayedCount);

  const totalItems =
    categories.length > 0 ? categories.length : availableThemes.length;
  const hasMoreItems = displayedCount < totalItems;
  const remainingItems = totalItems - displayedCount;

  return (
    <div className="selector-theme-tags">
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.length > 0
          ? // Rendu avec les données complètes des catégories
            (itemsToDisplay as Category[]).map((category, index) => {
              const selected = isSelected(category.key);
              return (
                <button
                  key={category.key}
                  type="button"
                  onClick={() => handleTagClick(category.key)}
                  className="theme-tag-button"
                >
                  <ThemeTag
                    category={category.key}
                    name={category.name}
                    isSelected={selected}
                  />
                </button>
              );
            })
          : // Rendu avec les thèmes simples (mode legacy)
            (itemsToDisplay as string[]).map((item, index) => {
              const selected = isSelected(item);
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleTagClick(item)}
                  className="theme-tag-button"
                >
                  <ThemeTag category={item} name={item} isSelected={selected} />
                </button>
              );
            })}
      </div>

      {hasMoreItems && (
        <button
          onClick={showMoreItems}
          className="show-more-button mt-4 w-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg py-3 px-4 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:border-gray-400 transition-all duration-200"
        >
          {showMoreLabel} ({remainingItems} restantes)
        </button>
      )}
    </div>
  );
}
