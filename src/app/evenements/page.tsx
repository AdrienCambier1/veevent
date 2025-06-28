"use client";
import SearchInput from "@/components/inputs/search-input/search-input";
import { useState, useEffect, Suspense, useMemo, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import EventCard from "@/components/cards/event-card/event-card";
import HorizontalList from "@/components/lists/horizontal-list/horizontal-list";
import { useEvents } from "@/hooks/events/use-events";
import { useEventsPaginated } from "@/hooks/events/use-events-paginated";
import { Event } from "@/types";
import { FilterProvider, useFilters } from "@/contexts/filter-context";
import { Filter } from "iconoir-react";
import FilterBottomSheet from "@/components/commons/filters/filter-bottom-sheet";
import PaginatedList from "@/components/commons/paginated-list/paginated-list";

// Fonction utilitaire pour extraire l'ID depuis les liens HATEOAS
const extractIdFromSelfLink = (event: Event): string => {
  const href = event._links.self.href;
  const id = href.split("/").pop();
  return id || "";
};

function EvenementsPageContent() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { appliedFilters, hasActiveFilters, filterVersion } = useFilters();
  const eventsSectionRef = useRef<HTMLElement>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

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

  // Utilisation du nouveau hook paginé
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

  useEffect(() => {
    const urlSearch = searchParams?.get("search");
    if (urlSearch) {
      setSearchTerm(urlSearch);
    }
  }, [searchParams]);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/evenements?search=${encodeURIComponent(searchTerm)}`);
    } else {
      router.push("/evenements");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

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

  return (
    <>
      <main>
        <section className="wrapper">
          <h1>Explorez les évènements sur veevent</h1>
          <h3>Rechercher un évènement</h3>
          <SearchInput
            value={searchTerm}
            onChange={handleInputChange}
            placeholder="Concert, Festival, Conférence..."
          />
          <button className="primary-btn" onClick={handleSearch}>
            <span>Rechercher</span>
          </button>
        </section>

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
        

        {/* Utilisation du composant PaginatedList */}
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
          onOpenFilters={() => setIsFilterOpen(true)}
          renderItem={renderEventCard}
          title="Tous les événements"
          scrollTargetRef={eventsSectionRef}
        />
      </main>

      <FilterBottomSheet
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />
    </>
  );
}

export default function EvenementsPage() {
  return (
    <Suspense fallback={<div>Chargement de la page...</div>}>
      <FilterProvider>
        <EvenementsPageContent />
      </FilterProvider>
    </Suspense>
  );
}
