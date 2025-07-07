"use client";
import img from "@/assets/images/nice.jpg";
import TextImageCard from "@/components/cards/text-image-card/text-image-card";
import { useCity } from "@/contexts/city-context";
import { useSidebar } from "@/contexts/sidebar-context";
import { useCities } from "@/hooks/cities/use-cities";
import { AnimatePresence, motion } from "framer-motion";
import { City, MapPin, Xmark } from "iconoir-react";
import Link from "next/link";
import "./sidebar-menu.scss";

export default function SidebarMenu() {
  const { isOpen, closeSidebar } = useSidebar();

  const {
    currentCity,
    nearbyCities,
    geoLoading,
    geoError, // ✅ Récupérer l'erreur
    clearGeoError, // ✅ Fonction de reset
    locationType,
    requestPreciseLocation,
    disablePreciseLocation,
    canUsePreciseLocation,
    isGpsEnabled,
  } = useCity();

  // Hook pour récupérer les villes populaires par défaut
  const { cities: popularCities, loading: popularLoading } = useCities(
    "popular",
    { limit: 4 }
  );

  // Logique simplifiée avec gestion de la transition
  const hasNearbyCities = nearbyCities.length > 0;
  const hasPopularCities = popularCities.length > 0;

  // Utiliser les villes proches si disponibles, sinon les populaires
  const citiesToDisplay = hasNearbyCities ? nearbyCities : popularCities;

  // Afficher skeleton si :
  // - Géolocalisation en cours
  // - Pas de villes proches ET chargement des populaires en cours
  // - Aucune ville à afficher (transition)
  const isLoadingCities =
    geoLoading ||
    (!hasNearbyCities && popularLoading) ||
    citiesToDisplay.length === 0;

  // Titre dynamique
  const sectionTitle = hasNearbyCities
    ? "Villes à proximité"
    : "Villes populaires";

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

  const handleGpsToggle = async () => {
    if (geoLoading) return;

    if (isGpsEnabled) {
      await disablePreciseLocation();
    } else {
      await requestPreciseLocation();
    }
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
                <div className="city-info">
                  <span>
                    {isLoadingCities ? "Localisation..." : currentCity}
                  </span>
                </div>
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
                {sectionTitle}
              </motion.p>

              {isLoadingCities
                ? // Skeleton loading pour les villes
                  Array.from({ length: 4 }, (_, index) => (
                    <motion.div
                      key={`skeleton-${index}`}
                      variants={itemVariants}
                      custom={index}
                      className="flex items-center gap-3 p-3 rounded-lg mb-2"
                    >
                      <div className="skeleton-bg w-12 h-12 rounded-lg flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="skeleton-bg h-4 w-20 mb-1"></div>
                        <div className="skeleton-bg h-3 w-16 opacity-70"></div>
                      </div>
                      <div className="skeleton-bg w-4 h-4 rounded"></div>
                    </motion.div>
                  ))
                : citiesToDisplay.map((city, index) => (
                    <motion.div
                      key={city.id}
                      variants={itemVariants}
                      custom={index}
                      style={{ cursor: "pointer" }}
                    >
                      <TextImageCard
                        title={city.name}
                        href={`/villes/${city.name.toLowerCase()}`}
                        isCard={false}
                        image={city.imageUrl || img}
                        onClick={closeSidebar}
                      />
                    </motion.div>
                  ))}

              <motion.div variants={itemVariants}>
                <Link
                  href="/villes"
                  className="primary-btn"
                  onClick={closeSidebar}
                >
                  <City className="!text-white" />
                  <span>Toutes les villes</span>
                </Link>
              </motion.div>
            </motion.ul>

            <motion.div className="sidebar-footer" variants={itemVariants}>
              {geoError && (
                <motion.div variants={itemVariants}>
                  <div className="text-red-500 flex gap-1 text-xs">
                    <span>{geoError}</span>
                    <button onClick={clearGeoError} className="error-dismiss">
                      ✕
                    </button>
                  </div>
                </motion.div>
              )}

              {canUsePreciseLocation && (
                <div className="geo-section">
                  {isGpsEnabled ? (
                    <div className="gps-active">
                      <div className="gps-status">
                        <MapPin className="gps-icon active" />
                        <span className="gps-text">
                          Géolocalisation précise activée
                        </span>
                      </div>
                      <button
                        className="geo-button disable"
                        onClick={handleGpsToggle}
                        disabled={geoLoading}
                      >
                        {geoLoading
                          ? "Désactivation..."
                          : "Désactiver la géolocalisation"}
                      </button>
                      <p className="geo-info">
                        Vos coordonnées GPS sont utilisées pour une localisation
                        précise
                      </p>
                    </div>
                  ) : (
                    <div className="gps-inactive">
                      <button
                        className="geo-button enable"
                        onClick={handleGpsToggle}
                        disabled={geoLoading}
                      >
                        <MapPin />
                        {geoLoading
                          ? "Activation..."
                          : "Utiliser la géolocalisation précise"}
                      </button>
                      <p className="geo-info">
                        Autorisez la géolocalisation pour une localisation plus
                        précise
                      </p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
