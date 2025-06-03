import BarMenuItem from "@/components/menu/bar-menu/bar-menu-item";
import "./bar-menu.scss";

interface BarMenuProps {
  children?: React.ReactNode;
}

export default function BarMenu({ children }: BarMenuProps) {
  return (
    <div className="bar-menu scrollbar-hide">
      <BarMenuItem isActive={true} isHome={true} />
      {children}
    </div>
  );
}
