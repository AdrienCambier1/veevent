import { CategoriesResponse, Category, BaseCategory } from "@/types";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8090";
const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

const mockCategories: Category[] = [
  {
    name: "Sport",
    description: "Événements sportifs et activités physiques",
    key: "sport",
    trending: false,
    _links: { self: { href: "http://localhost:8090/categories/1" } }
  },
  {
    name: "Culture",
    description: "Art, musique, théâtre et expositions",
    key: "culture",
    trending: true,
    _links: { self: { href: "http://localhost:8090/categories/2" } }
  },
  {
    name: "Technologie",
    description: "Conférences tech, meetups et hackathons",
    key: "technology",
    trending: false,
    _links: { self: { href: "http://localhost:8090/categories/3" } }
  },
  {
    name: "Nourriture",
    description: "Événements culinaires et dégustations",
    key: "food",
    trending: false,
    _links: { self: { href: "http://localhost:8090/categories/4" } }
  },
  {
    name: "Bien-être",
    description: "Yoga, méditation et activités de bien-être",
    key: "wellness",
    trending: false,
    _links: { self: { href: "http://localhost:8090/categories/5" } }
  },
  {
    name: "Tendance",
    description: "En tendance",
    key: "trending",
    trending: true,
    _links: { self: { href: "http://localhost:8090/categories/6" } }
  }
];

export const categoryService = {
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
      return result._embedded?.categories || [];
    } catch (error) {
      console.error("❌ Error in getCategories:", error);
      throw error;
    }
  },

  async getCategoryByKey(key: string): Promise<Category | null> {
    try {
      const categories = await this.getCategories();
      return categories.find(category => category.key === key) || null;
    } catch (error) {
      console.error("❌ Error in getCategoryByKey:", error);
      return null;
    }
  },

  async getTrendingCategories(): Promise<Category[]> {
    try {
      const categories = await this.getCategories();
      return categories.filter(category => category.trending);
    } catch (error) {
      console.error("❌ Error in getTrendingCategories:", error);
      return [];
    }
  }
};