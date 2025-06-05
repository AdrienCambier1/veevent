"use client";
import { useState } from "react";
import SearchInput from "@/components/inputs/search-input/search-input";
import CityCard from "@/components/cards/city-card/city-card";
import TabList from "@/components/common/tab-list/tab-list";
import CustomTitle from "@/components/common/custom-title/custom-title";

export default function CitiesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <main>
      <section className="wrapper">
        <h2>Explorez les villes disponibles sur veevent</h2>
        <h3>Rechercher une ville</h3>
        <SearchInput
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="primary-btn">
          <span>Rechercher</span>
        </button>
      </section>
      <section className="wrapper">
        <h3>Parcourir les villes populaires</h3>
        <div className="flex flex-col gap-2">
          <CityCard city="Nice" events={24} />
          <CityCard city="Cannes" events={24} />
          <CityCard city="Antibes" events={24} />
          <CityCard city="Mougins" events={24} />
        </div>
      </section>
      <section className="wrapper">
        <h3>Parcourir les villes populaires</h3>
        <div className="flex flex-col gap-2">
          <TabList
            title="Alpes-Maritimes"
            items={[]}
            generateHref={(city) => `/cities/${city.toLowerCase()}`}
          />
          <TabList
            title="Var"
            items={[]}
            generateHref={(city) => `/cities/${city.toLowerCase()}`}
          />
        </div>
      </section>
      <section className="wrapper">
        <CustomTitle
          title="Les lieux populaires proche de chez vous"
          description="Lieux"
        />
      </section>
    </main>
  );
}
