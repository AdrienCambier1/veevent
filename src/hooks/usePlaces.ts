import { useState, useEffect, useCallback } from "react";
import { placeService } from "@/services/placeService";
import { Place } from "@/types";

interface UsePlacesReturn {
  places: Place[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const usePlaces = (
  type?: "popular" | "search",
  searchTerm?: string,
  cityName?: string,
  limit?: number
): UsePlacesReturn => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPlaces = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let data: Place[] = [];

      switch (type) {
        case "popular":
          data = await placeService.getPopularPlaces(limit);
          break;
        case "search":
          if (searchTerm) {
            data = await placeService.searchPlaces(searchTerm);
          } else {
            data = await placeService.getPlaces();
          }
          break;
        default:
          if (cityName) {
            data = await placeService.getPlacesByCity(cityName);
          } else {
            data = await placeService.getPlaces();
          }
      }

      setPlaces(data || []);
    } catch (err) {
      setError(err as Error);
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  }, [type, searchTerm, cityName, limit]);

  useEffect(() => {
    fetchPlaces();
  }, [fetchPlaces]);

  const refetch = useCallback(() => {
    fetchPlaces();
  }, [fetchPlaces]);

  return { places, loading, error, refetch };
};