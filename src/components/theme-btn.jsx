import { Headset, Basketball, Book } from "iconoir-react";

export default function ThemeButton({
  theme = "musique",
  onClick,
  isSelected,
}) {
  const iconClasses = `${isSelected && "!text-white"} `;

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
    <button
      type="button"
      className={`${isSelected && "!bg-[var(--primary-blue)]"} theme-btn group`}
      onClick={onClick}
    >
      <div className="flex gap-4 items-center">
        <div
          className={`${
            isSelected ? "border-white" : "border-[var(--primary-blue)]"
          } h-4 w-4 border-2  rounded-full transition flex items-center justify-center`}
        >
          {isSelected && <div className="h-2 w-2 bg-white rounded-full" />}
        </div>
        <p
          className={`${
            isSelected ? "text-white" : "text-[var(--primary-blue)]"
          } font-bold  transition`}
        >
          {theme}
        </p>
      </div>
      {getThemeIcon(theme)}
    </button>
  );
}
