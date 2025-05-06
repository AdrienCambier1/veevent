import EventList from "@/components/lists/event-list";

export default function InscriptionsPage() {
  return (
    <EventList
      title="Consulter mes inscriptions"
      description="Evenements"
      showFilters={true}
      showSort={true}
      isRegistered={true}
    />
  );
}
