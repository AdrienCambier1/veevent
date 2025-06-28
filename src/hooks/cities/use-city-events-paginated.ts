import { usePaginatedData } from "@/hooks/commons/use-paginated-data";
import { cityService } from "@/services/city-service";
import { Event, EventFilters, EventsResponse } from "@/types";
import { useCallback, useEffect, useState } from "react";

interface UseCityEventsPaginatedOptions {
  cityName: string;
  filters?: EventFilters;
  scrollTargetRef?: React.RefObject<HTMLElement | null>;
  filterVersion?: number;
}

export function useCityEventsPaginated({
  cityName,
  filters,
  scrollTargetRef,
  filterVersion,
}: UseCityEventsPaginatedOptions) {
  const [eventsHref, setEventsHref] = useState<string | null>(null);
  const [loadingCity, setLoadingCity] = useState(true);
  const [errorCity, setErrorCity] = useState<Error | null>(null);

  // Récupérer le lien events de la ville
  useEffect(() => {
    let isMounted = true;
    setLoadingCity(true);
    setErrorCity(null);
    cityService.getCityByName(cityName)
      .then((city) => {
        if (isMounted && city && city._links?.events?.href) {
          setEventsHref(city._links.events.href);
        }
      })
      .catch((err) => {
        if (isMounted) setErrorCity(err as Error);
      })
      .finally(() => {
        if (isMounted) setLoadingCity(false);
      });
    return () => { isMounted = false; };
  }, [cityName]);

  // Fonction pour fetch les événements paginés
  const fetchEvents = useCallback(async (page: number, size: number = 10) => {
    if (!eventsHref) {
      return { items: [], pagination: { size: 10, totalElements: 0, totalPages: 1, number: 0 } };
    }
    // Préparer les filtres pour l'API
    const apiFilters: any = {
      ...filters,
      page,
      size,
    };
    if (apiFilters.categories && Array.isArray(apiFilters.categories)) {
      apiFilters.categories = apiFilters.categories.join(",");
    }
    const result: EventsResponse = await cityService.getEventsByCityLink(eventsHref, apiFilters);
    return {
      items: result._embedded?.eventSummaryResponses || [],
      pagination: result.page || { size: size, totalElements: 0, totalPages: 1, number: page },
    };
  }, [eventsHref, filters, filterVersion]);

  const paginatedData = usePaginatedData({
    fetchData: fetchEvents,
    pageSize: 10,
    scrollTargetRef,
  });

  // Forcer le reset à la première page quand eventsHref change
  useEffect(() => {
    if (eventsHref) {
      paginatedData.loadPage(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventsHref]);

  return {
    ...paginatedData,
    loading: paginatedData.loading || loadingCity,
    error: paginatedData.error || errorCity,
  };
} 