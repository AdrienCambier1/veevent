"use client";
import { useRef, Suspense } from "react";
import { useCities } from "@/hooks/cities/use-cities";
import {
  FRENCH_REGIONS,
  RegionCode,
  getRegionCodes,
} from "@/constants/regions";
import SearchInput from "@/components/inputs/search-input/search-input";
import TabList from "@/components/lists/tab-list/tab-list";
import CustomTitle from "@/components/commons/custom-title/custom-title";
import TextImageCard from "@/components/cards/text-image-card/text-image-card";
import TextImageCardSkeleton from "@/components/cards/text-image-card/text-image-card-skeleton";
import img from "@/assets/images/nice.jpg";
import PlacesMapList from "@/components/lists/places-map-list/places-map-list";
import { usePlaces } from "@/hooks/places/use-places";
import { useSearchPaginated } from "@/hooks/commons/use-search-paginated";
import { useSearchParams } from "next/navigation";
import PaginatedList from "@/components/commons/paginated-list/paginated-list";

function VillesPageContent() {
  const searchParams = useSearchParams()!;
  const initialQuery = searchParams.get("q") || "";
  const scrollTargetRef = useRef<HTMLElement>(null);

  // Hook pour récupérer les villes populaires
  const { cities: popularCities, loading: popularLoading } = useCities(
    "popular",
    { limit: 6 }
  );

  const { places } = usePlaces("popular", undefined, undefined, 10);
  const filteredPlaces = places.filter(
    (place) =>
      place.location.latitude &&
      place.location.longitude &&
      place.eventsCount > 0
  );

  // Hooks pour récupérer les villes par région pour toutes les régions
  const regionCities = getRegionCodes().reduce((acc, regionCode) => {
    const { cities } = useCities("byRegion", { region: regionCode });
    acc[regionCode] = cities.filter((city) => city.eventsCount > 0);
    return acc;
  }, {} as Record<RegionCode, any[]>);

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
    initialTypes: ["city"],
    pageSize: 20,
    scrollTargetRef,
  });

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // Supprimer les caractères spéciaux
      .replace(/\s+/g, "-") // Remplacer les espaces par des tirets
      .replace(/-+/g, "-") // Remplacer les tirets multiples par un seul
      .trim(); // Supprimer les espaces au début et à la fin
  };

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
        <h1>Explorez les villes disponibles sur veevent</h1>
        <h3>Rechercher une ville</h3>
        <SearchInput
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nice, Cannes, Antibes..."
        />

        {/* Affichage des résultats de recherche avec PaginatedList */}
        {query && (
          <div>
            <h4>Résultats de recherche</h4>
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
                  key={item.city.id}
                  title={item.city.name}
                  subtitle={`${item.city.eventsCount} événements`}
                  image={item.city.imageUrl || img}
                  href={`/villes/${item.city.slug}`}
                  isCard={true}
                />
              )}
              renderEmpty={() => (
                <div className="text-center text-gray-500 py-8">
                  <p>Aucune ville trouvée</p>
                </div>
              )}
              renderLoading={renderLoading}
              showFilters={false}
              scrollTargetRef={scrollTargetRef}
              gridClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            />
          </div>
        )}
      </section>

      {/* Afficher les sections suivantes seulement si pas de recherche active */}
      {!query && (
        <>
          <section className="wrapper">
            <h3>Parcourir les villes populaires</h3>
            {popularLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }, (_, i) => (
                  <TextImageCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {popularCities.map(
                  (city) =>
                    city.eventsCount > 0 && (
                      <TextImageCard
                        key={city.id}
                        title={city.name}
                        subtitle={`${city.eventsCount} événements`}
                        image={city.imageUrl || img}
                        href={`/villes/${city.name.toLowerCase()}`}
                        isCard={true}
                      />
                    )
                )}
              </div>
            )}
          </section>

          <section className="wrapper">
            <h3>Parcourir par région</h3>
            {getRegionCodes().map((regionCode) => (
              <TabList
                key={regionCode}
                title={FRENCH_REGIONS[regionCode]}
                items={regionCities[regionCode]?.map((city) => city.name) || []}
                generateHref={(city) => `/villes/${slugify(city)}`}
              />
            ))}
          </section>

          {filteredPlaces.length > 0 && (
            <section className="wrapper">
              <CustomTitle
                title="Les lieux les plus populaires"
                description="Lieux"
              />

              <PlacesMapList locations={filteredPlaces} />
            </section>
          )}
        </>
      )}
    </main>
  );
}

export default function VillesPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <VillesPageContent />
    </Suspense>
  );
}
