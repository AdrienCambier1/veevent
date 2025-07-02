import React from "react";

const TrustpilotCardSkeleton = () => (
  <div className="trustpilot-card skeleton-bg p-4 w-full max-w-xl mb-4 flex flex-col gap-2">
    <h3 className="skeleton-text mb-2">Avis Trustpilot</h3>
    <span className="skeleton-text mb-2">★★★★☆</span>
    <p className="skeleton-text mb-1">
      Excellent service, je recommande vivement cette plateforme
    </p>
    <span className="skeleton-text">- Client vérifié</span>
  </div>
);

export default TrustpilotCardSkeleton;
