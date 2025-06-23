import EventsAgendaItem from "./events-agenda-item";
import "./events-agenda.scss";

export default function EventsAgenda() {
  return (
    <div className="events-agenda">
      <EventsAgendaItem />
      <EventsAgendaItem />
    </div>
  );
}
