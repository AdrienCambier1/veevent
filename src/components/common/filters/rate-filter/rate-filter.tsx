import { useState } from "react";
import { Star, StarSolid } from "iconoir-react";

interface RateFilterProps {
  onRateChange?: (rate: number) => void;
  initialRate?: number;
}

export default function RateFilter({
  onRateChange,
  initialRate = 0,
}: RateFilterProps) {
  const [selectedRate, setSelectedRate] = useState(initialRate);
  const [hoveredRate, setHoveredRate] = useState(0);

  const handleStarClick = (rate: number) => {
    const newRate = selectedRate === rate ? 0 : rate;
    setSelectedRate(newRate);
    onRateChange?.(newRate);
  };

  const handleStarHover = (rate: number) => {
    setHoveredRate(rate);
  };

  const handleMouseLeave = () => {
    setHoveredRate(0);
  };

  const isStarFilled = (starIndex: number) => {
    const rateToCheck = hoveredRate || selectedRate;
    return starIndex <= rateToCheck;
  };

  return (
    <div className="rate-filter flex justify-center">
      <div className="flex gap-1" onMouseLeave={handleMouseLeave}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="p-1 transition-transform rounded"
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => handleStarHover(star)}
            aria-label={`Noter ${star} étoile${star > 1 ? "s" : ""}`}
          >
            {isStarFilled(star) ? (
              <StarSolid className="w-6 h-6 text-primary-600" />
            ) : (
              <Star className="w-6 h-6 text-primary-300 hover:text-primary-600 transition-colors" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
