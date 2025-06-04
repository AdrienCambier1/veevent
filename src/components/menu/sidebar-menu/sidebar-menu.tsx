"use client";
import "./sidebar-menu.scss";
import { Xmark, City, MapPin } from "iconoir-react";
import CityCard from "@/components/cards/city-card/city-card";
import { motion, AnimatePresence } from "framer-motion";
import { useSidebar } from "@/contexts/sidebar-context";
import { useCity } from "@/contexts/city-context";
import Link from "next/link";

export default function SidebarMenu() {
  const { isOpen, closeSidebar } = useSidebar();
  const { currentCity, nearbyCities, geoLoading, changeCity } = useCity();

  const handleCitySelect = (cityName: string) => {
    // Convertir le nom de ville en objet City
    const cityObject = {
      name: cityName,
      value: cityName.toLowerCase().replace(/\s+/g, "-"),
    };
    changeCity(cityObject);
    closeSidebar();
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
                <span>{geoLoading ? "Localisation..." : currentCity}</span>
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
                {nearbyCities.length > 0
                  ? "Villes à proximité"
                  : "Explorer par ville"}
              </motion.p>

              {nearbyCities.map((city, index) => (
                <motion.div
                  key={city}
                  variants={itemVariants}
                  custom={index}
                  onClick={() => handleCitySelect(city)}
                  style={{ cursor: "pointer" }}
                >
                  <CityCard city={city} isCard={false} />
                </motion.div>
              ))}

              <motion.div variants={itemVariants}>
                <Link
                  href="/cities"
                  className="primary-btn"
                  onClick={closeSidebar}
                >
                  <City className="!text-white" />
                  <span>Toutes les villes</span>
                </Link>
              </motion.div>
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
                {geoLoading
                  ? "Localisation en cours..."
                  : "Actualiser la géolocalisation"}
              </button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
