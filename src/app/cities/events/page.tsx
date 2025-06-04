import EventCard from "@/components/cards/event-card/event-card";

export default function EventsPage() {
  return (
    <section className="wrapper">
      <div className="flex flex-col gap-2">
        <h2>Les événements populaires à Nice</h2>
        <EventCard
          title="Atelier fresque végétal"
          location="Antibes"
          date="vendredi 14 mai 2025 • 19h00"
          description=" Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
                semper commodo velit ac facilisis. Nullam augue dui, bibendum vel
                congue vitae, lacinia vel nunc. Cras tristique ac ipsum nec
                consectetur. "
          minify={false}
          price={59}
        />
      </div>
    </section>
  );
}
