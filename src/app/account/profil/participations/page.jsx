import EventList from "@/components/event-list";

export default function ParticipationsPage() {
  return (
    <EventList
      title="Mes événements participés"
      description="Evenements"
      showCreateButton={true}
    />
  );
}
