import { useCity } from "@/contexts/city-context";
import { useEffect, useState } from "react";
import { cityService } from "@/services/city-service";
import { SingleCity } from "@/types";

const DEFAULT_CITY = "Nice";

export function useNearbyCities(limit = 3) {
  const { currentCity, nearbyCities, loading } = useCity();
  const [cities, setCities] = useState<SingleCity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCities() {
      setIsLoading(true);
      let cityNames: string[] = [];

      if (currentCity) {
        cityNames = [
          currentCity,
          ...nearbyCities.map((city) => city.name),
        ].slice(0, limit);
      } else {
        cityNames = [DEFAULT_CITY];
      }

      // Récupère les détails des villes
      const results: SingleCity[] = [];
      for (const name of cityNames) {
        try {
          const city = await cityService.getCityByName(name);
          if (city) results.push(city);
        } catch {}
      }
      setCities(results);
      setIsLoading(false);
    }
    fetchCities();
  }, [currentCity, nearbyCities, limit]);

  return { cities, loading: loading || isLoading };
}
