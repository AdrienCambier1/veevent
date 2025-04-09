"use client";
import SearchBarButton from "@/components/search-bar-button";
import CustomTitle from "@/components/custom-title";
import CityCard from "@/components/city-card";
import { NavArrowRight } from "iconoir-react";
import ThemeCard from "@/components/theme-card";

export default function Home() {
  return (
    <main>
      <section className="items-center">
        <h1 className="text-center">Découvrez nos événements</h1>
        <p className="text-center">
          Un concert 🎸qui fait vibrer. Un atelier qui inspire.
          <br /> Un festival 🎪 à ne pas manquer. Tout est ici. Découvrez,
          réservez, profitez. 🗓️
        </p>
        <SearchBarButton />
      </section>
      <section className="container">
        <CustomTitle title="Les villes tendances" description="Villes" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <CityCard />
          <CityCard />
          <CityCard />
          <CityCard />
        </div>
        <button className="blue-rounded-btn">
          <span>Voir plus</span>
          <NavArrowRight />
        </button>
      </section>
      <section className="container">
        <CustomTitle title="Envie d'une sortie" description="Thèmes" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <ThemeCard />
          <ThemeCard />
          <ThemeCard />
          <ThemeCard />
        </div>
      </section>
      <section className="container">
        <CustomTitle title="Recommandé pour vous" description="Evenements" />
        <button className="blue-rounded-btn">
          <span>Voir plus</span>
          <NavArrowRight />
        </button>
      </section>
    </main>
  );
}
