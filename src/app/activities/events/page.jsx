import EventList from "@/components/lists/event-list";

export default function EventsPage() {
  return (
    <EventList
      title="Rechercher un événement"
      description="Evenements"
      showSort={true}
      showFilters={true}
    />
  );
}
