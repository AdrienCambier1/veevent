import { useState, useEffect, useCallback } from "react";
import { eventService } from "@/services/eventService";
import { Event, EventFilters } from "@/types";

interface UseEventsReturn {
  events: Event[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useEvents = (
  type?: "popular" | "deals" | "free",
  filters?: EventFilters
): UseEventsReturn => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let data: Event[] = [];

      switch (type) {
        case "popular":
          data = await eventService.getPopularEvents();
          break;
        case "deals":
          data = await eventService.getDealEvents();
          break;
        case "free":
          data = await eventService.getFreeEvents();
          break;
        default:
          data = await eventService.getEvents(filters);
      }

      setEvents(data || []);
    } catch (err) {
      setError(err as Error);
      setEvents([]);
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

  return { events, loading, error, refetch };
};
