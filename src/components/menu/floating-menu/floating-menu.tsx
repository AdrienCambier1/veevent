"use client";

import { usePathname } from "next/navigation";
import FloatingMenuItem from "@/components/menu/floating-menu/floating-menu-item";
import "./floating-menu.scss";

export default function FloatingMenu() {
  const pathname = usePathname() || "";

  const menuItems = [
    {
      link: "/",
      label: "Pour vous",
      isActive: pathname === "/",
    },
    {
      link: "/evenements",
      label: "Évènements",
      isActive: pathname.includes("/evenements"),
    },
    {
      link: "/compte/tickets",
      label: "Profil",
      isActive: pathname.includes("/compte"),
    },
  ];

  return (
    <div className="floating-menu">
      {menuItems.map((item) => (
        <FloatingMenuItem
          key={item.link}
          link={item.link}
          label={item.label}
          isActive={item.isActive}
        />
      ))}
    </div>
  );
}
