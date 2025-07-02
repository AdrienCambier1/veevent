"use client";

interface FilterFooterProps {
  onShowResults: () => void;
  onClearAll: () => void;
  hasActiveFilters: boolean;
  hasTempChanges: boolean; // Rendre cette prop obligatoire
}

export default function FilterFooter({
  onShowResults,
  onClearAll,
  hasActiveFilters,
  hasTempChanges,
}: FilterFooterProps) {
  return (
    <div className="flex gap-3 md:gap-4">
      <button
        onClick={onClearAll}
        disabled={!hasActiveFilters && !hasTempChanges}
        className={`secondary-btn flex-1 ${
          hasActiveFilters || hasTempChanges
            ? ""
            : "opacity-50 cursor-not-allowed"
        }`}
      >
        <span>Tout effacer</span>
      </button>
      <button
        onClick={onShowResults}
        className={`primary-btn flex-1 ${
          hasTempChanges ? "bg-primary-700" : ""
        }`}
      >
        <span>Afficher les résultats</span>
      </button>
    </div>
  );
}
