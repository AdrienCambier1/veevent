// Service pour la recherche globale et typée

const apiUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8090/api/v1";

export async function searchGlobal(
  query: string,
  page: number = 0,
  size: number = 20
) {
  const res = await fetch(
    `${apiUrl}/search?query=${encodeURIComponent(
      query
    )}&page=${page}&size=${size}`
  );
  if (!res.ok) throw new Error("Erreur lors de la recherche globale");
  return res.json();
}

export async function searchByType(
  query: string,
  types: string[],
  page: number = 0,
  size: number = 20,
  filters?: {
    cityName?: string;
    placeName?: string;
    categories?: string[];
    minPrice?: number;
    maxPrice?: number;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: string;
  }
) {
  const searchParams = new URLSearchParams();
  searchParams.append("types", types.join(","));
  searchParams.append("query", encodeURIComponent(query));
  searchParams.append("page", page.toString());
  searchParams.append("size", size.toString());
  
  // Ajouter les filtres si présents
  if (filters) {
    if (filters.cityName) {
      searchParams.append("cities", filters.cityName);
    }
    if (filters.placeName) {
      searchParams.append("places", filters.placeName);
    }
    if (filters.categories && filters.categories.length > 0) {
      searchParams.append("categories", filters.categories.join(","));
    }
    if (filters.minPrice !== undefined) {
      searchParams.append("minPrice", filters.minPrice.toString());
    }
    if (filters.maxPrice !== undefined) {
      searchParams.append("maxPrice", filters.maxPrice.toString());
    }
    if (filters.startDate) {
      searchParams.append("startDate", filters.startDate);
    }
    if (filters.endDate) {
      searchParams.append("endDate", filters.endDate);
    }
    if (filters.sortBy) {
      searchParams.append("sortBy", filters.sortBy);
    }
    if (filters.sortOrder) {
      searchParams.append("sortOrder", filters.sortOrder);
    }
  }

  const res = await fetch(`${apiUrl}/search?${searchParams.toString()}`);
  if (!res.ok) throw new Error("Erreur lors de la recherche typée");
  return res.json();
}

// Nouvelle fonction pour rechercher des événements avec filtres
export async function searchEventsWithFilters(
  query: string,
  filters: {
    cityName?: string;
    placeName?: string;
    categories?: string[];
    minPrice?: number;
    maxPrice?: number;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: string;
  },
  page: number = 0,
  size: number = 20
) {
  const searchParams = new URLSearchParams();
  
  // Ajouter la requête de recherche si elle existe
  if (query && query.trim() !== "") {
    searchParams.append("query", query);
  }
  
  // Ajouter les paramètres de pagination
  searchParams.append("page", page.toString());
  searchParams.append("size", size.toString());
  
  // Ajouter les filtres
  if (filters.cityName) {
    searchParams.append("cities", filters.cityName);
  }
  if (filters.placeName) {
    searchParams.append("places", filters.placeName);
  }
  if (filters.categories && filters.categories.length > 0) {
    searchParams.append("categories", filters.categories.join(","));
  }
  if (filters.minPrice !== undefined) {
    searchParams.append("minPrice", filters.minPrice.toString());
  }
  if (filters.maxPrice !== undefined) {
    searchParams.append("maxPrice", filters.maxPrice.toString());
  }
  if (filters.startDate) {
    searchParams.append("startDate", filters.startDate);
  }
  if (filters.endDate) {
    searchParams.append("endDate", filters.endDate);
  }
  if (filters.sortBy) {
    searchParams.append("sortBy", filters.sortBy);
  }
  if (filters.sortOrder) {
    searchParams.append("sortOrder", filters.sortOrder);
  }

  const queryString = searchParams.toString();
  const url = `${apiUrl}/events${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la recherche d'événements");
  }

  const data = await response.json();
  
  // Transformer la réponse pour qu'elle soit compatible avec le format de recherche
  return {
    _embedded: {
      searchResultResponses: data._embedded?.eventSummaryResponses?.map((event: any) => ({
        type: "event",
        event: event,
        score: 1.0, // Score par défaut pour les événements
      })) || [],
    },
    page: data.page,
    _links: data._links,
  };
}
