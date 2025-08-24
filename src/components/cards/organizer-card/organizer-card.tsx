import ProfileImg from "@/components/images/profile-img/profile-img";
import { BaseUser, SingleUser } from "@/types";
import Link from "next/link";
import EventCardLine from "../event-card-line/event-card-line";
import { useOrganizerEvents } from "@/hooks/organizers/use-organizer-events";
import OrganizerCardSkeleton from "./organizer-card-skeleton";
import "./organizer-card.scss";

interface OrganizerCardProps {
  organizer: SingleUser;
  currentEventId?: string;
}

export default function OrganizerCard({
  organizer,
  currentEventId,
}: OrganizerCardProps) {
  const { events, loading, error } = useOrganizerEvents(
    organizer.id,
    currentEventId,
    2
  );

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // Supprimer les caractères spéciaux
      .replace(/\s+/g, "-") // Remplacer les espaces par des tirets
      .replace(/-+/g, "-") // Remplacer les tirets multiples par un seul
      .trim(); // Supprimer les espaces au début et à la fin
  };

  const renderEvents = () => {
    if (loading) {
      return <OrganizerCardSkeleton />;
    }

    if (error) {
      return (
        <div className="text-red-500 text-sm">
          Erreur lors du chargement des événements
        </div>
      );
    }

    if (!events || events.length === 0) {
      return (
        <div className="text-gray-500 text-sm">
          Aucun autre événement à venir
        </div>
      );
    }

    return (
      <div className="flex flex-col w-full">
        {events.map((event, index) => (
          <EventCardLine key={index} event={event} />
        ))}
      </div>
    );
  };

  return (
    <Link href={`/organisateurs/${organizer.slug}/evenements`}>
      <div className="organizer-card">
        <ProfileImg
          name={
            `${organizer.firstName || ""} ${organizer.lastName || ""}`.trim() ||
            "Organisateur"
          }
          note={organizer.note || 0}
          imageUrl={organizer.imageUrl}
        />
        <div className="profile-stats">
          {/* <div>
            <span>28</span> abonnements
          </div>
          <div>
            <span>12</span> abonnés
          </div> */}
          <div>
            <span>
              {Math.max(0, organizer.eventsCount - organizer.eventPastCount)}{" "}
            </span>
            événements en cours
          </div>
          <div>
            <span>{organizer.eventPastCount}</span>
            {organizer.eventPastCount > 1 ? " passés" : " passé"}
          </div>
        </div>

        {renderEvents()}

        <span className="text-primary-600 font-medium underline">
          Voir le profil
        </span>
      </div>
    </Link>
  );
}
