import { useState, useEffect, useCallback } from "react";
import { eventService } from "@/services/eventService";
import { SingleEvent } from "@/types";

interface UseSingleEventReturn {
  event: SingleEvent | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useSingleEvent = (eventId: number): UseSingleEventReturn => {
  const [event, setEvent] = useState<SingleEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEvent = useCallback(async () => {
    if (!eventId) {
      setError(new Error("ID d'événement manquant"));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await eventService.getEventById(eventId);

      setEvent(data);
    } catch (err) {
      console.error("❌ Error in useSingleEvent:", err);
      setError(err as Error);
      setEvent(null);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  const refetch = useCallback(() => {
    fetchEvent();
  }, [fetchEvent]);

  return { event, loading, error, refetch };
};
