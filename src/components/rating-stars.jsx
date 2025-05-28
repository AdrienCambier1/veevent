import { Star } from "iconoir-react";
import { StarSolid } from "iconoir-react";

export default function RatingStars({ note = 0, size = "base" }) {
  const stars = [1, 2, 3, 4, 5];

  const sizeMap = {
    base: "icon",
    sm: "icon-small",
    xs: "icon-very-small",
  };

  const iconSize = sizeMap[size] || "icon";

  return (
    <div className="flex items-center">
      {stars.map((star) =>
        star <= note ? (
          <StarSolid
            key={star}
            className={`${iconSize} text-[var(--primary-blue)]`}
          />
        ) : (
          <Star
            key={star}
            className={`${iconSize} text-[var(--primary-blue)]`}
          />
        )
      )}
    </div>
  );
}
