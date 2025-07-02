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
import { useEventPlace } from "@/hooks/places/use-event-place";
import Gmaps from "@/components/lists/places-map-list/gmap";
import { MapPin, Shop } from "iconoir-react";
import BilletSelector from "@/components/cards/billet-selector/billet-selector";

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

  // Récupérer les infos du lieu via le lien HATEOAS
  const {
    place: eventPlace,
    loading: placeLoading,
    error: placeError,
  } = useEventPlace(event?._links?.places?.href);

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
        organizer={organizerToUse || {}}
        categories={event.categories}
      />

      <section className="wrapper">
        <h2>Billet</h2>
        {event.isInvitationOnly ? (
          <div className="text-blue-600 font-semibold py-4">
            Événement sur invitation uniquement
          </div>
        ) : event.status === "NOT_STARTED" && event.currentParticipants < event.maxCustomers ? (
          <BilletSelector event={event} />
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
        <h2>Se rendre à l'évènement</h2>
        {eventPlace && <Gmaps locations={[eventPlace]} />}
        <div className="flex flex-col gap-4 text-primary-600 font-semibold">
          <div className="flex gap-2 items-center">
            <Shop />
            {eventPlace?.name}
          </div>
          <div className="flex gap-2 items-center">
            <MapPin />
            {eventPlace?.address}
          </div>
        </div>
        <button
          className="secondary-btn"
          onClick={() => {
            window.open(
              `https://www.google.com/maps/search/?api=1&query=${eventPlace?.name} ${eventPlace?.cityName}`,
              "_blank"
            );
          }}
        >
          <span>Voir le lieu sur Google Maps</span>
        </button>
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
          <OrganizerCard organizer={organizerToUse!} currentEventId={id} />
        )}
        <button className="secondary-btn">
          <span>Signaler l'évènement</span>
        </button>
      </section>
    </main>
  );
}


// par invitation l'utilisateur peut faire une demande avec cette endpoint http://localhost:8090/api/v1/invitations
// en pOST avec ce body par exemple 
// {
//   "description": "Invitation à l'événement techno de l'année",
//   "status": "SENT",
//   "eventId": 32,
//   "userId": 5
// }
// en reponse du post 
// {
//     "description": "Invitation à l'événement techno de l'année",
//     "status": "SENT",
//     "_links": {
//         "self": {
//             "href": "http://localhost:8090/api/v1/invitations/1"
//         },
//         "invitations": {
//             "href": "http://localhost:8090/api/v1/invitations"
//         },
//         "event": {
//             "href": "http://localhost:8090/api/v1/events/13"
//         }
//     }
// }

// Integre au service event cette fonctionnalité, sur la page event l'utilisateur peut voir si il a fait une demande pour rejoindre l'event, si il a ete refusé, accepté ou en attente de reponse. Un evenement par invitation peut 