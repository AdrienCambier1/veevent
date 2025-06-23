"use client";

import BottomSheet from "@/components/common/bottom-sheet/bottom-sheet";
import Filters from "./filters";
import FilterFooter from "./filter-footer/filter-footer";
import { useFilters } from "@/contexts/FilterContext";

interface FilterBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FilterBottomSheet({
  isOpen,
  onClose,
}: FilterBottomSheetProps) {
  const { clearFilters, hasActiveFilters, applyFilters, hasTempChanges } = useFilters();

  const handleShowResults = () => {
    applyFilters(); // Appliquer les filtres temporaires
    onClose();
  };

  const handleClearAll = () => {
    clearFilters();
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
          hasActiveFilters={hasActiveFilters}
          hasTempChanges={hasTempChanges}
        />
      </div>
    </BottomSheet>
  );
}
