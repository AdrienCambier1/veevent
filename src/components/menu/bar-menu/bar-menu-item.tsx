import { Home } from "iconoir-react";
import Link from "next/link";

interface BarMenuItemProps {
  label?: string;
  href?: string;
  isActive?: boolean;
  isHome?: boolean;
}

export default function BarMenuItem({
  label,
  href = "#",
  isActive,
  isHome,
}: BarMenuItemProps) {
  return (
    <Link className={`bar-menu-item ${isActive && "active"}`} href={href}>
      {isHome ? <Home /> : <span>{label}</span>}
    </Link>
  );
}
