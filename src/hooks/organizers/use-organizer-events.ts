import { useState, useEffect, useCallback } from "react";
import { eventService } from "@/services/event-service";
import { Event, SingleUser } from "@/types";

interface UseOrganizerEventsReturn {
  events: Event[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useOrganizerEvents = (
  organizer: SingleUser,
  currentEventId?: string,
  limit: number = 3
): UseOrganizerEventsReturn => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchOrganizerEvents = useCallback(async () => {
    if (!organizer || !organizer._links?.self?.href) {
      setEvents([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Construire l'URL des événements à partir du lien self de l'organisateur
      const organizerEventsHref = `${organizer._links.self.href}/events`;

      console.log("organizer events href", organizerEventsHref);
      console.log("currentEventId", currentEventId);
      console.log("limit", limit);

      const data = await eventService.getEventsByOrganizerHref(
        organizerEventsHref,
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
  }, [organizer, currentEventId, limit]);

  useEffect(() => {
    fetchOrganizerEvents();
  }, [fetchOrganizerEvents]);

  const refetch = useCallback(() => {
    fetchOrganizerEvents();
  }, [fetchOrganizerEvents]);

  return { events, loading, error, refetch };
};
