import { useState, useEffect, useCallback, useMemo } from "react";
import { placeService } from "@/services/place-service";
import { eventService } from "@/services/event-service";
import { SinglePlace, Event, SingleUser } from "@/types";

interface UsePlaceDataReturn {
  place: SinglePlace | null;
  events: Event[];
  organizers: SingleUser[];
  firstEvents: Event[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const usePlaceData = (
  slug: string,
  dataType?: "events" | "organizers" | "trending" | "firstEvents" | "all",
  filters?: {
    minPrice?: number;
    maxPrice?: number;
    startDate?: string;
    endDate?: string;
    categories?: string;
  },
  limit?: number
): UsePlaceDataReturn => {
  const [place, setPlace] = useState<SinglePlace | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [organizers, setOrganizers] = useState<SingleUser[]>([]);
  const [firstEvents, setFirstEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Stabiliser l'objet filters avec useMemo
  const stableFilters = useMemo(() => {
    if (!filters) return undefined;

    // Ne retourner un objet que si au moins un filtre a une valeur
    const hasFilters = Object.values(filters).some(
      (value) => value !== undefined && value !== null && value !== ""
    );

    return hasFilters ? filters : undefined;
  }, [
    filters?.minPrice,
    filters?.maxPrice,
    filters?.startDate,
    filters?.endDate,
    filters?.categories,
  ]);

  const fetchPlaceData = useCallback(async () => {
    if (!slug) return;

    try {
      setLoading(true);
      setError(null);

      // 1. Récupérer d'abord les données de base de la place
      const placeData = await placeService.getPlaceBySlug(slug);

      if (!placeData) {
        throw new Error("Lieu non trouvé");
      }

      setPlace(placeData);

      // 2. Utiliser les liens HATEOAS pour récupérer les données spécifiques
      if (dataType === "events" || dataType === "all") {
        if (placeData._links?.events?.href) {
          try {
            const placeEvents = await placeService.getEventsByPlaceLink(
              placeData._links.events.href,
              stableFilters,
              limit
            );
            const events = placeEvents._embedded?.eventSummaryResponses || [];
            setEvents(events);
          } catch (eventError) {
            console.warn(
              "Erreur lors du chargement des événements:",
              eventError
            );
            setEvents([]);
          }
        }
      }

      // 3. Gestion spécifique des événements trending
      if (dataType === "trending") {
        if (placeData._links?.events?.href) {
          try {
            const trendingEvents = await placeService.getTrendingEventsByPlaceLink(
              placeData._links.events.href,
              limit
            );
            setEvents(limit ? trendingEvents.slice(0, limit) : trendingEvents);
          } catch (eventError) {
            console.warn(
              "Erreur lors du chargement des événements trending:",
              eventError
            );
            setEvents([]);
          }
        }
      }

      // 4. Gestion spécifique des événements first editions
      if (dataType === "firstEvents" || dataType === "all") {
        try {
          const firstEditionEvents = await eventService.getFirstEvents(
            placeData.cityName,
            placeData.name,
            limit
          );
          setFirstEvents(limit ? firstEditionEvents.slice(0, limit) : firstEditionEvents);
        } catch (firstEventsError) {
          console.warn(
            "Erreur lors du chargement des événements first editions:",
            firstEventsError
          );
          setFirstEvents([]);
        }
      }

      if (dataType === "organizers" || dataType === "all") {
        if (placeData._links?.organizers?.href) {
          try {
            const placeOrganizers = await placeService.getOrganizersByPlaceLink(
              placeData._links.organizers.href,
              limit
            );
            setOrganizers(limit ? placeOrganizers.slice(0, limit) : placeOrganizers);
          } catch (organizersError) {
            console.warn(
              "Erreur lors du chargement des organisateurs:",
              organizersError
            );
            setOrganizers([]);
          }
        }
      }
    } catch (err) {
      setError(err as Error);
      setPlace(null);
      setEvents([]);
      setOrganizers([]);
      setFirstEvents([]);
    } finally {
      setLoading(false);
    }
  }, [slug, dataType, stableFilters, limit]);

  useEffect(() => {
    fetchPlaceData();
  }, [fetchPlaceData]);

  const refetch = useCallback(() => {
    fetchPlaceData();
  }, [fetchPlaceData]);

  return { place, events, organizers, firstEvents, loading, error, refetch };
}; 