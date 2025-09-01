import { usePaginatedData } from "@/hooks/commons/use-paginated-data";
import { eventService } from "@/services/event-service";
import { Event, EventFilters } from "@/types";
import { useCallback, useEffect, useMemo, useRef } from "react";

interface UseEventsPaginatedOptions {
  filters?: EventFilters;
  scrollTargetRef?: React.RefObject<HTMLElement | null>;
  filterVersion?: number;
}

export function useEventsPaginated({
  filters,
  scrollTargetRef,
  filterVersion = 0,
}: UseEventsPaginatedOptions = {}) {
  const previousFiltersRef = useRef<EventFilters | undefined>(undefined);
  const previousFilterVersionRef = useRef<number>(0);

  // Stabiliser la fonction fetchEvents avec useMemo pour éviter les re-créations
  const fetchEvents = useMemo(() => {
    return async (page: number, size: number = 12) => {
      const result = await eventService.getEvents({
        ...filters,
        page,
        size,
      });
      console.log("Résultat filtré (events):", result._embedded.eventSummaryResponses);
      return {
        items: result._embedded.eventSummaryResponses,
        pagination: result.page,
      };
    };
  }, [filters, filterVersion]);

  const paginatedData = usePaginatedData({
    fetchData: fetchEvents,
    pageSize: 12,
    scrollTargetRef,
  });

  // Recharger les données seulement quand filterVersion change ET que les filtres ont réellement changé
  useEffect(() => {
    const filtersChanged = JSON.stringify(filters) !== JSON.stringify(previousFiltersRef.current);
    const versionChanged = filterVersion !== previousFilterVersionRef.current;
    
    if (filtersChanged || versionChanged) {
      paginatedData.refetch();
      previousFiltersRef.current = filters;
      previousFilterVersionRef.current = filterVersion;
    }
  }, [filterVersion, filters, paginatedData.refetch]);

  return paginatedData;
}