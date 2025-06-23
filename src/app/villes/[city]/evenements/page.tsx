"use client";
import { useParams } from "next/navigation";
import { useCityEvents } from "@/hooks/useCityEvents";
import { useMemo, useCallback, useState } from "react";
import EventCard from "@/components/cards/event-card/event-card";
import { Event } from "@/types";
import { Filter } from "iconoir-react";
import FilterBottomSheet from "@/components/common/filters/filter-bottom-sheet";
import { FilterProvider, useFilters } from "@/contexts/FilterContext";

const extractIdFromSelfLink = (event: Event): string => {
  const href = event._links.self.href;
  const id = href.split("/").pop();
  return id || "";
};

function EvenementsContent() {
  const { city: cityParam } = useParams() as { city: string };
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { appliedFilters, hasActiveFilters } = useFilters(); // Utiliser appliedFilters au lieu de filters

  // Décoder le paramètre URL et capitaliser
  const cityName = useMemo(() => {
    return decodeURIComponent(cityParam);
  }, [cityParam]);

  // Hook pour récupérer les événements via les liens HATEOAS
  const {
    city,
    allEvents,
    trendingEvents,
    firstEditionEvents,
    loading,
    error,
    applyFilters,
  } = useCityEvents(cityName, {
    fetchAll: true,
    fetchTrending: true,
    fetchFirstEdition: true,
    filters: appliedFilters, // Utiliser appliedFilters
  });

  // Appliquer les filtres quand appliedFilters change
  useMemo(() => {
    if (Object.keys(appliedFilters).length > 0) {
      applyFilters(appliedFilters);
    }
  }, [appliedFilters, applyFilters]);

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
            Aucun événement trouvé à {cityName}
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
    [cityName]
  );

  if (loading) {
    return (
      <div className="wrapper">
        <p>Chargement des événements...</p>
      </div>
    );
  }

  if (error || !city) {
    return (
      <div className="wrapper">
        <h1>Ville non trouvée</h1>
        <p>Impossible de charger les événements pour "{cityName}".</p>
        {error && <p>Erreur: {error.message}</p>}
      </div>
    );
  }

  return (
    <>
      <section className="wrapper">
        {/* Événements trending (populaires) */}
        <h2>Les événements populaires à {city.name}</h2>
        {trendingEvents.length > 0 ? (
          renderEventCards(trendingEvents, false, null, false)
        ) : (
          <p>Aucun événement populaire pour le moment.</p>
        )}
      </section>

      <section className="wrapper">
        {/* Événements de première édition */}
        <h2>Ils font leur début à {city.name}</h2>
        {firstEditionEvents.length > 0 ? (
          renderEventCards(firstEditionEvents, false, null, false)
        ) : (
          <p>Aucun événement de première édition pour le moment.</p>
        )}
      </section>

      <section className="wrapper">
        {/* Autres événements */}
        <h2>Tous les événements à {city.name} et aux alentours</h2>
        {/* Bouton de filtre */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setIsFilterOpen(true)}
            className={`rounded-full border font-semibold px-2 py-1 flex items-center gap-2 ${
              hasActiveFilters
                ? "border-primary-600 bg-primary-600 text-white"
                : "border-primary-600 text-primary-600"
            }`}
          >
            <Filter className="text-xs" />
            filtres & tris
            {hasActiveFilters && (
              <span className="bg-white text-primary-600 rounded-full px-1 text-xs">
                •
              </span>
            )}
          </button>
        </div>
        {allEvents.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {renderEventCards(allEvents, false, null, true)}
          </div>
        )}
        {allEvents.length === 0 && hasActiveFilters && (
          <p>Aucun événement ne correspond à vos critères de filtrage.</p>
        )}
      </section>
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
