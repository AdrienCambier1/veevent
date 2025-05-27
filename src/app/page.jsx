"use client";

import CityCard from "@/components/cards/city-card";
import EventCard from "@/components/cards/event-card";
import NewsCard from "@/components/cards/news-card";
import ThemeCard from "@/components/cards/theme-card";
import CustomTitle from "@/components/custom-title";
import { Search } from "iconoir-react";

export default function Home() {
  return (
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

      <p>ceci est un texte de base</p>

      <button className="primary-btn">
        <span>Primary btn</span>
      </button>

      <button className="secondary-btn">Secondary btn</button>

      {/* Code à déplacer dans un composant plus tard */}
      <div className="search-input">
        <Search className="" />
        <input type="search" placeholder="text input" />
      </div>

      <input type="text" placeholder="text input" />

      <NewsCard
        title="Les 5 artistes émergeants qui font le show sur la Côte d’Azur"
        description="Magis reges hoc pertinacior inquam nulla arcesilas nata hoc diodorus erit coercendi maximas quod. Et effectrix tanto est quid est modo voluptatem autem tanto familiares actione et credo si.
Cum quis callipho credo tuus nulla est dicis sequuntur aegyptum interrete cum pullum constructio atqui etiam istud iste... En lire plus"
        date="25/04/2025"
      />

      <NewsCard
        title="Les 5 artistes émergeants qui font le show sur la Côte d’Azur"
        description="description courte le bouton ne s'affiche pas à voir si ça redirige vers une page ou ça affiche tout le texte"
        date="25/04/2025"
      />

      <CityCard city="Nice" events={24} />
    </main>
  );
}
