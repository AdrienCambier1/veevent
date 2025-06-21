import { useState, useEffect, useCallback, useMemo } from "react";
import { cityService } from "@/services/cityService";
import { SingleCity, Event, Place } from "@/types";

interface UseCityDataReturn {
  city: SingleCity | null;
  events: Event[];
  places: Place[];
  organizers: any[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useCityData = (
  cityName: string,
  dataType?: "events" | "places" | "organizers" | "trending" | "all",
  filters?: {
    minPrice?: number;
    maxPrice?: number;
    startDate?: string;
    endDate?: string;
    categories?: string;
  }
): UseCityDataReturn => {
  const [city, setCity] = useState<SingleCity | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [organizers, setOrganizers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Stabiliser l'objet filters avec useMemo
  const stableFilters = useMemo(() => {
    if (!filters) return undefined;

    // Ne retourner un objet que si au moins un filtre a une valeur
    const hasFilters = Object.values(filters).some(
      (value) => value !== undefined && value !== null && value !== ""
    );

    return hasFilters ? filters : undefined;
  }, [
    filters?.minPrice,
    filters?.maxPrice,
    filters?.startDate,
    filters?.endDate,
    filters?.categories,
  ]);

  const fetchCityData = useCallback(async () => {
    if (!cityName) return;

    try {
      setLoading(true);
      setError(null);

      // 1. Récupérer d'abord les données de base de la ville
      const cityData = await cityService.getCityByName(cityName);

      if (!cityData) {
        throw new Error("Ville non trouvée");
      }

      setCity(cityData);

      // 2. Utiliser les liens HATEOAS pour récupérer les données spécifiques
      if (dataType === "events" || dataType === "all") {
        if (cityData._links?.events?.href) {
          try {
            const cityEvents = await cityService.getEventsByCityLink(
              cityData._links.events.href,
              stableFilters
            );
            setEvents(cityEvents);
          } catch (eventError) {
            console.warn(
              "Erreur lors du chargement des événements:",
              eventError
            );
            setEvents([]);
          }
        }
      }

      // 3. Gestion spécifique des événements trending
      if (dataType === "trending") {
        if (cityData._links?.events?.href) {
          try {
            const trendingEvents = await cityService.getTrendingEventsByCityLink(
              cityData._links.events.href
            );
            setEvents(trendingEvents);
          } catch (eventError) {
            console.warn(
              "Erreur lors du chargement des événements trending:",
              eventError
            );
            setEvents([]);
          }
        }
      }

      if (dataType === "places" || dataType === "all") {
        if (cityData._links?.places?.href) {
          try {
            const cityPlaces = await cityService.getPlacesByCityLink(
              cityData._links.places.href
            );
            setPlaces(cityPlaces);
          } catch (placesError) {
            console.warn("Erreur lors du chargement des lieux:", placesError);
            setPlaces([]);
          }
        }
      }

      if (dataType === "organizers" || dataType === "all") {
        if (cityData._links?.events?.href) {
          try {
            const cityOrganizers = await cityService.getOrganizersByCityEvents(
              cityData._links.events.href
            );
            setOrganizers(cityOrganizers);
          } catch (organizersError) {
            console.warn(
              "Erreur lors du chargement des organisateurs:",
              organizersError
            );
            setOrganizers([]);
          }
        }
      }
    } catch (err) {
      setError(err as Error);
      setCity(null);
      setEvents([]);
      setPlaces([]);
      setOrganizers([]);
    } finally {
      setLoading(false);
    }
  }, [cityName, dataType, stableFilters]);

  useEffect(() => {
    fetchCityData();
  }, [fetchCityData]);

  const refetch = useCallback(() => {
    fetchCityData();
  }, [fetchCityData]);

  return { city, events, places, organizers, loading, error, refetch };
};
