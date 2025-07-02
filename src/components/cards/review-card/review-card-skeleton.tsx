import React from "react";

const ReviewCardSkeleton = () => (
  <div className="review-card skeleton-bg rounded-lg p-4 flex flex-col gap-2 w-full max-w-md mb-4">
    <div className="flex items-center gap-2">
      <div className="skeleton-bg h-8 w-8 rounded-full"></div>
      <div className="skeleton-text h-4 w-24"></div>
    </div>
    <div className="skeleton-text h-4 w-3/4"></div>
    <div className="skeleton-text h-3 w-1/2"></div>
    <div className="skeleton-text h-3 w-1/3"></div>
  </div>
);

export default ReviewCardSkeleton;
