import React from "react";

const NewsCardSkeleton = () => (
  <div className="news-card skeleton-bg p-4 w-full max-w-xl mb-4">
    <h3 className="skeleton-text mb-2">Titre de l'actualité</h3>
    <span className="skeleton-text mb-2">Il y a 1 heure</span>
    <p className="skeleton-text mb-1">
      Contenu de l'actualité qui décrit les dernières nouvelles importantes
    </p>
    <p className="skeleton-text mb-1">
      de la plateforme et des événements à venir dans votre région.
    </p>
    <p className="skeleton-text">En savoir plus...</p>
  </div>
);

export default NewsCardSkeleton;
