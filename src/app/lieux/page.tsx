"use client";
import SearchInput from "@/components/inputs/search-input/search-input";
import { Suspense, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import EventCard from "@/components/cards/event-card/event-card";
import EventCardSkeleton from "@/components/cards/event-card/event-card-skeleton";
import HorizontalList from "@/components/lists/horizontal-list/horizontal-list";
import CustomTitle from "@/components/commons/custom-title/custom-title";
import PlaceCard from "@/components/cards/place-card/place-card";
import PlaceCardSkeleton from "@/components/cards/place-card/place-card-skeleton";
import { usePlaces } from "@/hooks/places/use-places";
import { useEvents } from "@/hooks/events/use-events";
import { useSearchPaginated } from "@/hooks/commons/use-search-paginated";
import PaginatedList from "@/components/commons/paginated-list/paginated-list";
import TextImageCard from "@/components/cards/text-image-card/text-image-card";
import TextImageCardSkeleton from "@/components/cards/text-image-card/text-image-card-skeleton";
import React from "react";
import { usePageTitle } from "@/hooks/commons/use-page-title";
import { PAGE_TITLES } from "@/utils/page-titles";

function LieuxPageContent() {
  const searchParams = useSearchParams()!;
  const initialQuery = searchParams.get("q") || "";
  const scrollTargetRef = useRef<HTMLElement>(null);
  const [isSearching, setIsSearching] = useState(false);
  
  // Gestion dynamique du titre de la page
  usePageTitle({
    title: 'Lieux',
    description: 'Découvrez tous les lieux disponibles sur Veevent et leurs événements.',
  });

  // Récupérer les lieux populaires
  const {
    places: popularPlaces,
    loading: placesLoading,
    error: placesError,
  } = usePlaces("popular", undefined, undefined, 3);

  // Récupérer quelques événements pour la section horizontale
  const {
    events: popularEvents,
    loading: popularEventsLoading,
    error: popularEventsError,
  } = useEvents("popular");

  // Pagination pour tous les lieux
  const [page, setPage] = React.useState(0);
  const pageSize = 20;
  const {
    places: allPlaces,
    loading: allPlacesLoading,
    pageInfo: allPlacesPageInfo,
  } = usePlaces(undefined, undefined, undefined, undefined, page, pageSize);

  // Nouvelle logique de recherche avec useSearchPaginated
  const {
    query,
    setQuery,
    items: searchResults,
    loading: searchLoading,
    error: searchError,
    pagination,
    hasNextPage,
    hasPreviousPage,
    loadPage,
    loadPreviousPage,
    loadNextPage,
  } = useSearchPaginated({
    initialQuery,
    initialTypes: ["place"],
    pageSize: 20,
    scrollTargetRef,
    debounceDelay: 300,
  });

  // Fonction pour rendre les cartes d'événements avec skeleton cohérent
  const renderEventCards = (events: any[], loading: boolean, error: any) => {
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

    return events.map((event, index) => (
      <EventCard
        key={`${event._links.self.href}-${index}`}
        id={event._links.self.href}
        event={event}
        minify={false}
      />
    ));
  };

  // Variable commune pour le skeleton - cohérent avec les autres pages
  const commonSkeleton = renderEventCards([], true, null);

  // Rendu de chargement personnalisé avec le skeleton adapté
  const renderLoading = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }, (_, i) => (
        <TextImageCardSkeleton key={i} />
      ))}
    </div>
  );

  return (
    <main>
      <section className="wrapper">
        <h1>Explorez les différents lieux sur veevent</h1>
        <h3>Rechercher un lieu</h3>
        <SearchInput
          value={query}
          onChange={(e) => {
            const newValue = e.target.value;

            // Gestion du délai de recherche pour UX fluide
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
          placeholder="Stade, Parc, Salle de concert..."
        />
      </section>

      {/* Affichage des résultats de recherche */}
      {query && searchResults.length > 0 && !searchLoading && !isSearching && (
        <PaginatedList
          items={searchResults}
          loading={false}
          error={searchError}
          pagination={pagination}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
          onPageChange={loadPage}
          onPreviousPage={loadPreviousPage}
          onNextPage={loadNextPage}
          hasActiveFilters={false}
          onOpenFilters={() => {}}
          renderItem={(item: any, index: number) => (
            <TextImageCard
              key={item.place.id}
              title={item.place.name}
              image={item.place.imageUrl}
              href={`/lieux/${item.place.slug}`}
            />
          )}
          renderEmpty={() => (
            <div className="text-center text-gray-500 py-8">
              <p className="text-lg md:text-xl font-semibold mb-2">
                Aucun lieu trouvé
              </p>
              <p className="text-sm md:text-base">
                Essayez avec d'autres mots-clés
              </p>
            </div>
          )}
          showFilters={false}
          scrollTargetRef={scrollTargetRef}
          title="Résultats de recherche"
          gridClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        />
      )}

      {/* Skeleton pendant la recherche */}
      {query && (searchLoading || isSearching) && (
        <HorizontalList title="Résultats de recherche">
          {commonSkeleton}
        </HorizontalList>
      )}

      {/* Message aucun résultat */}
      {query &&
        !searchLoading &&
        !isSearching &&
        searchResults.length === 0 &&
        !searchError && (
          <section className="wrapper">
            <div className="text-center text-gray-500 py-8">
              <p className="text-lg md:text-xl font-semibold mb-2">
                Aucun lieu trouvé
              </p>
              <p className="text-sm md:text-base">
                Essayez avec d'autres mots-clés
              </p>
            </div>
          </section>
        )}

      {/* Erreur de recherche */}
      {query && searchError && !isSearching && (
        <section className="wrapper">
          <div className="text-center text-red-500 py-8">
            <p>Erreur lors de la recherche : {searchError.message}</p>
          </div>
        </section>
      )}

      {/* Afficher les sections suivantes seulement si pas de recherche active */}
      {!query && (
        <>
          <section className="wrapper">
            <CustomTitle
              description="Lieux"
              title={"Les lieux populaires en ce moment"}
            />

            {placesLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 3 }, (_, i) => (
                  <PlaceCardSkeleton key={i} />
                ))}
              </div>
            ) : placesError ? (
              <div className="text-center text-red-500 py-8">
                <p>Erreur lors du chargement des lieux populaires</p>
              </div>
            ) : popularPlaces.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {popularPlaces.map((place) => (
                  <PlaceCard key={place.id} place={place} />
                ))}
              </div>
            ) : null}
          </section>

          {/* Section événements avec skeleton cohérent */}
          {(popularEventsLoading || popularEvents.length > 0) && (
            <HorizontalList title="Les évènements qui rythment vos lieux préférés">
              {renderEventCards(
                popularEvents,
                popularEventsLoading,
                popularEventsError
              )}
            </HorizontalList>
          )}

          <section className="wrapper">
            <h2>Tous les lieux</h2>
            {allPlacesLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }, (_, i) => (
                  <PlaceCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {allPlaces.map((place) => (
                  <PlaceCard key={place.id} place={place} />
                ))}
              </div>
            )}

            {allPlacesPageInfo && (
              <div className="flex justify-center mt-6 gap-2">
                <button
                  disabled={page === 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-700 transition-colors"
                >
                  Précédent
                </button>
                <span className="flex items-center px-4 py-2 text-gray-600">
                  Page {allPlacesPageInfo.number + 1} sur{" "}
                  {allPlacesPageInfo.totalPages}
                </span>
                <button
                  disabled={page >= allPlacesPageInfo.totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-700 transition-colors"
                >
                  Suivant
                </button>
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}

export default function LieuxPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <LieuxPageContent />
    </Suspense>
  );
}
