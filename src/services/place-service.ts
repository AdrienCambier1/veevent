import { PlacesResponse, Place, SinglePlace, EventsResponse, SingleUser, UsersResponse, Event as ApiEvent } from "@/types";

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
        description: apiPlace.description,
        slug: apiPlace.slug,
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
        description: apiPlace.description,
        slug: apiPlace.slug,
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

  async getPlaceBySlug(slug: string): Promise<SinglePlace | null> {
    try {
      if (useMockData) {
        // TODO: Implémenter les données mock pour un lieu par slug
        throw new Error("Mock data not implemented for places by slug yet");
      }

      const response = await fetch(`${apiUrl}/places?slug=${slug}`, {
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result = await response.json();
      const apiPlace = result._embedded?.placeResponses?.[0];

      if (!apiPlace) {
        return null;
      }

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
        description: apiPlace.description,
        slug: apiPlace.slug,
        _links: apiPlace._links,
      };

      return mappedPlace;
    } catch (error) {
      console.error("❌ Error in getPlaceBySlug:", error);
      throw error;
    }
  },

  async getEventsByPlaceLink(
    eventsLink: string,
    filters?: {
      minPrice?: number;
      maxPrice?: number;
      startDate?: string;
      endDate?: string;
      categories?: string;
    },
    limit?: number
  ): Promise<EventsResponse> {
    try {
      // Remplacer le template HATEOAS par l'URL de base
      let url = eventsLink.replace(/\{.*\}/, "");

      // Ajouter les filtres à l'URL si présents
      if (filters) {
        const params = new URLSearchParams();
        if (filters.minPrice !== undefined) params.append("minPrice", filters.minPrice.toString());
        if (filters.maxPrice !== undefined) params.append("maxPrice", filters.maxPrice.toString());
        if (filters.startDate) params.append("startDate", filters.startDate);
        if (filters.endDate) params.append("endDate", filters.endDate);
        if (filters.categories) params.append("categories", filters.categories);

        const queryString = params.toString();
        if (queryString) {
          url += "?" + queryString;
        }
      }

      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result: EventsResponse = await response.json();
      return result;
    } catch (error) {
      console.error("❌ Error in getEventsByPlaceLink:", error);
      throw error;
    }
  },

  async getTrendingEventsByPlaceLink(
    eventsLink: string,
    limit?: number
  ): Promise<ApiEvent[]> {
    try {
      // Remplacer le template HATEOAS par l'URL réelle avec le filtre trending
      const url = eventsLink.replace(/\{.*\}/, "") + "?categories=trending";

      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result: EventsResponse = await response.json();
      const events = result._embedded?.eventSummaryResponses || [];

      return limit ? events.slice(0, limit) : events;
    } catch (error) {
      console.error("❌ Error in getTrendingEventsByPlaceLink:", error);
      throw error;
    }
  },

  async getOrganizersByPlaceLink(
    organizersLink: string,
    limit?: number
  ): Promise<SingleUser[]> {
    try {
      const response = await fetch(organizersLink, {
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result: UsersResponse = await response.json();
      const organizers = result._embedded?.userResponses || [];

      return limit ? organizers.slice(0, limit) : organizers;
    } catch (error) {
      console.error("❌ Error in getOrganizersByPlaceLink:", error);
      throw error;
    }
  },

  async getPlaceByLink(placeLink: string): Promise<SinglePlace | null> {
    try {
      if (useMockData) {
        // TODO: Implémenter les données mock pour un lieu par lien
        throw new Error("Mock data not implemented for places by link yet");
      }

      const response = await fetch(placeLink, {
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
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
        description: apiPlace.description,
        slug: apiPlace.slug,
        _links: apiPlace._links,
      };

      return mappedPlace;
    } catch (error) {
      console.error("❌ Error in getPlaceByLink:", error);
      throw error;
    }
  },
};
