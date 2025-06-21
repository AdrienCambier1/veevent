import { useState, useEffect, useCallback } from "react";
import { cityService } from "@/services/cityService";
import { City } from "@/types";

interface UseCitiesReturn {
  cities: City[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useCities = (
  type?: "popular" | "byRegion",
  options?: {
    region?: string;
    limit?: number;
    searchTerm?: string;
  }
): UseCitiesReturn => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let data: City[] = [];

      switch (type) {
        case "popular":
          data = await cityService.getPopularCities(options?.limit);
          break;
        case "byRegion":
          if (options?.region) {
            data = await cityService.getCitiesByRegion(options.region);
          } else {
            data = await cityService.getCities();
          }
          break;
        default:
          if (options?.searchTerm) {
            data = await cityService.searchCities(options.searchTerm);
          } else {
            data = await cityService.getCities();
          }
      }

      setCities(data || []);
    } catch (err) {
      setError(err as Error);
      setCities([]);
    } finally {
      setLoading(false);
    }
  }, [type, options?.region, options?.limit, options?.searchTerm]);

  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

  const refetch = useCallback(() => {
    fetchCities();
  }, [fetchCities]);

  return { cities, loading, error, refetch };
};
