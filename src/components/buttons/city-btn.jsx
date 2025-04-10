import { useState, useEffect, useRef } from "react";
import { NavArrowRight, Check } from "iconoir-react";
import Link from "next/link";
import { useCity } from "@/contexts/city-context";

export default function CityBtn({ reverse, onClick }) {
  const [cityDropdown, setCityDropdown] = useState(false);
  const cityDropdownRef = useRef(null);
  const { selectedCity, changeCity, cities } = useCity();

  const displayCities = cities.slice(0, 4);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        cityDropdownRef.current &&
        !cityDropdownRef.current.contains(event.target)
      ) {
        setCityDropdown(false);
      }
    };

    if (cityDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [cityDropdown]);

  const handleCityChange = (city) => {
    changeCity(city);
    setCityDropdown(false);
  };

  const handleClose = () => {
    setCityDropdown(false);
    onClick && onClick();
  };

  return (
    <div className="relative" ref={cityDropdownRef}>
      <button
        className="primary-btn"
        onClick={() => setCityDropdown(!cityDropdown)}
      >
        <span>{selectedCity.name}</span>
        <NavArrowRight />
      </button>
      <div
        className={`
          ${cityDropdown ? "visible opacity-100" : "invisible opacity-0"}
           !w-fit right-0
          ${reverse ? "dropdown-parent-reverse" : "dropdown-parent"}
        `}
      >
        {displayCities.map((city, index) => (
          <button
            key={index}
            className={`dropdown-child ${
              selectedCity.value === city.value && "!text-[var(--primary-blue)]"
            }`}
            onClick={() => handleCityChange(city)}
          >
            <span>{city.name}</span>
            {selectedCity.value === city.value && <Check />}
          </button>
        ))}
        <Link
          href="/cities"
          className="secondary-btn ml-3"
          onClick={handleClose}
        >
          <span>Afficher plus</span>
          <NavArrowRight />
        </Link>
      </div>
    </div>
  );
}
