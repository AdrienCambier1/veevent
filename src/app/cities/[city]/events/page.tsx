"use client";
import EventCard from "@/components/cards/event-card/event-card";
import { useParams } from "next/navigation";

export default function EventsPage() {
  const { city } = useParams() as { city: string };

  return (
    <>
      <section className="wrapper">
        <h2>Les événements populaires à {city}</h2>
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
      </section>
      <section className="wrapper">
        <h2>Tous les évènements à {city} et aux alentours</h2>
        <EventCard
          title="Atelier fresque végétal"
          location="Antibes"
          date="vendredi 14 mai 2025 • 19h00"
          description=" Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
                 semper commodo velit ac facilisis. Nullam augue dui, bibendum vel
                 congue vitae, lacinia vel nunc. Cras tristique ac ipsum nec
                 consectetur. "
          minify={true}
          price={59}
        />
        <EventCard
          title="Atelier fresque végétal"
          location="Antibes"
          date="vendredi 14 mai 2025 • 19h00"
          description=" Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
                 semper commodo velit ac facilisis. Nullam augue dui, bibendum vel
                 congue vitae, lacinia vel nunc. Cras tristique ac ipsum nec
                 consectetur. "
          minify={true}
          price={59}
        />
      </section>
    </>
  );
}
