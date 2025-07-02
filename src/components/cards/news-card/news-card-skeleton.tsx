import React from "react";

const NewsCardSkeleton = () => (
  <div className="news-card skeleton-bg rounded-lg p-4 w-full max-w-xl mb-4">
    <div className="skeleton-text h-5 w-2/3 mb-2"></div>
    <div className="skeleton-text h-4 w-1/3 mb-2"></div>
    <div className="skeleton-text h-3 w-full mb-1"></div>
    <div className="skeleton-text h-3 w-5/6 mb-1"></div>
    <div className="skeleton-text h-3 w-2/3"></div>
  </div>
);

export default NewsCardSkeleton;
