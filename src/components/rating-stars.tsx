import { Star, StarSolid } from "iconoir-react";
import { FC } from "react";

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

const RatingStars: FC<RatingStarsProps> = ({ note = 0, size = "base" }) => {
  const stars = [1, 2, 3, 4, 5];
  const iconSize = sizeMap[size];

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
};

export default RatingStars;
