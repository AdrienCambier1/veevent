import { useState, useEffect, useCallback } from "react";
import { cityService } from "@/services/city-service";
import { SingleCity, Event } from "@/types";

interface UseCityReturn {
  city: SingleCity | null;
  events: Event[];
  nearestCities: SingleCity[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useCity = (cityName: string): UseCityReturn => {
  const [city, setCity] = useState<SingleCity | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [nearestCities, setNearestCities] = useState<SingleCity[]>([]);
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

      // Récupérer les villes les plus proches
      if (cityData.nearestCities && cityData.nearestCities.length > 0) {
        try {
          const nearestCitiesData = await Promise.all(
            cityData.nearestCities.map(async (cityId: number) => {
              try {
                return await cityService.getCityById(cityId);
              } catch (error) {
                console.warn(
                  `Erreur lors du chargement de la ville ${cityId}:`,
                  error
                );
                return null;
              }
            })
          );

          // Filtrer les villes nulles (en cas d'erreur)
          const validNearestCities = nearestCitiesData.filter(
            (city): city is SingleCity => city !== null
          );
          setNearestCities(validNearestCities);
        } catch (nearestCitiesError) {
          console.warn(
            "Erreur lors du chargement des villes proches:",
            nearestCitiesError
          );
          setNearestCities([]);
        }
      } else {
        setNearestCities([]);
      }

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
