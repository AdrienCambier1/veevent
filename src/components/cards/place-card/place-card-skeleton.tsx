import React from "react";
import "./place-card.scss";

export default function PlaceCardSkeleton() {
  return (
    <div className="place-card skeleton-bg">
      <div className="number skeleton-bg w-6 h-6" />
      <div className="place-card-container">
        <div className="place-card-image skeleton-bg" />
        <div className="place-card-content">
          <h3 className="place-card-name skeleton-text mb-2">Nom du lieu</h3>
          <div className="place-card-specs">
            <span className="place-card-specs-item skeleton-text mb-1">
              Capacité
            </span>
            <span className="place-card-specs-item skeleton-text">Type</span>
          </div>
          <p className="place-card-events skeleton-text mt-2">X événements</p>
        </div>
      </div>
    </div>
  );
}
