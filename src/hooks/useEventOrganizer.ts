import { useState, useEffect, useCallback } from "react";
import { eventService } from "@/services/eventService";
import { SingleUser } from "@/types";

interface UseEventOrganizerReturn {
  organizer: SingleUser | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useEventOrganizer = (
  organizerHref?: string
): UseEventOrganizerReturn => {
  const [organizer, setOrganizer] = useState<SingleUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchOrganizer = useCallback(async () => {
    if (!organizerHref) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const organizerPseudo = organizerHref.split("/").pop() || "";

      const data = await eventService.getOrganizerByEvent(organizerPseudo);
      setOrganizer(data);
    } catch (err) {
      console.error("❌ Error in useEventOrganizer:", err);
      setError(err as Error);
      setOrganizer(null);
    } finally {
      setLoading(false);
    }
  }, [organizerHref]);

  useEffect(() => {
    fetchOrganizer();
  }, [fetchOrganizer]);

  const refetch = useCallback(() => {
    fetchOrganizer();
  }, [fetchOrganizer]);

  return { organizer, loading, error, refetch };
};
