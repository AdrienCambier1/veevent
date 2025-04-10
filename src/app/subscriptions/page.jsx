import MainTitle from "@/components/titles/main-title";
import EventList from "@/components/event-list";

export default function SubscriptionsPage() {
  return (
    <main>
      <section className="container items-center">
        <MainTitle title="Mes abonnements" />
        <p className="text-center">
          Retrouvez l’intégralité des événements des organisateurs auxquels vous
          êtes abonné.
        </p>
      </section>
      <EventList
        title="Evenements de mes abonnements"
        description="Evenements"
        showFilters={true}
        showSort={true}
      />
    </main>
  );
}
