export interface City {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  region?: string;
}

export interface GeolocationResponse {
  status: string;
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: string;
  isp: string;
  org: string;
  as: string;
  query: string;
}

export interface NearestCitiesResponse {
  success: boolean;
  data?: {
    currentCity: string;
    nearbyCities: string[]; // Simplement les noms des villes
    userLocation: {
      latitude: number;
      longitude: number;
    };
  };
  error?: string;
}
