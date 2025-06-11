import Link from "next/link";

interface FloatingMenuItemProps {
  label: string;
  isActive: boolean;
  link?: string;
}

export default function FloatingMenuItem({
  label,
  isActive,
  link = "#",
}: FloatingMenuItemProps) {
  return (
    <Link
      href={link}
      className={`floating-menu-item ${isActive ? "is-active" : ""}`}
    >
      {label}
    </Link>
  );
}
