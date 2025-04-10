"use client";
import MainTitle from "@/components/titles/main-title";
import CustomTitle from "@/components/titles/custom-title";
import DropdownButton from "@/components/buttons/dropdown-button";
import CityCard from "@/components/cards/city-card";
import { useState } from "react";
import { useCity } from "@/contexts/city-context";

export default function CitiesPage() {
  const [sortOption, setSortOption] = useState("events");
  const { cities, changeCity } = useCity();

  const sortOptions = [
    { label: "Plus d'événements", value: "events" },
    { label: "Ordre A-Z", value: "asc" },
    { label: "Ordre Z-A", value: "desc" },
  ];

  return (
    <main>
      <section className="container items-center">
        <MainTitle title="Les villes événementielles" />
        <p className="text-center">
          Découvrez les différentes villes proche de chez vous qui organisent
          des événements.
        </p>
      </section>
      <section className="page-grid">
        <div className="flex flex-col gap-6">
          <CustomTitle
            title="Effectuez une recherche"
            description="Organisateurs"
          />
          <div className="flex flex-col gap-4">
            <input type="text" placeholder="Mot clé" />
            <DropdownButton
              options={sortOptions}
              selectedValue={sortOption}
              label="Trier par :"
              onSelect={(option) => setSortOption(option.value)}
            />
          </div>
        </div>
        <div className="cards-grid">
          {cities.map((city, index) => (
            <CityCard
              key={index}
              city={city.name}
              changeCity={() => changeCity(city)}
              events={city.events}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
