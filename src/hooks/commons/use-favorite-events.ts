"use client";
import { useState, useEffect, useCallback } from "react";
import { eventService } from "@/services/event-service";
import { Event } from "@/types";

export function useFavoriteEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const favs = await eventService.getFavoriteEvents();
      setEvents(favs);
    } catch (err) {
      setError(err as Error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavorites();
    // Écoute le storage pour synchro multi-onglet
    const onStorage = (e: StorageEvent) => {
      if (e.key === "vv-fav-events") fetchFavorites();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [fetchFavorites]);

  const refetch = useCallback(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  return { events, loading, error, refetch };
} 