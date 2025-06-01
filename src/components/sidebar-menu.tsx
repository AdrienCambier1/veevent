"use client";
import "@/assets/styles/sidebar-menu.scss";
import { Xmark, City, MapPin } from "iconoir-react";
import CityCard from "@/components/cards/city-card";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSidebar } from "@/contexts/SidebarContext";

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
  const { isOpen, closeSidebar } = useSidebar();

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

  // Animations iOS-style
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const sidebarVariants = {
    hidden: {
      x: "100%",
      transition: {
        type: "spring",
        damping: 30,
        stiffness: 300,
      },
    },
    visible: {
      x: "0%",
      transition: {
        type: "spring",
        damping: 30,
        stiffness: 300,
      },
    },
  };

  const containerVariants = {
    hidden: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
    visible: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      x: 20,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 400,
      },
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 400,
      },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="sidebar-overlay"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={closeSidebar}
            transition={{ duration: 0.3 }}
          />
          <motion.div
            className="sidebar"
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.div
              className="sidebar-header"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <button className="close-button" onClick={closeSidebar}>
                <Xmark strokeWidth={2} />
              </button>
              <div className="city-selector">
                <City strokeWidth={2} />
                <span>{currentCity}</span>
              </div>
            </motion.div>

            <motion.ul
              className="sidebar-list"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <motion.p className="sidebar-list-title" variants={itemVariants}>
                Explorer par ville
              </motion.p>

              {cities.map((city, index) => (
                <motion.div key={city} variants={itemVariants} custom={index}>
                  <CityCard city={city} isCard={false} />
                </motion.div>
              ))}

              <motion.button className="primary-btn" variants={itemVariants}>
                <span className="flex gap-2">
                  <City strokeWidth={2} />
                  Toutes les villes
                </span>
              </motion.button>
            </motion.ul>

            <motion.div
              className="sidebar-footer"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <button className="geo-button">
                <MapPin />
                Activer la géolocalisation
              </button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
