"use client";
import { useState, useEffect, useCallback } from "react";
import { userService } from "@/services/user-service";
import { useUser } from "@/hooks/commons/use-user";
import { useAuth } from "@/contexts/auth-context";
import { EventsResponse, Event } from "@/types";


export function useUserEvents(currentEventId?: string, limit?: number) {
  const { user } = useUser();
  const { token } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  const fetchEvents = useCallback(async () => {
    if (!user?.id || !token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const userId = typeof user.id === 'string' ? parseInt(user.id) : user.id;
      const data: EventsResponse = await userService.getUserEventsByUserId(userId, token);
      
      // Ajouter l'ID extrait du lien HATEOAS à chaque événement
      let eventsWithId = (data._embedded?.eventSummaryResponses || []).map(event => ({
        ...event,
        id: event.id || 0
      }));

      // Filtrer l'événement actuel si spécifié
      if (currentEventId) {
        eventsWithId = eventsWithId.filter(event => 
          event.id?.toString() !== currentEventId
        );
      }

      // Appliquer la limite si spécifiée
      if (limit) {
        eventsWithId = eventsWithId.slice(0, limit);
      }
      
      setEvents(eventsWithId);
      setPagination(data.page || null);
    } catch (err) {
      setError(err as Error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id, token, currentEventId, limit]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const refetch = useCallback(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { 
    events, 
    loading, 
    error, 
    refetch, 
    pagination,
    hasNextPage: pagination ? pagination.number < pagination.totalPages - 1 : false,
    hasPreviousPage: pagination ? pagination.number > 0 : false
  };
} 