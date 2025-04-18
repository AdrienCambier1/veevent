"use client";
import { NavArrowDown } from "iconoir-react";
import { useState, useEffect, useRef } from "react";
import { Check } from "iconoir-react";

export default function DropdownButton({
  options = [],
  selectedValue = null,
  label = "Trier par :",
  onSelect = () => {},
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

  const selectedOption = options.find(
    (option) => option.value === selectedValue
  );

  const handleSelect = (option) => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className="relative w-fit" ref={dropdownRef}>
      <button
        className="input-btn !text-[var(--light-gray)]"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <span>
          {label}
          <span className="text-[var(--primary-blue)]">
            {" "}
            {selectedOption?.label || ""}
          </span>
        </span>
        <NavArrowDown className="text-[var(--dark-gray)] h-5 w-5 hover:opacity-75 transition" />
      </button>

      <div
        className={`${
          isOpen ? "visible opacity-100" : "invisible opacity-0"
        } dropdown-parent`}
      >
        {options.map((option, index) => (
          <button
            key={index}
            className={`dropdown-child ${
              selectedValue === option.value && "!text-[var(--primary-blue)]"
            }`}
            onClick={() => handleSelect(option)}
          >
            <span>{option.label}</span>
            {selectedValue === option.value && <Check />}
          </button>
        ))}
      </div>
    </div>
  );
}
