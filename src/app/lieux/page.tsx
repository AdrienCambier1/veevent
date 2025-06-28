"use client";
import SearchInput from "@/components/inputs/search-input/search-input";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import EventCard from "@/components/cards/event-card/event-card";
import HorizontalList from "@/components/lists/horizontal-list/horizontal-list";
import CustomTitle from "@/components/commons/custom-title/custom-title";
import PlaceCard from "@/components/cards/place-card/place-card";
import { usePlaces } from "@/hooks/places/use-places";
import { useEvents } from "@/hooks/events/use-events";

function LieuxPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  // Récupérer les lieux populaires
  const {
    places: popularPlaces,
    loading: placesLoading,
    error: placesError,
  } = usePlaces("popular", undefined, undefined, 3);

  // Récupérer les résultats de recherche si un terme est présent
  // const searchQuery = searchParams?.get("search") || "";
  // const { places: searchResults, loading: searchLoading } = usePlaces(
  //   searchQuery ? "search" : undefined,
  //   searchQuery || undefined
  // );

  // Récupérer quelques événements pour la section horizontale
  const { events: popularEvents, loading: popularEventsLoading } = useEvents("popular");

  // useEffect(() => {
  //   const urlSearch = searchParams?.get("search");
  //   if (urlSearch) {
  //     setSearchTerm(urlSearch);
  //   }
  // }, [searchParams]);

  // const handleSearch = () => {
  //   if (searchTerm.trim()) {
  //     router.push(`/lieux?search=${encodeURIComponent(searchTerm)}`);
  //   } else {
  //     router.push("/lieux");
  //   }
  // };

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setSearchTerm(e.target.value);
  // };

  // const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === "Enter") {
  //     handleSearch();
  //   }
  // };

  // Déterminer quels lieux afficher
  // const displayPlaces = searchQuery ? searchResults : popularPlaces;
  // const isLoading = searchQuery ? searchLoading : placesLoading;

  return (
    <main>
      <section className="wrapper">
        <h1>Explorez les différents lieux sur veevent</h1>
        <h3>Rechercher un lieu</h3>
        <SearchInput
          placeholder="Stade, Parc, Salle de concert..."
        />
        <button className="primary-btn">
          <span>Rechercher</span>
        </button>
      </section>

      <section className="wrapper">
        <CustomTitle
          description="Lieux"
          title={"Les lieux populaires en ce moment"}
        />


        {popularPlaces.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularPlaces.map((place) => (
            <PlaceCard key={place.id} place={place} />
            ))}
          </div>
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
              ))
            }
        </HorizontalList>
        )}

        
    </main>
  );
}

export default function LieuxPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      }
    >
      <LieuxPageContent />
    </Suspense>
  );
}
