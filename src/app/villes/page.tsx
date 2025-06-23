"use client";
import { useState } from "react";
import { useCities } from "@/hooks/cities/use-cities";
import {
  FRENCH_REGIONS,
  RegionCode,
  getRegionCodes,
} from "@/constants/regions";
import SearchInput from "@/components/inputs/search-input/search-input";
import TabList from "@/components/lists/tab-list/tab-list";
import CustomTitle from "@/components/commons/custom-title/custom-title";
import TextImageCard from "@/components/cards/text-image-card/text-image-card";
import img from "@/assets/images/nice.jpg";
import PlacesMapList from "@/components/lists/places-map-list/places-map-list";
import { usePlaces } from "@/hooks/places/use-places";

export default function VillesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Hook pour récupérer les villes populaires
  const { cities: popularCities, loading: popularLoading } = useCities(
    "popular",
    { limit: 6 }
  );

  const { places } = usePlaces("popular", undefined, undefined, 10);
  const filteredPlaces = places.filter(
    (place) =>
      place.location.latitude &&
      place.location.longitude &&
      place.eventsCount > 0
  );

  // Hooks pour récupérer les villes par région pour toutes les régions
  const regionCities = getRegionCodes().reduce((acc, regionCode) => {
    const { cities } = useCities("byRegion", { region: regionCode });
    acc[regionCode] = cities.filter((city) => city.eventsCount > 0);
    return acc;
  }, {} as Record<RegionCode, any[]>);

  // Hook pour la recherche
  const { cities: searchResults, loading: searchLoading } = useCities(
    undefined,
    {
      searchTerm: searchTerm.length > 2 ? searchTerm : undefined,
    }
  );

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // Supprimer les caractères spéciaux
      .replace(/\s+/g, "-") // Remplacer les espaces par des tirets
      .replace(/-+/g, "-") // Remplacer les tirets multiples par un seul
      .trim(); // Supprimer les espaces au début et à la fin
  };

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
          popularCities.map(
            (city) =>
              city.eventsCount > 0 && (
                <TextImageCard
                  key={city.id}
                  title={city.name}
                  subtitle={`${city.eventsCount} événements`}
                  image={city.imageUrl || img}
                  href={`/villes/${city.name.toLowerCase()}`}
                  isCard={true}
                />
              )
          )
        )}
      </section>

      <section className="wrapper">
        <h3>Parcourir par région</h3>
        {getRegionCodes().map((regionCode) => (
          <TabList
            key={regionCode}
            title={FRENCH_REGIONS[regionCode]}
            items={regionCities[regionCode]?.map((city) => city.name) || []}
            generateHref={(city) => `/villes/${slugify(city)}`}
          />
        ))}
      </section>

      {filteredPlaces.length > 0 && (
        <section className="wrapper">
          <CustomTitle
            title="Les lieux les plus populaires"
            description="Lieux"
          />

          <PlacesMapList locations={filteredPlaces} />
        </section>
      )}
    </main>
  );
}
