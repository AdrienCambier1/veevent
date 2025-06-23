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

      let organizersData: SingleUser[];

      if (cityName) {
        organizersData = await cityService.getOrganizersByCity(cityName);
      } else {
        organizersData = await cityService.getOrganizers();
      }

      setOrganizers(organizersData);
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
