import EventsAgendaItem from "./events-agenda-item";
import "./events-agenda.scss";
import { Event } from "@/types";

interface EventsAgendaProps {
  events?: Event[];
}

export default function EventsAgenda({ events = [] }: EventsAgendaProps) {
  // Grouper les événements par date
  const eventsByDate = events.reduce((acc, event) => {
    const date = new Date(event.date);
    const dateKey = date.toISOString().split('T')[0]; // Format YYYY-MM-DD
    
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  // Trier les dates
  const sortedDates = Object.keys(eventsByDate).sort();

  if (events.length === 0) {
    return (
      <div className="events-agenda">
        <div className="no-events">
          <p>Aucun événement programmé pour le moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="events-agenda">
      {sortedDates.map((dateKey) => {
        const date = new Date(dateKey);
        const day = date.getDate();
        const month = date.toLocaleDateString('fr-FR', { month: 'short' });
        
        return (
          <EventsAgendaItem
            key={dateKey}
            day={day}
            month={month}
            events={eventsByDate[dateKey]}
          />
        );
      })}
    </div>
  );
}
