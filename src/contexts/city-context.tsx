"use client";
import { City, NearestCitiesResponse, SingleCity } from "@/types";
import { cityService } from "@/services/city-service";
import { useGeolocation } from "@/hooks/commons/use-geolocation";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { useSlugify } from "@/hooks/commons/use-slugify";

interface CityContextType {
  selectedCity: SingleCity | undefined;
  currentCity: string | undefined;
  nearbyCities: string[];
  changeCity: (city: SingleCity) => void;
  loading: boolean;
  geoLoading: boolean;
  // ✅ Ajouter les erreurs et fonctions manquantes
  geoError: string | null;
  clearGeoError: () => void;
  userLocation: { latitude: number; longitude: number } | undefined;
  locationType: "GPS" | "IP" | undefined;
  requestPreciseLocation: () => Promise<void>;
  disablePreciseLocation: () => Promise<void>;
  canUsePreciseLocation: boolean;
  isGpsEnabled: boolean;
}

const CityContext = createContext<CityContextType | undefined>(undefined);

export function useCity(): CityContextType {
  const context = useContext(CityContext);
  if (context === undefined) {
    throw new Error("useCity must be used within a CityProvider");
  }
  return context;
}

interface CityProviderProps {
  children: ReactNode;
}

export function CityProvider({ children }: CityProviderProps) {
  const [selectedCity, setSelectedCity] = useState<SingleCity | undefined>();
  const [currentCity, setCurrentCity] = useState<string | undefined>();
  const [nearbyCities, setNearbyCities] = useState<string[]>([]);
  const [userLocation, setUserLocation] = useState<
    { latitude: number; longitude: number } | undefined
  >();
  const [locationType, setLocationType] = useState<"GPS" | "IP" | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [isGpsEnabled, setIsGpsEnabled] = useState<boolean>(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const {
    getCurrentPosition,
    supported: canUsePreciseLocation,
    loading: geoHookLoading,
    error: geoErrorFromHook,
    clearError,
    position,
  } = useGeolocation();

  // Fonction pour récupérer les villes à proximité via géolocalisation GPS précise
  const fetchNearestCitiesWithGPS = async (
    latitude: number,
    longitude: number
  ) => {
    try {
      console.log("📍 Envoi des coordonnées GPS précises...");

      const response = await fetch("/api/nearest-city", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ latitude, longitude }),
      });

      const data: NearestCitiesResponse = await response.json();
      return data;
    } catch (error) {
      console.error("❌ Erreur lors de l'envoi des coordonnées GPS:", error);
      return null;
    }
  };

  // Fonction pour récupérer les villes à proximité via géolocalisation IP
  const fetchNearestCitiesWithIP = async () => {
    try {
      console.log("🌐 Utilisation de la géolocalisation IP...");

      const response = await fetch("/api/nearest-city");
      const data: NearestCitiesResponse = await response.json();
      return data;
    } catch (error) {
      console.error("❌ Erreur lors de la géolocalisation IP:", error);
      return null;
    }
  };

  // Fonction pour traiter la réponse de géolocalisation
  const processLocationData = async (data: NearestCitiesResponse) => {
    if (data.success && data.data) {
      console.log("✅ Villes proches récupérées:", data.data);

      setCurrentCity(data.data.currentCity);
      setNearbyCities(data.data.nearbyCities);
      setUserLocation(data.data.userLocation);
      setLocationType(data.data.locationType);

      // Si une ville actuelle est détectée, essayer de la récupérer depuis l'API
      if (data.data.currentCity) {
        try {
          // Correction : on passe le nom brut, pas le slug
          const cityData = await cityService.getCityByName(
            data.data.currentCity
          );
          if (cityData) {
            console.log(
              "🎯 Ville détectée sélectionnée automatiquement:",
              cityData.name
            );
            setSelectedCity(cityData);
            localStorage.setItem("selectedCity", JSON.stringify(cityData));
          }
        } catch (error) {
          console.warn(
            "⚠️ Impossible de récupérer les détails de la ville détectée:",
            error
          );
        }
      }
    } else {
      console.warn("⚠️ Géolocalisation échouée:", data.error);
    }
  };

  // Fonction principale pour récupérer les villes proches (IP UNIQUEMENT)
  const fetchNearestCities = async () => {
    try {
      setLoading(true);
      console.log("🔍 Recherche des villes proches via IP...");

      // Utiliser UNIQUEMENT la géolocalisation IP au chargement
      const locationData = await fetchNearestCitiesWithIP();

      if (locationData) {
        await processLocationData(locationData);
      }
    } catch (error) {
      console.error(
        "❌ Erreur lors de la récupération des villes proches:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour demander une géolocalisation précise améliorée
  const requestPreciseLocation = useCallback(async () => {
    if (!canUsePreciseLocation) {
      console.warn("⚠️ Géolocalisation GPS non disponible");
      return;
    }

    try {
      // ✅ Effacer les erreurs précédentes
      clearError();

      console.log("🎯 Demande de géolocalisation précise...");

      const gpsPosition = await getCurrentPosition();

      // ✅ Vérifier si on a une erreur du hook
      if (!gpsPosition && geoErrorFromHook) {
        console.error("❌ Erreur de géolocalisation:", geoErrorFromHook);
        setGeoError(geoErrorFromHook);
        return;
      }

      if (gpsPosition) {
        const locationData = await fetchNearestCitiesWithGPS(
          gpsPosition.latitude,
          gpsPosition.longitude
        );

        if (locationData && locationData.success) {
          await processLocationData(locationData);
          setIsGpsEnabled(true);
          localStorage.setItem("gpsEnabled", "true");
          console.log("✅ Géolocalisation GPS activée");
        } else {
          console.error("❌ Erreur API nearest-city:", locationData?.error);
        }
      }
    } catch (error) {
      console.error("❌ Erreur lors de la géolocalisation précise:", error);
    }
  }, [canUsePreciseLocation, getCurrentPosition, clearError, geoErrorFromHook]);

  // Fonction pour désactiver la géolocalisation précise
  const disablePreciseLocation = useCallback(async () => {
    try {
      setLoading(true);
      console.log("🌐 Retour à la géolocalisation IP...");

      // Revenir à la géolocalisation IP
      const locationData = await fetchNearestCitiesWithIP();

      if (locationData) {
        await processLocationData(locationData);
        setIsGpsEnabled(false);
        localStorage.removeItem("gpsEnabled");
        console.log("✅ Géolocalisation GPS désactivée, retour à l'IP");
      }
    } catch (error) {
      console.error("❌ Erreur lors de la désactivation GPS:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fonction pour restaurer la ville depuis localStorage
  const restoreSelectedCity = async () => {
    const storedCity = localStorage.getItem("selectedCity");
    if (storedCity) {
      try {
        const parsedCity = JSON.parse(storedCity) as SingleCity;
        console.log("💾 Ville restaurée depuis localStorage:", parsedCity.name);

        const cityData = await cityService.getCityById(parsedCity.id);
        if (cityData) {
          setSelectedCity(parsedCity);
        } else {
          localStorage.removeItem("selectedCity");
        }
      } catch (error) {
        console.error("❌ Erreur lors de la restauration de la ville:", error);
        localStorage.removeItem("selectedCity");
      }
    }
  };

  useEffect(() => {
    const initializeCityContext = async () => {
      console.log("🚀 Initialisation du contexte City...");

      // Restaurer l'état GPS depuis localStorage
      const gpsEnabled = localStorage.getItem("gpsEnabled") === "true";
      setIsGpsEnabled(gpsEnabled);

      // 1. Restaurer la ville sélectionnée depuis localStorage
      await restoreSelectedCity();

      // 2. Récupérer les villes proches via géolocalisation IP UNIQUEMENT
      await fetchNearestCities();

      setLoading(false);
      console.log("✅ Contexte City initialisé");
    };

    initializeCityContext();
  }, []);

  const changeCity = (city: SingleCity): void => {
    console.log("🔄 Changement de ville vers:", city.name);
    setSelectedCity(city);
    localStorage.setItem("selectedCity", JSON.stringify(city));
  };

  const value: CityContextType = {
    selectedCity,
    currentCity,
    nearbyCities,
    userLocation,
    locationType,
    changeCity,
    loading,
    geoLoading: geoHookLoading, // ✅ Utiliser le loading du hook
    geoError, // ✅ Exposer les erreurs
    clearGeoError: clearError, // ✅ Fonction de reset
    requestPreciseLocation,
    disablePreciseLocation,
    canUsePreciseLocation,
    isGpsEnabled,
  };

  return <CityContext.Provider value={value}>{children}</CityContext.Provider>;
}
