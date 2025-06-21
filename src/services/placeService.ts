import { PlacesResponse, Place, SinglePlace } from "@/types";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8090";
const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

export const placeService = {
  async getPlaces(): Promise<Place[]> {
    try {
      // Si on utilise les données fictives (à implémenter plus tard si nécessaire)
      if (useMockData) {
        // TODO: Implémenter les données mock pour les lieux
        return [];
      }

      const response = await fetch(`${apiUrl}/places`, {
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result: PlacesResponse = await response.json();
      const apiPlaces = result._embedded?.placeResponses || [];

      const mappedPlaces: Place[] = apiPlaces.map((apiPlace: any) => ({
        id: apiPlace.id,
        name: apiPlace.name,
        address: apiPlace.address,
        type: apiPlace.type,
        location: apiPlace.location,
        eventsCount: apiPlace.eventsCount,
        eventsPastCount: apiPlace.eventsPastCount,
        cityName: apiPlace.cityName,
        bannerUrl: apiPlace.bannerUrl,
        imageUrl: apiPlace.imageUrl || "/images/placeholder-place.jpg", // Image par défaut
        content: apiPlace.content,
        _links: apiPlace._links,
      }));

      return mappedPlaces;
    } catch (error) {
      console.error("❌ Error in getPlaces:", error);
      throw error;
    }
  },

  async getPlaceById(id: number): Promise<SinglePlace> {
    try {
      if (useMockData) {
        // TODO: Implémenter les données mock pour un lieu spécifique
        throw new Error("Mock data not implemented for places yet");
      }

      const response = await fetch(`${apiUrl}/places/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Lieu non trouvé");
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const apiPlace = await response.json();

      const mappedPlace: SinglePlace = {
        id: apiPlace.id,
        name: apiPlace.name,
        address: apiPlace.address,
        type: apiPlace.type,
        location: apiPlace.location,
        eventsCount: apiPlace.eventsCount,
        eventsPastCount: apiPlace.eventsPastCount,
        cityName: apiPlace.cityName,
        bannerUrl: apiPlace.bannerUrl,
        imageUrl: apiPlace.imageUrl || "/images/placeholder-place.jpg",
        content: apiPlace.content,
        _links: apiPlace._links,
      };

      return mappedPlace;
    } catch (error) {
      console.error("❌ Error in getPlaceById:", error);
      throw error;
    }
  },

  async getPopularPlaces(limit: number = 6): Promise<Place[]> {
    try {
      const places = await this.getPlaces();

      // Trier par nombre d'événements (actuels + passés) et limiter
      const popularPlaces = places
        .sort((a, b) => {
          const totalEventsA = a.eventsCount + a.eventsPastCount;
          const totalEventsB = b.eventsCount + b.eventsPastCount;
          return totalEventsB - totalEventsA;
        })
        .slice(0, limit);

      return popularPlaces;
    } catch (error) {
      console.error("❌ Error in getPopularPlaces:", error);
      throw error;
    }
  },

  async getPlacesByCity(cityName: string): Promise<Place[]> {
    try {
      const places = await this.getPlaces();

      // Filtrer par nom de ville
      const cityPlaces = places.filter(
        (place) => place.cityName.toLowerCase() === cityName.toLowerCase()
      );

      return cityPlaces;
    } catch (error) {
      console.error("❌ Error in getPlacesByCity:", error);
      throw error;
    }
  },

  async searchPlaces(searchTerm: string): Promise<Place[]> {
    try {
      const places = await this.getPlaces();

      // Recherche dans le nom, l'adresse, le type et la ville
      const filteredPlaces = places.filter((place) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          place.name.toLowerCase().includes(searchLower) ||
          place.address.toLowerCase().includes(searchLower) ||
          place.cityName.toLowerCase().includes(searchLower) ||
          (place.type && place.type.toLowerCase().includes(searchLower))
        );
      });

      return filteredPlaces;
    } catch (error) {
      console.error("❌ Error in searchPlaces:", error);
      throw error;
    }
  },
};
