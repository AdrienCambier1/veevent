interface FloatingMenuItemProps {
  label: string;
  isActive: boolean;
}

export default function FloatingMenuItem({
  label,
  isActive,
}: FloatingMenuItemProps) {
  return (
    <div className={`floating-menu-item ${isActive ? "is-active" : ""}`}>
      {label}
    </div>
  );
}
