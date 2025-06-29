"use client";
import SearchInput from "@/components/inputs/search-input/search-input";
import { Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import EventCard from "@/components/cards/event-card/event-card";
import HorizontalList from "@/components/lists/horizontal-list/horizontal-list";
import CustomTitle from "@/components/commons/custom-title/custom-title";
import PlaceCard from "@/components/cards/place-card/place-card";
import { usePlaces } from "@/hooks/places/use-places";
import { useEvents } from "@/hooks/events/use-events";
import { useSearchPaginated } from "@/hooks/commons/use-search-paginated";
import PaginatedList from "@/components/commons/paginated-list/paginated-list";
import TextImageCard from "@/components/cards/text-image-card/text-image-card";
import TextImageCardSkeleton from "@/components/cards/text-image-card/text-image-card-skeleton";

function LieuxPageContent() {
  const searchParams = useSearchParams()!;
  const initialQuery = searchParams.get("q") || "";
  const scrollTargetRef = useRef<HTMLElement>(null);

  // Récupérer les lieux populaires
  const {
    places: popularPlaces,
    loading: placesLoading,
    error: placesError,
  } = usePlaces("popular", undefined, undefined, 3);

  // Récupérer quelques événements pour la section horizontale
  const { events: popularEvents, loading: popularEventsLoading } = useEvents("popular");

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
    scrollTargetRef 
  });

  // Rendu de chargement personnalisé avec le skeleton adapté
  const renderLoading = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }, (_, i) => (
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
          onChange={e => setQuery(e.target.value)}
          placeholder="Stade, Parc, Salle de concert..."
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
                <p>Aucun lieu trouvé</p>
              </div>
            )}
            renderLoading={renderLoading}
            showFilters={false}
            scrollTargetRef={scrollTargetRef}
          />
        </div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }, (_, i) => (
                  <div key={i} className="animate-pulse bg-gray-200 h-80 rounded-lg"></div>
                ))}
              </div>
            ) : (
              popularPlaces.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {popularPlaces.map((place) => (
                    <PlaceCard key={place.id} place={place} />
                  ))}
                </div>
              )
            )}
          </section>

          {popularEvents.length > 0 && (
            <HorizontalList title="Les évènements qui rythment vos lieux préférés">
              {popularEvents.map((event, index) => (
                <EventCard
                  key={`${event._links.self.href}-${index}`}
                  id={event._links.self.href}
                  event={event}
                  minify={false}
                />
              ))}
            </HorizontalList>
          )}
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
