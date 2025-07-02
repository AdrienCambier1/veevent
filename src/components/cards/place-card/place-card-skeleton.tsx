import React from "react";
import "./place-card.scss";

export default function PlaceCardSkeleton() {
  return (
    <div className="place-card skeleton-bg">
      <div className="number skeleton-bg" style={{ width: 24, height: 24 }} />
      <div className="place-card-container">
        <div
          className="place-card-image skeleton-bg"
          style={{ width: 80, height: 80, borderRadius: 8 }}
        />
        <div className="place-card-content">
          <div className="place-card-name skeleton-text h-5 w-32 rounded mb-2" />
          <div className="place-card-specs">
            <div className="place-card-specs-item skeleton-text h-4 w-24 rounded mb-1" />
            <div className="place-card-specs-item skeleton-text h-4 w-20 rounded" />
          </div>
          <div className="place-card-events skeleton-text h-4 w-24 rounded mt-2" />
        </div>
      </div>
    </div>
  );
}
