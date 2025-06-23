import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import "./price-filter.scss";
import { useFilters } from "@/contexts/filter-context";

export default function PriceFilter() {
  const { tempFilters, updateTempFilters } = useFilters();

  const priceData = [
    5, 8, 12, 15, 18, 22, 25, 30, 35, 38, 42, 45, 48, 52, 55, 50, 45, 40, 35,
    30, 25, 20, 18, 15, 12, 10, 8, 5, 3, 1,
  ];

  const MIN_PRICE = 0;
  const MAX_PRICE = priceData.length * 10;
  const PRICE_STEP = 10;

  // Initialiser avec les valeurs du contexte ou les valeurs par défaut
  const [minPrice, setMinPrice] = useState<number>(
    tempFilters.minPrice ?? MIN_PRICE
  );
  const [maxPrice, setMaxPrice] = useState<number>(
    tempFilters.maxPrice ?? MAX_PRICE
  );
  const [isDragging, setIsDragging] = useState<string | null>(null);
  const [showOnlyFree, setShowOnlyFree] = useState<boolean>(
    tempFilters.minPrice === 0 && tempFilters.maxPrice === 0
  );

  const sliderRef = useRef<HTMLDivElement>(null);
  const isMouseDownRef = useRef<boolean>(false);

  // Synchroniser avec les filtres temporaires du contexte
  useEffect(() => {
    if (
      tempFilters.minPrice !== undefined &&
      tempFilters.minPrice !== minPrice
    ) {
      setMinPrice(tempFilters.minPrice);
    }
    if (
      tempFilters.maxPrice !== undefined &&
      tempFilters.maxPrice !== maxPrice
    ) {
      setMaxPrice(tempFilters.maxPrice);
    }

    // Détecter si "événements gratuits uniquement" est activé
    const isFreeOnly = tempFilters.minPrice === 0 && tempFilters.maxPrice === 0;
    if (isFreeOnly !== showOnlyFree) {
      setShowOnlyFree(isFreeOnly);
    }
  }, [
    tempFilters.minPrice,
    tempFilters.maxPrice,
    minPrice,
    maxPrice,
    showOnlyFree,
  ]);

  // Mettre à jour le contexte quand les prix changent
  const updatePriceFilters = useCallback(
    (newMinPrice: number, newMaxPrice: number) => {
      updateTempFilters({
        minPrice: newMinPrice,
        maxPrice: newMaxPrice,
      });
    },
    [updateTempFilters]
  );

  const maxValue = Math.max(...priceData);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !sliderRef.current || !isMouseDownRef.current) return;

      const slider = sliderRef.current.getBoundingClientRect();
      const percent = Math.max(
        0,
        Math.min(1, (e.clientX - slider.left) / slider.width)
      );
      const value = Math.round(percent * MAX_PRICE);

      if (isDragging === "min") {
        const newMinPrice = Math.min(value, maxPrice);
        setMinPrice(newMinPrice);
        updatePriceFilters(newMinPrice, maxPrice);
      } else if (isDragging === "max") {
        const newMaxPrice = Math.max(value, minPrice);
        setMaxPrice(newMaxPrice);
        updatePriceFilters(minPrice, newMaxPrice);
      }
    },
    [isDragging, MAX_PRICE, maxPrice, minPrice, updatePriceFilters]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(null);
    isMouseDownRef.current = false;

    document.body.style.overflow = "";
    document.body.style.touchAction = "";

    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseMove]);

  const handleSliderClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (isDragging || showOnlyFree) return;

    const slider = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - slider.left) / slider.width;
    const value = Math.round(percent * MAX_PRICE);

    const distToMin = Math.abs(minPrice - value);
    const distToMax = Math.abs(maxPrice - value);

    if (distToMin <= distToMax) {
      const newMinPrice = Math.min(value, maxPrice);
      setMinPrice(newMinPrice);
      updatePriceFilters(newMinPrice, maxPrice);
    } else {
      const newMaxPrice = Math.max(value, minPrice);
      setMaxPrice(newMaxPrice);
      updatePriceFilters(minPrice, newMaxPrice);
    }
  };

  const handleMouseDown = (handle: "min" | "max") => (e: React.MouseEvent) => {
    if (showOnlyFree) return;

    e.preventDefault();
    e.stopPropagation();
    setIsDragging(handle);
    isMouseDownRef.current = true;

    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleTouchStart = (handle: "min" | "max") => (e: React.TouchEvent) => {
    if (showOnlyFree) return;

    e.preventDefault();
    setIsDragging(handle);
    isMouseDownRef.current = true;

    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
  };

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging || !sliderRef.current || !isMouseDownRef.current) return;

      const touch = e.touches[0];
      const slider = sliderRef.current.getBoundingClientRect();
      const percent = Math.max(
        0,
        Math.min(1, (touch.clientX - slider.left) / slider.width)
      );
      const value = Math.round(percent * MAX_PRICE);

      if (isDragging === "min") {
        const newMinPrice = Math.min(value, maxPrice);
        setMinPrice(newMinPrice);
        updatePriceFilters(newMinPrice, maxPrice);
      } else if (isDragging === "max") {
        const newMaxPrice = Math.max(value, minPrice);
        setMaxPrice(newMaxPrice);
        updatePriceFilters(minPrice, newMaxPrice);
      }
    },
    [isDragging, MAX_PRICE, maxPrice, minPrice, updatePriceFilters]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(null);
    isMouseDownRef.current = false;

    document.body.style.overflow = "";
    document.body.style.touchAction = "";

    document.removeEventListener("touchmove", handleTouchMove);
    document.removeEventListener("touchend", handleTouchEnd);
  }, [handleTouchMove]);

  // Gérer le changement de "événements gratuits uniquement"
  const handleFreeOnlyChange = useCallback(() => {
    const newShowOnlyFree = !showOnlyFree;
    setShowOnlyFree(newShowOnlyFree);

    if (newShowOnlyFree) {
      // Activer les événements gratuits uniquement
      setMinPrice(0);
      setMaxPrice(0);
      updateTempFilters({
        minPrice: 0,
        maxPrice: 0,
      });
    } else {
      // Désactiver et revenir aux valeurs par défaut
      setMinPrice(MIN_PRICE);
      setMaxPrice(MAX_PRICE);
      updateTempFilters({
        minPrice: undefined,
        maxPrice: undefined,
      });
    }
  }, [showOnlyFree, updateTempFilters, MIN_PRICE, MAX_PRICE]);

  // Fonction pour effacer les filtres de prix
  const clearPriceFilters = useCallback(() => {
    setMinPrice(MIN_PRICE);
    setMaxPrice(MAX_PRICE);
    setShowOnlyFree(false);
    updateTempFilters({
      minPrice: undefined,
      maxPrice: undefined,
    });
  }, [MIN_PRICE, MAX_PRICE, updateTempFilters]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";

      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  useEffect(() => {
    if (isDragging && isMouseDownRef.current) {
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleTouchEnd);
    }
  }, [isDragging, handleTouchMove, handleTouchEnd]);

  const rangeWidth = ((maxPrice - minPrice) / MAX_PRICE) * 100;
  const rangeLeft = (minPrice / MAX_PRICE) * 100;

  interface FilteredEventsResult {
    count: number;
    total: number;
  }

  const getFilteredEvents = (): FilteredEventsResult => {
    const total = priceData.reduce((sum, val) => sum + val, 0);

    if (showOnlyFree) return { count: priceData[0], total };

    const startIndex = Math.floor(minPrice / PRICE_STEP);
    const endIndex = Math.min(
      Math.ceil(maxPrice / PRICE_STEP),
      priceData.length - 1
    );

    let count = 0;
    for (let i = startIndex; i <= endIndex; i++) {
      count += priceData[i];
    }

    return { count, total };
  };

  const { count, total } = getFilteredEvents();
  const percentage = Math.round((count / total) * 100);

  // Vérifier si des filtres de prix sont actifs
  const hasPriceFilters =
    minPrice !== MIN_PRICE || maxPrice !== MAX_PRICE || showOnlyFree;

  return (
    <div className={`price-filter ${showOnlyFree ? "disabled" : ""}`}>
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <h2 className="title">Fourchette de prix</h2>
          {hasPriceFilters && (
            <button
              onClick={clearPriceFilters}
              className="text-xs text-primary-600 hover:text-primary-700 font-medium"
            >
              Effacer
            </button>
          )}
        </div>
        <p className="subtitle">
          Prix par billet • {percentage}% des événements ({count}/{total})
        </p>
      </div>

      <div className="histogram">
        {priceData.map((value, index) => {
          const barHeight = (value / maxValue) * 100;
          const currentPrice = index * PRICE_STEP;
          const isBetween =
            currentPrice >= minPrice && currentPrice <= maxPrice;

          return (
            <motion.div
              key={index}
              initial={{ height: 0 }}
              animate={{
                height: showOnlyFree ? "0%" : `${barHeight}%`,
                opacity: showOnlyFree ? 0.3 : 1,
              }}
              transition={{ duration: 0.5, delay: index * 0.02 }}
              className={`bar ${isBetween ? "selected" : ""}`}
              style={{
                left: `${(index / priceData.length) * 100}%`,
                height: showOnlyFree ? "0%" : `${barHeight}%`,
              }}
            />
          );
        })}
      </div>

      <div ref={sliderRef} className="slider">
        <div className="track" onClick={handleSliderClick}>
          <div
            className="range"
            style={{ width: `${rangeWidth}%`, left: `${rangeLeft}%` }}
          />
        </div>

        <div
          className={`handle min ${isDragging === "min" ? "dragging" : ""}`}
          style={{ left: `calc(${rangeLeft}% - 12px)` }}
          onMouseDown={handleMouseDown("min")}
          onTouchStart={handleTouchStart("min")}
        >
          <div className="touch-area" />
        </div>

        <div
          className={`handle max ${isDragging === "max" ? "dragging" : ""}`}
          style={{ left: `calc(${(maxPrice / MAX_PRICE) * 100}% - 12px)` }}
          onMouseDown={handleMouseDown("max")}
          onTouchStart={handleTouchStart("max")}
        >
          <div className="touch-area" />
        </div>
      </div>

      <div className="labels">
        <span className="label">{showOnlyFree ? "0€" : `${minPrice}€`}</span>
        <span className="label">
          {showOnlyFree ? "Gratuit" : `${maxPrice}€`}
        </span>
      </div>

      <label className="checkbox">
        <div className="checkbox-wrapper">
          <input
            type="checkbox"
            className="checkbox-input"
            checked={showOnlyFree}
            onChange={handleFreeOnlyChange}
          />
          <div className={`checkbox-box ${showOnlyFree ? "checked" : ""}`}>
            {showOnlyFree && (
              <motion.svg
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="checkbox-icon"
                viewBox="0 0 20 20"
              >
                <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
              </motion.svg>
            )}
          </div>
        </div>
        <span className="checkbox-text">Événements gratuits uniquement</span>
      </label>
    </div>
  );
}
