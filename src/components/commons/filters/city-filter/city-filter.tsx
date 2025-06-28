import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Xmark } from "iconoir-react";
import { useFilters } from "@/contexts/filter-context";
import { cityService } from "@/services/city-service";
import { placeService } from "@/services/place-service";
import { SearchFilterOption } from "@/types";
import "../search-filter/search-filter.scss";

export default function CityFilter() {
  const { tempFilters, updateTempFilters } = useFilters();

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(tempFilters.cityName || "");
  const [selectedCity, setSelectedCity] = useState<SearchFilterOption | null>(
    tempFilters.cityName ? { name: tempFilters.cityName, eventCount: 0 } : null
  );
  const [cities, setCities] = useState<SearchFilterOption[]>([]);
  const [filteredCities, setFilteredCities] = useState<SearchFilterOption[]>([]);
  const [loading, setLoading] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Charger les villes depuis l'API ou via HATEOAS si un lieu est sélectionné
  const loadCities = useCallback(async () => {
    setLoading(true);
    try {
      if (tempFilters.selectedPlaceObj && tempFilters.selectedPlaceObj._links?.city?.href) {
        // Charger la ville du lieu sélectionné
        const city = await cityService.getCityById(tempFilters.selectedPlaceObj.cityId || tempFilters.selectedPlaceObj.id);
        if (city) {
          const cityOption = { id: city.id, name: city.name, eventCount: city.eventsCount, _full: city };
          setCities([cityOption]);
          setFilteredCities([cityOption]);
          // Forcer la sélection de la ville liée au lieu si ce n'est pas déjà fait
          if (!tempFilters.cityName || tempFilters.cityName !== city.name) {
            setSelectedCity(cityOption);
            setSearchTerm(city.name);
            updateTempFilters({ cityName: city.name, selectedCityObj: city });
          }
        } else {
          setCities([]);
          setFilteredCities([]);
        }
      } else {
        // Charger toutes les villes
        const allCities = await cityService.getCities();
        const cityOptions: SearchFilterOption[] = allCities.map((city) => ({
          id: city.id.toString(),
          name: city.name,
          eventCount: city.eventsCount,
          _full: city,
        }));
        setCities(cityOptions);
        setFilteredCities(cityOptions);
      }
    } finally {
      setLoading(false);
    }
  }, [tempFilters.selectedPlaceObj]);

  // Recharger les villes quand selectedPlaceObj change
  useEffect(() => {
    console.log("🔄 CityFilter: selectedPlaceObj changed", tempFilters.selectedPlaceObj);
    loadCities();
  }, [tempFilters.selectedPlaceObj, loadCities]);

  // Filtrer les villes selon le terme de recherche
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCities(cities);
    } else {
      const filtered = cities.filter((city) =>
        city.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCities(filtered);
    }
  }, [searchTerm, cities]);

  // Synchroniser avec les filtres du contexte
  useEffect(() => {
    if (tempFilters.cityName !== selectedCity?.name) {
      if (tempFilters.cityName) {
        setSelectedCity({ name: tempFilters.cityName, eventCount: 0 });
        setSearchTerm(tempFilters.cityName);
      } else {
        setSelectedCity(null);
        setSearchTerm("");
      }
    }
  }, [tempFilters.cityName, selectedCity]);

  // Synchroniser l'input avec le contexte quand la ville est désélectionnée
  useEffect(() => {
    if (!tempFilters.cityName) {
      setSearchTerm("");
      setSelectedCity(null);
    }
  }, [tempFilters.cityName]);

  // Gérer le clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCitySelect = (city: SearchFilterOption) => {
    setSelectedCity(city);
    setSearchTerm(city.name);
    setIsOpen(false);
    // Si on sélectionne une ville différente de celle du lieu sélectionné, on reset le lieu
    if (
      tempFilters.selectedPlaceObj &&
      tempFilters.selectedPlaceObj.cityName &&
      tempFilters.selectedPlaceObj.cityName !== city.name
    ) {
      updateTempFilters({ cityName: city.name, selectedCityObj: city._full, placeName: undefined, selectedPlaceObj: undefined });
    } else {
      updateTempFilters({ cityName: city.name, selectedCityObj: city._full });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);

    // Si l'input est vidé, supprimer le filtre ville ET la place sélectionnée
    if (e.target.value.trim() === "") {
      setSelectedCity(null);
      updateTempFilters({ cityName: undefined, selectedCityObj: undefined, placeName: undefined, selectedPlaceObj: undefined });
    }
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const clearSelection = () => {
    setSelectedCity(null);
    setSearchTerm("");
    updateTempFilters({ cityName: undefined, selectedCityObj: undefined });
  };

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: {
        duration: 0.2,
        ease: [0.4, 0.0, 0.2, 1],
      },
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.4, 0.0, 0.2, 1],
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.2,
        ease: [0.4, 0.0, 0.2, 1],
      },
    }),
  };

  return (
    <div className="search-filter" ref={filterRef}>
      <div className="search-search-input" onClick={() => setIsOpen(true)}>
        <input
          type="text"
          placeholder="Rechercher une ville"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
        />
        <div className="search-icons">
          {selectedCity && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearSelection();
              }}
              className="clear-button"
            >
              <Xmark />
            </button>
          )}
          <span className="search-icon">
            <Search />
          </span>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="search-dropdown"
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {loading ? (
              <div className="loading">Chargement des villes...</div>
            ) : filteredCities.length > 0 ? (
              filteredCities.map((city, index) => (
                <motion.div
                  key={city.id || city.name}
                  className={`search-option ${
                    selectedCity?.name === city.name ? "selected" : ""
                  }`}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  custom={index}
                  onClick={() => handleCitySelect(city)}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>{city.name}</span>
                  <span className="event-count">
                    {city.eventCount} événements
                  </span>
                </motion.div>
              ))
            ) : (
              <div className="no-results">Aucune ville trouvée</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
