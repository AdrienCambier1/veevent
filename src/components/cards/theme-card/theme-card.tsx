import { useRouter } from "next/navigation";
import { Category } from "@/types";
import themeIcons from "../../tags/theme-tag/themes";
import "./theme-card.scss";

interface ThemeCardProps {
  category: Category; // ✅ Obligatoire maintenant
  children?: React.ReactNode;
}

export default function ThemeCard({ category, children }: ThemeCardProps) {
  const router = useRouter();

  const handleClick = () => {
    // ✅ Redirection vers la page des événements avec le filtre de catégorie
    router.push(`/evenements?theme=${category.key}`);
  };

  const themeIcon = themeIcons[category.key] || themeIcons.default;

  return (
    <div
      className="theme-card"
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <div className="theme-card-icon">{themeIcon.icon}</div>
      <span className="theme-card-label">{category.name}</span>
      {children}
    </div>
  );
}
