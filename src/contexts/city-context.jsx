"use client";
import { createContext, useContext, useState, useEffect } from "react";

const CityContext = createContext();

const cityList = [
  { name: "Toutes les villes", value: "all", events: 24 },
  { name: "Paris", value: "paris", events: 10 },
  { name: "Nice", value: "nice", events: 2 },
  { name: "Marseille", value: "marseille", events: 5 },
  { name: "Lille", value: "lille", events: 3 },
  { name: "Lyon", value: "Lyon", events: 4 },
];

export function useCity() {
  return useContext(CityContext);
}

export function CityProvider({ children }) {
  const [selectedCity, setSelectedCity] = useState({
    name: "Toutes les villes",
    value: "all",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedCity = localStorage.getItem("selectedCity");
    if (storedCity) {
      try {
        const parsedCity = JSON.parse(storedCity);
        setSelectedCity(parsedCity);
      } catch (error) {
        console.error("Erreur de parsing de la ville:", error);
      }
    }
    setLoading(false);
  }, []);

  const changeCity = (city) => {
    setSelectedCity(city);
    localStorage.setItem("selectedCity", JSON.stringify(city));
  };

  const value = {
    cities: cityList,
    selectedCity,
    changeCity,
    loading,
  };

  return <CityContext.Provider value={value}>{children}</CityContext.Provider>;
}
