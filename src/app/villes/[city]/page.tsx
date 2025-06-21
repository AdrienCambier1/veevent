"use client";
import { useParams } from "next/navigation";
import { useCity } from "@/hooks/useCity";
import { useCities } from "@/hooks/useCities";
import EventCard from "@/components/cards/event-card/event-card";
import NewsCard from "@/components/cards/news-card/news-card";
import CustomTitle from "@/components/common/custom-title/custom-title";
import TabList from "@/components/lists/tab-list/tab-list";
import Link from "next/link";
import HorizontalList from "@/components/lists/horizontal-list/horizontal-list";
import { Event } from "@/types";

const extractIdFromSelfLink = (event: Event): string => {
  const href = event._links.self.href;
  const id = href.split("/").pop();
  return id || "";
};

export default function CityPage() {
  const { city: cityParam } = useParams() as { city: string };

  // Décoder le paramètre URL et capitaliser
  const cityName = decodeURIComponent(cityParam);
  // .split("-")
  // .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
  // .join(" ");

  // Hook pour récupérer les données de la ville
  const { city, events, nearestCities, loading, error } = useCity(cityName);

  // Hook pour récupérer les villes par région (pour les TabList)
  const { cities: regionCities } = useCities("byRegion", {
    region: city?.region || "Provence Alpes Côte d'azur",
  });

  // Fonction pour rendre les EventCards (inspirée de la page événements)
  const renderEventCards = (
    events: Event[],
    loading: boolean,
    error: Error | null
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

  // Séparer les événements populaires (les 4 premiers) du reste
  const popularEvents = events.slice(0, 4);
  const otherEvents = events.slice(4);

  return (
    <>
      {/* Section des événements populaires en horizontal */}
      {popularEvents.length > 0 && (
        <HorizontalList title={`Les évènements populaires à ${city.name}`}>
          {renderEventCards(popularEvents, false, null)}
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
        <h2>Les évènements à {city.name}</h2>

        {events.length === 0 ? (
          <p>Aucun événement disponible pour le moment à {city.name}.</p>
        ) : (
          <>
            {/* Afficher les autres événements s'il y en a */}
            {otherEvents.length > 0 &&
              renderEventCards(otherEvents, false, null)}

            {/* Si pas d'événements populaires, afficher tous les événements ici */}
            {popularEvents.length === 0 &&
              renderEventCards(events, false, null)}
          </>
        )}

        {/* Villes proches */}
        {nearestCities.length > 0 && (
          <>
            <h3>Villes proches de {city.name}</h3>
            <TabList
              title="Villes à proximité"
              items={nearestCities}
              generateHref={(cityName) =>
                `/villes/${cityName.toLowerCase().replace(" ", "-")}`
              }
            />
          </>
        )}

        {/* Villes de la région */}
        {regionCities.length > 0 && (
          <TabList
            title={city.region}
            items={regionCities
              .filter((c) => c.name !== city.name) // Exclure la ville actuelle
              .map((c) => c.name)}
            generateHref={(cityName) =>
              `/villes/${cityName.toLowerCase().replace(" ", "-")}`
            }
          />
        )}
      </section>

      {/* Section actualités */}
      <section className="wrapper">
        <CustomTitle
          title={`Les évènements à ne pas manquer à ${city.name} et ses alentours`}
          description="Actualités"
        />
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

        <Link href="#" className="secondary-btn">
          <span>Voir les actualités de la ville</span>
        </Link>
      </section>
    </>
  );
}
