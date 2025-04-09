import { Star } from "iconoir-react";
import { StarSolid } from "iconoir-react";

export default function RatingStar({ note = 0 }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center">
      {stars.map((star) =>
        star <= note ? (
          <StarSolid
            key={star}
            className="h-3 w-3 text-[var(--primary-blue)]"
          />
        ) : (
          <Star key={star} className="h-3 w-3 text-[var(--primary-blue)]" />
        )
      )}
    </div>
  );
}
