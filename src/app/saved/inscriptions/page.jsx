"use client";
import CustomTitle from "@/components/custom-title";
import EventCard from "@/components/event-card";
import DropdownButton from "@/components/dropdown-button";
import { useState } from "react";
import MultiDropdownButton from "@/components/multi-dropdown-button";

export default function InscriptionsPage() {
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
    <>
      <section className="page-grid">
        <div className="flex flex-col gap-6">
          <CustomTitle
            title="Consulter mes inscriptions"
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
    </>
  );
}
