"use client";

import { useState } from "react";
import FilterBottomSheet from "@/components/common/filters/filter-bottom-sheet";

export default function ConnexionPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <main className="p-4 mt-[200px]">
      <div className="flex justify-center">
        <button
          onClick={() => setIsFilterOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Ouvrir les filtres
        </button>
      </div>

      <FilterBottomSheet
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />
    </main>
  );
}
