import { useState, useEffect, useCallback } from "react";
import { cityService } from "@/services/cityService";
import { SingleCity, Event } from "@/types";

interface UseCityReturn {
  city: SingleCity | null;
  events: Event[];
  nearestCities: string[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useCity = (cityName: string): UseCityReturn => {
  const [city, setCity] = useState<SingleCity | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [nearestCities, setNearestCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCityData = useCallback(async () => {
    if (!cityName) return;

    try {
      setLoading(true);
      setError(null);

      // Récupérer les données de la ville
      const cityData = await cityService.getCityByName(cityName);
      
      if (!cityData) {
        throw new Error("Ville non trouvée");
      }

      setCity(cityData);
      setNearestCities(cityData.nearestCities || []);

      // Récupérer les événements de la ville
      try {
        const cityEvents = await cityService.getEventsByCity(cityData.id);
        setEvents(cityEvents);
      } catch (eventError) {
        console.warn("Erreur lors du chargement des événements:", eventError);
        setEvents([]);
      }

    } catch (err) {
      setError(err as Error);
      setCity(null);
      setEvents([]);
      setNearestCities([]);
    } finally {
      setLoading(false);
    }
  }, [cityName]);

  useEffect(() => {
    fetchCityData();
  }, [fetchCityData]);

  const refetch = useCallback(() => {
    fetchCityData();
  }, [fetchCityData]);

  return { city, events, nearestCities, loading, error, refetch };
};