import { useState, useEffect, useCallback } from "react";
import { eventService } from "@/services/event-service";
import { Event } from "@/types";
import { useUser } from "@/hooks/commons/use-user";

interface UseUserPreferredEventsReturn {
  events: Event[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useUserPreferredEvents = (
  limit?: number
): UseUserPreferredEventsReturn => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const { user } = useUser();

  const fetchUserPreferredEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Si l'utilisateur n'est pas connecté ou n'a pas de catégories préférées
      if (!user || !user.categories || user.categories.length === 0) {
        setEvents([]);
        return;
      }

      // Extraire les clés des catégories préférées de l'utilisateur
      const preferredCategories = user.categories.map(cat => 
        typeof cat === 'string' ? cat : cat.key
      );

      // Utiliser la nouvelle méthode getEventsByCategories
      const categoryEvents = await eventService.getEventsByCategories(
        preferredCategories, 
        limit || 10
      );
      
      setEvents(categoryEvents);
    } catch (err) {
      console.error("❌ Erreur dans useUserPreferredEvents:", err);
      setError(err as Error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [user, limit]);

  useEffect(() => {
    fetchUserPreferredEvents();
  }, [fetchUserPreferredEvents]);

  const refetch = useCallback(() => {
    fetchUserPreferredEvents();
  }, [fetchUserPreferredEvents]);

  return { 
    events, 
    loading, 
    error, 
    refetch
  };
}; 