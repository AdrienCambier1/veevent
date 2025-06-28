import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Xmark } from "iconoir-react";
import { useFilters } from "@/contexts/filter-context";
import { placeService } from "@/services/place-service";
import { cityService } from "@/services/city-service";
import { SearchFilterOption } from "@/types";
import "../search-filter/search-filter.scss";

interface PlaceFilterProps {
  cityName?: string;
}

export default function PlaceFilter({ cityName }: PlaceFilterProps) {
  const { tempFilters, updateTempFilters } = useFilters();

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(tempFilters.placeName || "");
  const [selectedPlace, setSelectedPlace] = useState<SearchFilterOption | null>(
    tempFilters.placeName
      ? { name: tempFilters.placeName, eventCount: 0 }
      : null
  );
  const [places, setPlaces] = useState<SearchFilterOption[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<SearchFilterOption[]>([]);
  const [loading, setLoading] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Charger les lieux depuis l'API ou via HATEOAS si une ville est sélectionnée
  const loadPlaces = useCallback(async () => {
    setLoading(true);
    try {
      if (cityName) {
        // Charger les lieux de la ville courante
        const city = await cityService.getCityByName(cityName);
        if (city && city._links?.places?.href) {
          const cityPlaces = await cityService.getPlacesByCityLink(city._links.places.href);
          const placeOptions: SearchFilterOption[] = cityPlaces.map((place) => ({
            id: place.id.toString(),
            name: place.name,
            eventCount: place.eventsCount,
            _full: place,
          }));
          setPlaces(placeOptions);
          setFilteredPlaces(placeOptions);
        } else {
          setPlaces([]);
          setFilteredPlaces([]);
        }
      } else if (tempFilters.selectedCityObj && tempFilters.selectedCityObj._links?.places?.href) {
        // Charger les lieux de la ville sélectionnée dans les filtres
        const cityPlaces = await cityService.getPlacesByCityLink(tempFilters.selectedCityObj._links.places.href);
        const placeOptions: SearchFilterOption[] = cityPlaces.map((place) => ({
          id: place.id.toString(),
          name: place.name,
          eventCount: place.eventsCount,
          _full: place,
        }));
        setPlaces(placeOptions);
        setFilteredPlaces(placeOptions);
      } else if (tempFilters.selectedCityObj && tempFilters.selectedCityObj.name) {
        // Fallback: filtrer par nom de ville
        const allPlaces = await placeService.getPlaces();
        const cityPlaces = allPlaces.filter(place => 
          place.cityName.toLowerCase() === tempFilters.selectedCityObj.name.toLowerCase()
        );
        const placeOptions: SearchFilterOption[] = cityPlaces.map((place) => ({
          id: place.id.toString(),
          name: place.name,
          eventCount: place.eventsCount,
          _full: place,
        }));
        setPlaces(placeOptions);
        setFilteredPlaces(placeOptions);
      } else {
        // Charger tous les lieux
        const allPlaces = await placeService.getPlaces();
        const placeOptions: SearchFilterOption[] = allPlaces.map((place) => ({
          id: place.id.toString(),
          name: place.name,
          eventCount: place.eventsCount,
          _full: place,
        }));
        setPlaces(placeOptions);
        setFilteredPlaces(placeOptions);
      }
    } catch (error) {
      console.error("❌ PlaceFilter loadPlaces error:", error);
    } finally {
      setLoading(false);
    }
  }, [cityName, tempFilters.selectedCityObj]);

  // Recharger les lieux quand selectedCityObj ou cityName change
  useEffect(() => {
    loadPlaces();
  }, [tempFilters.selectedCityObj, cityName, loadPlaces]);

  // Filtrer les lieux selon le terme de recherche
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPlaces(places);
    } else {
      const filtered = places.filter((place) =>
        place.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPlaces(filtered);
    }
  }, [searchTerm, places]);

  // Synchroniser avec les filtres du contexte
  useEffect(() => {
    if (tempFilters.placeName !== selectedPlace?.name) {
      if (tempFilters.placeName) {
        setSelectedPlace({ name: tempFilters.placeName, eventCount: 0 });
        setSearchTerm(tempFilters.placeName);
      } else {
        setSelectedPlace(null);
        setSearchTerm("");
      }
    }
  }, [tempFilters.placeName, selectedPlace]);

  // Synchroniser l'input avec le contexte quand la place est désélectionnée
  useEffect(() => {
    if (!tempFilters.placeName) {
      setSearchTerm("");
      setSelectedPlace(null);
    }
  }, [tempFilters.placeName]);

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

  const handlePlaceSelect = (place: SearchFilterOption) => {
    setSelectedPlace(place);
    setSearchTerm(place.name);
    setIsOpen(false);

    if (cityName) {
      // Sur la page ville, on ne touche pas au filtre ville
      updateTempFilters({ placeName: place.name, selectedPlaceObj: place._full });
    } else {
      // Comportement normal (hors page ville)
      const cityNameFromPlace = place._full?.cityName;
      if (cityNameFromPlace && tempFilters.cityName !== cityNameFromPlace) {
        updateTempFilters({
          placeName: place.name,
          selectedPlaceObj: place._full,
          cityName: cityNameFromPlace,
          selectedCityObj: undefined
        });
      } else {
        updateTempFilters({ placeName: place.name, selectedPlaceObj: place._full });
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);

    // Si l'input est vidé, supprimer le filtre
    if (e.target.value.trim() === "") {
      setSelectedPlace(null);
      updateTempFilters({ placeName: undefined, selectedPlaceObj: undefined });
    }
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const clearSelection = () => {
    setSelectedPlace(null);
    setSearchTerm("");
    updateTempFilters({ placeName: undefined, selectedPlaceObj: undefined });
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
          placeholder="Rechercher un lieu"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
        />
        <div className="search-icons">
          {selectedPlace && (
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
              <div className="loading">Chargement des lieux...</div>
            ) : filteredPlaces.length > 0 ? (
              filteredPlaces.map((place, index) => (
                <motion.div
                  key={place.id || place.name}
                  className={`search-option ${
                    selectedPlace?.name === place.name ? "selected" : ""
                  }`}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  custom={index}
                  onClick={() => handlePlaceSelect(place)}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>{place.name}</span>
                  <span className="event-count">
                    {place.eventCount} événements
                  </span>
                </motion.div>
              ))
            ) : (
              <div className="no-results">Aucun lieu trouvé</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
