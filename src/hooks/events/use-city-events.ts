import { useState, useEffect, useCallback } from "react";
import { eventService } from "@/services/event-service";
import { Event } from "@/types";
import { useCity } from "@/contexts/city-context";

interface UseCityEventsReturn {
  events: Event[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useCityEvents = (limit?: number): UseCityEventsReturn => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { selectedCity, nearbyCities } = useCity();

  const fetchCityEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Si aucune ville n'est sélectionnée, ne pas faire d'appel
      if (!selectedCity) {
        setEvents([]);
        return;
      }

      // Créer un tableau avec la ville sélectionnée et ses villes proches
      const citiesToSearch = [
        selectedCity.name,
        ...nearbyCities.map((city) => city.name),
      ];

      // Utiliser la nouvelle méthode getEventsByCities
      const cityEvents = await eventService.getEventsByCities(
        citiesToSearch,
        limit || 6
      );

      setEvents(cityEvents);
    } catch (err) {
      console.error("❌ Erreur dans useCityEvents:", err);
      setError(err as Error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCity, nearbyCities, limit]);

  useEffect(() => {
    fetchCityEvents();
  }, [fetchCityEvents]);

  const refetch = useCallback(() => {
    fetchCityEvents();
  }, [fetchCityEvents]);

  return {
    events,
    loading,
    error,
    refetch,
  };
};
