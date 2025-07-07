"use client";
import { useParams } from "next/navigation";
import { useCity } from "@/hooks/cities/use-city";
import { useCities } from "@/hooks/cities/use-cities";
import EventCard from "@/components/cards/event-card/event-card";
import NewsCard from "@/components/cards/news-card/news-card";
import CustomTitle from "@/components/commons/custom-title/custom-title";
import TabList from "@/components/lists/tab-list/tab-list";
import Link from "next/link";
import HorizontalList from "@/components/lists/horizontal-list/horizontal-list";
import { BaseUser, Event, SingleUser } from "@/types";
import { useCityEvents } from "@/hooks/cities/use-city-events";
import { FRENCH_REGIONS } from "@/constants/regions";
import TextImageCard from "@/components/cards/text-image-card/text-image-card";
import img from "@/assets/images/nice.jpg";
import OrganizerCard from "@/components/cards/organizer-card/organizer-card";
import { useCityData } from "@/hooks/cities/use-city-data";

const extractIdFromSelfLink = (event: Event): string => {
  const href = event._links.self.href;
  const id = href.split("/").pop();
  return id || "";
};

export default function CityPage() {
  const { city: cityParam } = useParams() as { city: string };

  // Décoder le paramètre URL et capitaliser
  const cityName = decodeURIComponent(cityParam);

  // Hook pour récupérer les données de la ville
  const { city, events, nearestCities, loading, error } = useCity(cityName);

  const { trendingEvents } = useCityEvents(cityName);
  const { organizers: popularOrganizers } = useCityData(
    cityName,
    "organizers",
    undefined,
    3
  );

  // Hook pour récupérer les villes par région (pour les TabList)
  const { cities: regionCities } = useCities("byRegion", {
    region: city?.region || "",
  });

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

  if (error || !city) {
    return (
      <div className="wrapper">
        <h1>Ville non trouvée</h1>
        <p>La ville "{cityName}" n'existe pas ou n'est pas disponible.</p>
        <Link href="/villes" className="primary-btn">
          <span>Retour aux villes</span>
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Section des événements populaires en horizontal */}
      {trendingEvents.length > 0 && (
        <HorizontalList title={`Les évènements populaires à ${city.name}`}>
          {renderEventCards(trendingEvents, false, null)}
        </HorizontalList>
      )}

      {/* Section découverte de la ville */}
      <section className="wrapper">
        <h2>Découvrir la ville de {city.name}</h2>
        {city.content ? (
          <NewsCard description={city.content} />
        ) : (
          <NewsCard
            description={`Découvrez ${city.name}, une ville magnifique de la région ${city.region}. 
            Avec ${city.eventsCount} événements disponibles, il y a toujours quelque chose à faire !`}
          />
        )}
      </section>

      {/* Section tous les événements */}
      <section className="wrapper">
        {/* Villes proches */}
        {nearestCities.length > 0 && (
          <>
            <h3>Villes proches de {city.name}</h3>
            {nearestCities.map(
              (nearestCity) =>
                nearestCity.eventsCount > 0 && (
                  <TextImageCard
                    key={nearestCity.id}
                    title={nearestCity.name}
                    subtitle={`${nearestCity.eventsCount} événement${
                      nearestCity.eventsCount > 1 ? "s" : ""
                    }`}
                    image={img}
                    href={`/villes/${slugify(nearestCity.name)}`}
                  />
                )
            )}
          </>
        )}
      </section>

      {popularOrganizers.length > 0 && (
        <section className="wrapper">
          <CustomTitle
            title={`Découvrez leurs derniers évènements sur ${city.name}`}
            description={`Organisateurs populaires`}
          />
          {popularOrganizers.map((organizer: SingleUser) => (
            <OrganizerCard key={organizer.id} organizer={organizer} />
          ))}
          <button className="secondary-btn">
            <span>Voir tous les organisateurs</span>
          </button>
        </section>
      )}

      {/* Section actualités */}
      <section className="wrapper">
        <CustomTitle
          title={`Les évènements à ne pas manquer à ${city.name} et ses alentours`}
          description="Actualités"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NewsCard
          title={`Les événements incontournables à ${city.name}`}
          description={`Découvrez les meilleurs événements qui se déroulent à ${city.name}. 
          Avec ${city.eventsCount} événements disponibles, notre ville offre une programmation riche et variée 
          pour tous les goûts et tous les âges. Ne manquez pas les événements qui font vibrer notre région !`}
          date={new Date().toLocaleDateString("fr-FR")}
        />

        {nearestCities.length > 0 && (
          <NewsCard
            title={`Explorez les villes voisines de ${city.name}`}
            description={`${
              city.name
            } est idéalement située près de ${nearestCities
              .slice(0, 3)
              .join(", ")}. 
            Profitez de votre séjour pour découvrir ces destinations exceptionnelles de la région ${
              city.region
            }.`}
            date={new Date().toLocaleDateString("fr-FR")}
          />
        )}
        </div>
        <Link href="#" className="secondary-btn">
          <span>Voir les actualités de la ville</span>
        </Link>
      </section>
    </>
  );
}
