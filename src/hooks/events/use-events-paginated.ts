import { usePaginatedData } from "@/hooks/commons/use-paginated-data";
import { eventService } from "@/services/event-service";
import { Event, EventFilters } from "@/types";
import { useCallback, useEffect } from "react";

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
  const fetchEvents = useCallback(async (page: number, size: number = 10) => {
    const result = await eventService.getEvents({
      ...filters,
      page,
      size,
    });
    
    return {
      items: result._embedded.eventSummaryResponses,
      pagination: result.page,
    };
  }, [filters, filterVersion]);

  const paginatedData = usePaginatedData({
    fetchData: fetchEvents,
    pageSize: 10,
    scrollTargetRef,
  });

  // Recharger les données quand les filtres changent ou que filterVersion change
  useEffect(() => {
    paginatedData.loadPage(0);
  }, [filterVersion]);

  useEffect(() => {
    paginatedData.refetch();
  }, [filterVersion]);

  return paginatedData;
} 