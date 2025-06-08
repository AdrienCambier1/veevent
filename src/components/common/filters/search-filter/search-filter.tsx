import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "iconoir-react";
import "./search-filter.scss";
import { SearchFilterOption } from "@/types";

interface SearchFilterProps {
  options: SearchFilterOption[];
  placeholder?: string;
  onSelectionChange?: (selectedOption: SearchFilterOption | null) => void;
  countLabel?: string;
  noResultsText?: string;
  className?: string;
}

export default function SearchFilter({
  options,
  placeholder = "Rechercher...",
  onSelectionChange,
  countLabel = "événements",
  noResultsText = "Aucun résultat trouvé",
  className = "",
}: SearchFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOption, setSelectedOption] =
    useState<SearchFilterOption | null>(null);
  const [filteredOptions, setFilteredOptions] =
    useState<SearchFilterOption[]>(options);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredOptions(options);
    } else {
      const filtered = options.filter((option) =>
        option.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
  }, [searchTerm, options]);

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

  const handleOptionSelect = (option: SearchFilterOption) => {
    setSelectedOption(option);
    setSearchTerm(option.name);
    setIsOpen(false);
    onSelectionChange?.(option);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const dropdownVariants = {
    hidden: {
      opasearch: 0,
      scale: 0.95,
      y: -10,
      transition: {
        duration: 0.2,
        ease: [0.4, 0.0, 0.2, 1],
      },
    },
    visible: {
      opasearch: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.4, 0.0, 0.2, 1],
      },
    },
  };

  const itemVariants = {
    hidden: { opasearch: 0, x: -20 },
    visible: (i: number) => ({
      opasearch: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.2,
        ease: [0.4, 0.0, 0.2, 1],
      },
    }),
  };

  return (
    <div className={`search-filter ${className}`} ref={filterRef}>
      <div className="search-search-input" onClick={() => setIsOpen(true)}>
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
        />
        <span className="search-icon">
          <Search />
        </span>
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
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <motion.div
                  key={option.id || option.name}
                  className={`search-option ${
                    selectedOption?.name === option.name ? "selected" : ""
                  }`}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  custom={index}
                  onClick={() => handleOptionSelect(option)}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>{option.name}</span>
                  <span className="event-count">
                    {option.eventCount} {countLabel}
                  </span>
                </motion.div>
              ))
            ) : (
              <div className="no-results">{noResultsText}</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
