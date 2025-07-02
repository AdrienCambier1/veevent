import React from "react";

const TrustpilotCardSkeleton = () => (
  <div className="trustpilot-card skeleton-bg rounded-lg p-4 w-full max-w-xl mb-4 flex flex-col gap-2">
    <div className="skeleton-text h-5 w-1/3 mb-2"></div>
    <div className="skeleton-text h-4 w-1/4 mb-2"></div>
    <div className="skeleton-text h-3 w-2/3 mb-1"></div>
    <div className="skeleton-text h-3 w-1/2"></div>
  </div>
);

export default TrustpilotCardSkeleton;
