"use client";
import { useState } from "react";
import { useCities } from "@/hooks/useCities";
import SearchInput from "@/components/inputs/search-input/search-input";
import TabList from "@/components/lists/tab-list/tab-list";
import CustomTitle from "@/components/common/custom-title/custom-title";
import TextImageCard from "@/components/cards/text-image-card/text-image-card";
import img from "@/assets/images/nice.jpg";

export default function VillesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Hook pour récupérer les villes populaires
  const { cities: popularCities, loading: popularLoading } = useCities(
    "popular",
    { limit: 4 }
  );

  // Hook pour récupérer les villes par région
  const { cities: PacaCities } = useCities("byRegion", {
    region: "Provence Alpes Côte d'Azur",
  });

  // Hook pour la recherche
  const { cities: searchResults, loading: searchLoading } = useCities(
    undefined,
    {
      searchTerm: searchTerm.length > 2 ? searchTerm : undefined,
    }
  );

  const handleSearch = () => {
    // La recherche se fait automatiquement via le hook quand searchTerm change
    console.log("Recherche pour:", searchTerm);
  };

  return (
    <main>
      <section className="wrapper">
        <h1>Explorez les villes disponibles sur veevent</h1>
        <h3>Rechercher une ville</h3>
        <SearchInput
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Nice, Cannes, Antibes..."
        />
        <button className="primary-btn" onClick={handleSearch}>
          <span>Rechercher</span>
        </button>

        {/* Affichage des résultats de recherche */}
        {searchTerm.length > 2 && (
          <div>
            <h4>Résultats de recherche</h4>
            {searchLoading ? (
              <p>Recherche en cours...</p>
            ) : searchResults.length > 0 ? (
              searchResults.map((city) => (
                <TextImageCard
                  key={city.id}
                  title={city.name}
                  subtitle={`${city.eventsCount} événements`}
                  image={city.imageUrl || img}
                  href={`/villes/${city.name.toLowerCase()}`}
                  isCard={true}
                />
              ))
            ) : (
              <p>Aucune ville trouvée</p>
            )}
          </div>
        )}
      </section>

      <section className="wrapper">
        <h3>Parcourir les villes populaires</h3>
        {popularLoading ? (
          <p>Chargement...</p>
        ) : (
          popularCities.map((city) => (
            <TextImageCard
              key={city.id}
              title={city.name}
              subtitle={`${city.eventsCount} événements`}
              image={city.imageUrl || img}
              href={`/villes/${city.name.toLowerCase()}`}
              isCard={true}
            />
          ))
        )}
      </section>

      <section className="wrapper">
        <h3>Parcourir par région</h3>
        <TabList
          title="Provence Alpes Côte d'Azur"
          items={PacaCities.map((city) => city.name)}
          generateHref={(city) => `/villes/${city.toLowerCase()}`}
        />
      </section>

      <section className="wrapper">
        <CustomTitle
          title="Les lieux populaires proche de chez vous"
          description="Lieux"
        />
      </section>
    </main>
  );
}
