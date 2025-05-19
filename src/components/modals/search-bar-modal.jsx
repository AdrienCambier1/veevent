"use client";
import { useState, useRef, useEffect } from "react";
import { Check, NavArrowRight, Search } from "iconoir-react";
import { useRouter } from "next/navigation";
import ModalBg from "./modal-bg";
import ReactFocusLock from "react-focus-lock";

export default function SearchBarModal({ isOpen, setIsOpen }) {
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("events");
  const [searchDropdown, setSearchDropdown] = useState(false);
  const router = useRouter();
  const searchDropdownRef = useRef(null);
  const inputRef = useRef(null);
  const modalRef = useRef(null);

  const searchTypes = [
    { label: "Evenements", value: "events" },
    { label: "Organisateurs", value: "organisers" },
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && isOpen && searchTerm.trim()) {
        e.preventDefault();
        handleSearch(e);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, searchTerm, searchType]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchDropdownRef.current &&
        !searchDropdownRef.current.contains(event.target)
      ) {
        setSearchDropdown(false);
      }
    };

    if (searchDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchDropdown]);

  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchTerm.trim()) return;

    if (searchType === "events") {
      router.push(
        `/activities/events?search=${encodeURIComponent(searchTerm)}`
      );
    } else {
      router.push(
        `/activities/organisers?search=${encodeURIComponent(searchTerm)}`
      );
    }

    setIsOpen();
  };

  const handleTypeChange = (type) => {
    setSearchType(type);
    setSearchDropdown(false);
  };

  const selectedSearchType = searchTypes.find(
    (type) => type.value === searchType
  );

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <ReactFocusLock
        ref={modalRef}
        className={`${
          isOpen ? "visible" : "invisible"
        } modal-container !p-6 !items-start`}
      >
        <div
          className={`${
            isOpen ? "opacity-100" : "opacity-0"
          } search-bar-btn pointer-events-auto`}
        >
          <Search />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              searchType === "events"
                ? "Rechercher un événement"
                : "Rechercher un organisateur"
            }
            className="invisible-input truncate"
            autoComplete="off"
          />
          <div className="flex items-center gap-3">
            <p className="hidden md:block border border-[var(--secondary-border-col)] px-2 rounded-md">
              Entrer
            </p>
            <div className="relative" ref={searchDropdownRef}>
              <button
                className="secondary-btn"
                type="button"
                onClick={() => setSearchDropdown(!searchDropdown)}
              >
                <span>
                  <span>{selectedSearchType?.label || ""}</span>
                </span>
                <NavArrowRight />
              </button>
              <div
                className={`${
                  searchDropdown ? "visible opacity-100" : "invisible opacity-0"
                } !w-fit right-0 dropdown-parent`}
              >
                {searchTypes.map((type, index) => (
                  <button
                    type="button"
                    onClick={() => handleTypeChange(type.value)}
                    key={index}
                    className={`${
                      searchType === type.value && "!text-[var(--primary-blue)]"
                    } dropdown-child`}
                  >
                    <span>{type.label}</span>
                    {searchType === type.value && <Check />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ReactFocusLock>
      <ModalBg isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}
