"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface City {
  name: string;
  value: string;
  events?: number;
}

interface NearestCitiesResponse {
  success: boolean;
  data?: {
    currentCity: string;
    nearbyCities: string[];
    userLocation: {
      latitude: number;
      longitude: number;
    };
  };
  error?: string;
}

interface CityContextType {
  cities: City[];
  selectedCity: City;
  currentCity: string;
  nearbyCities: string[];
  changeCity: (city: City) => void;
  loading: boolean;
  geoLoading: boolean;
}

const CityContext = createContext<CityContextType | undefined>(undefined);

const cityList: City[] = [
  { name: "Toutes les villes", value: "all", events: 24 },
  { name: "Paris", value: "paris", events: 10 },
  { name: "Nice", value: "nice", events: 2 },
  { name: "Marseille", value: "marseille", events: 5 },
  { name: "Lille", value: "lille", events: 3 },
  { name: "Lyon", value: "lyon", events: 4 },
  { name: "Cannes", value: "cannes", events: 1 },
  { name: "Boulogne-Billancourt", value: "boulogne-billancourt", events: 2 },
  { name: "Toulouse", value: "toulouse", events: 3 },
  { name: "Bordeaux", value: "bordeaux", events: 2 },
];

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

export function CityProvider({ children }: CityProviderProps): JSX.Element {
  const [selectedCity, setSelectedCity] = useState<City>({
    name: "Toutes les villes",
    value: "all",
  });
  const [currentCity, setCurrentCity] = useState<string>("Nice");
  const [nearbyCities, setNearbyCities] = useState<string[]>([
    "Nice",
    "Cannes",
    "Marseille",
    "Lyon",
  ]);
  const [loading, setLoading] = useState<boolean>(true);
  const [geoLoading, setGeoLoading] = useState<boolean>(false);

  // Fonction pour récupérer les villes à proximité
  const fetchNearestCities = async () => {
    try {
      setGeoLoading(true);
      const response = await fetch("/api/nearest-city");
      const data: NearestCitiesResponse = await response.json();

      if (data.success && data.data) {
        setCurrentCity(data.data.currentCity);
        setNearbyCities(data.data.nearbyCities);

        // Mettre à jour la ville sélectionnée si elle correspond à une ville proche
        const foundCity = cityList.find(
          (city) =>
            city.name.toLowerCase() === data.data!.currentCity.toLowerCase()
        );
        if (foundCity) {
          setSelectedCity(foundCity);
          localStorage.setItem("selectedCity", JSON.stringify(foundCity));
        }
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des villes:", error);
      // Garder les valeurs par défaut en cas d'erreur
    } finally {
      setGeoLoading(false);
    }
  };

  useEffect(() => {
    const initializeCities = async () => {
      // Récupérer la ville stockée
      const storedCity = localStorage.getItem("selectedCity");
      if (storedCity) {
        try {
          const parsedCity = JSON.parse(storedCity) as City;
          setSelectedCity(parsedCity);
        } catch (error) {
          console.error("Erreur de parsing de la ville:", error);
        }
      }

      // Récupérer les villes à proximité
      await fetchNearestCities();
      setLoading(false);
    };

    initializeCities();
  }, []);

  const changeCity = (city: City): void => {
    setSelectedCity(city);
    localStorage.setItem("selectedCity", JSON.stringify(city));
  };

  const value: CityContextType = {
    cities: cityList,
    selectedCity,
    currentCity,
    nearbyCities,
    changeCity,
    loading,
    geoLoading,
  };

  return <CityContext.Provider value={value}>{children}</CityContext.Provider>;
}
