import { NextApiRequest, NextApiResponse } from "next";
import requestIp from "request-ip";
import { cityService } from "@/services/cityService";
import {
  City,
  GeolocationResponse,
  NearestCitiesResponse,
  SingleCity,
} from "@/types";

// Fonction pour calculer la distance avec la formule de Haversine
function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Rayon de la Terre en kilomètres
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Fonction pour récupérer la géolocalisation depuis l'IP
async function getLocationFromIP(
  ip: string
): Promise<GeolocationResponse | null> {
  try {
    const response = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query`
    );
    const data: GeolocationResponse = await response.json();

    console.log("🌐 Réponse de l'API de géolocalisation IP:", data);

    if (data.status === "success") {
      return data;
    }
    return null;
  } catch (error) {
    console.error("Erreur lors de la géolocalisation IP:", error);
    return null;
  }
}

// Fonction pour récupérer les villes depuis l'API via cityService
async function getCitiesFromAPI(): Promise<SingleCity[]> {
  try {
    const cities = await cityService.getCities();
    console.log("Villes récupérées depuis l'API:", cities.length);

    return cities.filter(
      (city) => city.location.latitude && city.location.longitude
    );
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des villes depuis l'API:",
      error
    );
    return [];
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<NearestCitiesResponse>
) {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Méthode non autorisée",
    });
  }

  try {
    let userLocation: { lat: number; lon: number; source: "IP" | "GPS" };

    // Si c'est une requête POST avec coordonnées GPS
    if (req.method === "POST" && req.body.latitude && req.body.longitude) {
      console.log("📍 Utilisation des coordonnées GPS précises");
      userLocation = {
        lat: req.body.latitude,
        lon: req.body.longitude,
        source: "GPS",
      };
    } else {
      // Fallback vers géolocalisation IP
      console.log("🌐 Utilisation de la géolocalisation IP");

      let clientIp = requestIp.getClientIp(req);
      const testIp = req.query.testIp as string;

      // Gestion IP de développement
      if (process.env.NODE_ENV === "development" && testIp) {
        clientIp = testIp;
      }

      if (
        !clientIp ||
        ((clientIp === "127.0.0.1" || clientIp === "::1") && !testIp)
      ) {
        if (process.env.NODE_ENV === "development") {
          clientIp = "8.8.8.8"; // IP de test pour le développement
        } else {
          return res.status(200).json({
            success: false,
            error: "Impossible de déterminer la localisation (IP locale)",
          });
        }
      }

      console.log("🌍 Géolocalisation pour IP:", clientIp);

      // Récupérer la géolocalisation IP
      const location = await getLocationFromIP(clientIp);

      if (!location) {
        return res.status(200).json({
          success: false,
          error: "Impossible de géolocaliser l'adresse IP",
        });
      }

      userLocation = {
        lat: location.lat,
        lon: location.lon,
        source: "IP",
      };
    }

    console.log(
      `📍 Localisation ${userLocation.source}:`,
      userLocation.lat,
      userLocation.lon
    );

    // Récupérer les villes depuis l'API
    const cities = await getCitiesFromAPI();

    if (cities.length === 0) {
      return res.status(200).json({
        success: false,
        error: "Aucune ville disponible",
      });
    }

    // Calculer les distances et trouver les villes proches
    const citiesWithDistance = cities.map((city) => ({
      ...city,
      distance: calculateHaversineDistance(
        userLocation.lat,
        userLocation.lon,
        city.location.latitude || 0,
        city.location.longitude || 0
      ),
    }));

    // Trouver la ville la plus proche pour currentCity
    const nearestCity = citiesWithDistance.sort(
      (a, b) => a.distance - b.distance
    )[0];

    // Filtrer les villes à moins de 50km, trier et prendre les 4 premières
    const nearbyCities = citiesWithDistance
      .filter((city) => city.distance <= 50)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 4)
      .map((city) => city.name);

    // Fallback si aucune ville proche trouvée
    const fallbackCities = ["Nice", "Cannes", "Marseille", "Lyon"];

    console.log(
      "🏙️ Ville la plus proche:",
      nearestCity.name,
      "(" + Math.round(nearestCity.distance) + "km)"
    );
    console.log("🎯 Villes proches:", nearbyCities);

    return res.status(200).json({
      success: true,
      data: {
        currentCity: nearestCity.name,
        nearbyCities: nearbyCities.length > 0 ? nearbyCities : fallbackCities,
        userLocation: {
          latitude: userLocation.lat,
          longitude: userLocation.lon,
        },
        locationType: userLocation.source,
      },
    });
  } catch (error) {
    console.error("❌ Erreur dans l'API nearest-city:", error);
    return res.status(500).json({
      success: false,
      error: "Erreur interne du serveur",
    });
  }
}
