import { useState, useEffect, useCallback } from "react";
import { cityService } from "@/services/city-service";
import { SingleUser } from "@/types";

interface UseOrganizersReturn {
  organizers: SingleUser[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useOrganizers = (cityName?: string): UseOrganizersReturn => {
  const [organizers, setOrganizers] = useState<SingleUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchOrganizers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let organizersResponse;

      if (cityName) {
        organizersResponse = await cityService.getOrganizersByCity(cityName);
      } else {
        organizersResponse = await cityService.getOrganizers();
      }

      setOrganizers(organizersResponse._embedded?.userResponses || []);
    } catch (err) {
      setError(err as Error);
      setOrganizers([]);
    } finally {
      setLoading(false);
    }
  }, [cityName]);

  useEffect(() => {
    fetchOrganizers();
  }, [fetchOrganizers]);

  const refetch = useCallback(() => {
    fetchOrganizers();
  }, [fetchOrganizers]);

  return { organizers, loading, error, refetch };
};
