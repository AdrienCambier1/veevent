import EventCardLine from "@/components/cards/event-card-line/event-card-line";
import { Event } from "@/types";

interface EventsAgendaItemProps {
  day?: number;
  month?: string;
  events?: Event[];
}

export default function EventsAgendaItem({ day = 14, month = "Mai", events = [] }: EventsAgendaItemProps) {
  return (
    <div className="events-agenda-item">
      <div className="item-date">
        <div className="item-day">{day}</div>
        <div className="item-month">{month}</div>
      </div>
      <div className="agenda-separator" />
      <div className="item-content">
        {events.length > 0 ? (
          events.map((event, index) => (
            <EventCardLine key={index} event={event} />
          ))
        ) : (
          <>
            <EventCardLine />
            <EventCardLine />
            <EventCardLine />
          </>
        )}
      </div>
    </div>
  );
}
