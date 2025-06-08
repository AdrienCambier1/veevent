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

export interface Place {
  id: string;
  name: string;
  address: string;
  location: location;
  category: string;
  eventsCount: number;
  imageUrl: string;
}

interface location {
  lat: number;
  lng: number;
}

export interface SearchFilterOption {
  name: string;
  eventCount: number;
  id?: string | number;
}
