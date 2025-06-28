"use client";
import { useParams } from "next/navigation";
import { useCityEvents } from "@/hooks/cities/use-city-events";
import { useMemo, useCallback, useState, useRef } from "react";
import EventCard from "@/components/cards/event-card/event-card";
import { Event } from "@/types";
import { Filter } from "iconoir-react";
import FilterBottomSheet from "@/components/commons/filters/filter-bottom-sheet";
import { FilterProvider, useFilters } from "@/contexts/filter-context";
import HorizontalList from "@/components/lists/horizontal-list/horizontal-list";
import PaginatedList from "@/components/commons/paginated-list/paginated-list";
import { useCityEventsPaginated } from "@/hooks/cities/use-city-events-paginated";
import { useCity } from "@/hooks/cities/use-city";

const extractIdFromSelfLink = (event: Event): string => {
  const href = event._links.self.href;
  const id = href.split("/").pop();
  return id || "";
};

function EvenementsContent() {
  const { city: cityParam } = useParams() as { city: string };
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { appliedFilters, hasActiveFilters, filterVersion } = useFilters();
  const eventsSectionRef = useRef<HTMLElement>(null);

  // Récupérer la ville depuis l'API
  const { city, loading: cityLoading } = useCity(cityParam);

  // Hook paginé pour les événements de la ville
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
  } = useCityEventsPaginated({
    cityName: cityParam,
    filters: appliedFilters,
    scrollTargetRef: eventsSectionRef,
    filterVersion,
  });
  const {
    trendingEvents,
    firstEditionEvents,
  } = useCityEvents(cityParam, {
    fetchAll: true,
    fetchTrending: true,
    fetchFirstEdition: true,
    filters: appliedFilters, // Utiliser appliedFilters
  });


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
            Aucun événement trouvé{city?.name ? ` à ${city.name}` : ""}
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
    [city]
  );

  if (cityLoading) {
    return <div className="p-8 text-center">Chargement de la ville...</div>;
  }

  return (
    <>
      {/* Événements de première édition */}
      {trendingEvents.length > 0 && (
        <HorizontalList title={`Les événements populaires à ${city?.name}`}>
          {renderEventCards(trendingEvents, false, null, false)}
        </HorizontalList>
      )}

      {/* Événements de première édition */}
      {firstEditionEvents.length > 0 && (
        <HorizontalList title={`Ils font leur début à ${city?.name}`}>
          {renderEventCards(firstEditionEvents, false, null, false)}
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
            <EventCard key={eventId} id={eventId} event={event} minify={true} grid={true} />
          );
        }}
        title={city ? `Tous les événements à ${city.name} et aux alentours` : "Tous les événements"}
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
