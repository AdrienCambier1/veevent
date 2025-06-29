"use client";
import SearchInput from "@/components/inputs/search-input/search-input";
import { Suspense, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";
import EventCard from "@/components/cards/event-card/event-card";
import HorizontalList from "@/components/lists/horizontal-list/horizontal-list";
import { useEvents } from "@/hooks/events/use-events";
import { useEventsPaginated } from "@/hooks/events/use-events-paginated";
import { Event } from "@/types";
import { FilterProvider, useFilters } from "@/contexts/filter-context";
import FilterBottomSheet from "@/components/commons/filters/filter-bottom-sheet";
import PaginatedList from "@/components/commons/paginated-list/paginated-list";
import { useSearchPaginated } from "@/hooks/commons/use-search-paginated";

// Fonction utilitaire pour extraire l'ID depuis les liens HATEOAS
const extractIdFromSelfLink = (event: Event): string => {
  const href = event._links.self.href;
  const id = href.split("/").pop();
  return id || "";
};

function EvenementsPageContent() {
  const { appliedFilters, hasActiveFilters, filterVersion } = useFilters();
  const eventsSectionRef = useRef<HTMLElement>(null);
  const searchScrollTargetRef = useRef<HTMLElement>(null);

  const searchParams = useSearchParams()!;
  const initialQuery = searchParams.get("q") || "";

  const {
    events: popularEvents,
    loading: popularLoading,
    error: popularError,
  } = useEvents("popular");
  const {
    events: dealEvents,
    loading: dealLoading,
    error: dealError,
  } = useEvents("deals");
  const {
    events: freeEvents,
    loading: freeLoading,
    error: freeError,
  } = useEvents("free");

  // Nouvelle logique de recherche avec useSearchPaginated
  const {
    query,
    setQuery,
    items: searchResults,
    loading: searchLoading,
    error: searchError,
    pagination: searchPagination,
    hasNextPage: searchHasNextPage,
    hasPreviousPage: searchHasPreviousPage,
    loadPage: searchLoadPage,
    loadPreviousPage: searchLoadPreviousPage,
    loadNextPage: searchLoadNextPage,
  } = useSearchPaginated({ 
    initialQuery, 
    initialTypes: ["event"],
    pageSize: 20,
    scrollTargetRef: searchScrollTargetRef 
  });

  // Utilisation du nouveau hook paginé pour tous les événements (quand pas de recherche)
  const {
    items: allEvents,
    loading: allLoading,
    error: allError,
    pagination,
    hasNextPage,
    hasPreviousPage,
    loadNextPage,
    loadPreviousPage,
    loadPage,
  } = useEventsPaginated({
    filters: appliedFilters,
    scrollTargetRef: eventsSectionRef,
    filterVersion,
  });

  const renderEventCards = (
    events: Event[],
    loading: boolean,
    error: Error | null
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
          Aucun événement trouvé
        </div>
      );
    }

    return events.map((event: Event) => {
      const eventId = extractIdFromSelfLink(event);
      return (
        <EventCard key={eventId} id={eventId} event={event} minify={false} />
      );
    });
  };

  // Fonction de rendu pour PaginatedList
  const renderEventCard = (event: Event, index: number) => {
    const eventId = extractIdFromSelfLink(event);
    return (
      <EventCard key={eventId} id={eventId} event={event} minify={false} grid={true} />
    );
  };

  // Rendu de chargement personnalisé pour la recherche
  const renderSearchLoading = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="animate-pulse bg-gray-200 h-80 rounded-lg"></div>
      ))}
    </div>
  );

  return (
    <>
      <main>
        <section className="wrapper">
          <h1>Explorez les évènements sur veevent</h1>
          <h3>Rechercher un évènement</h3>
          <SearchInput
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Concert, Festival, Conférence..."
          />
        </section>

        {/* Affichage des résultats de recherche avec PaginatedList */}
        {query && (
          <div>
            <h4 className="px-4 pt-2">Résultats de recherche</h4>
            <PaginatedList
              items={searchResults}
              loading={searchLoading}
              error={searchError}
              pagination={searchPagination}
              hasNextPage={searchHasNextPage}
              hasPreviousPage={searchHasPreviousPage}
              onPageChange={searchLoadPage}
              onPreviousPage={searchLoadPreviousPage}
              onNextPage={searchLoadNextPage}
              hasActiveFilters={false}
              onOpenFilters={() => {}}
              renderItem={(item: any, index: number) => (
                <EventCard 
                  key={item.event.id} 
                  id={item.event.id.toString()} 
                  event={item.event} 
                  minify={false}
                  grid={true}
                />
              )}
              renderEmpty={() => (
                <div className="text-center text-gray-500 py-8">
                  <p>Aucun événement trouvé</p>
                </div>
              )}
              renderLoading={renderSearchLoading}
              showFilters={false}
              scrollTargetRef={searchScrollTargetRef}
            />
          </div>
        )}

        {/* Afficher les sections suivantes seulement si pas de recherche active */}
        {!query && (
          <>
            {popularEvents.length > 0 && (
              <HorizontalList title="Les évènements populaires cette semaine">
                {renderEventCards(popularEvents, popularLoading, popularError)}
              </HorizontalList>
            )}

            {dealEvents.length > 0 && (
              <HorizontalList title="Les bonnes affaires de la semaine">
                {renderEventCards(dealEvents, dealLoading, dealError)}
              </HorizontalList>
            )}

            {freeEvents.length > 0 && (
              <HorizontalList title="Sortez gratuitement ce week end">
                {renderEventCards(freeEvents, freeLoading, freeError)}
              </HorizontalList>
            )}

            {/* Utilisation du composant PaginatedList pour tous les événements */}
            <PaginatedList
              items={allEvents}
              loading={allLoading}
              error={allError}
              pagination={pagination}
              hasNextPage={hasNextPage}
              hasPreviousPage={hasPreviousPage}
              onPageChange={loadPage}
              onPreviousPage={loadPreviousPage}
              onNextPage={loadNextPage}
              hasActiveFilters={hasActiveFilters}
              onOpenFilters={() => {}}
              renderItem={renderEventCard}
              title="Tous les événements"
              scrollTargetRef={eventsSectionRef}
            />
          </>
        )}
      </main>

      <FilterBottomSheet
        isOpen={false}
        onClose={() => {}}
      />
    </>
  );
}

export default function EvenementsPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <FilterProvider>
        <EvenementsPageContent />
      </FilterProvider>
    </Suspense>
  );
}
