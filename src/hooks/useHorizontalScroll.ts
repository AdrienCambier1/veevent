import { useState, useRef, useEffect, useCallback } from "react";

export function useHorizontalScroll() {
  // États pour gérer les indicateurs de position de scroll
  const [isAtLeft, setIsAtLeft] = useState(true);
  const [isAtRight, setIsAtRight] = useState(false);

  // Références pour le conteneur et l'animation frame
  const scrollRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  // Vérifie la position actuelle du scroll pour mettre à jour les indicateurs
  const checkScrollPosition = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    const { scrollLeft, clientWidth, scrollWidth } = container;
    const tolerance = 1; // Tolérance pour éviter les problèmes de précision

    setIsAtLeft(scrollLeft <= tolerance);
    setIsAtRight(scrollLeft + clientWidth >= scrollWidth - tolerance);
  }, []);

  // Gestionnaire optimisé du scroll avec requestAnimationFrame
  const handleScroll = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(checkScrollPosition);
  }, [checkScrollPosition]);

  // Centre automatiquement l'item actif dans le conteneur
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

    // Calcul pour centrer l'item
    const targetScrollLeft = itemLeft - containerWidth / 2 + itemWidth / 2;

    container.scrollTo({
      left: Math.max(
        0,
        Math.min(targetScrollLeft, container.scrollWidth - containerWidth)
      ),
      behavior: "smooth",
    });
  }, []);

  // Initialisation et nettoyage
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    // Vérification initiale de la position
    checkScrollPosition();

    // Nettoyage à la destruction du composant
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [checkScrollPosition]);

  return {
    scrollRef,
    handleScroll,
    isAtLeft,
    isAtRight,
    scrollToActiveItem,
  };
}
