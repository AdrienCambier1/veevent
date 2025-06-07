import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import "./price-filter.scss";

export default function PriceFilter() {
  const priceData = [
    5, 8, 12, 15, 18, 22, 25, 30, 35, 38, 42, 45, 48, 52, 55, 50, 45, 40, 35,
    30, 25, 20, 18, 15, 12, 10, 8, 5, 3, 1,
  ];

  const MIN_PRICE = 0;
  const MAX_PRICE = priceData.length * 10;
  const PRICE_STEP = 10;

  const [minPrice, setMinPrice] = useState<number>(MIN_PRICE);
  const [maxPrice, setMaxPrice] = useState<number>(MAX_PRICE);
  const [isDragging, setIsDragging] = useState<string | null>(null);
  const [showOnlyFree, setShowOnlyFree] = useState<boolean>(false);

  const sliderRef = useRef<HTMLDivElement>(null);
  const isMouseDownRef = useRef<boolean>(false);

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
        setMinPrice(Math.min(value, maxPrice));
      } else if (isDragging === "max") {
        setMaxPrice(Math.max(value, minPrice));
      }
    },
    [isDragging, MAX_PRICE, maxPrice, minPrice]
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
      setMinPrice(Math.min(value, maxPrice));
    } else {
      setMaxPrice(Math.max(value, minPrice));
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
        setMinPrice(Math.min(value, maxPrice));
      } else if (isDragging === "max") {
        setMaxPrice(Math.max(value, minPrice));
      }
    },
    [isDragging, MAX_PRICE, maxPrice, minPrice]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(null);
    isMouseDownRef.current = false;

    document.body.style.overflow = "";
    document.body.style.touchAction = "";

    document.removeEventListener("touchmove", handleTouchMove);
    document.removeEventListener("touchend", handleTouchEnd);
  }, [handleTouchMove]);

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

  return (
    <div
      className={`price-filter ${showOnlyFree ? "price-filter--disabled" : ""}`}
    >
      <div className="flex flex-col">
        <h2 className="price-filter__title">Fourchette de prix</h2>
        <p className="price-filter__subtitle">Prix par billet</p>
      </div>

      <div className="price-filter__histogram">
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
              className={`price-filter__bar ${
                isBetween ? "price-filter__bar--selected" : ""
              }`}
              style={{
                left: `${(index / priceData.length) * 100}%`,
                height: showOnlyFree ? "0%" : `${barHeight}%`,
              }}
            />
          );
        })}
      </div>

      <div ref={sliderRef} className="price-filter__slider">
        <div className="price-filter__track" onClick={handleSliderClick}>
          <div
            className="price-filter__range"
            style={{ width: `${rangeWidth}%`, left: `${rangeLeft}%` }}
          />
        </div>

        <div
          className={`price-filter__handle price-filter__handle--min ${
            isDragging === "min" ? "price-filter__handle--dragging" : ""
          }`}
          style={{ left: `calc(${rangeLeft}% - 12px)` }}
          onMouseDown={handleMouseDown("min")}
          onTouchStart={handleTouchStart("min")}
        >
          <div className="price-filter__handle-touch" />
        </div>

        <div
          className={`price-filter__handle price-filter__handle--max ${
            isDragging === "max" ? "price-filter__handle--dragging" : ""
          }`}
          style={{ left: `calc(${(maxPrice / MAX_PRICE) * 100}% - 12px)` }}
          onMouseDown={handleMouseDown("max")}
          onTouchStart={handleTouchStart("max")}
        >
          <div className="price-filter__handle-touch" />
        </div>
      </div>

      <div className="price-filter__labels">
        <span className="price-filter__label">{minPrice}€</span>
        <span className="price-filter__label">{maxPrice}€</span>
      </div>

      <label className="price-filter__checkbox">
        <div className="price-filter__checkbox-wrapper">
          <input
            type="checkbox"
            className="price-filter__checkbox-input"
            checked={showOnlyFree}
            onChange={() => setShowOnlyFree(!showOnlyFree)}
          />
          <div
            className={`price-filter__checkbox-box ${
              showOnlyFree ? "price-filter__checkbox-box--checked" : ""
            }`}
          >
            {showOnlyFree && (
              <motion.svg
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="price-filter__checkbox-icon"
                viewBox="0 0 20 20"
              >
                <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
              </motion.svg>
            )}
          </div>
        </div>
        <span className="price-filter__checkbox-text">
          Événements gratuits uniquements
        </span>
      </label>
    </div>
  );
}
