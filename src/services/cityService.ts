import {
  CitiesResponse,
  City,
  SingleCity,
  Event,
  Place,
  SingleUser,
} from "@/types";
import { mockCities } from "@/services/data/cities";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8090";
const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

export const cityService = {
  async getCities(): Promise<City[]> {
    try {
      // Si on utilise les données fictives
      if (useMockData) {
        return mockCities;
      }

      const response = await fetch(`${apiUrl}/cities`, {
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result: CitiesResponse = await response.json();
      const apiCities = result._embedded?.cityResponses || [];

      return apiCities;
    } catch (error) {
      console.error("❌ Error in getCities:", error);
      throw error;
    }
  },

  async getCityById(id: number): Promise<SingleCity> {
    try {
      if (useMockData) {
        const mockCity = mockCities.find((city) => city.id === id);
        if (!mockCity) {
          throw new Error("Ville non trouvée");
        }
        return mockCity;
      }

      const response = await fetch(`${apiUrl}/cities/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Ville non trouvée");
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const apiCity: SingleCity = await response.json();
      return apiCity;
    } catch (error) {
      console.error("❌ Error in getCityById:", error);
      throw error;
    }
  },

  async getCityByName(name: string): Promise<SingleCity | null> {
    try {
      if (useMockData) {
        const mockCity = mockCities.find(
          (city) => city.name.toLowerCase() === name.toLowerCase()
        );
        return mockCity || null;
      }

      // Récupérer toutes les villes et trouver celle qui correspond au nom
      const cities = await this.getCities();
      const city = cities.find(
        (city) => city.name.toLowerCase() === name.toLowerCase()
      );

      if (!city) {
        return null;
      }

      // Récupérer les détails complets de la ville
      return await this.getCityById(city.id);
    } catch (error) {
      console.error("❌ Error in getCityByName:", error);
      throw error;
    }
  },

  async getCitiesByRegion(region: string): Promise<City[]> {
    try {
      const cities = await this.getCities();
      return cities.filter((city) =>
        city.region.toLowerCase().includes(region.toLowerCase())
      );
    } catch (error) {
      console.error("❌ Error in getCitiesByRegion:", error);
      throw error;
    }
  },

  async getPopularCities(limit: number = 10): Promise<City[]> {
    try {
      const cities = await this.getCities();
      return cities
        .sort((a, b) => b.eventsCount - a.eventsCount)
        .slice(0, limit);
    } catch (error) {
      console.error("❌ Error in getPopularCities:", error);
      throw error;
    }
  },

  async searchCities(searchTerm: string): Promise<City[]> {
    try {
      const cities = await this.getCities();
      return cities.filter(
        (city) =>
          city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          city.region.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      console.error("❌ Error in searchCities:", error);
      throw error;
    }
  },

  async getEventsByCity(
    cityId: number,
    filters?: {
      minPrice?: number;
      maxPrice?: number;
      startDate?: string;
      endDate?: string;
      categories?: string;
    }
  ): Promise<any[]> {
    try {
      // Construire les paramètres de requête
      const searchParams = new URLSearchParams();
      if (filters?.minPrice)
        searchParams.append("minPrice", filters.minPrice.toString());
      if (filters?.maxPrice)
        searchParams.append("maxPrice", filters.maxPrice.toString());
      if (filters?.startDate)
        searchParams.append("startDate", filters.startDate);
      if (filters?.endDate) searchParams.append("endDate", filters.endDate);
      if (filters?.categories)
        searchParams.append("categories", filters.categories);

      const queryString = searchParams.toString();
      const url = `${apiUrl}/cities/${cityId}/events${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result = await response.json();
      return result._embedded?.eventSummaryResponses || [];
    } catch (error) {
      console.error("❌ Error in getEventsByCity:", error);
      throw error;
    }
  },

  async getEventsByCityLink(
    eventsHref: string,
    filters?: {
      minPrice?: number;
      maxPrice?: number;
      startDate?: string;
      endDate?: string;
      categories?: string;
    }
  ): Promise<Event[]> {
    try {
      if (useMockData) {
        return [];
      }

      // Construire l'URL avec les paramètres de filtre
      let url = eventsHref;

      if (filters) {
        const searchParams = new URLSearchParams();
        if (filters.minPrice !== undefined)
          searchParams.append("minPrice", filters.minPrice.toString());
        if (filters.maxPrice !== undefined)
          searchParams.append("maxPrice", filters.maxPrice.toString());
        if (filters.startDate)
          searchParams.append("startDate", filters.startDate);
        if (filters.endDate) searchParams.append("endDate", filters.endDate);
        if (filters.categories)
          searchParams.append("categories", filters.categories);

        // Remplacer le template {?...} par les vrais paramètres
        if (url.includes("{?")) {
          url = url.split("{?")[0];
          if (searchParams.toString()) {
            url += "?" + searchParams.toString();
          }
        }
      } else {
        // Supprimer le template si pas de filtres
        url = url.split("{?")[0];
      }

      console.log("Fetching events from:", url); // Debug

      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result = await response.json();
      console.log("Events API Response:", result); // Debug

      // Vérifier la structure de la réponse
      return (
        result._embedded?.events ||
        result._embedded?.eventSummaryResponses ||
        []
      );
    } catch (error) {
      console.error("❌ Error in getEventsByCityLink:", error);
      throw error;
    }
  },

  // Nouvelle méthode pour récupérer les événements populaires (trending)
  async getTrendingEventsByCityLink(eventsHref: string): Promise<Event[]> {
    try {
      return await this.getEventsByCityLink(eventsHref, {
        categories: "trending",
      });
    } catch (error) {
      console.error("❌ Error in getTrendingEventsByCityLink:", error);
      throw error;
    }
  },

  async getPlacesByCityLink(placesHref: string): Promise<Place[]> {
    try {
      if (useMockData) {
        // Retourner des données mock si nécessaire
        return [];
      }

      const response = await fetch(placesHref, {
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result = await response.json();
      console.log("Places API Response:", result); // Debug log

      // Corriger pour utiliser placeResponses au lieu de places
      return result._embedded?.placeResponses || [];
    } catch (error) {
      console.error("❌ Error in getPlacesByCityLink:", error);
      throw error;
    }
  },

  // Nouvelle méthode pour récupérer tous les organisateurs d'une ville
  async getOrganizersByCityEvents(eventsHref: string): Promise<any[]> {
    try {
      const events = await this.getEventsByCityLink(eventsHref);

      // Extraire les organisateurs uniques
      const uniqueOrganizers = events.reduce(
        (organizers: any[], event: Event) => {
          const existingOrganizer = organizers.find(
            (org) => org.pseudo === event.organizer.pseudo
          );
          if (!existingOrganizer) {
            organizers.push({
              ...event.organizer,
              eventsCount: events.filter(
                (e) => e.organizer.pseudo === event.organizer.pseudo
              ).length,
            });
          }
          return organizers;
        },
        []
      );

      return uniqueOrganizers;
    } catch (error) {
      console.error("❌ Error in getOrganizersByCityEvents:", error);
      throw error;
    }
  },

  async getAllUsers(): Promise<SingleUser[]> {
    try {
      if (useMockData) {
        return [];
      }

      const response = await fetch(`${apiUrl}/users`, {
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result = await response.json();
      console.log("Users API Response:", result); // Debug

      return result._embedded?.userResponses || [];
    } catch (error) {
      console.error("❌ Error in getAllUsers:", error);
      throw error;
    }
  },

  async getOrganizers(): Promise<SingleUser[]> {
    try {
      const allUsers = await this.getAllUsers();

      // Filtrer pour ne garder que les organisateurs (role "Organizer")
      return allUsers.filter((user) => user.role === "Organizer");
    } catch (error) {
      console.error("❌ Error in getOrganizers:", error);
      throw error;
    }
  },

  async getOrganizersByCity(cityName: string): Promise<SingleUser[]> {
    try {
      // Pour cette version, on récupère tous les organisateurs
      // Dans une version future, on pourrait filtrer par ville
      return await this.getOrganizers();
    } catch (error) {
      console.error("❌ Error in getOrganizersByCity:", error);
      throw error;
    }
  },
};
