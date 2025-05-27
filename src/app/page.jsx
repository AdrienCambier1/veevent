"use client";

import EventCard from "@/components/cards/event-card";
import ThemeCard from "@/components/cards/theme-card";
import CustomTitle from "@/components/custom-title";

export default function Home() {
  return (
    <>
      <main className="flex flex-col gap-8 p-4">
        <h2>Exemple h2</h2>
        <CustomTitle
          title="Titre personnalisé"
          description="Description personnalisée"
        />

        <ThemeCard theme="musique" />
        <ThemeCard theme="sport" />

        <EventCard
          title="Atelier fresque végétal"
          location="Antibes"
          date="vendredi 14 mai 2025 • 19h00"
          description=" Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
          semper commodo velit ac facilisis. Nullam augue dui, bibendum vel
          congue vitae, lacinia vel nunc. Cras tristique ac ipsum nec
          consectetur. "
          price="59"
        />
      </main>
    </>
  );
}
