import themeIcons from "../../tags/theme-tag/themes";
import "./theme-card.scss";

interface ThemeCardProps {
  category?: string;
  name?: string;
  children?: React.ReactNode;
}

export default function ThemeCard({
  category,
  name,
  children,
}: ThemeCardProps) {
  if (category) {
    const themeIcon = themeIcons[category] || themeIcons.default;
    const displayName = name || themeIcon.name;

    return (
      <div className="theme-card">
        <div className="theme-card-icon">{themeIcon.icon}</div>
        <span className="theme-card-label">{displayName}</span>
        {children}
      </div>
    );
  }

  if (name) {
    return (
      <div className="theme-card">
        <div className="theme-card-icon"> {themeIcons.default.icon}</div>
        <span className="theme-card-label">
          {" "}
          {children}
          {name}
        </span>
      </div>
    );
  }

  return <span className="theme-card">{children}</span>;
}
