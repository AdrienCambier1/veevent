"use client";

import BottomSheet from "@/components/common/bottom-sheet/bottom-sheet";
import Filters from "./filters";
import FilterFooter from "./filter-footer/filter-footer";

interface FilterBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FilterBottomSheet({
  isOpen,
  onClose,
}: FilterBottomSheetProps) {
  const handleShowResults = () => {
    onClose();
    // Logique pour appliquer les filtres et afficher les résultats
  };

  const handleClearAll = () => {
    // Logique pour effacer tous les filtres
    console.log("Effacer tous les filtres");
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} maxHeight="85vh">
      <div className="pb-20">
        <Filters />
      </div>
      <div className="absolute bottom-0 left-0 right-0">
        <FilterFooter
          onShowResults={handleShowResults}
          onClearAll={handleClearAll}
        />
      </div>
    </BottomSheet>
  );
}
