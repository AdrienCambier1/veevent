import { useState, useEffect, useCallback } from "react";
import { eventService } from "@/services/event-service";
import { Event } from "@/types";

interface UseOrganizerEventsReturn {
  events: Event[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useOrganizerEvents = (
  organizerPseudo: string,
  organizerId: number,
  currentEventId?: string,
  limit: number = 3
): UseOrganizerEventsReturn => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchOrganizerEvents = useCallback(async () => {
    if (!organizerPseudo) {
      setEvents([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log("organizerPseudo", organizerPseudo);
      console.log("currentEventId", currentEventId);
      console.log("limit", limit);

      const data = await eventService.getEventsByOrganizer(
        organizerPseudo,
        organizerId,
        currentEventId,
        limit
      );


      setEvents(data);
    } catch (err) {
      console.error("❌ Error in useOrganizerEvents:", err);
      setError(err as Error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [organizerPseudo, currentEventId, limit]);

  useEffect(() => {
    fetchOrganizerEvents();
  }, [fetchOrganizerEvents]);

  const refetch = useCallback(() => {
    fetchOrganizerEvents();
  }, [fetchOrganizerEvents]);

  return { events, loading, error, refetch };
};
