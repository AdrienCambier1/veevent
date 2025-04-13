import EventList from "@/components/lists/event-list";

export default function EventsPage() {
  return (
    <EventList
      title="Rechercher mes événements"
      description="Evenements"
      showCreateButton={true}
      canEdit={true}
    />
  );
}
