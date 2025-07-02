import { useState, useEffect } from "react";
import { cityService } from "@/services/city-service";
import { placeService } from "@/services/place-service";
import { SearchFilterOption } from "@/types";

interface UseSearchDataReturn {
  cities: SearchFilterOption[];
  places: SearchFilterOption[];
  loading: boolean;
  error: Error | null;
}

export const useSearchData = (): UseSearchDataReturn => {
  const [cities, setCities] = useState<SearchFilterOption[]>([]);
  const [places, setPlaces] = useState<SearchFilterOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Charger les villes et les lieux en parallèle
        const [citiesData, placesData] = await Promise.all([
          cityService.getCities(),
          placeService.getPlaces(),
        ]);

        // Transformer les données pour le SearchFilter
        const cityOptions: SearchFilterOption[] = citiesData.map((city) => ({
          id: city.id.toString(),
          name: city.name,
          eventCount: city.eventsCount,
        }));

        const placeOptions: SearchFilterOption[] = placesData._embedded?.placeResponses?.map((place) => ({
          id: place.id.toString(),
          name: place.name,
          eventCount: place.eventsCount,
        })) || [];

        setCities(cityOptions);
        setPlaces(placeOptions);
      } catch (err) {
        setError(err as Error);
        console.error(
          "Erreur lors du chargement des données de recherche:",
          err
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { cities, places, loading, error };
};
