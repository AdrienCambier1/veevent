import BarMenuItem from "@/components/bar-menu/bar-menu-item";
import "@/assets/styles/bar-menu.scss";

interface BarMenuProps {
  children?: React.ReactNode;
}

export default function BarMenu({ children }: BarMenuProps) {
  return (
    <div className="bar-menu">
      <BarMenuItem isActive={true} isHome={true} />
      {children}
    </div>
  );
}
