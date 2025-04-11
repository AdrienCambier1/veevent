"use client";
import { Suspense } from "react";
import CustomTitle from "@/components/titles/custom-title";
import EventCard from "@/components/cards/event-card";
import DropdownButton from "@/components/buttons/dropdown-button";
import { useState, useEffect } from "react";
import MultiDropdownButton from "@/components/buttons/multi-dropdown-button";
import { Plus } from "iconoir-react";
import Link from "next/link";

function EventListContent({
  title,
  description,
  showSort,
  showFilters,
  showCreateButton,
  useUrlParams,
}) {
  const { useSearchParams } = require("next/navigation");
  const searchParams = useUrlParams ? useSearchParams() : null;
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
    if (useUrlParams && searchParams) {
      const themeParam = searchParams.get("theme");
      if (themeParam) {
        const themeExists = filterOptions.some(
          (option) => option.value === themeParam
        );
        if (themeExists && !selectedFilters.includes(themeParam)) {
          setSelectedFilters([themeParam]);
        }
      }
    }
  }, [searchParams, filterOptions, selectedFilters, useUrlParams]);

  const handleFilterSelect = (option) => {
    setSelectedFilters([...selectedFilters, option.value]);
  };

  const handleFilterRemove = (value) => {
    setSelectedFilters(selectedFilters.filter((filter) => filter !== value));
  };

  return (
    <section className="page-grid">
      <div className="flex flex-col gap-6">
        <CustomTitle title={title} description={description} />
        <div className="flex flex-col gap-4">
          <input type="text" placeholder="Mot clé" />
          {showFilters && (
            <MultiDropdownButton
              options={filterOptions}
              selectedValues={selectedFilters}
              label="Filtre par catégorie :"
              onSelect={handleFilterSelect}
              onRemove={handleFilterRemove}
            />
          )}
          {showSort && (
            <DropdownButton
              options={sortOptions}
              selectedValue={sortOption}
              label="Trier par :"
              onSelect={(option) => setSortOption(option.value)}
            />
          )}
          {showCreateButton && (
            <Link href="" className="primary-btn">
              <span>Créer un événement</span>
              <Plus />
            </Link>
          )}
        </div>
      </div>
      <div className="cards-grid">
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
      </div>
    </section>
  );
}

export default function EventList(props) {
  return (
    <Suspense fallback={<></>}>
      <EventListContent {...props} />
    </Suspense>
  );
}
