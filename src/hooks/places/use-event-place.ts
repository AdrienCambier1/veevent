import { useState, useEffect, useCallback } from "react";
import { placeService } from "@/services/place-service";
import { SinglePlace } from "@/types";

interface UseEventPlaceReturn {
  place: SinglePlace | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useEventPlace = (placeLink?: string): UseEventPlaceReturn => {
  const [place, setPlace] = useState<SinglePlace | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchPlace = useCallback(async () => {
    if (!placeLink) {
      setPlace(null);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await placeService.getPlaceByLink(placeLink);
      setPlace(data);
    } catch (err) {
      setError(err as Error);
      setPlace(null);
    } finally {
      setLoading(false);
    }
  }, [placeLink]);

  useEffect(() => {
    fetchPlace();
  }, [fetchPlace]);

  const refetch = useCallback(() => {
    fetchPlace();
  }, [fetchPlace]);

  return { place, loading, error, refetch };
}; 