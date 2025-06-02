import { Home } from "iconoir-react";

interface BarMenuItemProps {
  label?: string;
  isActive?: boolean;
  isHome?: boolean;
}

export default function BarMenuItem({
  label,
  isActive,
  isHome,
}: BarMenuItemProps) {
  return (
    <div className={`bar-menu-item ${isActive ? "active" : ""}`}>
      {isHome ? <Home /> : <span>{label}</span>}
    </div>
  );
}
