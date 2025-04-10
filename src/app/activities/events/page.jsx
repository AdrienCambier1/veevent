"use client";
export const dynamic = "force-dynamic";
import CustomTitle from "@/components/titles/custom-title";
import EventCard from "@/components/cards/event-card";
import DropdownButton from "@/components/buttons/dropdown-button";
import { useState, useEffect } from "react";
import MultiDropdownButton from "@/components/multi-dropdown-button";
import { useSearchParams } from "next/navigation";

export default function EventsPage() {
  const searchParams = useSearchParams();
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

  useEffect(() => {
    const themeParam = searchParams.get("theme");
    if (themeParam) {
      const themeExists = filterOptions.some(
        (option) => option.value === themeParam
      );
      if (themeExists && !selectedFilters.includes(themeParam)) {
        setSelectedFilters([themeParam]);
      }
    }
  }, [searchParams, filterOptions]);

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
            title="Rechercher un événement"
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
