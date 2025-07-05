import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useFilters } from "@/contexts/filter-context";

export function useCategoryFilter() {
  const searchParams = useSearchParams()!;
  const router = useRouter();
  const { updateTempFilters, applyFilters, clearFilters } = useFilters();
  const previousCategory = useRef<string | null>(null);
  
  const categoryParam = searchParams.get("category");

  useEffect(() => {
    // Éviter les appels inutiles si la catégorie n'a pas changé
    if (categoryParam === previousCategory.current) {
      return;
    }

    if (categoryParam) {
      // Appliquer le filtre de catégorie depuis l'URL
      updateTempFilters({ categories: [categoryParam] });
      applyFilters();
    } else if (previousCategory.current) {
      // Si on avait une catégorie avant mais plus maintenant, nettoyer
      clearFilters();
    }
    
    previousCategory.current = categoryParam;
  }, [categoryParam, updateTempFilters, applyFilters, clearFilters]);

  // Fonction pour effacer le paramètre de catégorie de l'URL
  const clearCategoryFilter = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete("category");
    
    // Reconstruire l'URL sans le paramètre category
    const newUrl = newSearchParams.toString() 
      ? `/evenements?${newSearchParams.toString()}`
      : "/evenements";
    
    router.push(newUrl);
  };

  return {
    categoryParam,
    hasCategoryFilter: !!categoryParam,
    clearCategoryFilter,
  };
} 