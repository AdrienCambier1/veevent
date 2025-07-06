import { usePaginatedData } from "@/hooks/commons/use-paginated-data";
import { cityService } from "@/services/city-service";
import { Event, EventFilters, EventsResponse } from "@/types";
import { useCallback, useEffect, useState } from "react";

interface UseCityEventsPaginatedOptions {
  cityName: string;
  filters?: EventFilters;
  scrollTargetRef?: React.RefObject<HTMLElement | null>;
  filterVersion?: number;
}

export function useCityEventsPaginated({
  cityName,
  filters,
  scrollTargetRef,
  filterVersion,
}: UseCityEventsPaginatedOptions) {
  const [eventsHref, setEventsHref] = useState<string | null>(null);
  const [loadingCity, setLoadingCity] = useState(true);
  const [errorCity, setErrorCity] = useState<Error | null>(null);

  // Récupérer le lien events de la ville
  useEffect(() => {
    let isMounted = true;
    setLoadingCity(true);
    setErrorCity(null);
    cityService
      .getCityByName(cityName)
      .then((city) => {
        if (isMounted && city && city._links?.events?.href) {
          setEventsHref(city._links.events.href);
        }
      })
      .catch((err) => {
        if (isMounted) setErrorCity(err as Error);
      })
      .finally(() => {
        if (isMounted) setLoadingCity(false);
      });
    return () => {
      isMounted = false;
    };
  }, [cityName]);

  // Fonction pour fetch les événements paginés
  const fetchEvents = useCallback(
    async (page: number, size: number = 10) => {
      if (!eventsHref) {
        return {
          items: [],
          pagination: { size: 10, totalElements: 0, totalPages: 1, number: 0 },
        };
      }
      // Préparer les filtres pour l'API
      const apiFilters: any = {
        page,
        size,
      };
      
      // Fonction pour slugifier le texte
      const slugify = (text: string) => {
        return text
          .toLowerCase()
          .normalize("NFD") // Normaliser les caractères Unicode
          .replace(/\p{Diacritic}/gu, "") // Supprimer les accents
          .replace(/[^a-z0-9\s-]/g, "") // Supprimer les caractères spéciaux
          .replace(/\s+/g, "-") // Remplacer les espaces par des tirets
          .replace(/-+/g, "-") // Remplacer les tirets multiples par un seul
          .trim(); // Supprimer les espaces au début et à la fin
      };

      // N'ajouter les filtres que s'ils ne sont pas vides
      if (filters && Object.keys(filters).length > 0) {
        Object.assign(apiFilters, filters);
        
        // Slugifier placeName si présent
        if (apiFilters.placeName && typeof apiFilters.placeName === 'string') {
          apiFilters.placeName = slugify(apiFilters.placeName);
        }
      }
      
      console.log("🎯 Filters received:", filters);
      console.log("🔧 API filters prepared:", apiFilters);
      
      // Gérer les catégories : convertir en string seulement si le tableau n'est pas vide
      if (apiFilters.categories && Array.isArray(apiFilters.categories)) {
        if (apiFilters.categories.length > 0) {
          apiFilters.categories = apiFilters.categories.join(",");
        } else {
          // Si le tableau est vide, ne pas envoyer le paramètre
          delete apiFilters.categories;
        }
      }
      
      console.log("🔍 Fetching events with filters:", apiFilters);
      const result: EventsResponse = await cityService.getEventsByCityLink(
        eventsHref,
        apiFilters
      );
      console.log("📦 Events result:", result);
      return {
        items: result._embedded?.eventSummaryResponses || [],
        pagination: result.page || {
          size: size,
          totalElements: 0,
          totalPages: 1,
          number: page,
        },
      };
    },
    [eventsHref, filters, filterVersion]
  );

  const paginatedData = usePaginatedData({
    fetchData: fetchEvents,
    pageSize: 10,
    scrollTargetRef,
  });

  // Le hook usePaginatedData se recharge automatiquement quand fetchEvents change
  // grâce à la dépendance [fetchData] dans son useEffect

  return {
    ...paginatedData,
    loading: paginatedData.loading || loadingCity,
    error: paginatedData.error || errorCity,
  };
}
