"use client";
import { NavArrowDown } from "iconoir-react";
import { useState, useEffect, useRef } from "react";
import { Check } from "iconoir-react";
import ThemeTags from "../theme-tags";

export default function MultiDropdownButton({
  options = [],
  selectedValues = [],
  label = "Filtrer par :",
  onSelect = () => {},
  onRemove = () => {},
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedOptions = options.filter((option) =>
    selectedValues.includes(option.value)
  );

  const handleSelect = (option) => {
    if (selectedValues.includes(option.value)) {
      onRemove(option.value);
    } else {
      onSelect(option);
    }
  };

  const selectedThemes = selectedOptions.map((opt) => ({
    name: opt.label,
    value: opt.value,
  }));

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        className="input-btn !text-[var(--light-gray)] flex flex-col"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <div className="flex justify-between items-center w-full">
          <span>{label}</span>
          <NavArrowDown className="text-[var(--dark-gray)] h-5 w-5 hover:opacity-75 transition ml-auto flex-shrink-0" />
        </div>
        {selectedOptions.length > 0 && <ThemeTags theme={selectedThemes} />}
      </button>

      <div
        className={`${
          isOpen ? "visible opacity-100" : "invisible opacity-0"
        } dropdown-parent`}
      >
        {options.map((option, index) => (
          <button
            type="button"
            key={index}
            className={`dropdown-child ${
              selectedValues.includes(option.value) &&
              "!text-[var(--primary-green)]"
            } hover:!bg-[rgba(var(--primary-green-rgb),0.1)]`}
            onClick={() => handleSelect(option)}
          >
            <span>{option.label}</span>
            {selectedValues.includes(option.value) && <Check />}
          </button>
        ))}
      </div>
    </div>
  );
}
