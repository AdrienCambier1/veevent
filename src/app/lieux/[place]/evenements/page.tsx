"use client";
import EventCard from "@/components/cards/event-card/event-card";
import FilterBottomSheet from "@/components/commons/filters/filter-bottom-sheet";
import PaginatedList from "@/components/commons/paginated-list/paginated-list";
import HorizontalList from "@/components/lists/horizontal-list/horizontal-list";
import { FilterProvider, useFilters } from "@/contexts/filter-context";
import { usePlaceData } from "@/hooks/places/use-place-data";
import { usePlaceEventsPaginated } from "@/hooks/places/use-place-events-paginated";
import { Event } from "@/types";
import { useParams } from "next/navigation";
import { useCallback, useRef, useState } from "react";

const extractIdFromSelfLink = (event: Event): string => {
  const href = event._links.self.href;
  const id = href.split("/").pop();
  return id || "";
};

function EvenementsContent() {
  const { place: placeParam } = useParams() as { place: string };
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { appliedFilters, hasActiveFilters, filterVersion } = useFilters();
  const eventsSectionRef = useRef<HTMLElement>(null);

  // Récupérer le lieu depuis l'API
  const { place, loading: placeLoading } = usePlaceData(placeParam);

  // Hook paginé pour les événements du lieu
  const {
    items: allEvents,
    loading,
    error,
    pagination,
    hasNextPage,
    hasPreviousPage,
    loadNextPage,
    loadPreviousPage,
    loadPage,
  } = usePlaceEventsPaginated({
    placeSlug: placeParam,
    filters: appliedFilters,
    scrollTargetRef: eventsSectionRef,
    filterVersion,
  });

  const {
    events: trendingEvents,
    loading: trendingEventsLoading,
    error: trendingEventsError,
  } = usePlaceData(placeParam, "trending");

  const {
    events: firstEditionEvents,
    loading: firstEditionEventsLoading,
    error: firstEditionEventsError,
  } = usePlaceData(placeParam, "firstEvents");

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
            <div className="skeleton-bg h-32"></div>
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
            Aucun événement trouvé{place?.name ? ` à ${place.name}` : ""}
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
    [place]
  );

  if (placeLoading) {
    return <div className="p-8 text-center">Chargement du lieu...</div>;
  }

  return (
    <>
      {/* Section des événements populaires en horizontal */}
      {trendingEvents.length > 0 && (
        <HorizontalList title={`Les évènements populaires à ${place?.name}`}>
          {renderEventCards(trendingEvents, false, null)}
        </HorizontalList>
      )}

      {/* Événements de première édition */}
      {firstEditionEvents.length > 0 && (
        <HorizontalList title={`Ils font leur début à ${place?.name}`}>
          {renderEventCards(firstEditionEvents, false, null)}
        </HorizontalList>
      )}

      <PaginatedList
        items={allEvents}
        loading={loading}
        error={error}
        pagination={pagination}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        onPageChange={loadPage}
        onPreviousPage={loadPreviousPage}
        onNextPage={loadNextPage}
        hasActiveFilters={hasActiveFilters}
        onOpenFilters={() => setIsFilterOpen(true)}
        renderItem={(event: Event, index: number) => {
          const eventId = extractIdFromSelfLink(event);
          return (
            <EventCard
              key={eventId}
              id={eventId}
              event={event}
              minify={true}
              grid={true}
            />
          );
        }}
        title={
          place ? `Tous les événements à ${place.name}` : "Tous les événements"
        }
        scrollTargetRef={eventsSectionRef}
      />
      <FilterBottomSheet
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />
    </>
  );
}

export default function EvenementsPage() {
  return (
    <FilterProvider>
      <EvenementsContent />
    </FilterProvider>
  );
}
