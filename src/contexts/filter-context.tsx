"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

export interface EventFilters {
  minPrice?: number;
  maxPrice?: number;
  startDate?: string;
  endDate?: string;
  categories?: string[];
  sortBy?: "date" | "price" | "popularity";
  sortOrder?: "asc" | "desc";
  cityName?: string;
  placeName?: string;
  selectedCityObj?: any; // Objet complet de la ville sélectionnée
  selectedPlaceObj?: any; // Objet complet du lieu sélectionné
}

interface FilterContextType {
  // Filtres temporaires (en cours d'édition)
  tempFilters: EventFilters;
  // Filtres appliqués (utilisés pour les requêtes)
  appliedFilters: EventFilters;
  updateTempFilters: (newFilters: Partial<EventFilters>) => void;
  applyFilters: () => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
  hasTempChanges: boolean;
  filterVersion: number;
  removeFilterAndApply: (key: string) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilters must be used within a FilterProvider");
  }
  return context;
};

interface FilterProviderProps {
  children: ReactNode;
}

// Fonction utilitaire pour nettoyer les filtres
function cleanFilters(filters: EventFilters): EventFilters {
  return Object.fromEntries(
    Object.entries(filters).filter(
      ([, value]) => value !== undefined && value !== null && !(Array.isArray(value) && value.length === 0)
    )
  );
}

export const FilterProvider: React.FC<FilterProviderProps> = ({ children }) => {
  const [tempFilters, setTempFilters] = useState<EventFilters>({});
  const [appliedFilters, setAppliedFilters] = useState<EventFilters>({});
  const [filterVersion, setFilterVersion] = useState(0);

  const updateTempFilters = (newFilters: Partial<EventFilters>) => {
    setTempFilters((prev) => cleanFilters({ ...prev, ...newFilters }));
  };

  const applyFilters = () => {
    console.log("[FilterContext] applyFilters called", tempFilters);
    setAppliedFilters(cleanFilters(tempFilters));
    setFilterVersion((v) => v + 1);
  };

  const clearFilters = () => {
    console.log("[FilterContext] clearFilters called");
    setTempFilters({});
    setAppliedFilters({});
    setFilterVersion((v) => v + 1);
  };

  const hasActiveFilters = Object.keys(appliedFilters).length > 0;
  const hasTempChanges =
    JSON.stringify(tempFilters) !== JSON.stringify(appliedFilters);

  // Supprimer un filtre et appliquer immédiatement
  const removeFilterAndApply = (key: string) => {
    setTempFilters((prev) => {
      const newFilters: EventFilters = { ...prev };
      delete newFilters[key as keyof EventFilters];
      return newFilters;
    });
    setAppliedFilters((prev) => {
      const newFilters: EventFilters = { ...prev };
      delete newFilters[key as keyof EventFilters];
      return newFilters;
    });
    setFilterVersion((v) => v + 1);
  };

  return (
    <FilterContext.Provider
      value={{
        tempFilters,
        appliedFilters,
        updateTempFilters,
        applyFilters,
        clearFilters,
        hasActiveFilters,
        hasTempChanges,
        filterVersion,
        removeFilterAndApply,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};
