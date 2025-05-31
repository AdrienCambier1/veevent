import { NextApiRequest, NextApiResponse } from "next";
import requestIp from "request-ip";
import { City, GeolocationResponse, NearestCitiesResponse } from "../../types";

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

    if (data.status === "success") {
      return data;
    }
    return null;
  } catch (error) {
    console.error("Erreur lors de la géolocalisation IP:", error);
    return null;
  }
}

async function getCitiesFromDatabase(): Promise<City[]> {
  return [
    {
      id: "1",
      name: "Paris",
      latitude: 48.8566,
      longitude: 2.3522,
      country: "France",
      region: "Île-de-France",
    },
    {
      id: "2",
      name: "Boulogne-Billancourt",
      latitude: 48.8356,
      longitude: 2.2395,
      country: "France",
      region: "Île-de-France",
    },
    {
      id: "3",
      name: "Versailles",
      latitude: 48.8014,
      longitude: 2.1301,
      country: "France",
      region: "Île-de-France",
    },
    {
      id: "4",
      name: "Saint-Denis",
      latitude: 48.9362,
      longitude: 2.3574,
      country: "France",
      region: "Île-de-France",
    },
    {
      id: "5",
      name: "Créteil",
      latitude: 48.7909,
      longitude: 2.4553,
      country: "France",
      region: "Île-de-France",
    },
    {
      id: "6",
      name: "Nanterre",
      latitude: 48.8924,
      longitude: 2.2069,
      country: "France",
      region: "Île-de-France",
    },
    {
      id: "7",
      name: "Meaux",
      latitude: 48.9606,
      longitude: 2.8779,
      country: "France",
      region: "Île-de-France",
    },
    {
      id: "8",
      name: "Melun",
      latitude: 48.5394,
      longitude: 2.6594,
      country: "France",
      region: "Île-de-France",
    },
    {
      id: "9",
      name: "Nice",
      latitude: 43.7102,
      longitude: 7.262,
      country: "France",
      region: "Provence-Alpes-Côte d'Azur",
    },
    {
      id: "10",
      name: "Cannes",
      latitude: 43.5528,
      longitude: 7.0174,
      country: "France",
      region: "Provence-Alpes-Côte d'Azur",
    },
    {
      id: "11",
      name: "Antibes",
      latitude: 43.5804,
      longitude: 7.1251,
      country: "France",
      region: "Provence-Alpes-Côte d'Azur",
    },
    {
      id: "12",
      name: "Monaco",
      latitude: 43.7384,
      longitude: 7.4246,
      country: "Monaco",
      region: "Monaco",
    },
    {
      id: "13",
      name: "Marseille",
      latitude: 43.2965,
      longitude: 5.3698,
      country: "France",
      region: "Provence-Alpes-Côte d'Azur",
    },
    {
      id: "14",
      name: "Aix-en-Provence",
      latitude: 43.5297,
      longitude: 5.4474,
      country: "France",
      region: "Provence-Alpes-Côte d'Azur",
    },
    {
      id: "15",
      name: "Toulon",
      latitude: 43.1242,
      longitude: 5.928,
      country: "France",
      region: "Provence-Alpes-Côte d'Azur",
    },
    {
      id: "16",
      name: "Lyon",
      latitude: 45.764,
      longitude: 4.8357,
      country: "France",
      region: "Auvergne-Rhône-Alpes",
    },
    {
      id: "17",
      name: "Villeurbanne",
      latitude: 45.7665,
      longitude: 4.8795,
      country: "France",
      region: "Auvergne-Rhône-Alpes",
    },
    {
      id: "18",
      name: "Toulouse",
      latitude: 43.6047,
      longitude: 1.4442,
      country: "France",
      region: "Occitanie",
    },
    {
      id: "19",
      name: "Bordeaux",
      latitude: 44.8378,
      longitude: -0.5792,
      country: "France",
      region: "Nouvelle-Aquitaine",
    },
    {
      id: "20",
      name: "Nantes",
      latitude: 47.2184,
      longitude: -1.5536,
      country: "France",
      region: "Pays de la Loire",
    },
    {
      id: "21",
      name: "Montpellier",
      latitude: 43.6108,
      longitude: 3.8767,
      country: "France",
      region: "Occitanie",
    },
  ];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<NearestCitiesResponse>
) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      error: "Méthode non autorisée",
    });
  }

  try {
    let clientIp = requestIp.getClientIp(req);
    const testIp = req.query.testIp as string;

    if (process.env.NODE_ENV === "development" && testIp) {
      clientIp = testIp;
    }

    if (
      !clientIp ||
      ((clientIp === "127.0.0.1" || clientIp === "::1") && !testIp)
    ) {
      if (process.env.NODE_ENV === "development") {
        clientIp = "8.8.8.8";
      } else {
        return res.status(200).json({
          success: false,
          error: "Impossible de déterminer la localisation (IP locale)",
        });
      }
    }

    const location = await getLocationFromIP(clientIp);

    if (!location) {
      return res.status(200).json({
        success: false,
        error: "Impossible de géolocaliser l'adresse IP",
      });
    }

    const cities = await getCitiesFromDatabase();

    // Calculer les distances et trouver les 4 villes les plus proches (< 50km)
    const citiesWithDistance = cities.map((city) => ({
      ...city,
      distance: calculateHaversineDistance(
        location.lat,
        location.lon,
        city.latitude,
        city.longitude
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

    return res.status(200).json({
      success: true,
      data: {
        currentCity: nearestCity.name,
        nearbyCities:
          nearbyCities.length > 0
            ? nearbyCities
            : ["Nice", "Cannes", "Marseille", "Lyon"],
        userLocation: {
          latitude: location.lat,
          longitude: location.lon,
        },
      },
    });
  } catch (error) {
    console.error("Erreur dans l'API nearest-city:", error);
    return res.status(500).json({
      success: false,
      error: "Erreur interne du serveur",
    });
  }
}
