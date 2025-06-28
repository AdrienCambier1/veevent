"use client";

import BottomSheet from "@/components/commons/bottom-sheet/bottom-sheet";
import Filters from "./filters";
import FilterFooter from "./filter-footer/filter-footer";
import { useFilters } from "@/contexts/filter-context";
import { useParams } from "next/navigation";

interface FilterBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FilterBottomSheet({
  isOpen,
  onClose,
}: FilterBottomSheetProps) {
  const { clearFilters, hasActiveFilters, applyFilters, hasTempChanges } =
    useFilters();

  // Récupérer le nom de la ville et du lieu depuis l'URL si présent
  let cityName: string | undefined = undefined;
  let placeName: string | undefined = undefined;
  let isPlacePage = false;
  
  try {
    const params = useParams();
    if (params && typeof params.city === "string") {
      cityName = decodeURIComponent(params.city);
    }
    if (params && typeof params.place === "string") {
      placeName = decodeURIComponent(params.place);
      isPlacePage = true;
    }
  } catch {}

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
        <Filters 
          hideCityFilter={!!cityName || isPlacePage} 
          hidePlaceFilter={isPlacePage}
          cityName={cityName} 
        />
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
