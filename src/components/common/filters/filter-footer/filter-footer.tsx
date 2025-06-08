"use client";

interface FilterFooterProps {
  onShowResults: () => void;
  onClearAll: () => void;
}

export default function FilterFooter({
  onShowResults,
  onClearAll,
}: FilterFooterProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex gap-3 z-50">
      <button
        onClick={onClearAll}
        className="flex-1 py-3 border border-gray-300 rounded-[var(--vv-border-radius)] text-gray-700 font-medium hover:bg-gray-50 transition-colors"
      >
        Tout effacer
      </button>
      <button onClick={onShowResults} className="primary-btn w-fit px-6">
        <span className="text-primary-50 text-sm font-semibold">
          Afficher les résultats
        </span>
      </button>
    </div>
  );
}
