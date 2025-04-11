import EventList from "@/components/lists/event-list";

export default function MarkedPage() {
  return (
    <EventList
      title="Consulter mes favoris"
      description="Evenements"
      showFilters={true}
      showSort={true}
    />
  );
}
