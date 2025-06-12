"use client";
import BarMenuItem from "@/components/menu/bar-menu/bar-menu-item";
import "./bar-menu.scss";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAtLeft, setIsAtLeft] = useState(true);
  const [isAtRight, setIsAtRight] = useState(false);

  const isActiveLink = useCallback(
    (href: string, isHome?: boolean) => {
      if (isHome) return pathname === href;
      return pathname === href || pathname?.startsWith(href + "/");
    },
    [pathname]
  );

  const handleScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    const { scrollLeft, clientWidth, scrollWidth } = container;
    const tolerance = 2;

    setIsAtLeft(scrollLeft <= tolerance);
    setIsAtRight(scrollLeft + clientWidth >= scrollWidth - tolerance);
  }, []);

  const scrollToActiveItem = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    const activeItem = container.querySelector(
      ".bar-menu-item.active"
    ) as HTMLElement;
    if (!activeItem) return;

    activeItem.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToActiveItem();
    }, 150);

    return () => clearTimeout(timer);
  }, [pathname, scrollToActiveItem]);

  useEffect(() => {
    handleScroll();
  }, [handleScroll]);

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
