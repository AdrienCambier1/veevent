"use client";
import EventCard from "@/components/cards/event-card/event-card";
import NewsCard from "@/components/cards/news-card/news-card";
import ThemeCard from "@/components/cards/theme-card/theme-card";
import CustomTitle from "@/components/commons/custom-title/custom-title";
import TrustpilotCard from "@/components/cards/trustpilot-card/trustpilot-card";
import * as Iconoir from "iconoir-react";
import ReviewCard from "@/components/cards/review-card/review-card";
import TrendingCard from "@/components/cards/trending-card/trending-card";
import Link from "next/link";
import Shortcut from "@/components/commons/shortcut/shortcut";
import PlaceCard from "@/components/cards/place-card/place-card";
import PlacesMapList from "@/components/lists/places-map-list/places-map-list";
import EventsAgenda from "@/components/commons/events-agenda/events-agenda";
import Welcome from "@/components/commons/welcome/welcome";
import ProfileHead from "@/components/heads/profile-head/profile-head";
import SearchBtn from "@/components/commons/search-btn/search-btn";
import TabList from "@/components/lists/tab-list/tab-list";
import OrganizerCard from "@/components/cards/organizer-card/organizer-card";
import TextImageCard from "@/components/cards/text-image-card/text-image-card";
import img from "@/assets/images/nice.jpg";
import HorizontalList from "@/components/lists/horizontal-list/horizontal-list";
import FaqCard from "@/components/cards/faq-card/faq-card";
import TicketCard from "@/components/cards/ticket-card/ticket-card";
import { useAuth } from "@/contexts/auth-context";
import { useEvents } from "@/hooks/events/use-events";
import { useCityEvents } from "@/hooks/events/use-city-events";
import { useUserPreferredEvents } from "@/hooks/events/use-user-preferred-events";
import { useCities } from "@/hooks/cities/use-cities";
import { Event } from "@/types";
import EventCardSkeleton from "@/components/cards/event-card/event-card-skeleton";
import { useCategories } from "@/hooks/commons/use-categories";
import { useOrganizers } from "@/hooks/organizers/use-organizers";
import ThemeCardSkeleton from "@/components/cards/theme-card/theme-card-skeleton";
import TrendingCardSkeleton from "@/components/cards/trending-card/trending-card-skeleton";
import { useNearbyCities } from "@/hooks/cities/use-nearby-cities";
import { usePlaces } from "@/hooks/places/use-places";
import { useNearbyPlaces } from "@/hooks/places/use-nearby-places";
import OrganizerCardSkeleton from "@/components/cards/organizer-card/organizer-card-skeleton";
import NewsCardSkeleton from "@/components/cards/news-card/news-card-skeleton";
import FaqCardSkeleton from "@/components/cards/faq-card/faq-card-skeleton";
import TrustpilotCardSkeleton from "@/components/cards/trustpilot-card/trustpilot-card-skeleton";
import ReviewCardSkeleton from "@/components/cards/review-card/review-card-skeleton";
import PlaceCardSkeleton from "@/components/cards/place-card/place-card-skeleton";
import TextImageCardSkeleton from "@/components/cards/text-image-card/text-image-card-skeleton";

export default function HomePage() {
  const { login, loading, isAuthenticated, logout } = useAuth();

  // Récupération des événements par catégorie
  const {
    events: popularEvents,
    loading: popularLoading,
    error: popularError,
  } = useEvents("popular");
  const {
    events: trendingEvents,
    loading: trendingLoading,
    error: trendingError,
  } = useEvents("trending");
  const {
    events: dealEvents,
    loading: dealLoading,
    error: dealError,
  } = useEvents("deals");
  const {
    events: freeEvents,
    loading: freeLoading,
    error: freeError,
  } = useEvents("free");
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  // ✅ Récupération des villes tendances (top 5)
  const {
    cities: trendingCities,
    loading: trendingCitiesLoading,
    error: trendingCitiesError,
  } = useCities("popular", { limit: 5 });

  // ✅ Récupération des organisateurs
  const {
    organizers,
    loading: organizersLoading,
    error: organizersError,
  } = useOrganizers();

  // Hook pour récupérer les villes proches (ou par défaut)
  const { cities: nearbyCities, loading: loadingNearbyCities } =
    useNearbyCities(3);

  // Hook pour récupérer les lieux de la première ville proche (ou par défaut)
  const cityName = nearbyCities[0]?.name;
  const { places: nearbyPlacesByCity, loading: loadingNearbyPlacesByCity } =
    usePlaces(undefined, undefined, cityName, 3);

  // Hook pour récupérer les lieux les plus proches (toutes villes confondues)
  const { places: nearbyPlaces, loading: loadingNearbyPlaces } =
    useNearbyPlaces(3);

  // ✅ Hook pour récupérer les événements de la ville sélectionnée et de ses villes proches
  const {
    events: cityEvents,
    loading: cityEventsLoading,
    error: cityEventsError,
  } = useCityEvents(6);

  // ✅ Hook pour récupérer les événements des catégories préférées de l'utilisateur connecté
  const {
    events: userPreferredEvents,
    loading: userPreferredEventsLoading,
    error: userPreferredEventsError,
  } = useUserPreferredEvents(10);

  // Fonction utilitaire pour extraire l'ID depuis les liens HATEOAS
  const extractIdFromSelfLink = (event: Event): string => {
    const href = event._links.self.href;
    const id = href.split("/").pop();
    return id || "";
  };

  // Fonction pour rendre les cartes d'événements
  const renderEventCards = (
    events: Event[],
    loading: boolean,
    error: Error | null
  ) => {
    if (loading) {
      return (
        <>
          <EventCardSkeleton />
          <EventCardSkeleton />
          <EventCardSkeleton />
        </>
      );
    }

    // ✅ Retourner null en cas d'erreur ou pas de données
    if (error || !events || events.length === 0) {
      return null;
    }

    return events.slice(0, 6).map((event: Event) => {
      const eventId = extractIdFromSelfLink(event);

      return (
        <EventCard id={eventId} key={eventId} event={event} minify={false} />
      );
    });
  };

  // Fonction pour rendre les cartes trending à partir des événements populaires
  const renderTrendingCards = (
    events: Event[],
    loading: boolean,
    error: Error | null
  ) => {
    if (loading) {
      return (
        <>
          <TrendingCardSkeleton />
          <TrendingCardSkeleton />
          <TrendingCardSkeleton />
        </>
      );
    }

    // ✅ Retourner null en cas d'erreur ou pas de données
    if (error || !events || events.length === 0) {
      return null;
    }

    return events.slice(0, 3).map((event: Event) => {
      const eventId = extractIdFromSelfLink(event);

      return (
        <TrendingCard
          key={eventId}
          organizer={event.organizer?.pseudo || ""}
          city={event.address.split(",")[0] || event.address}
          description={
            event.description.length > 50
              ? event.description.substring(0, 50) + "..."
              : event.description
          }
        />
      );
    });
  };

  const renderThemeCards = () => {
    if (categoriesLoading) {
      return (
        <>
          <ThemeCardSkeleton />
          <ThemeCardSkeleton />
          <ThemeCardSkeleton />
        </>
      );
    }

    // ✅ Retourner null en cas d'erreur ou pas de données
    if (categoriesError || !categories || categories.length === 0) {
      return null;
    }

    return categories.map((category) => (
      <ThemeCard key={category.key} category={category} />
    ));
  };

  // ✅ Fonction pour rendre les cartes de villes tendances
  const renderTrendingCityCards = () => {
    if (trendingCitiesLoading) {
      return (
        <>
          <TextImageCardSkeleton />
          <TextImageCardSkeleton />
          <TextImageCardSkeleton />
        </>
      );
    }

    // ✅ Retourner null en cas d'erreur ou pas de données
    if (trendingCitiesError || !trendingCities || trendingCities.length === 0) {
      return null;
    }

    return trendingCities.map((city) => (
      <TextImageCard
        key={city.id}
        title={city.name}
        subtitle={`${city.eventsCount} événement${
          city.eventsCount > 1 ? "s" : ""
        }`}
        image={city.imageUrl || img}
        href={`./villes/${city.name.toLowerCase()}`}
        isCard={true}
      />
    ));
  };

  // ✅ Fonction pour rendre les cartes d'organisateurs populaires
  const renderOrganizerCards = () => {
    if (organizersLoading) {
      return (
        <>
          <OrganizerCardSkeleton />
          <OrganizerCardSkeleton />
        </>
      );
    }
    if (organizersError || !organizers || organizers.length === 0) {
      return (
        <Link href="/organisateurs" className="secondary-btn mt-4">
          <span>Voir tous les organisateurs</span>
        </Link>
      );
    }
    return (
      <>
        {organizers.slice(0, 2).map((organizer) => (
          <OrganizerCard key={organizer.id} organizer={organizer} />
        ))}
        <Link href="/organisateurs" className="secondary-btn mt-4">
          <span>Voir tous les organisateurs</span>
        </Link>
      </>
    );
  };

  // Simuler le loading pour chaque section (à remplacer par un vrai loading si besoin)
  const loadingNews = false;
  const loadingFaq = false;
  const loadingTrustpilot = false;
  const loadingReview = false;

  return (
    <main>
      <section className="wrapper">
        <Welcome />
      </section>
      <section className="wrapper">
        <p className="text-lg font-bold text-center">
          Un concert 🎸qui fait vibrer. Un atelier qui inspire. Un festival 🎪 à
          ne pas manquer. Tout est ici. Découvrez, réservez, profitez. 🗓️
        </p>
      </section>
      <section className="wrapper">
        <div className="flex flex-col gap-2">
          <p className="font-medium">Recherchez ce qui vous intéresse</p>
          <SearchBtn />
        </div>
      </section>
 
      {/* ✅ Sections conditionnelles - n'affichent que si contenu disponible */}
      {renderTrendingCards(trendingEvents, trendingLoading, trendingError) && (
        <HorizontalList title="Les évènements populaires">
          {renderTrendingCards(trendingEvents, trendingLoading, trendingError)}
        </HorizontalList>
      )}

      {/* ✅ Afficher seulement si on a du contenu ou en chargement */}
      {renderThemeCards() && (
        <HorizontalList title="Envie d'une sortie">
          {renderThemeCards()}
        </HorizontalList>
      )}

       {/* ✅ Section des événements de la ville sélectionnée et de ses villes proches */}
      {renderEventCards(cityEvents, cityEventsLoading, cityEventsError) && (
        <HorizontalList title="Événements près de chez vous">
          {renderEventCards(cityEvents, cityEventsLoading, cityEventsError)}
        </HorizontalList>
      )}

      {/* ✅ Section des événements des catégories préférées de l'utilisateur connecté */}
      {isAuthenticated && renderEventCards(userPreferredEvents, userPreferredEventsLoading, userPreferredEventsError) && (
        <HorizontalList title="Événements selon vos goûts">
          {renderEventCards(userPreferredEvents, userPreferredEventsLoading, userPreferredEventsError)}
        </HorizontalList>
      )}

      {renderEventCards(dealEvents, dealLoading, dealError) && (
        <HorizontalList title="Les bonnes affaires de la semaine">
          {renderEventCards(dealEvents, dealLoading, dealError)}
        </HorizontalList>
      )}

      {renderEventCards(freeEvents, freeLoading, freeError) && (
        <HorizontalList title="Sortez gratuitement ce week-end">
          {renderEventCards(freeEvents, freeLoading, freeError)}
        </HorizontalList>
      )}

      {!isAuthenticated && (
        <section className="wrapper">
          <h2>Gérer vos évènements facilement</h2>
          <p>
            Créer un compte ou connectez-vous pour rester informer sur vos
            évènements et notifications.
          </p>
          <Link href="/connexion" className="primary-btn">
            <span>S'inscrire</span>
          </Link>
          <Link href="/inscription" className="secondary-btn">
            <span>Se connecter</span>
          </Link>
        </section>
      )}

      <section className="wrapper">
        <CustomTitle
          description="Actualités"
          title="Les sorties qui font la une"
        />
        {loadingNews ? (
          <>
            <NewsCardSkeleton />
            <NewsCardSkeleton />
          </>
        ) : (
          <>
            <NewsCard
              title="Les 5 artistes émergeants qui font le show sur la Côte d'Azur"
              description="Magis reges hoc pertinacior inquam nulla arcesilas nata hoc diodorus erit coercendi maximas quod. Et effectrix tanto est quid est modo voluptatem autem tanto familiares actione et credo si.\nCum quis callipho credo tuus nulla est dicis sequuntur aegyptum interrete cum pullum constructio atqui etiam istud iste... En lire plus"
              date="25/04/2025"
            />
            <NewsCard
              title="Les 5 artistes émergeants qui font le show sur la Côte d'Azur"
              description="description courte le bouton ne s'affiche pas à voir si ça redirige vers une page ou ça affiche tout le texte"
              date="25/04/2025"
            />
          </>
        )}
        <Link href="/actualites" className="secondary-btn">
          <span>Voir les actualités des évènements</span>
        </Link>
      </section>

      {/* ✅ Afficher seulement si on a des villes ou en chargement */}
      {renderTrendingCityCards() && (
        <HorizontalList title="Destinations tendances" description="Villes">
          {renderTrendingCityCards()}
        </HorizontalList>
      )}

      <section className="wrapper">
        <CustomTitle
          description="Lieux"
          title="Les lieux populaires proche de chez vous"
        />

        {/* Affichage dynamique des lieux proches avec la map */}
        {loadingNearbyPlaces ? (
          <div className="flex gap-4">
            <PlaceCardSkeleton />
            <PlaceCardSkeleton />
            <PlaceCardSkeleton />
          </div>
        ) : (
          <PlacesMapList locations={nearbyPlaces} />
        )}
        <Link href="/lieux" className="secondary-btn mt-4 mb-2">
          <span>Voir tous les lieux</span>
        </Link>
      </section>

      <section className="wrapper">
        <CustomTitle
          description="Avis"
          title="Ils conseillent veevent pour des évènements"
        />
        {loadingTrustpilot ? (
          <TrustpilotCardSkeleton />
        ) : (
          <TrustpilotCard
            note={3}
            reviews_number={1394}
            description="Iam non est dolere adipiscing potuit expetendum quem eo est non non\n      numitorium parte eo publicae fregellanum accessit igitur. Eius nostrae\n      illis animus constructio non ipsum sed ipsum virtutes avia tecum\n      ciceronem."
          />
        )}
        {loadingReview ? (
          <ReviewCardSkeleton />
        ) : (
          <ReviewCard
            author="Jean Dupont"
            note={3}
            title="Je recommande cette platefomre pour trouver des artistes locaux"
            description="Sed non triarius nata consectetur est homines esse dolor voluptatem in iam ipsum viros est est est instrumento itaque iste epicuro. Isto triarius iste habent abducas atque et igitur se."
            type="pop rock"
            place="Maison 13"
            city="Cannes"
          />
        )}
        <Link href="#" className="secondary-btn">
          <span>Voir tous les avis</span>
        </Link>
      </section>

      <section className="wrapper">
        <CustomTitle
          title="Questions fréquentes de nos utilisateurs"
          description="FAQ"
        />
        {loadingFaq ? (
          <>
            <FaqCardSkeleton />
            <FaqCardSkeleton />
            <FaqCardSkeleton />
          </>
        ) : (
          <>
            <FaqCard label="Comment acheter un billet de concert ?" />
            <FaqCard label="Comment acheter un billet de concert ?" />
            <FaqCard label="Comment acheter un billet de concert ?" />
          </>
        )}
      </section>

      <section className="wrapper">
        <h2>Sortir avec veevent</h2>
        <Shortcut
          link="/evenements"
          label="Trouver un évènement"
          icon={<Iconoir.Search />}
        />
        <Shortcut
          link="/organisateurs"
          label="Trouver un organisateur"
          icon={<Iconoir.User />}
        />
        <Shortcut
          link="/villes"
          label="Trouver une ville"
          icon={<Iconoir.City />}
        />
        <Shortcut
          link="/lieux"
          label="Trouver un lieu"
          icon={<Iconoir.Home />}
        />
      </section>

      <section className="wrapper">
        <CustomTitle
          description="Newsletter"
          title="Ne ratez rien des derniers évènements locaux"
        />
        <p>
          Abonnez-vous à notre newsletter pour recevoir les dernières
          informations sur les événements locaux.
        </p>
        <div className="flex flex-col gap-2">
          <label>Adresse mail </label>
          <input type="text" placeholder="text input" />
        </div>
        <p className="text-gray-500">
          En vous inscrivant, vous acceptez notre politique de confidentialité
          et consentez à recevoir des mises à jour.
        </p>
        <button className="primary-btn">
          <span>S'inscrire à la newsletter</span>
        </button>
      </section>

      <section className="wrapper">
        <CustomTitle
          description="Organisateurs populaires"
          title="Découvrez leurs derniers évènements"
        />
        {renderOrganizerCards()}
      </section>
    </main>
  );
}
