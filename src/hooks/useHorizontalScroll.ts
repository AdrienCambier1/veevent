import { useState, useRef, useEffect, useCallback } from "react";

export function useHorizontalScroll() {
  const [isAtLeft, setIsAtLeft] = useState(true);
  const [isAtRight, setIsAtRight] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const checkScrollPosition = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    const { scrollLeft, clientWidth, scrollWidth } = container;
    const tolerance = 1;

    setIsAtLeft(scrollLeft <= tolerance);
    setIsAtRight(scrollLeft + clientWidth >= scrollWidth - tolerance);
  }, []);

  const handleScroll = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(checkScrollPosition);
  }, [checkScrollPosition]);

  const handleResize = useCallback(() => {
    requestAnimationFrame(checkScrollPosition);
  }, [checkScrollPosition]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    checkScrollPosition();
    window.addEventListener("resize", handleResize);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [checkScrollPosition, handleResize]);

  return { scrollRef, handleScroll, isAtLeft, isAtRight };
}
