export interface CityWithCoordinates {
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
    nearbyCities: string[];
    userLocation: {
      latitude: number;
      longitude: number;
    };
    locationType?: "GPS" | "IP";
  };
  error?: string;
}

// Interface existante Place (pour usage local/UI)
export interface PlaceWithLocation {
  id: string;
  name: string;
  address: string;
  location: Location;
  category: string;
  eventsCount: number;
  imageUrl: string;
}

export interface SearchFilterOption {
  name: string;
  eventCount: number;
  id?: string | number;
  _full?: any;
}

export type EventStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export interface EventLink {
  href: string;
  templated?: boolean;
}

// === INTERFACES POUR LES ÉVÉNEMENTS ===

// Interface de base pour un événement (propriétés communes)
export interface BaseEvent {
  date: string;
  description: string;
  name: string;
  address: string;
  maxCustomers: number;
  isTrending?: boolean;
  price: number;
  status?: EventStatus;
  categories: BaseCategory[];
  organizer?: SingleUser;
  currentParticipants: number;
  isInvitationOnly?: boolean;
}

// Événement dans la liste (sans id direct, sans currentParticipants)
export interface Event extends BaseEvent {
  id?: number;
  organizer?: SingleUser;
  _links: {
    self: EventLink;
  };
}

// Événement détaillé (avec id et currentParticipants)
export interface SingleEvent extends BaseEvent {
  id: number;
  contentHtml: string;
  _links?: {
    self: EventLink;
    events: EventLink;
    places: EventLink;
    invitations: EventLink;
    city: EventLink;
    organizer: EventLink;
    categories: EventLink[];
    participants: EventLink;
  };
}

export interface EventsEmbedded {
  eventSummaryResponses: Event[];
}

export interface EventsResponse extends PaginatedResponse<EventsEmbedded> {}

export interface EventFilters {
  minPrice?: number;
  maxPrice?: number;
  startDate?: string;
  endDate?: string;
  categories?: string[]; // Changé pour utiliser les clés des catégories
  sortBy?: "date" | "price" | "popularity";
  sortOrder?: "asc" | "desc";
  cityName?: string;
  placeName?: string;
  page?: number;
  size?: number;
}

// Interface pour la pagination
export interface PaginationInfo {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}

export interface PaginatedResponse<T> {
  _embedded: T;
  _links: {
    first: EventLink;
    self: EventLink;
    next?: EventLink;
    last: EventLink;
  };
  page: PaginationInfo;
}

// === INTERFACES POUR LES VILLES ===

// Interface pour la localisation
export interface Location {
  latitude: number | null;
  longitude: number | null;
}

// Interface de base pour une ville (propriétés communes API)
export interface BaseCity {
  name: string;
  postalCode: string;
  region: string;
  country: string;
  bannerUrl?: string | null;
  imageUrl?: string | null;
  content?: string | null;
}

// Ville dans la liste API (avec id et propriétés supplémentaires)
export interface City extends BaseCity {
  id: number;
  location: Location;
  eventsCount: number;
  eventsPastCount: number;
  nearestCities: string[];
  _links: {
    self: EventLink;
  };
}

// Ville détaillée (structure similaire mais potentiellement avec plus de liens)
export interface SingleCity extends BaseCity {
  id: number;
  location: Location;
  eventsCount: number;
  eventsPastCount: number;
  nearestCities: number[];
  _links: {
    self: EventLink;
    cities?: EventLink;
    places?: EventLink;
    events?: EventLink;
    organizers?: EventLink;
  };
}

export interface CitiesEmbedded {
  cityResponses: SingleCity[];
}

export interface CitiesResponse {
  _embedded: CitiesEmbedded;
  _links: {
    self: EventLink;
  };
}

// Interface pour l'objet City final unifié (sans métadonnées HATEOAS)
export interface CityData extends BaseCity {
  id: string | number;
  location?: Location;
  eventsCount?: number;
  eventsPastCount?: number;
  nearestCities?: string[];
}

// === INTERFACES POUR LES LIEUX ===

// Interface de base pour un lieu (propriétés communes API)
export interface BasePlace {
  name: string;
  address: string;
  type: string;
  location: Location;
  eventsCount: number;
  eventsPastCount: number;
  cityName: string;
  bannerUrl?: string | null;
  imageUrl: string;
  content?: string | null;
  description: string;
  slug: string;
}

// Lieu dans la liste API (avec id)
export interface Place extends BasePlace {
  id: number;
  _links: {
    self: EventLink;
    places: EventLink;
    city: EventLink;
    events: EventLink;
    organizers?: EventLink;
  };
}

// Lieu détaillé (même structure que Place pour cette API)
export interface SinglePlace extends BasePlace {
  id: number;
  _links: {
    self: EventLink;
    places: EventLink;
    city: EventLink;
    events: EventLink;
    organizers?: EventLink;
  };
}

export interface PlacesEmbedded {
  placeResponses: Place[]; // Changé de "places" à "placeResponses"
}

export interface PlacesResponse extends PaginatedResponse<PlacesEmbedded> {}

// Interface pour l'objet Place final unifié (sans métadonnées HATEOAS)
export interface PlaceData extends BasePlace {
  id: string | number;
}

// === INTERFACES POUR LES CATÉGORIES ===

// Interface de base pour une catégorie (propriétés communes API)
export interface BaseCategory {
  name: string;
  description?: string;
  trending?: boolean;
  key: string;
}

// Catégorie dans la liste API (sans id direct)
export interface Category extends BaseCategory {
  _links: {
    self: EventLink;
  };
}

export interface CategoriesEmbedded {
  categories: Category[];
}

export interface CategoriesResponse {
  _embedded: CategoriesEmbedded;
  _links: {
    self: EventLink;
  };
}

// Interface pour l'objet Category final unifié (sans métadonnées HATEOAS)
export interface CategoryData extends BaseCategory {
  id: string | number;
}

// === INTERFACES POUR LES UTILISATEURS ===

export type UserRole = "User" | "Admin" | "AuthService" | "Organizer" | "Banned";

// Interface de base pour un utilisateur (propriétés communes API)
export interface BaseUser {
  firstName?: string | null;
  lastName?: string | null;
  pseudo?: string | null;
  email?: string | null;
  phone?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  bannerUrl?: string | null;
  note?: number | null;
  role?: UserRole;
}

// Utilisateur détaillé (avec id et champs supplémentaires)
export interface SingleUser extends BaseUser {
  id: number;
  eventPastCount: number;
  eventsCount: number;
  socials?: string[]; // Tableau au lieu de string
  categories?: string[]; // Tableau des catégories
  organizer?: boolean; // Nommé différemment de isOrganizer
  _links?: {
    self: EventLink;
    users?: EventLink;
    events?: EventLink;
    categories?: EventLink;
    invitations?: EventLink;
  };
}

export interface UsersEmbedded {
  userResponses: SingleUser[]; // Changé pour correspondre à la réponse API
}

export interface UsersResponse {
  _embedded: UsersEmbedded;
  _links: {
    self: EventLink;
    places: EventLink;
    events: EventLink;
    Invitations: EventLink;
    Categories: EventLink;
  };
}

export interface OrganizersResponse extends PaginatedResponse<UsersEmbedded> {}

// Interface pour l'objet User final unifié (sans métadonnées HATEOAS)
export interface UserData extends BaseUser {
  id: number;
  isOrganizer?: boolean; // Optionnel car différent selon la source
  organizer?: boolean; // Optionnel car différent selon la source
  role?: UserRole; // Optionnel car pas dans SingleUser
  eventPastCount?: number; // Optionnel car pas dans la liste
  eventsCount?: number; // Optionnel car pas dans la liste
  socials?: string | string[]; // Peut être string ou tableau
  categories?: CategoryData[]; // Optionnel car pas dans la liste
}

// Interface pour l'utilisateur authentifié avec liens HATEOAS
export interface AuthenticatedUser extends UserData {
  _links?: {
    self: EventLink;
    users?: EventLink;
    events?: EventLink;
    categories?: EventLink;
    orders?: EventLink;
    invitations?: EventLink;
  };
}

// === INTERFACES POUR LES COMMANDES ET TICKETS ===

// Interface pour un ticket
export interface Ticket {
  id: number;
  name: string;
  lastName: string;
  description: string;
  unitPrice: number;
  _links?: {
    self: EventLink;
  };
}

// Interface pour une commande
export interface Order {
  id: number;
  totalPrice: number;
  ticketToBeCreated: number;
  tickets: Ticket[];
  _links: {
    self: EventLink;
    user: EventLink;
    events: EventLink;
    tickets: EventLink;
  };
}

// Interface pour la réponse des commandes
export interface OrdersEmbedded {
  orderResponses: Order[];
}

export interface OrdersResponse {
  _embedded: OrdersEmbedded;
  _links: {
    self: EventLink;
    orders: EventLink;
  };
}
