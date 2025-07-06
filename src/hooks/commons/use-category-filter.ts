import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef, useCallback } from "react";
import { useFilters } from "@/contexts/filter-context";

export function useCategoryFilter() {
  const searchParams = useSearchParams()!;
  const router = useRouter();
  const { tempFilters, updateTempFilters, applyFilters, clearFilters } = useFilters();
  const previousCategory = useRef<string | null>(null);
  const isInitialized = useRef<boolean>(false);
  const isProcessing = useRef<boolean>(false);
  
  const categoryParam = searchParams.get("category");

  // Stabiliser les fonctions pour éviter les re-créations
  const stableUpdateTempFilters = useCallback(updateTempFilters, [updateTempFilters]);
  const stableApplyFilters = useCallback(applyFilters, [applyFilters]);
  const stableClearFilters = useCallback(clearFilters, [clearFilters]);

  useEffect(() => {
    // Éviter les appels simultanés
    if (isProcessing.current) {
      return;
    }

    // Éviter les appels inutiles si la catégorie n'a pas changé
    if (categoryParam === previousCategory.current) {
      return;
    }

    // Éviter l'appel initial si on n'a pas de catégorie
    if (!isInitialized.current && !categoryParam) {
      isInitialized.current = true;
      return;
    }

    isProcessing.current = true;

    try {
      if (categoryParam) {
        // Combiner les filtres existants avec la catégorie
        const newFilters = {
          ...tempFilters,
          categories: [categoryParam]
        };
        stableUpdateTempFilters(newFilters);
        stableApplyFilters();
      } else if (previousCategory.current) {
        // Si on avait une catégorie avant mais plus maintenant, nettoyer seulement la catégorie
        const { categories, ...filtersWithoutCategory } = tempFilters;
        stableUpdateTempFilters(filtersWithoutCategory);
        stableApplyFilters();
      }
    } finally {
      isProcessing.current = false;
    }
    
    previousCategory.current = categoryParam;
    isInitialized.current = true;
  }, [categoryParam, tempFilters, stableUpdateTempFilters, stableApplyFilters, stableClearFilters]);

  // Fonction pour effacer le paramètre de catégorie de l'URL
  const clearCategoryFilter = useCallback(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete("category");
    
    // Reconstruire l'URL sans le paramètre category
    const newUrl = newSearchParams.toString() 
      ? `/evenements?${newSearchParams.toString()}`
      : "/evenements";
    
    router.push(newUrl);
  }, [searchParams, router]);

  return {
    categoryParam,
    hasCategoryFilter: !!categoryParam,
    clearCategoryFilter,
  };
} 