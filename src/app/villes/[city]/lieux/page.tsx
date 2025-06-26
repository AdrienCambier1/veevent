"use client";
import EventCard from "@/components/cards/event-card/event-card";
import CustomTitle from "@/components/commons/custom-title/custom-title";
import HorizontalList from "@/components/lists/horizontal-list/horizontal-list";
import PlacesMapList from "@/components/lists/places-map-list/places-map-list";
import TabList from "@/components/lists/tab-list/tab-list";
import {
  PLACE_TYPE_LABELS,
  PLACE_TYPE_ORDER,
} from "@/constants/places-categories";
import { useCityData } from "@/hooks/cities/use-city-data";
import { useCityEvents } from "@/hooks/cities/use-city-events";
import { useCityPlacesByCategory } from "@/hooks/cities/use-city-places-by-category";
import { Event } from "@/types";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";

const extractIdFromSelfLink = (event: Event): string => {
  const href = event._links.self.href;
  const id = href.split("/").pop();
  return id || "";
};

export default function LieuxPage() {
  const { city: cityParam } = useParams() as { city: string };

  // Décoder le paramètre URL et capitaliser
  const cityName = useMemo(() => {
    return decodeURIComponent(cityParam);
    // .split("-")
    // .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    // .join(" ");
  }, [cityParam]);

  // Hook pour récupérer les lieux via les liens HATEOAS
  const {
    city: cityLieux,
    places,
    loading: placesLoading,
    error: placesError,
  } = useCityData(cityName, "places");

  // Hook pour récupérer les événements trending (populaires)
  const {
    city,
    trendingEvents,
    loading: eventsLoading,
    error: eventsError,
  } = useCityEvents(cityName);

  const {
    placesByCategory,
    loading: placesByCategoryLoading,
    error: placesByCategoryError,
  } = useCityPlacesByCategory(city?._links?.places?.href);

  if (placesByCategoryLoading) {
    return <div>Chargement des lieux...</div>;
  }
  if (placesByCategoryError) {
    return (
      <div>
        Erreur lors du chargement des lieux: {placesByCategoryError.message}
      </div>
    );
  }

  // Fonction pour rendre les EventCards
  const renderEventCards = (
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
          Aucun événement populaire trouvé
        </div>
      );
    }

    return events.map((event: Event) => {
      const eventId = extractIdFromSelfLink(event);

      return (
        <EventCard key={eventId} id={eventId} event={event} minify={minify} />
      );
    });
  };

  const loading = placesLoading || eventsLoading;
  const error = placesError || eventsError;
  const cityData = city || cityLieux;

  if (loading) {
    return (
      <div className="wrapper">
        <p>Chargement des lieux...</p>
      </div>
    );
  }

  if (error || !cityData) {
    return (
      <div className="wrapper">
        <h1>Ville non trouvée</h1>
        <p>Impossible de charger les lieux pour "{cityName}".</p>
        {error && <p>Erreur: {error.message}</p>}
      </div>
    );
  }

  return (
    <>
      {/* Affichage des lieux */}
      <section className="wrapper">
        <CustomTitle
          title={`Les lieux populaires à ${cityData.name}`}
          description="Lieux"
        />
        {places.length > 0 ? (
          <PlacesMapList locations={places} />
        ) : (
          <p>Aucun lieu trouvé pour le moment.</p>
        )}
      </section>

      {/* Événements populaires (trending) */}
      {trendingEvents.length > 0 && (
        <HorizontalList title={`Les évènements populaires à ${cityData.name}`}>
          {renderEventCards(trendingEvents, false, null, false)}
        </HorizontalList>
      )}

      {/* Liste des lieux par catégorie */}
      <section className="wrapper">
        <h2>Tous les lieux sur Nice et alentours</h2>
        {PLACE_TYPE_ORDER.map((typeKey) => {
          const label = PLACE_TYPE_LABELS[typeKey];
          const places = placesByCategory[label];
          if (!places || places.length === 0) return null;
          return (
            <TabList
              key={typeKey}
              title={label}
              items={places.map((place) => place.name)}
              generateHref={(name) => {
                const place = places.find((p) => p.name === name);
                return place ? `/lieux/${place.id}` : "#";
              }}
            />
          );
        })}
      </section>

    
    </>
  );
}
