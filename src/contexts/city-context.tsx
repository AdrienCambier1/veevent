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

interface CityContextType {
  cities: City[];
  selectedCity: City;
  changeCity: (city: City) => void;
  loading: boolean;
}

const CityContext = createContext<CityContextType | undefined>(undefined);

const cityList: City[] = [
  { name: "Toutes les villes", value: "all", events: 24 },
  { name: "Paris", value: "paris", events: 10 },
  { name: "Nice", value: "nice", events: 2 },
  { name: "Marseille", value: "marseille", events: 5 },
  { name: "Lille", value: "lille", events: 3 },
  { name: "Lyon", value: "Lyon", events: 4 },
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
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedCity = localStorage.getItem("selectedCity");
    if (storedCity) {
      try {
        const parsedCity = JSON.parse(storedCity) as City;
        setSelectedCity(parsedCity);
      } catch (error) {
        console.error("Erreur de parsing de la ville:", error);
      }
    }
    setLoading(false);
  }, []);

  const changeCity = (city: City): void => {
    setSelectedCity(city);
    localStorage.setItem("selectedCity", JSON.stringify(city));
  };

  const value: CityContextType = {
    cities: cityList,
    selectedCity,
    changeCity,
    loading,
  };

  return <CityContext.Provider value={value}>{children}</CityContext.Provider>;
}
