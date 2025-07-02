"use client";

import { Drawer } from "vaul";
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
    <Drawer.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Drawer.Content className="bg-white flex flex-col rounded-t-[20px] h-[85vh] mt-24 fixed bottom-0 left-0 right-0 w-full z-50">
          {/* Header avec handle */}
          <div className="flex-shrink-0 p-4 pb-0">
            <div className="mx-auto w-12 h-1.5 rounded-full bg-gray-300 mb-6" />
            <Drawer.Title className="text-xl md:text-2xl font-bold text-center mb-4 md:mb-6">
              Filtres
            </Drawer.Title>
          </div>
          
          {/* Contenu scrollable */}
          <div className="flex-1 overflow-y-auto px-4">
            <div className="w-full pb-6">
              <Filters
                hideCityFilter={!!cityName || isPlacePage}
                hidePlaceFilter={isPlacePage}
                cityName={cityName}
              />
            </div>
          </div>
          
          {/* Footer fixe */}
          <div className="flex-shrink-0 bg-white border-t border-gray-200 p-4">
            <div className="w-full">
              <FilterFooter
                onShowResults={handleShowResults}
                onClearAll={handleClearAll}
                hasActiveFilters={hasActiveFilters}
                hasTempChanges={hasTempChanges}
              />
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
