"use client";
import BannerHead from "@/components/heads/banner-head/banner-head";
import EventHead from "@/components/heads/event-head/event-head";
import { useParams } from "next/navigation";
import CustomTitle from "@/components/commons/custom-title/custom-title";
import FaqCard from "@/components/cards/faq-card/faq-card";
import OrganizerCard from "@/components/cards/organizer-card/organizer-card";
import NewsCard from "@/components/cards/news-card/news-card";
import { useSingleEvent } from "@/hooks/events/use-single-event";
import { useEventOrganizer } from "@/hooks/organizers/use-event-organizer";

export default function EventPage() {
  const { id, slug } = useParams() as { id: string; slug: string };
  const eventIdNumber = Number(id);
  const { event, loading, error } = useSingleEvent(eventIdNumber);

  // Récupérer les infos complètes de l'organisateur
  const {
    organizer: detailedOrganizer,
    loading: organizerLoading,
    error: organizerError,
  } = useEventOrganizer(event?._links?.organizer?.href);

  // États de chargement et d'erreur
  if (loading) {
    return (
      <main>
        <div className="wrapper">
          <div className="animate-pulse">
            <div className="bg-gray-200 h-64 rounded mb-4"></div>
            <div className="bg-gray-200 h-8 rounded mb-2"></div>
            <div className="bg-gray-200 h-4 rounded mb-4"></div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <div className="wrapper">
          <div className="text-center py-8">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Erreur lors du chargement de l'événement
            </h1>
            <p className="text-gray-600 mb-4">{error.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="primary-btn"
            >
              <span>Réessayer</span>
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!event) {
    return (
      <main>
        <div className="wrapper">
          <div className="text-center py-8">
            <h1 className="text-2xl font-bold text-gray-600">
              Événement non trouvé
            </h1>
          </div>
        </div>
      </main>
    );
  }

  // Calculer le nombre de personnes intéressées (exemple basé sur les participants actuels)
  const interestedCount = 192;

  // Utiliser l'organisateur détaillé si disponible, sinon celui de l'événement
  const organizerToUse = detailedOrganizer || event.organizer;

  return (
    <main>
      <BannerHead />
      <EventHead
        title={event.name}
        location={event.address}
        date={event.date}
        price={event.price}
        interested={interestedCount}
        organizer={organizerToUse}
        categories={event.categories}
      />

      <section className="wrapper">
        <h2>Billet</h2>
        {event.status === "NOT_STARTED" &&
        event.currentParticipants < event.maxCustomers ? (
          <button className="primary-btn">
            <span>Réserver - {event.price}€</span>
          </button>
        ) : event.status === "COMPLETED" ? (
          <div className="text-gray-500">
            <span>Événement terminé</span>
          </div>
        ) : event.status === "CANCELLED" ? (
          <div className="text-red-500">
            <span>Événement annulé</span>
          </div>
        ) : (
          <div className="text-orange-500">
            <span>Complet</span>
          </div>
        )}
      </section>

      <section className="wrapper">
        <h2>À propos de l'évènement</h2>
        <div dangerouslySetInnerHTML={{ __html: event.contentHtml }}></div>
      </section>

      <section className="wrapper">
        <CustomTitle
          title="Questions fréquentes de nos utilisateurs"
          description="FAQ"
        />
        <FaqCard label="Comment acheter un billet de concert ?" />
        <FaqCard label="Puis-je annuler ma réservation ?" />
        <FaqCard label="L'événement peut-il être annulé ?" />
      </section>

      <section className="wrapper">
        <CustomTitle
          description="Actualités"
          title="Ces artistes font la Une"
        />
        <NewsCard
          title="Les 5 artistes émergeants qui font le show sur la Côte d'Azur"
          description="Magis reges hoc pertinacior inquam nulla arcesilas nata hoc diodorus erit coercendi maximas quod. Et effectrix tanto est quid est modo voluptatem autem tanto familiares actione et credo si."
          date="25/04/2025"
        />
        <NewsCard
          title="Guide des meilleurs événements de la semaine"
          description="Découvrez notre sélection d'événements incontournables pour cette semaine."
          date="20/04/2025"
        />
      </section>

      <section className="wrapper">
        <h2>Organisé par</h2>
        {organizerLoading ? (
          <div className="animate-pulse bg-gray-200 h-32 rounded"></div>
        ) : organizerError ? (
          <div className="text-red-500">
            Erreur lors du chargement des informations de l'organisateur
          </div>
        ) : (
          <OrganizerCard organizer={organizerToUse} currentEventId={id} />
        )}
        <button className="secondary-btn">
          <span>Signaler l'évènement</span>
        </button>
      </section>
    </main>
  );
}
