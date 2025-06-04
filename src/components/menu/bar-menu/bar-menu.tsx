import BarMenuItem from "@/components/menu/bar-menu/bar-menu-item";
import "./bar-menu.scss";
import { usePathname } from "next/navigation";

interface BarMenuProps {
  navigation: {
    label?: string;
    href: string;
    isActive?: boolean;
    isHome?: boolean;
  }[];
}

export default function BarMenu({ navigation }: BarMenuProps) {
  const pathname = usePathname();

  return (
    <div className="bar-menu scrollbar-hide">
      {navigation.map((item, index) => {
        const isActive = pathname === item.href;

        return (
          <BarMenuItem
            key={index}
            href={item.href}
            label={item.label}
            isHome={item.isHome}
            isActive={isActive}
          />
        );
      })}
    </div>
  );
}
