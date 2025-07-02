"use client";
import SearchInput from "@/components/inputs/search-input/search-input";
import OrganizerCard from "@/components/cards/organizer-card/organizer-card";
import OrganizerPhotoCard from "@/components/cards/organizer-photo-card/organizer-photo-card";
import { Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import CustomTitle from "@/components/commons/custom-title/custom-title";
import { useOrganizers } from "@/hooks/organizers/use-organizers";
import { useSearchPaginated } from "@/hooks/commons/use-search-paginated";
import PaginatedList from "@/components/commons/paginated-list/paginated-list";
import { SingleUser } from "@/types";

function OrganisateursPageContent() {
  const searchParams = useSearchParams()!;
  const initialQuery = searchParams.get("q") || "";
  const scrollTargetRef = useRef<HTMLElement>(null);

  // Hook pour récupérer tous les organisateurs
  const { organizers, loading, error } = useOrganizers();

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
    initialTypes: ["user"],
    pageSize: 20,
    scrollTargetRef,
  });

  // Rendu de chargement personnalisé avec le skeleton adapté
  const renderLoading = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="skeleton-bg h-32 rounded-xl"></div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <main>
        <section className="wrapper">
          <p>Chargement des organisateurs...</p>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <section className="wrapper">
          <h1>Erreur de chargement</h1>
          <p>Impossible de charger les organisateurs.</p>
          <p>Erreur: {error.message}</p>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="wrapper">
        <h1>Explorez les organisateurs veevent</h1>
        <h3>Rechercher un organisateur</h3>
        <SearchInput
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Florent, Jean, Marie..."
        />
      </section>

      {/* Affichage des résultats de recherche avec PaginatedList */}
      {query && (
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
            <OrganizerPhotoCard
              key={item.user.id}
              name={item.user.firstName + " " + item.user.lastName}
              imageUrl={item.user.imageUrl || ""}
              href={`/organisateurs/${item.user.pseudo}`}
            />
          )}
          renderEmpty={() => (
            <div className="text-center text-gray-500 py-8">
              <p className="text-lg md:text-xl font-semibold mb-2">
                Aucun organisateur trouvé
              </p>
              <p className="text-sm md:text-base">
                Essayez avec d'autres mots-clés
              </p>
            </div>
          )}
          renderLoading={renderLoading}
          showFilters={false}
          scrollTargetRef={scrollTargetRef}
          title="Résultats de recherche"
          gridClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        />
      )}

      {/* Afficher les sections suivantes seulement si pas de recherche active */}
      {!query && (
        <>
          {/* Organisateurs populaires */}
          {organizers.length > 0 && (
            <section className="wrapper">
              <CustomTitle
                description="Organisateurs populaires"
                title="Découvrez les organisateurs populaires"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {organizers
                  .filter((org) => org.eventsCount > 0)
                  .sort(
                    (a, b) =>
                      b.eventsCount +
                      b.eventPastCount -
                      (a.eventsCount + a.eventPastCount)
                  )
                  .slice(0, 6)
                  .map((organizer: SingleUser) => (
                    <OrganizerCard
                      key={organizer.pseudo}
                      organizer={organizer}
                    />
                  ))}
              </div>
            </section>
          )}

          {/* Tous les organisateurs */}
          <section className="wrapper">
            <h2>Tous les organisateurs</h2>
            {organizers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {organizers.map((organizer: SingleUser) => (
                  <OrganizerCard key={organizer.pseudo} organizer={organizer} />
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p className="text-lg md:text-xl font-semibold mb-2">
                  Aucun organisateur trouvé
                </p>
                <p className="text-sm md:text-base">
                  Essayez avec d'autres mots-clés
                </p>
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}

export default function OrganisateursPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <OrganisateursPageContent />
    </Suspense>
  );
}
