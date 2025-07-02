import { useState, useEffect, useCallback, useMemo } from "react";
import { cityService } from "@/services/city-service";
import { SingleCity, Event, EventFilters } from "@/types";

type EventType = "all" | "trending" | "firstEdition";

interface UseCityEventsOptions {
  fetchAll?: boolean;
  fetchTrending?: boolean;
  fetchFirstEdition?: boolean;
  filters?: EventFilters;
}

interface UseCityEventsReturn {
  city: SingleCity | null;
  allEvents: Event[];
  trendingEvents: Event[];
  firstEditionEvents: Event[];
  loading: boolean;
  error: Error | null;
  refetch: (options?: UseCityEventsOptions) => void;
  applyFilters: (filters: EventFilters) => void;
}

export const useCityEvents = (
  cityName: string,
  options: UseCityEventsOptions = {
    fetchAll: true,
    fetchTrending: true,
    fetchFirstEdition: false,
  }
): UseCityEventsReturn => {
  const [city, setCity] = useState<SingleCity | null>(null);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [trendingEvents, setTrendingEvents] = useState<Event[]>([]);
  const [firstEditionEvents, setFirstEditionEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentFilters, setCurrentFilters] = useState<EventFilters>({});

  // Mémoriser les options pour éviter les rerenders
  const memoizedOptions = useMemo(
    () => options,
    [
      options.fetchAll,
      options.fetchTrending,
      options.fetchFirstEdition,
      JSON.stringify(options.filters),
    ]
  );

  const fetchCityEvents = useCallback(
    async (fetchOptions?: UseCityEventsOptions) => {
      if (!cityName) return;

      const finalOptions = { ...memoizedOptions, ...fetchOptions };
      const filtersToApply = finalOptions.filters || currentFilters;

      try {
        setLoading(true);
        setError(null);

        // 1. Récupérer d'abord les données de base de la ville
        const cityData = await cityService.getCityByName(cityName);

        if (!cityData) {
          throw new Error("Ville non trouvée");
        }

        setCity(cityData);

        // Convertir les filtres pour l'API
        const apiFilters = {
          minPrice: filtersToApply.minPrice,
          maxPrice: filtersToApply.maxPrice,
          startDate: filtersToApply.startDate,
          endDate: filtersToApply.endDate,
          categories: filtersToApply.categories?.join(","),
        };

        // Préparer les promesses selon les options
        const promises: Promise<Event[]>[] = [];
        const promiseTypes: EventType[] = [];

        if (finalOptions.fetchAll && cityData._links?.events?.href) {
          promises.push(
            cityService
              .getEventsByCityLink(cityData._links.events.href, apiFilters)
              .then(
                (response) => response._embedded?.eventSummaryResponses || []
              )
          );
          promiseTypes.push("all");
        }

        if (finalOptions.fetchTrending && cityData._links?.events?.href) {
          promises.push(
            cityService.getTrendingEventsByCityLink(cityData._links.events.href)
          );
          promiseTypes.push("trending");
        }

        if (finalOptions.fetchFirstEdition) {
          promises.push(cityService.getFirstEditionEventsByCity(cityName));
          promiseTypes.push("firstEdition");
        }

        // Exécuter toutes les promesses en parallèle
        if (promises.length > 0) {
          const results = await Promise.all(promises);

          // Assigner les résultats selon leur type
          results.forEach((result, index) => {
            const type = promiseTypes[index];
            let sortedResult = result;

            // Appliquer le tri côté client si nécessaire
            if (filtersToApply.sortBy) {
              sortedResult = sortEvents(
                result,
                filtersToApply.sortBy,
                filtersToApply.sortOrder
              );
            }

            switch (type) {
              case "all":
                setAllEvents(sortedResult);
                break;
              case "trending":
                setTrendingEvents(sortedResult);
                break;
              case "firstEdition":
                setFirstEditionEvents(sortedResult);
                break;
            }
          });
        }
      } catch (err) {
        setError(err as Error);
        setCity(null);
        setAllEvents([]);
        setTrendingEvents([]);
        setFirstEditionEvents([]);
      } finally {
        setLoading(false);
      }
    },
    [cityName, memoizedOptions, currentFilters]
  );

  // Fonction pour trier les événements côté client
  const sortEvents = (
    events: Event[],
    sortBy: string,
    sortOrder: string = "asc"
  ): Event[] => {
    return [...events].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "date":
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case "price":
          comparison = a.price - b.price;
          break;
        case "popularity":
          comparison = a.currentParticipants - b.currentParticipants;
          break;
        default:
          return 0;
      }

      return sortOrder === "desc" ? -comparison : comparison;
    });
  };

  const applyFilters = useCallback(
    (filters: EventFilters) => {
      setCurrentFilters(filters);
      fetchCityEvents({ filters });
    },
    [fetchCityEvents]
  );

  useEffect(() => {
    fetchCityEvents();
  }, [fetchCityEvents]);

  const refetch = useCallback(
    (refetchOptions?: UseCityEventsOptions) => {
      fetchCityEvents(refetchOptions);
    },
    [fetchCityEvents]
  );

  return {
    city,
    allEvents,
    trendingEvents,
    firstEditionEvents,
    loading,
    error,
    refetch,
    applyFilters,
  };
};
