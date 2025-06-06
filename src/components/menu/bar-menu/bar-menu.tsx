// BarMenu avec hook personnalisé
"use client";
import BarMenuItem from "@/components/menu/bar-menu/bar-menu-item";
import "./bar-menu.scss";
import { usePathname } from "next/navigation";
import { useCallback } from "react";
import { useHorizontalScroll } from "@/hooks/useHorizontalScroll";

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
  const { scrollRef, handleScroll, isAtLeft, isAtRight } =
    useHorizontalScroll();

  const isActiveLink = useCallback(
    (href: string, isHome?: boolean) => {
      if (isHome) return pathname === href;
      return pathname === href || pathname?.startsWith(href + "/");
    },
    [pathname]
  );

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className={`bar-menu scrollbar-hide ${!isAtLeft ? "mask-left" : ""} ${
        !isAtRight ? "mask-right" : ""
      }`}
    >
      {navigation.map((item) => (
        <BarMenuItem
          key={item.href}
          href={item.href}
          label={item.label}
          isHome={item.isHome}
          isActive={isActiveLink(item.href, item.isHome)}
        />
      ))}
    </div>
  );
}
