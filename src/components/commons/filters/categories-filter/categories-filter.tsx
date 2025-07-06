import { useState, useEffect, useCallback } from "react";
import { useFilters } from "@/contexts/filter-context";
import { Category } from "@/types";
import { categoryService } from "@/services/category-service";
import SelectorThemeTags from "@/components/tags/selector-theme-tags/selector-theme-tags";

export default function CategoriesFilter() {
  const { tempFilters, updateTempFilters } = useFilters();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    tempFilters.categories || []
  );

  // Charger les catégories depuis l'API
  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const categoriesData = await categoryService.getCategories();
      setCategories(categoriesData);
    } catch (err) {
      setError(err as Error);
      console.error("Erreur lors du chargement des catégories:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger les catégories au montage du composant
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Synchroniser avec les filtres du contexte
  useEffect(() => {
    const contextCategories = tempFilters.categories || [];
    if (
      JSON.stringify(contextCategories) !== JSON.stringify(selectedCategories)
    ) {
      setSelectedCategories(contextCategories);
    }
  }, [tempFilters.categories, selectedCategories]);

  // Gérer le changement de sélection depuis SelectorThemeTags
  const handleSelectionChange = useCallback(
    (selectedThemes: string[]) => {
      console.log("🎯 Categories selected:", selectedThemes);
      setSelectedCategories(selectedThemes);
      updateTempFilters({
        categories: selectedThemes.length > 0 ? selectedThemes : [],
      });
    },
    [updateTempFilters]
  );

  // Effacer toutes les catégories sélectionnées
  const clearCategories = useCallback(() => {
    setSelectedCategories([]);
    updateTempFilters({ categories: [] });
  }, [updateTempFilters]);

  const hasSelectedCategories = selectedCategories.length > 0;

  if (loading) {
    return (
      <div className="category-filter">
        <div className="loading">Chargement des catégories...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="category-filter">
        <div className="error">Erreur lors du chargement des catégories</div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 flex-col">
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <span className="title">Catégories</span>
          {hasSelectedCategories && (
            <span className="selected-count">
              {selectedCategories.length} sélectionnée
              {selectedCategories.length > 1 ? "s" : ""}
            </span>
          )}
        </div>
        {hasSelectedCategories && (
          <button onClick={clearCategories} className="text-primary-600">
            Tout effacer
          </button>
        )}
      </div>

      <SelectorThemeTags
        categories={categories}
        selectedThemes={selectedCategories}
        onSelectionChange={handleSelectionChange}
        itemsPerPage={10}
        showMoreLabel="Afficher plus de catégories"
      />
    </div>
  );
}
