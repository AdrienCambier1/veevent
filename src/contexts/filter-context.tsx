"use client";
import React, { createContext, useContext, useState, ReactNode, useRef } from "react";

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
      ([key, value]) => {
        // Garder les valeurs non-null et non-undefined
        if (value === undefined || value === null) return false;
        
        // Pour les tableaux, garder même s'ils sont vides (pour les catégories)
        if (Array.isArray(value)) return true;
        
        // Pour les chaînes, ne pas garder si vides
        if (typeof value === 'string' && value.trim() === '') return false;
        
        return true;
      }
    )
  );
}

// Fonction utilitaire pour comparer deux objets de filtres
function areFiltersEqual(filters1: EventFilters, filters2: EventFilters): boolean {
  const clean1 = cleanFilters(filters1);
  const clean2 = cleanFilters(filters2);
  return JSON.stringify(clean1) === JSON.stringify(clean2);
}

export const FilterProvider: React.FC<FilterProviderProps> = ({ children }) => {
  const [tempFilters, setTempFilters] = useState<EventFilters>({});
  const [appliedFilters, setAppliedFilters] = useState<EventFilters>({});
  const [filterVersion, setFilterVersion] = useState(0);
  const previousAppliedFilters = useRef<EventFilters>({});

  const updateTempFilters = (newFilters: Partial<EventFilters>) => {
    setTempFilters((prev) => cleanFilters({ ...prev, ...newFilters }));
  };

  const applyFilters = () => {
    console.log("[FilterContext] applyFilters called", tempFilters);
    const cleanedFilters = cleanFilters(tempFilters);
    
    // Ne pas incrémenter filterVersion si les filtres n'ont pas changé
    if (!areFiltersEqual(cleanedFilters, previousAppliedFilters.current)) {
      setAppliedFilters(cleanedFilters);
      setFilterVersion((v) => v + 1);
      previousAppliedFilters.current = cleanedFilters;
    }
  };

  const clearFilters = () => {
    console.log("[FilterContext] clearFilters called");
    const emptyFilters = {};
    setTempFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    
    // Ne pas incrémenter filterVersion si les filtres étaient déjà vides
    if (!areFiltersEqual(previousAppliedFilters.current, emptyFilters)) {
      setFilterVersion((v) => v + 1);
      previousAppliedFilters.current = emptyFilters;
    }
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
