import { useState, useRef, useEffect, useCallback } from "react";

export function useHorizontalScroll() {
  const [isAtLeft, setIsAtLeft] = useState(true);
  const [isAtRight, setIsAtRight] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const checkScrollPosition = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    const { scrollLeft, clientWidth, scrollWidth } = container;
    const tolerance = 2;

    setIsAtLeft(scrollLeft <= tolerance);
    setIsAtRight(scrollLeft + clientWidth >= scrollWidth - tolerance);
  }, []);

  const handleScroll = useCallback(() => {
    setIsScrolling(true);

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(checkScrollPosition);

    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);
  }, [checkScrollPosition]);

  const scrollToActiveItem = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    const activeItem = container.querySelector(
      ".bar-menu-item.active"
    ) as HTMLElement;
    if (!activeItem) return;

    const itemLeft = activeItem.offsetLeft;
    const itemWidth = activeItem.offsetWidth;
    const containerWidth = container.clientWidth;
    const containerScrollLeft = container.scrollLeft;

    const itemCenter = itemLeft + itemWidth / 2;
    const containerCenter = containerScrollLeft + containerWidth / 2;

    const scrollDistance = itemCenter - containerCenter;
    const targetScrollLeft = containerScrollLeft + scrollDistance;

    container.scrollTo({
      left: Math.max(
        0,
        Math.min(targetScrollLeft, container.scrollWidth - containerWidth)
      ),
      behavior: "smooth",
    });
  }, []);

  const scrollBy = useCallback((distance: number) => {
    const container = scrollRef.current;
    if (!container) return;

    const currentScroll = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;
    const targetScroll = Math.max(
      0,
      Math.min(currentScroll + distance, maxScroll)
    );

    container.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    });
  }, []);

  const scrollLeft = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollDistance = -container.clientWidth * 0.8;
    scrollBy(scrollDistance);
  }, [scrollBy]);

  const scrollRight = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollDistance = container.clientWidth * 0.8;
    scrollBy(scrollDistance);
  }, [scrollBy]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    container.style.scrollBehavior = "smooth";
    container.style.overflowX = "auto";
    container.style.overscrollBehaviorX = "contain";

    checkScrollPosition();

    const resizeObserver = new ResizeObserver(() => {
      checkScrollPosition();
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [checkScrollPosition]);

  return {
    scrollRef,
    handleScroll,
    isAtLeft,
    isAtRight,
    isScrolling,
    scrollToActiveItem,
    scrollBy,
    scrollLeft,
    scrollRight,
  };
}
