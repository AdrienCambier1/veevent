"use client";
import BarMenuItem from "@/components/menu/bar-menu/bar-menu-item";
import "./bar-menu.scss";
import { usePathname } from "next/navigation";
import { useCallback, useEffect } from "react";
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
  const { scrollRef, handleScroll, isAtLeft, isAtRight, scrollToActiveItem } =
    useHorizontalScroll();

  const isActiveLink = useCallback(
    (href: string, isHome?: boolean) => {
      if (isHome) return pathname === href;
      return pathname === href || pathname?.startsWith(href + "/");
    },
    [pathname]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToActiveItem();
    }, 150);

    return () => clearTimeout(timer);
  }, [pathname, scrollToActiveItem]);

  const maskClasses =
    !isAtLeft && !isAtRight
      ? "mask-both"
      : !isAtLeft
      ? "mask-left"
      : !isAtRight
      ? "mask-right"
      : "";

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className={`bar-menu scrollbar-hide ${maskClasses}`}
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
