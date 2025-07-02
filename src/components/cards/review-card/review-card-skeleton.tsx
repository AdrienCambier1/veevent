import React from "react";

const ReviewCardSkeleton = () => (
  <div className="review-card skeleton-bg p-4 flex flex-col gap-2 w-full max-w-md mb-4">
    <div className="flex items-center gap-2">
      <div className="skeleton-bg h-8 w-8 rounded-full"></div>
      <span className="skeleton-text">Nom utilisateur</span>
    </div>
    <p className="skeleton-text">
      Commentaire de l'utilisateur sur l'événement
    </p>
    <span className="skeleton-text">Il y a 2 jours</span>
    <span className="skeleton-text">★★★★☆</span>
  </div>
);

export default ReviewCardSkeleton;
