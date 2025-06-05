import { Star, StarSolid } from "iconoir-react";
import { FC } from "react";
import "./rating-stars.scss";

type SizeOption = "base" | "sm" | "xs";

interface RatingStarsProps {
  note?: number;
  size?: SizeOption;
}

const sizeMap: Record<SizeOption, string> = {
  base: "icon",
  sm: "icon-small",
  xs: "icon-very-small",
};

export default function RatingStars({
  note = 0,
  size = "base",
}: RatingStarsProps) {
  const stars = [1, 2, 3, 4, 5];
  const iconSize = sizeMap[size];

  return (
    <div className="rating-stars">
      {stars.map((star) =>
        star <= note ? (
          <StarSolid key={star} className={`${iconSize}`} />
        ) : (
          <Star key={star} className={`${iconSize} `} />
        )
      )}
    </div>
  );
}
