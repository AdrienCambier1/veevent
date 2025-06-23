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
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex gap-3 z-50">
      <button
        onClick={onClearAll}
        disabled={!hasActiveFilters && !hasTempChanges}
        className={`flex-1 py-3 border rounded-[var(--vv-border-radius)] font-medium transition-colors ${
          hasActiveFilters || hasTempChanges
            ? "border-gray-300 text-gray-700 hover:bg-gray-50"
            : "border-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        Tout effacer
      </button>
      <button
        onClick={onShowResults}
        className={`primary-btn w-fit px-6 ${
          hasTempChanges ? "bg-primary-700" : ""
        }`}
      >
        <span className="text-primary-50 text-sm font-semibold">
          Afficher les résultats
          {hasTempChanges && " *"}
        </span>
      </button>
    </div>
  );
}
