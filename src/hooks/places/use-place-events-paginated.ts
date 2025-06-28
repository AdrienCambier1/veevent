import { usePaginatedData } from "@/hooks/commons/use-paginated-data";
import { placeService } from "@/services/place-service";
import { Event, EventFilters, EventsResponse } from "@/types";
import { useCallback, useEffect, useState } from "react";

interface UsePlaceEventsPaginatedOptions {
  placeSlug: string;
  filters?: EventFilters;
  scrollTargetRef?: React.RefObject<HTMLElement | null>;
  filterVersion?: number;
}

export function usePlaceEventsPaginated({
  placeSlug,
  filters,
  scrollTargetRef,
  filterVersion,
}: UsePlaceEventsPaginatedOptions) {
  const [eventsHref, setEventsHref] = useState<string | null>(null);
  const [loadingPlace, setLoadingPlace] = useState(true);
  const [errorPlace, setErrorPlace] = useState<Error | null>(null);

  // Récupérer le lien events du lieu
  useEffect(() => {
    let isMounted = true;
    setLoadingPlace(true);
    setErrorPlace(null);
    placeService.getPlaceBySlug(placeSlug)
      .then((place) => {
        if (isMounted && place && place._links?.events?.href) {
          setEventsHref(place._links.events.href);
        }
      })
      .catch((err) => {
        if (isMounted) setErrorPlace(err as Error);
      })
      .finally(() => {
        if (isMounted) setLoadingPlace(false);
      });
    return () => { isMounted = false; };
  }, [placeSlug]);

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
    // Désactiver le filtre place et city pour la page lieu
    delete apiFilters.placeName;
    delete apiFilters.cityName;
    if (apiFilters.categories && Array.isArray(apiFilters.categories)) {
      apiFilters.categories = apiFilters.categories.join(",");
    }
    const result: EventsResponse = await placeService.getEventsByPlaceLink(eventsHref, apiFilters);
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
    loading: paginatedData.loading || loadingPlace,
    error: paginatedData.error || errorPlace,
  };
} 