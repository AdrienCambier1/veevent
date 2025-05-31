import "@/assets/styles/sidebar-menu.scss";
import { Xmark, City, MapPin } from "iconoir-react";
import CityCard from "@/components/cards/city-card";
import { useState, useEffect } from "react";

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

export default function SidebarMenu(): JSX.Element {
  // Villes par défaut
  const defaultCities = ["Nice", "Cannes", "Marseille", "Lyon"];

  const [cities, setCities] = useState<string[]>(defaultCities);
  const [currentCity, setCurrentCity] = useState<string>("Nice");

  useEffect(() => {
    fetchNearestCities();
  }, []);

  const fetchNearestCities = async () => {
    try {
      const response = await fetch("/api/nearest-city");
      const data: NearestCitiesResponse = await response.json();

      if (data.success && data.data) {
        setCurrentCity(data.data.currentCity);
        setCities(data.data.nearbyCities);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des villes:", error);
      // Garder les valeurs par défaut en cas d'erreur
    }
  };

  return (
    <>
      <div className="sidebar-overlay"> </div>
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="close-button">
            <Xmark strokeWidth={2} />
          </div>
          <div className="city-selector">
            <City strokeWidth={2} />
            <span>{currentCity}</span>
          </div>
        </div>
        <ul className="sidebar-list">
          <p className="sidebar-list-title">Explorer par ville</p>
          {cities.map((city) => (
            <CityCard key={city} city={city} isCard={false} />
          ))}
          <button className="primary-btn">
            <span className="flex gap-2">
              <City strokeWidth={2} />
              Toutes les villes
            </span>
          </button>
        </ul>
        <div className="sidebar-footer">
          <button className="geo-button">
            <MapPin />
            Activer la géolocalisation
          </button>
        </div>
      </div>
    </>
  );
}
