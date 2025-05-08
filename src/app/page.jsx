"use client";
import SearchBarButton from "@/components/buttons/search-bar-button";
import CustomTitle from "@/components/titles/custom-title";
import CityCard from "@/components/cards/city-card";
import { NavArrowRight } from "iconoir-react";
import ThemeCard from "@/components/cards/theme-card";
import EventCard from "@/components/cards/event-card";
import MainTitle from "@/components/titles/main-title";
import Link from "next/link";
import SearchBarModal from "@/components/modals/search-bar-modal";
import { useState } from "react";

export default function Home() {
  const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);

  return (
    <>
      <main>
        <section className="container items-center">
          <MainTitle title="Découvrez nos événements" />
          <p className="text-center">
            Un concert 🎸qui fait vibrer. Un atelier qui inspire.
            <br /> Un festival 🎪 à ne pas manquer. Tout est ici. Découvrez,
            réservez, profitez. 🗓️
          </p>
          <SearchBarButton
            onClick={() => setIsSearchBarOpen(!isSearchBarOpen)}
          />
        </section>
        <section className="container">
          <CustomTitle title="Les villes tendances" description="Villes" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <CityCard city="Paris" events={8} />
            <CityCard city="Nice" events={10} />
            <CityCard city="Toulouse" events={5} />
          </div>
          <Link href="/cities" className="blue-rounded-btn">
            <span>Voir plus</span>
            <NavArrowRight />
          </Link>
        </section>
        <section className="container">
          <CustomTitle title="Envie d'une sortie" description="Thèmes" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <ThemeCard theme="sport" />
            <ThemeCard theme="musique" />
            <ThemeCard theme="learning" />
            <ThemeCard />
          </div>
        </section>
        <section className="container">
          <CustomTitle title="Recommandé pour vous" description="Evenements" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <EventCard isTrending={true} />
            <EventCard isTrending={true} />
            <EventCard />
          </div>
          <Link href="/subscriptions/events" className="blue-rounded-btn">
            <span>Voir plus</span>
            <NavArrowRight />
          </Link>
        </section>
        <section className="container">
          <CustomTitle title="Proche de chez vous" description="Evenements" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <EventCard />
            <EventCard />
            <EventCard />
          </div>
          <Link href="/activities/events" className="blue-rounded-btn">
            <span>Voir plus</span>
            <NavArrowRight />
          </Link>
        </section>
      </main>
      <SearchBarModal
        isOpen={isSearchBarOpen}
        setIsOpen={() => setIsSearchBarOpen(!isSearchBarOpen)}
      />
    </>
  );
}
