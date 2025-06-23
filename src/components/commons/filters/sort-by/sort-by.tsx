import "./sort-by.scss";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavArrowDown } from "iconoir-react";

interface SortOption {
  value: string;
  label: string;
}

const sortOptions: SortOption[] = [
  { value: "date", label: "Date" },
  { value: "name", label: "Nom" },
  { value: "popularity", label: "Popularité" },
  { value: "price", label: "Prix" },
];

export default function SortBy() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(sortOptions[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionSelect = (option: SortOption) => {
    setSelectedOption(option);
    setIsOpen(false);
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
    <div className="sort-by" ref={dropdownRef}>
      <motion.div
        className="sort-by-input"
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.1 }}
      >
        <span className="sort-by-selected">{selectedOption.label}</span>

        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }}
        >
          <NavArrowDown />
        </motion.span>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="sort-by-dropdown"
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {sortOptions.map((option, index) => (
              <motion.div
                key={option.value}
                className={`sort-by-option ${
                  selectedOption.value === option.value ? "selected" : ""
                }`}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                custom={index}
                onClick={() => handleOptionSelect(option)}
                whileHover={{ backgroundColor: "rgba(0, 122, 255, 0.1)" }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="sort-by-option-label">{option.label}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
