"use client";
import CustomTitle from "@/components/titles/custom-title";
import OrganiserCard from "@/components/cards/organiser-card";
import DropdownButton from "@/components/buttons/dropdown-button";
import { useState, Suspense, useEffect, useRef } from "react";

function ProfilListContent({ title, description }) {
  const { useSearchParams } = require("next/navigation");
  const searchParams = useSearchParams();
  const [sortOption, setSortOption] = useState("liked");
  const [searchTerm, setSearchTerm] = useState("");
  const initializedRef = useRef(false);

  const sortOptions = [
    { label: "Mieux noté", value: "liked" },
    { label: "Plus d'événements", value: "events" },
    { label: "Plus d'abonnés", value: "subscribers" },
  ];

  useEffect(() => {
    if (initializedRef.current) return;

    if (searchParams) {
      const searchParam = searchParams.get("search");
      if (searchParam) {
        setSearchTerm(searchParam);
      }
    }

    initializedRef.current = true;
  }, [searchParams]);

  return (
    <section className="page-grid">
      <div className="flex flex-col gap-6">
        <CustomTitle title={title} description={description} />
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Mot clé"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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

export default function ProfilList(props) {
  return (
    <Suspense fallback={<></>}>
      <ProfilListContent {...props} />
    </Suspense>
  );
}
