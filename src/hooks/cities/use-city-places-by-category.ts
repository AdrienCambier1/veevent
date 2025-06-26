import { useEffect, useState } from "react";
import { Place } from "@/types";
import { PLACE_TYPE_LABELS, PLACE_TYPE_ORDER } from "@/constants/places-categories";
import { cityService } from "@/services/city-service";

interface UseCityPlacesByCategoryResult {
  placesByCategory: Record<string, Place[]>;
  loading: boolean;
  error: Error | null;
}

export function useCityPlacesByCategory(placesHref?: string) : UseCityPlacesByCategoryResult {
  const [placesByCategory, setPlacesByCategory] = useState<Record<string, Place[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!placesHref) return;
    setLoading(true);
    setError(null);
    cityService.getPlacesByCityLink(placesHref)
      .then((places) => {
        // Grouper par catégorie
        const grouped: Record<string, Place[]> = {};
        places.forEach((place) => {
          const type = place.type || "default";
          const label = PLACE_TYPE_LABELS[type] || PLACE_TYPE_LABELS["default"];
          if (!grouped[label]) grouped[label] = [];
          grouped[label].push(place);
        });
        setPlacesByCategory(grouped);
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [placesHref]);

  return { placesByCategory, loading, error };
} 