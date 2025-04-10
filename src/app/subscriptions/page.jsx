"use client";
import MainTitle from "@/components/main-title";
import CustomTitle from "@/components/custom-title";
import DropdownButton from "@/components/dropdown-button";
import EventCard from "@/components/event-card";
import { useState } from "react";
import MultiDropdownButton from "@/components/multi-dropdown-button";

export default function SubscriptionsPage() {
  const [sortOption, setSortOption] = useState("recent");
  const [selectedFilters, setSelectedFilters] = useState([]);

  const sortOptions = [
    { label: "Plus récent", value: "recent" },
    { label: "Plus ancien", value: "ancien" },
    { label: "Plus populaire", value: "populaire" },
  ];

  const filterOptions = [
    { label: "Musique", value: "musique" },
    { label: "Sport", value: "sport" },
    { label: "Cinéma", value: "cinema" },
    { label: "Théâtre", value: "theatre" },
    { label: "Arts", value: "arts" },
  ];

  const handleFilterSelect = (option) => {
    setSelectedFilters([...selectedFilters, option.value]);
  };

  const handleFilterRemove = (value) => {
    setSelectedFilters(selectedFilters.filter((filter) => filter !== value));
  };

  return (
    <main>
      <section className="container items-center">
        <MainTitle title="Mes abonnements" />
        <p className="text-center">
          Retrouvez l’intégralité des événements des organisateurs auxquels vous
          êtes abonné.
        </p>
      </section>
      <section className="page-grid">
        <div className="flex flex-col gap-6">
          <CustomTitle
            title="Evenements de mes abonnements"
            description="Evenements"
          />
          <div className="flex flex-col gap-4">
            <input type="text" placeholder="Mot clé" />
            <MultiDropdownButton
              options={filterOptions}
              selectedValues={selectedFilters}
              label="Filtre par catégorie :"
              onSelect={handleFilterSelect}
              onRemove={handleFilterRemove}
            />
            <DropdownButton
              options={sortOptions}
              selectedValue={sortOption}
              label="Trier par :"
              onSelect={(option) => setSortOption(option.value)}
            />
          </div>
        </div>
        <div className="cards-grid">
          <EventCard />
          <EventCard />
          <EventCard />
          <EventCard />
        </div>
      </section>
    </main>
  );
}
