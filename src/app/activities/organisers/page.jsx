"use client";
import CustomTitle from "@/components/custom-title";
import OrganiserCard from "@/components/organiser-card";
import DropdownButton from "@/components/dropdown-button";
import { useState } from "react";

export default function OrganisersPage() {
  const [sortOption, setSortOption] = useState("liked");

  const sortOptions = [
    { label: "Mieux noté", value: "liked" },
    { label: "Plus d'événements", value: "events" },
    { label: "Plus d'abonnés", value: "subscribers" },
  ];

  return (
    <section className="page-grid">
      <div className="flex flex-col gap-6">
        <CustomTitle
          title="Rechercher un organisateur"
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
        <OrganiserCard
          name="Jean Claude"
          id="@JeanClaudeDu06"
          subscribers="8"
          events="12"
          note="4"
        />
        <OrganiserCard
          name="Jean Claude"
          id="@JeanClaudeDu06"
          subscribers="8"
          events="12"
          note="4"
        />
        <OrganiserCard
          name="Jean Claude"
          id="@JeanClaudeDu06"
          subscribers="8"
          events="12"
          note="4"
        />
        <OrganiserCard
          name="Jean Claude"
          id="@JeanClaudeDu06"
          subscribers="8"
          events="12"
          note="4"
        />
      </div>
    </section>
  );
}
