"use client";
import { useParams } from "next/navigation";
import { useCityData } from "@/hooks/useCityData";
import CustomTitle from "@/components/common/custom-title/custom-title";
import EventCard from "@/components/cards/event-card/event-card";
import Link from "next/link";
import TextImageCard from "@/components/cards/text-image-card/text-image-card";
import HorizontalList from "@/components/lists/horizontal-list/horizontal-list";
import { Event } from "@/types";
import { useMemo } from "react";

const extractIdFromSelfLink = (event: Event): string => {
  const href = event._links.self.href;
  const id = href.split("/").pop();
  return id || "";
};

export default function OrganisateursPage() {
  const { city: cityParam } = useParams() as { city: string };

  // Décoder le paramètre URL et capitaliser
  const cityName = useMemo(() => {
    return decodeURIComponent(cityParam)
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }, [cityParam]);

  // Hook pour récupérer les organisateurs via les liens HATEOAS
  const { city, events, organizers, loading, error } = useCityData(
    cityName,
    "organizers"
  );

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
      </section>

      {featuredEvent && (
        <section className="wrapper">
          <h2>Les évènements populaires à {city.name}</h2>
          {renderEventCards([featuredEvent], false, null, false)}
        </section>
      )}

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
                  }`.trim() || organizer.pseudo
                }
                subtitle={`${organizer.eventsCount || 0} événement${
                  organizer.eventsCount > 1 ? "s" : ""
                } • Note: ${organizer.note || "N/A"}/5`}
                href={`/organisateurs/${organizer.pseudo}`}
                image={organizer.imageUrl || organizer.bannerUrl}
              />
            ))
        ) : (
          <p>Aucun organisateur trouvé pour le moment.</p>
        )}

        <Link href="/organisateurs" className="primary-btn">
          <span>Voir tous les organisateurs</span>
        </Link>
      </section>

      {popularEvents.length > 1 && (
        <HorizontalList title={`Les évènements populaires à ${city.name}`}>
          {renderEventCards(popularEvents, false, null, false)}
        </HorizontalList>
      )}

      <section className="wrapper">
        <Link
          href={`/villes/${cityParam}/evenements`}
          className="secondary-btn"
        >
          <span>Voir tous les événements</span>
        </Link>
      </section>
    </>
  );
}
