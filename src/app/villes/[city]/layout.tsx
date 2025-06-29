"use client";
import { ReactNode, useRef, Suspense } from "react";
import SearchInput from "@/components/inputs/search-input/search-input";
import BarMenu from "@/components/menu/bar-menu/bar-menu";
import BannerHead from "@/components/heads/banner-head/banner-head";
import CustomTitle from "@/components/commons/custom-title/custom-title";
import FaqCard from "@/components/cards/faq-card/faq-card";
import ReviewCard from "@/components/cards/review-card/review-card";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useCityData } from "@/hooks/cities/use-city-data";
import { useSearchPaginated } from "@/hooks/commons/use-search-paginated";
import PaginatedList from "@/components/commons/paginated-list/paginated-list";
import EventCard from "@/components/cards/event-card/event-card";

interface CitiesLayoutProps {
  children: ReactNode;
}

function CityLayoutContent({ children }: CitiesLayoutProps) {
  const { city } = useParams() as { city: string };
  const searchParams = useSearchParams()!;
  const initialQuery = searchParams.get("q") || "";
  const searchScrollTargetRef = useRef<HTMLElement>(null);
  
  const { city: cityData } = useCityData(city);

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

  const navigation = [
    { isHome: true, href: `/villes/${city}`, label: "Accueil" },
    { label: "Événements", href: `/villes/${city}/evenements` },
    { label: "Lieux", href: `/villes/${city}/lieux` },
    { label: "Organisateurs", href: `/villes/${city}/organisateurs` },
  ];

  // Rendu de chargement personnalisé pour la recherche
  const renderSearchLoading = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="animate-pulse bg-gray-200 h-80 rounded-lg"></div>
      ))}
    </div>
  );

  return (
    <main>
      <BannerHead city={cityData?.name || ""} />
      <section className="wrapper">
        <h1>Évènements et activités proche de la ville de {cityData?.name}</h1>
        <h3>Rechercher un évènement à {cityData?.name}</h3>
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
                <p>Aucun événement trouvé à {city}</p>
              </div>
            )}
            renderLoading={renderSearchLoading}
            showFilters={false}
            scrollTargetRef={searchScrollTargetRef}
          />
        </div>
      )}

      {/* Afficher le contenu normal seulement si pas de recherche active */}
      {!query && (
        <>
          <section className="wrapper">
            <BarMenu navigation={navigation} />
          </section>
          {children}
          <section className="wrapper">
            <CustomTitle
              title="Nos utilisateurs parlent de leur expérience à Nice"
              description="Avis"
            />
            <ReviewCard
              author="Jean Dupont"
              note={3}
              title="Je recommande cette platefomre pour trouver des artistes locaux"
              description="Sed non triarius nata consectetur est homines esse dolor voluptatem in iam ipsum viros est est est instrumento itaque iste epicuro. Isto triarius iste habent abducas atque et igitur se."
              type="pop rock"
              place="Maison 13"
              city="Cannes"
            />
            <ReviewCard
              author="Jean Dupont"
              note={3}
              title="Je recommande cette platefomre pour trouver des artistes locaux"
              description="Sed non triarius nata consectetur est homines esse dolor voluptatem in iam ipsum viros est est est instrumento itaque iste epicuro. Isto triarius iste habent abducas atque et igitur se."
              type="pop rock"
              place="Maison 13"
              city="Cannes"
            />
            <Link href="#" className="secondary-btn">
              <span>Voir plus d'avis</span>
            </Link>
          </section>
          <section className="wrapper">
            <CustomTitle
              title="Questions fréquentes de nos utilisateurs"
              description="FAQ"
            />
            <FaqCard label="Comment acheter un billet de concert ?" />
            <FaqCard label="Comment acheter un billet de concert ?" />
            <FaqCard label="Comment acheter un billet de concert ?" />
          </section>
        </>
      )}
    </main>
  );
}

export default function CityLayout({ children }: CitiesLayoutProps) {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <CityLayoutContent children={children} />
    </Suspense>
  );
}
