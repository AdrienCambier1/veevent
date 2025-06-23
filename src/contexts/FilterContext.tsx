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

export const FilterProvider: React.FC<FilterProviderProps> = ({ children }) => {
  const [tempFilters, setTempFilters] = useState<EventFilters>({});
  const [appliedFilters, setAppliedFilters] = useState<EventFilters>({});

  const updateTempFilters = (newFilters: Partial<EventFilters>) => {
    setTempFilters(prev => ({ ...prev, ...newFilters }));
  };

  const applyFilters = () => {
    setAppliedFilters(tempFilters);
  };

  const clearFilters = () => {
    setTempFilters({});
    setAppliedFilters({});
  };

  const hasActiveFilters = Object.keys(appliedFilters).length > 0;
  const hasTempChanges = JSON.stringify(tempFilters) !== JSON.stringify(appliedFilters);

  return (
    <FilterContext.Provider value={{
      tempFilters,
      appliedFilters,
      updateTempFilters,
      applyFilters,
      clearFilters,
      hasActiveFilters,
      hasTempChanges
    }}>
      {children}
    </FilterContext.Provider>
  );
};