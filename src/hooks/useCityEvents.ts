import { useState, useEffect, useCallback, useMemo } from "react";
import { cityService } from "@/services/cityService";
import { SingleCity, Event } from "@/types";

interface UseCityEventsReturn {
  city: SingleCity | null;
  allEvents: Event[];
  trendingEvents: Event[];
  otherEvents: Event[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useCityEvents = (cityName: string): UseCityEventsReturn => {
  const [city, setCity] = useState<SingleCity | null>(null);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [trendingEvents, setTrendingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCityEvents = useCallback(async () => {
    if (!cityName) return;

    try {
      setLoading(true);
      setError(null);

      // 1. Récupérer les données de la ville
      const cityData = await cityService.getCityByName(cityName);
      
      if (!cityData) {
        throw new Error("Ville non trouvée");
      }

      setCity(cityData);

      if (cityData._links?.events?.href) {
        // 2. Récupérer tous les événements
        const allEventsPromise = cityService.getEventsByCityLink(
          cityData._links.events.href
        );

        // 3. Récupérer les événements trending
        const trendingEventsPromise = cityService.getTrendingEventsByCityLink(
          cityData._links.events.href
        );

        const [allEventsData, trendingEventsData] = await Promise.all([
          allEventsPromise,
          trendingEventsPromise
        ]);

        setAllEvents(allEventsData);
        setTrendingEvents(trendingEventsData);
      }

    } catch (err) {
      setError(err as Error);
      setCity(null);
      setAllEvents([]);
      setTrendingEvents([]);
    } finally {
      setLoading(false);
    }
  }, [cityName]);

  useEffect(() => {
    fetchCityEvents();
  }, [fetchCityEvents]);

  // Calculer les autres événements (non trending)
  const otherEvents = useMemo(() => {
    const trendingIds = trendingEvents.map(event => {
      const href = event._links.self.href;
      return href.split("/").pop();
    });

    return allEvents.filter(event => {
      const href = event._links.self.href;
      const id = href.split("/").pop();
      return !trendingIds.includes(id);
    });
  }, [allEvents, trendingEvents]);

  const refetch = useCallback(() => {
    fetchCityEvents();
  }, [fetchCityEvents]);

  return { 
    city, 
    allEvents, 
    trendingEvents, 
    otherEvents, 
    loading, 
    error, 
    refetch 
  };
};