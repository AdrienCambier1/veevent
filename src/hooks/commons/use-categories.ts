import { useState, useEffect } from "react";
import { Category } from "@/types";
import { categoryService } from "@/services/category-service";

interface UseCategoriesOptions {
  withEventsOnly?: boolean;
}

export function useCategories(options: UseCategoriesOptions = {}) {
  const { withEventsOnly = true } = options;
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = withEventsOnly 
          ? await categoryService.getCategoriesWithEvents()
          : await categoryService.getAllCategories();
        setCategories(data);
      } catch (err) {
        setError(err as Error);
        console.error("Erreur lors du chargement des catégories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [withEventsOnly]);

  return { categories, loading, error };
}

// Hook pour les catégories tendances
export function useTrendingCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTrendingCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await categoryService.getTrendingCategories();
        setCategories(data);
      } catch (err) {
        setError(err as Error);
        console.error(
          "Erreur lors du chargement des catégories tendances:",
          err
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingCategories();
  }, []);

  return { categories, loading, error };
}
