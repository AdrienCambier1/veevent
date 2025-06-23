import { City, SingleCity } from "@/types";

export const mockCities: SingleCity[] = [
  {
    id: 1,
    name: "Nice",
    postalCode: "06000",
    region: "Provence Alpes Côte d'azur",
    country: "France",
    location: { latitude: 43.7102, longitude: 7.262 },
    eventsCount: 24,
    eventsPastCount: 15,
    bannerUrl: null,
    imageUrl: null,
    content: null,
    nearestCities: [2, 3, 4],
    _links: {
      self: { href: "/cities/1" },
    },
  },
  {
    id: 2,
    name: "Cannes",
    postalCode: "06400",
    region: "Provence Alpes Côte d'azur",
    country: "France",
    location: { latitude: 43.5528, longitude: 7.0174 },
    eventsCount: 12,
    eventsPastCount: 8,
    bannerUrl: null,
    imageUrl: null,
    content: null,
    nearestCities: [1, 3, 4],
    _links: {
      self: { href: "/cities/2" },
    },
  },
];
