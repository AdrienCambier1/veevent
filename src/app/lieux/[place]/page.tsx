"use client";
import EventCard from "@/components/cards/event-card/event-card";
import NewsCard from "@/components/cards/news-card/news-card";
import TextImageCard from "@/components/cards/text-image-card/text-image-card";
import HorizontalList from "@/components/lists/horizontal-list/horizontal-list";
import Gmap from "@/components/lists/places-map-list/gmap";
import { usePlace } from "@/hooks/places/use-place";
import { usePlaceData } from "@/hooks/places/use-place-data";
import { Event } from "@/types";
import { MapPin } from "iconoir-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { usePageTitle } from "@/hooks/commons/use-page-title";
import { PAGE_TITLES } from "@/utils/page-titles";

const extractIdFromSelfLink = (event: Event): string => {
  const href = event._links.self.href;
  const id = href.split("/").pop();
  return id || "";
};

export default function PlacePage() {
  const { place: placeParam } = useParams() as { place: string };

  const { place, loading, error, refetch } = usePlaceData(placeParam);
  
  // Gestion dynamique du titre de la page
  usePageTitle({
    title: place ? `${place.name} - ${place.cityName}` : 'Lieu',
    description: place ? `Découvrez ${place.name} à ${place.cityName} et ses événements` : 'Découvrez ce lieu et ses événements',
  });

  const {
    events: trendingEvents,
    loading: trendingEventsLoading,
    error: trendingEventsError,
  } = usePlaceData(placeParam, "trending");

  const {
    events: firstEditionEvents,
    loading: firstEditionEventsLoading,
    error: firstEditionEventsError,
  } = usePlaceData(placeParam, "firstEvents");

  const {
    organizers,
    loading: organizersLoading,
    error: organizersError,
  } = usePlaceData(placeParam, "organizers");

  // Décoder le paramètre URL et capitaliser
  const placeName = decodeURIComponent(placeParam);
  // .split("-")
  // .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
  // .join(" ");

  // Hook pour récupérer les villes par région (pour les TabList)
  //   const { cities: regionCities } = useCities("byRegion", {
  //     region: city?.region || "",
  //   });
  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // Supprimer les caractères spéciaux
      .replace(/\s+/g, "-") // Remplacer les espaces par des tirets
      .replace(/-+/g, "-") // Remplacer les tirets multiples par un seul
      .trim(); // Supprimer les espaces au début et à la fin
  };

  // Fonction pour rendre les EventCards (inspirée de la page événements)
  const renderEventCards = (
    events: Event[],
    loading: boolean,
    error: Error | null
  ) => {
    if (loading) {
      return (
        <div className="loading-skeleton">
          <div className="skeleton-bg h-32"></div>
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

  if (loading) {
    return (
      <div className="wrapper">
        <p>Chargement de la ville...</p>
      </div>
    );
  }

  if (error || !place) {
    return (
      <div className="wrapper">
        <h1>Lieu non trouvé</h1>
        <p>Le lieu "{placeName}" n'existe pas ou n'est pas disponible.</p>
        <Link href="/lieux" className="primary-btn">
          <span>Retour aux lieux</span>
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Section des événements populaires en horizontal */}
      {trendingEvents.length > 0 && (
        <HorizontalList title={`Les évènements populaires à ${place.name}`}>
          {renderEventCards(trendingEvents, false, null)}
        </HorizontalList>
      )}

      {/* Section découverte de la ville */}
      <section className="wrapper">
        <h2>
          Iconique {place.name} à {place.cityName}
        </h2>
        {place.content ? (
          <NewsCard description={place.content} imageUrl={place.imageUrl} />
        ) : (
          <NewsCard
            description={`Découvrez ${place.name}, un magnifique lieu de la ville ${place.cityName}. 
            Avec ${place.eventsCount} événements disponibles, il y a toujours quelque chose à faire !`}
          />
        )}
      </section>

      <section className="wrapper">
        <h2>Se rendre à {place.name}</h2>
        <Gmap locations={[place]} />
        <div className="flex gap-2 items-center">
          <MapPin className="text-primary-600" />
          {place.address}
        </div>
        <button
          className="secondary-btn"
          onClick={() =>
            window.open(
              `https://www.google.com/maps/search/?api=1&query=${place.name} ${place.cityName}`,
              "_blank"
            )
          }
        >
          <span>Voir sur Google Maps</span>
        </button>
      </section>

      <section className="wrapper">
        <h2>Ils organisent bientôt leurs évènements</h2>

        {organizers.length > 0 ? (
          organizers
            .slice(0, 5)
            .map((organizer, index) => (
              <TextImageCard
                key={organizer.pseudo || index}
                title={
                  `${organizer.firstName || ""} ${
                    organizer.lastName || ""
                  }`.trim() ||
                  organizer.pseudo ||
                  "Organisateur"
                }
                href={`/organisateurs/${organizer.pseudo || "unknown"}`}
                image={organizer.imageUrl || organizer.bannerUrl || ""}
              />
            ))
        ) : (
          <p>Aucun organisateur trouvé pour le moment.</p>
        )}

        <Link href={`/lieux/${placeParam}/evenements`} className="primary-btn">
          <span>Voir les prochains événements</span>
        </Link>
      </section>

      {/* Événements de première édition */}
      {firstEditionEvents.length > 0 && (
        <HorizontalList title={`Ils font leur début à ${place?.name}`}>
          {renderEventCards(firstEditionEvents, false, null)}
        </HorizontalList>
      )}
    </>
  );
}
