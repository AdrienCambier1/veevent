"use client";
import SearchInput from "@/components/inputs/search-input/search-input";
import { Suspense, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import EventCard from "@/components/cards/event-card/event-card";
import EventCardSkeleton from "@/components/cards/event-card/event-card-skeleton";
import HorizontalList from "@/components/lists/horizontal-list/horizontal-list";
import { useEvents } from "@/hooks/events/use-events";
import { useEventsPaginated } from "@/hooks/events/use-events-paginated";
import { Event } from "@/types";
import { FilterProvider, useFilters } from "@/contexts/filter-context";
import FilterBottomSheet from "@/components/commons/filters/filter-bottom-sheet";
import PaginatedList from "@/components/commons/paginated-list/paginated-list";
import { useSearchPaginated } from "@/hooks/commons/use-search-paginated";
import { useCategoryFilter } from "@/hooks/commons/use-category-filter";
import { usePageTitle } from "@/hooks/commons/use-page-title";
import { PAGE_TITLES } from "@/utils/page-titles";

// Fonction utilitaire pour extraire l'ID depuis les liens HATEOAS
const extractIdFromSelfLink = (item: any): string => {
  try {
    // Pour les résultats de recherche d'événements
    if (item.type === 'event' && item.event) {
      // Utiliser l'ID direct de l'événement
      return item.event.id?.toString() || '';
    }

    // Pour les événements directs (pas de recherche)
    if (item._links?.self?.href) {
      const href = item._links.self.href;
      const id = href.split("/").pop();
      return id || '';
    }

    // Pour les événements avec ID direct
    if (item.id) {
      return item.id.toString();
    }

    console.warn('Impossible d\'extraire l\'ID pour:', item);
    return '';
  } catch (error) {
    console.error('Erreur lors de l\'extraction de l\'ID:', error);
    return '';
  }
};

function EvenementsPageContent() {
  const { appliedFilters, hasActiveFilters, filterVersion } = useFilters();

  // Gestion dynamique du titre de la page
  usePageTitle(PAGE_TITLES.events);
  const eventsSectionRef = useRef<HTMLElement>(null);
  const searchScrollTargetRef = useRef<HTMLElement>(null);
  const categoryScrollTargetRef = useRef<HTMLElement>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const searchParams = useSearchParams()!;
  const initialQuery = searchParams.get("q") || "";

  // Utiliser le hook pour gérer le filtre de catégorie
  const { categoryParam, hasCategoryFilter, clearCategoryFilter } = useCategoryFilter();

  // Stabiliser les filtres de catégorie pour éviter les re-créations d'objets
  const categoryFilters = useMemo(() => {
    if (hasCategoryFilter && categoryParam) {
      // Combiner les filtres de catégorie avec les filtres appliqués
      return {
        ...appliedFilters,
        categories: [categoryParam]
      };
    }
    return {};
  }, [hasCategoryFilter, categoryParam, appliedFilters]);

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
    scrollTargetRef: searchScrollTargetRef,
    debounceDelay: 300,
  });

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

  // Hook spécifique pour les événements filtrés par catégorie
  const {
    items: categoryEvents,
    loading: categoryLoading,
    error: categoryError,
    pagination: categoryPagination,
    hasNextPage: categoryHasNextPage,
    hasPreviousPage: categoryHasPreviousPage,
    loadNextPage: categoryLoadNextPage,
    loadPreviousPage: categoryLoadPreviousPage,
    loadPage: categoryLoadPage,
  } = useEventsPaginated({
    filters: categoryFilters,
    scrollTargetRef: categoryScrollTargetRef,
    filterVersion,
  });

  const renderEventCards = (
    events: Event[],
    loading: boolean,
    error: Error | null
  ) => {
    if (loading) {
      return (
        <>
          <EventCardSkeleton />
          <EventCardSkeleton />
          <EventCardSkeleton />
        </>
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
      return null;
    }

    return events.map((event: Event) => {
      const eventId = extractIdFromSelfLink(event);
      return (
        <EventCard key={eventId} id={eventId} event={event} minify={false} />
      );
    });
  };

  // Variable commune pour le skeleton - EXACTEMENT la même pour tout
  const commonSkeleton = renderEventCards([], true, null);

  // Fonction de rendu pour PaginatedList
  // Dans /evenements/page.tsx, remplacez renderPaginatedEventCard par :

  const renderPaginatedEventCard = (item: any, index: number) => {
    // Pour les résultats de recherche qui ont la structure { type: "event", event: {...} }
    if (item.type === 'event' && item.event) {
      return (
        <EventCard
          key={item.event.id}
          id={item.event.id?.toString() || ''}
          event={item.event}
          minify={true}
          grid={true}
        />
      );
    }

    // Pour les événements directs (comportement normal)
    const eventId = extractIdFromSelfLink(item);
    return (
      <EventCard
        key={eventId}
        id={eventId}
        event={item}
        minify={true}
        grid={true}
      />
    );
  };

  const renderSearchEmpty = () => (
    <div className="text-center text-gray-500 py-8">
      <p className="text-lg md:text-xl font-semibold mb-2">
        Aucun événement trouvé
      </p>
      <p className="text-sm md:text-base">
        Essayez avec d'autres mots-clés ou modifiez vos filtres
      </p>
    </div>
  );

  const handleOpenFilters = () => {
    setIsFilterOpen(true);
  };

  const handleCloseFilters = () => {
    setIsFilterOpen(false);
  };

  return (
    <>
      <main>
        <section className="wrapper">
          <h1>Explorez les évènements sur veevent</h1>
          <h3>Rechercher un évènement</h3>
          <SearchInput
            value={query}
            onChange={(e) => {
              const newValue = e.target.value;
              if (newValue !== query && newValue.trim() !== "") {
                setIsSearching(true);
                setTimeout(() => {
                  setIsSearching(false);
                }, 1000);
              } else if (newValue.trim() === "") {
                setIsSearching(false);
              }
              setQuery(newValue);
            }}
            placeholder="Concert, Festival, Conférence..."
          />
        </section>

        {/* Affichage des résultats de recherche avec PaginatedList */}
        {query &&
          searchResults.length > 0 &&
          !searchLoading &&
          !isSearching && (
            <PaginatedList
              items={searchResults}
              loading={false}
              error={searchError}
              pagination={searchPagination}
              hasNextPage={searchHasNextPage}
              hasPreviousPage={searchHasPreviousPage}
              onPageChange={searchLoadPage}
              onPreviousPage={searchLoadPreviousPage}
              onNextPage={searchLoadNextPage}
              hasActiveFilters={false}
              onOpenFilters={() => { }}
              renderItem={renderPaginatedEventCard}
              renderEmpty={renderSearchEmpty}
              showFilters={false}
              scrollTargetRef={searchScrollTargetRef}
            />
          )}

        {/* Affichage du skeleton pendant le chargement de la recherche OU pendant isSearching */}
        {query && (searchLoading || isSearching) && (
          <HorizontalList title="Résultats de recherche">
            {commonSkeleton}
          </HorizontalList>
        )}

        {/* Affichage du message "aucun résultat" seulement quand la recherche est terminée */}
        {query &&
          !searchLoading &&
          !isSearching &&
          searchResults.length === 0 &&
          !searchError && (
            <section className="wrapper">{renderSearchEmpty()}</section>
          )}

        {/* Affichage des erreurs de recherche */}
        {query && searchError && !isSearching && (
          <section className="wrapper">
            <div className="text-center text-red-500 py-8">
              <p>Erreur lors de la recherche : {searchError.message}</p>
            </div>
          </section>
        )}

        {/* Affichage des résultats filtrés par catégorie */}
        {!query && hasCategoryFilter && (
          <>
            {/* Bouton pour effacer le filtre de catégorie */}
            <section className="wrapper">
              <h2>
                Événements de la catégorie {categoryParam}
                {/* {hasActiveFilters && Object.keys(appliedFilters).some(key => key !== 'categories') && (
                    <span className="text-sm text-gray-500 ml-2">
                      (avec filtres supplémentaires)
                    </span>
                  )} */}
              </h2>
            </section>
            <PaginatedList
              items={categoryEvents}
              loading={categoryLoading}
              error={categoryError}
              pagination={categoryPagination}
              hasNextPage={categoryHasNextPage}
              hasPreviousPage={categoryHasPreviousPage}
              onPageChange={categoryLoadPage}
              onPreviousPage={categoryLoadPreviousPage}
              onNextPage={categoryLoadNextPage}
              hasActiveFilters={hasActiveFilters}
              onOpenFilters={handleOpenFilters}
              renderItem={renderPaginatedEventCard}
              renderEmpty={() => (
                <div className="text-center text-gray-500 py-8">
                  <p className="text-lg md:text-xl font-semibold mb-2">
                    Aucun événement trouvé dans cette catégorie
                  </p>
                  <p className="text-sm md:text-base">
                    Essayez de modifier vos filtres ou explorez d'autres catégories
                  </p>
                </div>
              )}
              showFilters={true}
              scrollTargetRef={categoryScrollTargetRef}
            />
            <section className="wrapper">
              <button className="secondary-btn" onClick={clearCategoryFilter}><span>Voir tous les événements</span></button>
            </section>
          </>
        )}

        {/* Afficher les sections suivantes seulement si pas de recherche active ET pas de filtre de catégorie */}
        {!query && !hasCategoryFilter && (
          <>
            {/* Afficher si en chargement ou si on a des événements */}
            {(popularLoading || popularEvents.length > 0) && (
              <HorizontalList title="Les évènements populaires cette semaine">
                {popularLoading
                  ? commonSkeleton
                  : renderEventCards(popularEvents, false, popularError)}
              </HorizontalList>
            )}

            {(dealLoading || dealEvents.length > 0) && (
              <HorizontalList title="Les bonnes affaires de la semaine">
                {dealLoading
                  ? commonSkeleton
                  : renderEventCards(dealEvents, false, dealError)}
              </HorizontalList>
            )}

            {(freeLoading || freeEvents.length > 0) && (
              <HorizontalList title="Sortez gratuitement ce week end">
                {freeLoading
                  ? commonSkeleton
                  : renderEventCards(freeEvents, false, freeError)}
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
              onOpenFilters={handleOpenFilters}
              renderItem={renderPaginatedEventCard}
              title="Tous les événements"
              scrollTargetRef={eventsSectionRef}
            />
          </>
        )}
      </main>

      <FilterBottomSheet isOpen={isFilterOpen} onClose={handleCloseFilters} />
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
