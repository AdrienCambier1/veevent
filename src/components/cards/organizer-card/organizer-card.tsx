import ProfileImg from "@/components/images/profile-img/profile-img";
import { BaseUser, SingleUser } from "@/types";
import Link from "next/link";
import EventCardLine from "../event-card-line/event-card-line";
import { useOrganizerEvents } from "@/hooks/organizers/use-organizer-events";
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
    organizer,
    currentEventId,
    2
  );


  const renderEvents = () => {
    if (loading) {
      return (
        <div className="flex flex-col w-full gap-2">
          <div className="animate-pulse bg-gray-200 h-16 rounded"></div>
          <div className="animate-pulse bg-gray-200 h-16 rounded"></div>
        </div>
      );
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
    <Link href={`/organisateurs/${organizer.pseudo?.toLowerCase()}`}>
      <div className="organizer-card">
        <ProfileImg
          name={`${organizer.firstName} ${organizer.lastName}` || ""}
          note={organizer.note}
        />
        <div className="profile-stats">
          {/* <div>
            <span>28</span> abonnements
          </div>
          <div>
            <span>12</span> abonnés
          </div> */}
          <div>
            <span>{organizer.eventsCount - organizer.eventPastCount} </span>
            {/* {organizer.eventsCount > 1 ? "événements " : "événement "} */}
            en cours
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
