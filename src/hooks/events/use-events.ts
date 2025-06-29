import { useState, useEffect, useCallback } from "react";
import { eventService } from "@/services/event-service";
import { Event, EventFilters, PaginationInfo } from "@/types";

interface UseEventsReturn {
  events: Event[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
  pagination?: PaginationInfo;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  loadNextPage: () => void;
  loadPreviousPage: () => void;
  loadPage: (page: number) => void;
}

export const useEvents = (
  type?: "popular" | "deals" | "free" | "trending",
  filters?: EventFilters,
  scrollTargetRef?: React.RefObject<HTMLElement | null>
): UseEventsReturn => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | undefined>(undefined);

  const scrollToTarget = useCallback(() => {
    if (scrollTargetRef?.current) {
      const headerHeight = 80; // Hauteur approximative du header en pixels
      const elementTop = scrollTargetRef.current.offsetTop;
      const offsetPosition = elementTop - headerHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    } else {
      // Fallback vers le haut de la page si pas de référence
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [scrollTargetRef]);

  const fetchEvents = useCallback(async (pageFilters?: EventFilters) => {
    try {
      setLoading(true);
      setError(null);

      let data: any = null;

      switch (type) {
        case "popular":
          data = await eventService.getPopularEvents();
          setEvents(data || []);
          break;
        case "deals":
          data = await eventService.getDealEvents();
          setEvents(data || []);
          break;
        case "free":
          data = await eventService.getFreeEvents();
          setEvents(data || []);
          break;
        case "trending":
          data = await eventService.getTrendingEvents();
          setEvents(data || []);
          break;
        default:
          data = await eventService.getEvents(pageFilters || filters);
          setEvents(data._embedded.eventSummaryResponses || []);
          setPagination(data.page);
      }
    } catch (err) {
      setError(err as Error);
      setEvents([]);
      setPagination(undefined);
    } finally {
      setLoading(false);
    }
  }, [type, filters]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const refetch = useCallback(() => {
    fetchEvents();
  }, [fetchEvents]);

  const loadNextPage = useCallback(() => {
    if (pagination && pagination.number < pagination.totalPages - 1) {
      const nextPage = pagination.number + 1;
      fetchEvents({ ...filters, page: nextPage });
      scrollToTarget();
    }
  }, [pagination, filters, fetchEvents, scrollToTarget]);

  const loadPreviousPage = useCallback(() => {
    if (pagination && pagination.number > 0) {
      const previousPage = pagination.number - 1;
      fetchEvents({ ...filters, page: previousPage });
      scrollToTarget();
    }
  }, [pagination, filters, fetchEvents, scrollToTarget]);

  const loadPage = useCallback((page: number) => {
    if (pagination && page >= 0 && page < pagination.totalPages) {
      fetchEvents({ ...filters, page });
      scrollToTarget();
    }
  }, [pagination, filters, fetchEvents, scrollToTarget]);

  const hasNextPage = pagination ? pagination.number < pagination.totalPages - 1 : false;
  const hasPreviousPage = pagination ? pagination.number > 0 : false;

  return { 
    events, 
    loading, 
    error, 
    refetch, 
    pagination,
    hasNextPage,
    hasPreviousPage,
    loadNextPage,
    loadPreviousPage,
    loadPage
  };
};
