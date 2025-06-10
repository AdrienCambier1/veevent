"use client";
import SearchInput from "@/components/inputs/search-input/search-input";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import EventCard from "@/components/cards/event-card/event-card";
import HorizontalList from "@/components/lists/horizontal-list/horizontal-list";

function EvenementsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const urlSearch = searchParams?.get("search");
    if (urlSearch) {
      setSearchTerm(urlSearch);
    }
  }, [searchParams]);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/evenements?search=${encodeURIComponent(searchTerm)}`);
    } else {
      router.push("/evenements");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <main>
      <section className="wrapper">
        <h1>Explorez les évènements sur veevent</h1>
        <h3>Rechercher un évènement</h3>
        <SearchInput
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Concert, Festival, Conférence..."
        />
        <button className="primary-btn" onClick={handleSearch}>
          <span>Rechercher</span>
        </button>
      </section>
      <HorizontalList title="Les évènements populaires cette semaine">
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
      <HorizontalList title="Les bonnes affaires de la semaine">
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
      <HorizontalList title="Sortez gratuitement ce week end">
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

export default function EvenementsPage() {
  return (
    <Suspense fallback={<></>}>
      <EvenementsPageContent />
    </Suspense>
  );
}
