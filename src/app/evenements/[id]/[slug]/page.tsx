"use client";
import BannerHead from "@/components/heads/banner-head/banner-head";
import EventHead from "@/components/heads/event-head/event-head";
import { useParams, useSearchParams } from "next/navigation";
import CustomTitle from "@/components/commons/custom-title/custom-title";
import FaqCard from "@/components/cards/faq-card/faq-card";
import OrganizerCard from "@/components/cards/organizer-card/organizer-card";
import NewsCard from "@/components/cards/news-card/news-card";
import { useSingleEvent } from "@/hooks/events/use-single-event";
import { useEventOrganizer } from "@/hooks/organizers/use-event-organizer";
import { useEventPlace } from "@/hooks/places/use-event-place";
import Gmaps from "@/components/lists/places-map-list/gmap";
import {
  MapPin,
  Shop,
  InfoCircle,
  Megaphone,
  Clock,
  LockSquare,
  Xmark,
} from "iconoir-react";
import BilletSelector from "@/components/commons/billet-selector/billet-selector";
import { useAuth } from "@/contexts/auth-context";
import { useEffect, useState } from "react";
import { eventService } from "@/services/event-service";
import Modal from "@/components/commons/modal/modal";
import { useUser } from "@/hooks/commons/use-user";
import { usePageTitle } from "@/hooks/commons/use-page-title";

// Motifs prédéfinis pour le signalement
const REPORT_REASONS = [
  {
    key: "INAPPROPRIATE_CONTENT",
    label: "Contenu inapproprié",
    description:
      "L'événement contient des propos, images ou liens inappropriés ou offensants.",
  },
  {
    key: "SPAM",
    label: "Spam ou arnaque",
    description:
      "L'événement semble être du spam, une arnaque ou une publicité abusive.",
  },
  {
    key: "ORGANIZATION_PROBLEM",
    label: "Problème d'organisation",
    description:
      "L'événement présente un problème d'organisation ou d'informations trompeuses.",
  },
  {
    key: "OTHER",
    label: "Autre (précisez)",
    description: "Expliquez la raison de votre signalement.",
  },
];

export default function EventPage() {
  const { id, slug } = useParams() as { id: string; slug: string };
  const eventIdNumber = Number(id);
  const { event, loading, error } = useSingleEvent(eventIdNumber);
  
  // Gestion dynamique du titre de la page
  usePageTitle({
    title: event?.name || 'Événement',
    description: event?.description || 'Découvrez cet événement exceptionnel',
  });
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

  const { isAuthenticated, token } = useAuth();
  const { user } = useUser();
  const [invitation, setInvitation] = useState<null | { status: string }>(null);
  const [invitationLoading, setInvitationLoading] = useState(false);
  const [invitationError, setInvitationError] = useState<string | null>(null);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportDescription, setReportDescription] = useState("");
  const [reportStatus, setReportStatus] = useState<null | "success" | "error">(
    null
  );
  const [reportMessage, setReportMessage] = useState<string>("");
  const [reportLoading, setReportLoading] = useState(false);
  const [reportReason, setReportReason] = useState(REPORT_REASONS[0].key);
  const selectedReason = REPORT_REASONS.find((r) => r.key === reportReason);

  const searchParams = useSearchParams();
  const orderStatus = searchParams?.get("order");

  useEffect(() => {
    if (event && event.isInvitationOnly && user?.id) {
      setInvitationLoading(true);
      eventService
        .getInvitationStatus(
          Number(event.id),
          Number(user.id),
          token || undefined
        )
        .then((inv) => setInvitation(inv))
        .catch(() => setInvitation(null))
        .finally(() => setInvitationLoading(false));
    }
  }, [event, user?.id, token]);

  const handleRequestInvitation = async () => {
    if (!isAuthenticated) {
      // Redirige vers la connexion avec redirect vers la page courante
      window.location.href = `/connexion?redirect=${encodeURIComponent(
        window.location.pathname
      )}`;
      return;
    }
    if (!user?.id || !event) return;
    setInvitationLoading(true);
    setInvitationError(null);
    try {
      const inv = await eventService.requestInvitation(
        Number(event.id),
        Number(user.id),
        `Demande d'invitation à l'événement ${event.name}`,
        token || undefined
      );
      setInvitation(inv);
    } catch (e: any) {
      setInvitationError(e.message || "Erreur lors de la demande");
    } finally {
      setInvitationLoading(false);
    }
  };

  const handleReportClick = () => {
    console.log("Bouton signaler cliqué");
    if (!isAuthenticated) {
      window.location.href = `/connexion?redirect=${encodeURIComponent(
        window.location.pathname
      )}`;
      return;
    }
    setShowReportForm((v) => !v);
    setReportStatus(null);
    setReportMessage("");
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const organizerId = organizerToUse?.id;
    if (!user?.id || !organizerId) return;
    setReportLoading(true);
    setReportStatus(null);
    setReportMessage("");
    let descriptionToSend = "";
    let typeToSend = reportReason;
    if (reportReason === "OTHER") {
      descriptionToSend = `Signalement d'événement (autre) : ${reportDescription}`;
      typeToSend = "OTHER";
    } else {
      descriptionToSend = selectedReason?.description || "";
    }
    try {
      await eventService.reportEvent(
        Number(user.id),
        Number(organizerId),
        descriptionToSend,
        typeToSend,
        token || undefined
      );
      setReportStatus("success");
      setReportMessage(
        "Merci, votre signalement a bien été transmis à notre équipe."
      );
      setShowReportForm(false);
      setReportDescription("");
      setReportReason(REPORT_REASONS[0].key);
    } catch (e: any) {
      setReportStatus("error");
      setReportMessage(e.message || "Erreur lors de l'envoi du signalement.");
    } finally {
      setReportLoading(false);
    }
  };

  // États de chargement et d'erreur
  if (loading) {
    return (
      <main>
        <div className="wrapper">
          <div>
            <div className="skeleton-bg h-64 mb-4"></div>
            <div className="skeleton-bg h-8 mb-2"></div>
            <div className="skeleton-bg h-4 mb-4"></div>
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

  // DEBUG: Affiche le href utilisé et l'objet détaillé reçu
  console.log('event._links.organizer.href:', event?._links?.organizer?.href);
  console.log('detailedOrganizer:', detailedOrganizer);

  // Utiliser l'organisateur détaillé si disponible, sinon celui de l'événement
  const organizerToUse = detailedOrganizer || event.organizer;
  console.log('organizerToUse:', organizerToUse);

  // Calcul du pourcentage de places restantes
  const placesRestantes = event.maxCustomers - event.currentParticipants;
  const pourcentageRestant = (placesRestantes / event.maxCustomers) * 100;
  
  // Vérifier si l'événement est passé
  const eventDate = new Date(event.date);
  const now = new Date();
  const isEventPast = eventDate < now;

  return (
    <main>
      <BannerHead bannerImage={event.imageUrl} />
      <EventHead
        id={event.id}
        title={event.name}
        location={event.address}
        date={event.date}
        price={event.price}
        organizer={organizerToUse || {}}
        categories={event.categories}
      />

      {orderStatus === "success" && (
        <div className="wrapper">
          <div className="bg-secondary-50 border border-secondary-200 text-secondary-800 rounded-lg p-4 text-center font-semibold">
            🎉 Votre commande a bien été prise en compte ! Vous recevrez vos
            billets par email.
          </div>
        </div>
      )}
      {orderStatus === "error" && (
        <div className="wrapper">
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6 text-center font-semibold">
            ❌ Une erreur est survenue lors de la commande. Merci de réessayer
            ou de contacter le support.
          </div>
        </div>
      )}
      {!isEventPast && pourcentageRestant <= 50 && placesRestantes > 0 && (
        <section className="wrapper">
          <div className="bg-primary-50 border border-secondary-400 text-primary-950 rounded-lg p-4 text-center font-semibold">
            Dépêchez-vous, il ne reste que plus beaucoup de places ! Profitez-en
            avant qu'il ne soit trop tard.
          </div>
        </section>
      )}
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

      <section
        className="wrapper"
        id="billet"
        style={{ scrollMarginTop: "100px" }}
      >
        <h2>Billet</h2>

        {isEventPast ? (
          <div className="mb-4 p-4 rounded-lg bg-gray-100 border border-gray-300 text-gray-700 text-center text-lg font-bold flex items-center justify-center gap-2">
            <Clock className="w-7 h-7" />
            Événement terminé
          </div>
        ) : event.status === "COMPLETED" ? (
          <div className="mb-4 p-4 rounded-lg bg-gray-100 border border-gray-300 text-gray-700 text-center text-lg font-bold flex items-center justify-center gap-2">
            <Clock className="w-7 h-7" />
            Événement terminé
          </div>
        ) : event.status === "CANCELLED" ? (
          <>
            <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-300 text-red-700 text-center text-lg font-bold flex items-center justify-center gap-2">
              <Xmark className="w-7 h-7" />
              Événement annulé
            </div>
            {event.isInvitationOnly ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-4 flex flex-col items-start">
                <div className="flex items-center gap-2 mb-2">
                  <InfoCircle className="text-blue-500" />
                  <span className="font-semibold text-blue-700">
                    Événement sur invitation
                  </span>
                </div>
                <div className="text-blue-800 mb-4 text-sm">
                  Cet événement est accessible uniquement sur invitation.
                  <br />
                  Faites une demande pour tenter d'y participer. Vous recevrez
                  une réponse par email ou sur votre compte.
                </div>
                {invitationLoading ? (
                  <span>Chargement...</span>
                ) : !isAuthenticated ? (
                  <span className="text-blue-700">
                    Connectez-vous pour demander une invitation.
                  </span>
                ) : invitation ? (
                  invitation.status === "SENT" ? (
                    <span className="text-blue-700">
                      Votre demande d'invitation a bien été envoyée.
                      <br />
                      Vous recevrez une réponse prochainement.
                    </span>
                  ) : invitation.status === "ACCEPTED" ? (
                    <span className="text-green-700 font-semibold">
                      Votre invitation a été acceptée ! Vous pouvez désormais
                      accéder à l'événement.
                    </span>
                  ) : invitation.status === "REJECTED" ? (
                    <span className="text-red-600">
                      Votre demande d'invitation a été refusée.
                      <br />
                      Vous pouvez contacter l'organisateur pour plus
                      d'informations.
                    </span>
                  ) : null
                ) : (
                  <button
                    className="primary-btn"
                    onClick={handleRequestInvitation}
                    disabled={true}
                  >
                    <span> Demander une invitation</span>
                  </button>
                )}
                {invitationError && (
                  <div className="text-red-500 mt-2">{invitationError}</div>
                )}
              </div>
            ) : (
              <BilletSelector event={event} disabled={true} />
            )}
          </>
        ) : event.currentParticipants >= event.maxCustomers ? (
          <>
            <div className="mb-4 p-4 rounded-lg bg-orange-50 border border-orange-300 text-orange-700 text-center text-lg font-bold flex items-center justify-center gap-2">
              <LockSquare className="w-7 h-7" />
              Complet
            </div>
            {event.isInvitationOnly ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-4 flex flex-col items-start">
                <div className="flex items-center gap-2 mb-2">
                  <InfoCircle className="text-blue-500" />
                  <span className="font-semibold text-blue-700">
                    Événement sur invitation
                  </span>
                </div>
                <div className="text-blue-800 mb-4 text-sm">
                  Cet événement est accessible uniquement sur invitation.
                  <br />
                  Faites une demande pour tenter d'y participer. Vous recevrez
                  une réponse par email ou sur votre compte.
                </div>
                {invitationLoading ? (
                  <span>Chargement...</span>
                ) : !isAuthenticated ? (
                  <span className="text-blue-700">
                    Connectez-vous pour demander une invitation.
                  </span>
                ) : invitation ? (
                  invitation.status === "SENT" ? (
                    <span className="text-blue-700">
                      Votre demande d'invitation a bien été envoyée.
                      <br />
                      Vous recevrez une réponse prochainement.
                    </span>
                  ) : invitation.status === "ACCEPTED" ? (
                    <span className="text-green-700 font-semibold">
                      Votre invitation a été acceptée ! Vous pouvez désormais
                      accéder à l'événement.
                    </span>
                  ) : invitation.status === "REJECTED" ? (
                    <span className="text-red-600">
                      Votre demande d'invitation a été refusée.
                      <br />
                      Vous pouvez contacter l'organisateur pour plus
                      d'informations.
                    </span>
                  ) : null
                ) : (
                  <button
                    className="primary-btn"
                    onClick={handleRequestInvitation}
                    disabled={true}
                  >
                    <span> Demander une invitation</span>
                  </button>
                )}
                {invitationError && (
                  <div className="text-red-500 mt-2">{invitationError}</div>
                )}
              </div>
            ) : (
              <BilletSelector event={event} disabled={true} />
            )}
          </>
        ) : event.isInvitationOnly ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-4 flex flex-col items-start">
            <div className="flex items-center gap-2 mb-2">
              <InfoCircle className="text-blue-500" />
              <span className="font-semibold text-blue-700">
                Événement sur invitation
              </span>
            </div>
            <div className="text-blue-800 mb-4 text-sm">
              Cet événement est accessible uniquement sur invitation.
              <br />
              Faites une demande pour tenter d'y participer. Vous recevrez une
              réponse par email ou sur votre compte.
            </div>
            {invitationLoading ? (
              <span>Chargement...</span>
            ) : !isAuthenticated ? (
              <span className="text-blue-700">
                Connectez-vous pour demander une invitation.
              </span>
            ) : invitation ? (
              invitation.status === "SENT" ? (
                <span className="text-blue-700">
                  Votre demande d'invitation a bien été envoyée.
                  <br />
                  Vous recevrez une réponse prochainement.
                </span>
              ) : invitation.status === "ACCEPTED" ? (
                <span className="text-green-700 font-semibold">
                  Votre invitation a été acceptée ! Vous pouvez désormais
                  accéder à l'événement.
                </span>
              ) : invitation.status === "REJECTED" ? (
                <span className="text-red-600">
                  Votre demande d'invitation a été refusée.
                  <br />
                  Vous pouvez contacter l'organisateur pour plus d'informations.
                </span>
              ) : null
            ) : (
              <button className="primary-btn" onClick={handleRequestInvitation} disabled={isEventPast}>
                <span> Demander une invitation</span>
              </button>
            )}
            {invitationError && (
              <div className="text-red-500 mt-2">{invitationError}</div>
            )}
          </div>
        ) : (
          <BilletSelector event={event} disabled={isEventPast} />
        )}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>
      </section>

      <section className="wrapper">
        <h2>Organisé par</h2>
        {organizerLoading ? (
          <div className="skeleton-bg h-32"></div>
        ) : organizerError ? (
          <div className="text-red-500">
            Erreur lors du chargement des informations de l'organisateur
          </div>
        ) : (
          <OrganizerCard organizer={organizerToUse!} currentEventId={id} />
        )}
        <button className="secondary-btn mt-4" onClick={handleReportClick}>
          <span className="flex items-center gap-2">
            <Megaphone /> Signaler l'évènement
          </span>
        </button>
        <Modal open={showReportForm} onClose={() => setShowReportForm(false)}>
          <h3 className="text-lg font-semibold mb-4">Signaler l'évènement</h3>
          <form onSubmit={handleReportSubmit}>
            <div className="mb-4">
              <div className="font-semibold mb-2">Motif du signalement</div>
              <div className="flex flex-col gap-2">
                {REPORT_REASONS.map((reason) => (
                  <label
                    key={reason.key}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="report-reason"
                      value={reason.key}
                      checked={reportReason === reason.key}
                      onChange={() => setReportReason(reason.key)}
                      className="accent-blue-600"
                    />
                    <span>{reason.label}</span>
                  </label>
                ))}
              </div>
              <div className="text-xs text-slate-600 mt-2 min-h-[1.5em]">
                {selectedReason?.description}
              </div>
            </div>
            {reportReason === "OTHER" && (
              <div className="mb-4">
                <label className="block mb-2 font-semibold text-gray-700">
                  Votre motif
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  rows={3}
                  required
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  placeholder="Décrivez brièvement le problème..."
                />
              </div>
            )}
            <button
              type="submit"
              className="primary-btn w-full flex items-center justify-center gap-2"
              disabled={
                reportLoading ||
                (reportReason === "OTHER" && !reportDescription.trim())
              }
            >
              <span className="flex items-center gap-2">
                {reportLoading ? <span className="loader loader-xs" /> : null}
                {reportLoading ? "Envoi..." : "Envoyer le signalement"}
              </span>
            </button>
          </form>
          {reportStatus === "success" && (
            <div className="text-green-600 mt-2">{reportMessage}</div>
          )}
          {reportStatus === "error" && (
            <div className="text-red-600 mt-2">{reportMessage}</div>
          )}
        </Modal>
      </section>
    </main>
  );
}
