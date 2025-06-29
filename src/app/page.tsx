"use client";
import EventCard from "@/components/cards/event-card/event-card";
import NewsCard from "@/components/cards/news-card/news-card";
import ThemeCard from "@/components/cards/theme-card/theme-card";
import CustomTitle from "@/components/commons/custom-title/custom-title";
import TrustpilotCard from "@/components/cards/trustpilot-card/trustpilot-card";
import { Medal } from "iconoir-react";
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
import { Event } from "@/types";
import EventCardSkeleton from "@/components/cards/event-card/event-card-skeleton";
import { useCategories } from "@/hooks/commons/use-categories";
import ThemeCardSkeleton from "@/components/cards/theme-card/theme-card-skeleton";
import TrendingCardSkeleton from "@/components/cards/trending-card/trending-card-skeleton";

export default function Home() {
  const { login, loading, isAuthenticated, logout } = useAuth();

  // Récupération des événements par catégorie
  const {
    events: popularEvents,
    loading: popularLoading,
    error: popularError,
  } = useEvents("popular");
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

    if (error) {
      return (
        <div className="text-red-500">
          Erreur lors du chargement des événements
        </div>
      );
    }

    if (!events || events.length === 0) {
      return <div className="text-gray-500">Aucun événement trouvé</div>;
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

    if (error) {
      return (
        <div className="text-red-500">
          Erreur lors du chargement des événements populaires
        </div>
      );
    }

    if (!events || events.length === 0) {
      return (
        <div className="text-gray-500">Aucun événement populaire trouvé</div>
      );
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

    if (categoriesError) {
      return (
        <div className="text-red-500">
          Erreur lors du chargement des catégories
        </div>
      );
    }

    if (!categories || categories.length === 0) {
      return <div>Aucune catégorie trouvée</div>;
    }

    return categories.map((category) => (
      <ThemeCard key={category.key} category={category} />
    ));
  };

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

      <HorizontalList title="Les évènements populaires">
        {renderTrendingCards(popularEvents, popularLoading, popularError)}
      </HorizontalList>

      <HorizontalList title="Envie d'une sortie">
        {renderThemeCards()}
      </HorizontalList>

      <HorizontalList title="Les bonnes affaires de la semaine">
        {renderEventCards(dealEvents, dealLoading, dealError)}
      </HorizontalList>

      <HorizontalList title="Sortez gratuitement ce week-end">
        {renderEventCards(freeEvents, freeLoading, freeError)}
      </HorizontalList>

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
        <NewsCard
          title="Les 5 artistes émergeants qui font le show sur la Côte d'Azur"
          description="Magis reges hoc pertinacior inquam nulla arcesilas nata hoc diodorus erit coercendi maximas quod. Et effectrix tanto est quid est modo voluptatem autem tanto familiares actione et credo si.
Cum quis callipho credo tuus nulla est dicis sequuntur aegyptum interrete cum pullum constructio atqui etiam istud iste... En lire plus"
          date="25/04/2025"
        />
        <NewsCard
          title="Les 5 artistes émergeants qui font le show sur la Côte d'Azur"
          description="description courte le bouton ne s'affiche pas à voir si ça redirige vers une page ou ça affiche tout le texte"
          date="25/04/2025"
        />
        <Link href="/actualites" className="secondary-btn">
          <span>Voir les actualités des évènements</span>
        </Link>
      </section>

      <HorizontalList title="Destinations tendances" description="Villes">
        <TextImageCard
          title="Nice"
          subtitle={"24 évenèments"}
          image={img}
          href={`./villes/${"Nice".toLocaleLowerCase()}`}
          isCard={true}
        />
        <TextImageCard
          title="Nice"
          subtitle={"24 évenèments"}
          image={img}
          href={`./villes/${"Nice".toLocaleLowerCase()}`}
          isCard={true}
        />
      </HorizontalList>

      <section className="wrapper">
        <CustomTitle
          description="Avis"
          title="Ils conseillent veevent pour des évènements"
        />
        <TrustpilotCard
          note={3}
          reviews_number={1394}
          description="Iam non est dolere adipiscing potuit expetendum quem eo est non non
      numitorium parte eo publicae fregellanum accessit igitur. Eius nostrae
      illis animus constructio non ipsum sed ipsum virtutes avia tecum
      ciceronem."
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
          <span>Voir tous les avis</span>
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

      <section className="wrapper">
        <CustomTitle
          description="Lieux"
          title="Les lieux populaires proche de chez vous"
        />
        {/* <PlacesMapList locations={locations} /> */}
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
        {/* <OrganizerCard name="Jean-Baptiste" /> */}
      </section>

      {/* Composants random */}
      <section className="wrapper">
        <EventsAgenda />

        <Shortcut link="#" label="Trouver un événement" />

        <TabList
          title="Alpes-Maritimes"
          items={[]}
          generateHref={(city) => `/cities/${city.toLowerCase()}`}
        />
        <TabList
          title="Var"
          items={[]}
          generateHref={(city) => `/cities/${city.toLowerCase()}`}
        />

        {/* <ProfileHead isMe={true} /> */}

        <TicketCard />

        {/* <PlaceCard
          place={{
            id: "1",
            name: "Bar des artistes",
            address: "Antibes",
            category: "Bar",
            location: {
              lat: 43.5803,
              lng: 7.1251,
            },
            imageUrl: "/images/nice.jpg",
            eventsCount: 5,
          }}
        /> */}
      </section>
    </main>
  );
}
