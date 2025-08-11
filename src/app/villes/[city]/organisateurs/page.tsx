"use client";
import EventCard from "@/components/cards/event-card/event-card";
import OrganizerCard from "@/components/cards/organizer-card/organizer-card";
import OrganizerPhotoCard from "@/components/cards/organizer-photo-card/organizer-photo-card";
import TextImageCard from "@/components/cards/text-image-card/text-image-card";
import CustomTitle from "@/components/commons/custom-title/custom-title";
import HorizontalList from "@/components/lists/horizontal-list/horizontal-list";
import { useCityData } from "@/hooks/cities/use-city-data";
import { useCityEvents } from "@/hooks/cities/use-city-events";
import { Event } from "@/types";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";

const extractIdFromSelfLink = (event: Event): string => {
  const href = event._links?.self?.href || "";
  const id = href.split("/").pop();
  return id || "";
};

export default function OrganisateursPage() {
  const { city: cityParam } = useParams() as { city: string };

  // Décoder le paramètre URL et capitaliser
  const cityName = useMemo(() => {
    return decodeURIComponent(cityParam);
  }, [cityParam]);

  // Hook pour récupérer les organisateurs via les liens HATEOAS
  const { city, events, organizers, firstEvents, loading, error } = useCityData(
    cityName,
    "organizers"
  );

  const { trendingEvents } = useCityEvents(cityName, {
    fetchTrending: true,
  });

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
        <EventCard key={eventId} id={eventId} event={event} minify={minify} />
      );
    });
  };

  if (loading) {
    return (
      <div className="wrapper">
        <p>Chargement des organisateurs...</p>
      </div>
    );
  }

  if (error || !city) {
    return (
      <div className="wrapper">
        <h1>Ville non trouvée</h1>
        <p>Impossible de charger les organisateurs pour "{cityName}".</p>
      </div>
    );
  }

  // Événements pour affichage
  const featuredEvent = events[0]; // Premier événement comme événement vedette
  const popularEvents = events.slice(0, 4);

  return (
    <>
      <section className="wrapper">
        <CustomTitle
          title={`Découvrez leurs derniers évènements sur ${city.name}`}
          description="Organisateurs populaires"
        />
        {organizers.length > 0 &&
          organizers.map((organizer) => (
            <OrganizerCard organizer={organizer} />
          ))}
      </section>

      {/* Événements de première édition */}

      {trendingEvents.length > 0 && (
        <HorizontalList title={`Les événements populaires à ${city.name}`}>
          {renderEventCards(trendingEvents as Event[], false, null, false)}
        </HorizontalList>
      )}

      <section className="wrapper">
        <h2>Ils organisent bientôt leurs évènements</h2>

        {organizers.length > 0 ? (
          organizers
            .slice(0, 5)
            .map((organizer, index) => (
              <TextImageCard
                key={index}
                title={
                  `${organizer.firstName || ""} ${
                    organizer.lastName || ""
                  }`.trim() || organizer.pseudo
                }
                href={`/organisateurs/${organizer.slug}`}
                image={organizer.imageUrl || organizer.bannerUrl}
              />
            ))
        ) : (
          <p>Aucun organisateur trouvé pour le moment.</p>
        )}

        <Link href={`/villes/${cityParam}/evenements`} className="primary-btn">
          <span>Voir les prochains événements</span>
        </Link>
      </section>

      {firstEvents.length > 1 && (
        <HorizontalList title={`Ils font leur début à ${city.name}`}>
          {renderEventCards(firstEvents as Event[], false, null, false)}
        </HorizontalList>
      )}

      {organizers.length > 0 && (
        <section className="wrapper">
          <h2>Ils ont organisé récemment à {city.name}</h2>
          <div className="grid grid-cols-3 gap-4">
            {organizers.map((organizer, index) => (
              <OrganizerPhotoCard
                key={index}
                name={organizer.firstName + " " + organizer.lastName}
                imageUrl={organizer.imageUrl}
                href={`/organisateurs/${organizer.slug}`}
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
