import EventCardLine from "@/components/cards/event-card-line/event-card-line";

export default function EventsAgendaItem() {
  return (
    <div className="events-agenda-item">
      <div className="item-date">
        <div className="item-day">14</div>
        <div className="item-month">Mai</div>
      </div>
      <div className="item-content">
        <EventCardLine />
        <EventCardLine />
        <EventCardLine />
      </div>
    </div>
  );
}
