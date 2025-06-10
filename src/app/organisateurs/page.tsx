"use client";
import SearchInput from "@/components/inputs/search-input/search-input";
import OrganizerCard from "@/components/cards/organizer-card/organizer-card";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import CustomTitle from "@/components/common/custom-title/custom-title";

export default function OrganisateursPage() {
  const searchParams = useSearchParams() || new URLSearchParams();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const urlSearch = searchParams.get("search");
    if (urlSearch) {
      setSearchTerm(urlSearch);
    }
  }, [searchParams]);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/organisateurs?search=${encodeURIComponent(searchTerm)}`);
    } else {
      router.push("/organisateurs");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <main>
      <section className="wrapper">
        <h1>Explorez les organisateurs veevent</h1>
        <h3>Rechercher un organisateur</h3>
        <SearchInput
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Florent, Jean, Marie..."
        />
        <button className="primary-btn" onClick={handleSearch}>
          <span>Rechercher</span>
        </button>
      </section>
      <section className="wrapper">
        <CustomTitle
          description="Organisateurs populaires"
          title="Découvrez les organisateurs populaires"
        />
        <OrganizerCard name="Jean-Baptiste" />
        <OrganizerCard name="Jean-Baptiste" />
        <OrganizerCard name="Jean-Baptiste" />
      </section>
    </main>
  );
}
