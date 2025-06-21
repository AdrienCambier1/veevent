"use client";
import { useParams } from "next/navigation";
import { useCityEvents } from "@/hooks/useCityEvents";
import { useMemo, useCallback } from "react";
import EventCard from "@/components/cards/event-card/event-card";
import HorizontalList from "@/components/lists/horizontal-list/horizontal-list";
import { Event } from "@/types";

const extractIdFromSelfLink = (event: Event): string => {
  const href = event._links.self.href;
  const id = href.split("/").pop();
  return id || "";
};

export default function EvenementsPage() {
  const { city: cityParam } = useParams() as { city: string };

  // Décoder le paramètre URL et capitaliser
  const cityName = useMemo(() => {
    return decodeURIComponent(cityParam)
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }, [cityParam]);

  // Hook pour récupérer les événements via les liens HATEOAS
  const { city, allEvents, trendingEvents, otherEvents, loading, error } =
    useCityEvents(cityName);

  // Fonction pour rendre les EventCards
  const renderEventCards = useCallback(
    (
      events: Event[],
      loading: boolean,
      error: Error | null,
      minify: boolean = false
    ) => {
      if (loading) {
        return (
          <div className="loading-skeleton">
            <div className="animate-pulse bg-gray-200 h-32 rounded"></div>
          </div>
        );
      }

      if (error) {
        return (
          <div className="error-message text-red-500 p-4">
            Erreur lors du chargement des événements: {error.message}
          </div>
        );
      }

      if (!events || events.length === 0) {
        return (
          <div className="no-events text-gray-500 p-4">
            Aucun événement trouvé à {cityName}
          </div>
        );
      }

      return events.map((event: Event) => {
        const eventId = extractIdFromSelfLink(event);

        return (
          <EventCard key={eventId} id={eventId} event={event} minify={minify} />
        );
      });
    },
    [cityName]
  );

  // Debug logs
  console.log("All events:", allEvents.length);
  console.log("Trending events:", trendingEvents.length);
  console.log("Other events:", otherEvents.length);

  if (loading) {
    return (
      <div className="wrapper">
        <p>Chargement des événements...</p>
      </div>
    );
  }

  if (error || !city) {
    return (
      <div className="wrapper">
        <h1>Ville non trouvée</h1>
        <p>Impossible de charger les événements pour "{cityName}".</p>
        {error && <p>Erreur: {error.message}</p>}
      </div>
    );
  }

  return (
    <>
      <section className="wrapper">
        {/* Événements trending (populaires) */}
        <h2>Les événements populaires à {city.name}</h2>
        {trendingEvents.length > 0 ? (
          renderEventCards(trendingEvents, false, null, false)
        ) : (
          <p>Aucun événement populaire pour le moment.</p>
        )}
      </section>

      {/* Autres événements */}
      {otherEvents.length > 0 && (
        <HorizontalList title={`Tous les autres évènements à ${city.name}`}>
          {renderEventCards(otherEvents, false, null, true)}
        </HorizontalList>
      )}
    </>
  );
}
