"use client";
import ThemeButton from "@/components/buttons/theme-btn";
import { EditPencil } from "iconoir-react";
import { useState } from "react";

export default function PreferencesPage() {
  const [selectedThemes, setSelectedThemes] = useState([]);
  const availableThemes = ["Musique", "Sport", "Learning"];

  const handleThemeToggle = (theme) => {
    setSelectedThemes((prevSelected) => {
      if (prevSelected.includes(theme)) {
        return prevSelected.filter((t) => t !== theme);
      } else {
        return [...prevSelected, theme];
      }
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <h3>Préférences du compte</h3>
      <div className="cards-grid">
        {availableThemes.map((theme) => (
          <ThemeButton
            key={theme}
            theme={theme}
            isSelected={selectedThemes.includes(theme)}
            onClick={() => handleThemeToggle(theme)}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <button className="blue-rounded-btn">
          <span>Modifier</span>
          <EditPencil />
        </button>
      </div>
    </div>
  );
}
