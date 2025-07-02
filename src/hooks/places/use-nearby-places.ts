import { useCity } from "@/contexts/city-context";
import { useEffect, useState } from "react";
import { placeService } from "@/services/place-service";
import { Place } from "@/types";

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  // Haversine formula
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function useNearbyPlaces(limit = 3) {
  const { userLocation, loading: cityLoading } = useCity();
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlaces() {
      setLoading(true);
      let allPlaces: Place[] = [];
      try {
        const result = await placeService.getPlaces(0, 1000); // Récupère beaucoup de lieux
        allPlaces = result._embedded?.placeResponses || [];
        if (userLocation) {
          allPlaces = allPlaces
            .filter(
              (p) =>
                p.location &&
                typeof p.location.latitude === "number" &&
                typeof p.location.longitude === "number"
            )
            .map((p) => ({
              ...p,
              _distance: getDistance(
                userLocation.latitude,
                userLocation.longitude,
                p.location.latitude!,
                p.location.longitude!
              ),
            }))
            .sort((a, b) => (a._distance ?? 0) - (b._distance ?? 0));
        }
        setPlaces(allPlaces.slice(0, limit));
      } catch (e) {
        setPlaces([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPlaces();
  }, [userLocation, limit]);

  return { places, loading: cityLoading || loading };
}
