import Link from "next/link";

interface FloatingMenuItemProps {
  label?: string;
  isActive: boolean;
  link?: string;
  icon?: React.ReactNode;
  isSearch?: boolean;
}

export default function FloatingMenuItem({
  label,
  isActive,
  link = "#",
  icon,
  isSearch = false,
}: FloatingMenuItemProps) {
  return (
    <Link
      href={link}
      className={`floating-menu-item ${isActive ? "is-active" : ""} ${
        isSearch ? "is-search" : ""
      }`}
    >
      {icon && <span className="floating-menu-item__icon">{icon}</span>}
      {label && <span className="floating-menu-item__label">{label}</span>}
    </Link>
  );
}
