import { CategoriesResponse, Category, BaseCategory } from "@/types";

const apiUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8090/api/v1";
const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

const mockCategories: Category[] = [
  {
    name: "Sport",
    description: "Événements sportifs et activités physiques",
    key: "sport",
    trending: false,
    _links: { self: { href: "http://localhost:8090/categories/1" } },
  },
  {
    name: "Culture",
    description: "Art, musique, théâtre et expositions",
    key: "culture",
    trending: true,
    _links: { self: { href: "http://localhost:8090/categories/2" } },
  },
  {
    name: "Technologie",
    description: "Conférences tech, meetups et hackathons",
    key: "technology",
    trending: false,
    _links: { self: { href: "http://localhost:8090/categories/3" } },
  },
  {
    name: "Nourriture",
    description: "Événements culinaires et dégustations",
    key: "food",
    trending: false,
    _links: { self: { href: "http://localhost:8090/categories/4" } },
  },
  {
    name: "Bien-être",
    description: "Yoga, méditation et activités de bien-être",
    key: "wellness",
    trending: false,
    _links: { self: { href: "http://localhost:8090/categories/5" } },
  },
  {
    name: "Tendance",
    description: "En tendance",
    key: "trending",
    trending: true,
    _links: { self: { href: "http://localhost:8090/categories/6" } },
  },
];

// Mock des comptes de catégories
const mockCategoryCounts = {
  "trending": 0,
  "festivals": 0,
  "nightlife": 0,
  "technology": 2,
  "food": 3,
  "art-culture": 0,
  "outdoor": 0,
  "music": 0,
  "theater": 0,
  "culture": 5,
  "wellness": 3,
  "cinema": 0,
  "family": 0,
  "sport": 3,
  "conferences": 0
};

export const categoryService = {
  async getCategoryCounts(): Promise<Record<string, number>> {
    try {
      if (useMockData) {
        return mockCategoryCounts;
      }

      const response = await fetch(`${apiUrl}/categories/counts`, {
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("❌ Error in getCategoryCounts:", error);
      throw error;
    }
  },

  async getCategories(): Promise<Category[]> {
    try {
      if (useMockData) {
        return mockCategories;
      }

      const response = await fetch(`${apiUrl}/categories`, {
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result: CategoriesResponse = await response.json();
      const allCategories = result._embedded?.categories || [];
      
      // Récupérer les comptes des catégories
      const categoryCounts = await this.getCategoryCounts();
      
      // Filtrer uniquement les catégories qui ont des événements
      const categoriesWithEvents = allCategories.filter(category => {
        const count = categoryCounts[category.key] || 0;
        return count > 0;
      });

      return categoriesWithEvents;
    } catch (error) {
      console.error("❌ Error in getCategories:", error);
      throw error;
    }
  },

  async getCategoryByKey(key: string): Promise<Category | null> {
    try {
      const categories = await this.getCategories();
      return categories.find((category) => category.key === key) || null;
    } catch (error) {
      console.error("❌ Error in getCategoryByKey:", error);
      return null;
    }
  },

  async getTrendingCategories(): Promise<Category[]> {
    try {
      const categories = await this.getCategories();
      return categories.filter((category) => category.trending);
    } catch (error) {
      console.error("❌ Error in getTrendingCategories:", error);
      return [];
    }
  },
};
