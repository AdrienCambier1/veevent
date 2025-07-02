import { useState, useEffect, useCallback } from "react";
import { placeService } from "@/services/place-service";
import { Place } from "@/types";

interface UsePlacesReturn {
  places: Place[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
  pageInfo?: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

export const usePlaces = (
  type?: "popular" | "search",
  searchTerm?: string,
  cityName?: string,
  limit?: number,
  page: number = 0,
  size: number = 10
): UsePlacesReturn => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [pageInfo, setPageInfo] = useState<UsePlacesReturn["pageInfo"]>();

  const fetchPlaces = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let data: Place[] = [];
      let pageData: UsePlacesReturn["pageInfo"] | undefined = undefined;

      switch (type) {
        case "popular":
          data = await placeService.getPopularPlaces(limit);
          break;
        case "search":
          if (searchTerm) {
            data = await placeService.searchPlaces(searchTerm);
          } else {
            const result = await placeService.getPlaces(page, size);
            data = result._embedded?.placeResponses || [];
            pageData = result.page;
          }
          break;
        default:
          if (cityName) {
            data = await placeService.getPlacesByCity(cityName);
          } else {
            const result = await placeService.getPlaces(page, size);
            data = result._embedded?.placeResponses || [];
            pageData = result.page;
          }
      }

      setPlaces(data || []);
      setPageInfo(pageData);
    } catch (err) {
      setError(err as Error);
      setPlaces([]);
      setPageInfo(undefined);
    } finally {
      setLoading(false);
    }
  }, [type, searchTerm, cityName, limit, page, size]);

  useEffect(() => {
    fetchPlaces();
  }, [fetchPlaces]);

  const refetch = useCallback(() => {
    fetchPlaces();
  }, [fetchPlaces]);

  return { places, loading, error, refetch, pageInfo };
};
