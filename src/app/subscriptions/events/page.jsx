import EventList from "@/components/event-list";

export default function EventsPage() {
  return (
    <EventList
      title="Evenements des abonnements"
      description="Evenements"
      showFilters={true}
      showSort={true}
    />
  );
}
