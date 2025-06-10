"use client";
import SearchInput from "@/components/inputs/search-input/search-input";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import EventCard from "@/components/cards/event-card/event-card";
import HorizontalList from "@/components/lists/horizontal-list/horizontal-list";
import CustomTitle from "@/components/common/custom-title/custom-title";
import PlaceCard from "@/components/cards/place-card/place-card";

export default function LieuxPage() {
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
      router.push(`/lieux?search=${encodeURIComponent(searchTerm)}`);
    } else {
      router.push("/lieux");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <main>
      <section className="wrapper">
        <h1>Explorez les différents lieux sur veevent</h1>
        <h3>Rechercher un lieu</h3>
        <SearchInput
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Stade, Parc, Salle de concert..."
        />
        <button className="primary-btn" onClick={handleSearch}>
          <span>Rechercher</span>
        </button>
      </section>
      <section className="wrapper">
        <CustomTitle
          description="Lieux"
          title="Les lieux populaires en ce moment"
        />
        <PlaceCard
          place={{
            id: "1",
            name: "Bar des artistes",
            address: "Antibes",
            category: "Bar",
            location: {
              lat: 43.5803,
              lng: 7.1251,
            },
            imageUrl: "/images/nice.jpg",
            eventsCount: 5,
          }}
        />
      </section>
      <HorizontalList title="Les évènements qui rythme vos lieux préférés">
        <EventCard
          title="Atelier fresque végétal"
          location="Antibes"
          date="vendredi 14 mai 2025 • 19h00"
          description=" Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
                                      semper commodo velit ac facilisis. Nullam augue dui, bibendum vel
                                      congue vitae, lacinia vel nunc. Cras tristique ac ipsum nec
                                      consectetur. "
          minify={false}
          price={59}
        />
        <EventCard
          title="Atelier fresque végétal"
          location="Antibes"
          date="vendredi 14 mai 2025 • 19h00"
          description=" Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
                                      semper commodo velit ac facilisis. Nullam augue dui, bibendum vel
                                      congue vitae, lacinia vel nunc. Cras tristique ac ipsum nec
                                      consectetur. "
          minify={false}
          price={59}
        />
      </HorizontalList>
    </main>
  );
}
