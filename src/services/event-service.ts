import {
  EventsResponse,
  Event,
  EventFilters,
  SingleEvent,
  BaseCategory,
  SingleUser,
  EventStatus,
  PaginatedResponse,
  EventsEmbedded,
} from "@/types";
import mockEvents from "@/services/data/events";
import { mockOrganizers } from "@/services/data/organizers";

const apiUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8090/api/v1";
const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

// Fonction utilitaire pour formater la date
const formatEventDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return date.toLocaleDateString("fr-FR", options);
};

// Fonction pour récupérer l'organisateur complet à partir du pseudo
const getOrganizerByPseudo = (pseudo: string) => {
  return mockOrganizers.find((organizer) => organizer.pseudo === pseudo);
};

// Fonction pour mapper les données mock vers le format Event
const mapMockEventToEvent = (mockEvent: any): Event => {
  const fullOrganizer = getOrganizerByPseudo(mockEvent.organizer.pseudo);

  if (!fullOrganizer) {
    return {
      id: mockEvent.id,
      date: formatEventDate(mockEvent.date),
      description: mockEvent.description,
      name: mockEvent.name,
      address: mockEvent.address,
      maxCustomers: mockEvent.maxCustomers,
      isTrending: mockEvent.isTrending,
      price: mockEvent.price,
      status: mockEvent.status,
      imageUrl: mockEvent.imageUrl,
      categories: mockEvent.categories,
      organizer: undefined,
      currentParticipants: mockEvent.currentParticipants,
      _links: mockEvent._links,
    };
  }

  const mappedOrganizer: SingleUser = {
    id: fullOrganizer.id,
    firstName: fullOrganizer.firstName,
    lastName: fullOrganizer.lastName,
    pseudo: fullOrganizer.pseudo,
    email: fullOrganizer.email,
    phone: fullOrganizer.phone,
    description: fullOrganizer.description,
    imageUrl: fullOrganizer.imageUrl,
    bannerUrl: fullOrganizer.bannerUrl,
    note: fullOrganizer.note,
    eventPastCount: fullOrganizer.eventPastCount,
    eventsCount: fullOrganizer.eventsCount,
    organizer: true,
    socials: fullOrganizer.socials,
    categories: fullOrganizer.categories,
    _links: {
      self: fullOrganizer._links?.self || {
        href: `/users/${fullOrganizer.pseudo}`,
      },
      users: { href: "/users" },
      events: fullOrganizer._links?.events || {
        href: `/users/${fullOrganizer.pseudo}/events`,
      },
      categories: { href: "/categories" },
      invitations: { href: `/users/${fullOrganizer.pseudo}/invitations` },
    },
  };

  return {
    id: mockEvent.id,
    date: formatEventDate(mockEvent.date),
    description: mockEvent.description,
    name: mockEvent.name,
    address: mockEvent.address,
    maxCustomers: mockEvent.maxCustomers,
    isTrending: mockEvent.isTrending,
    price: mockEvent.price,
    status: mockEvent.status,
    imageUrl: mockEvent.imageUrl,
    categories: mockEvent.categories,
    organizer: mappedOrganizer,
    currentParticipants: mockEvent.currentParticipants,
    _links: mockEvent._links,
  };
};

// Type pour une invitation
export interface Invitation {
  description: string;
  status: "SENT" | "ACCEPTED" | "REFUSED";
  _links: {
    self: { href: string };
    invitations: { href: string };
    event: { href: string };
  };
}

// --- FAVORIS LOCALSTORAGE ---
const FAVORITE_EVENTS_KEY = "vv-fav-events";

function getFavoriteEventIds(): number[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(FAVORITE_EVENTS_KEY) || "[]");
  } catch {
    return [];
  }
}

function setFavoriteEventIds(ids: number[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(FAVORITE_EVENTS_KEY, JSON.stringify(ids));
}

export const eventService = {
  async getEvents(
    filters?: EventFilters
  ): Promise<PaginatedResponse<EventsEmbedded>> {
    try {
      // Si on utilise les données fictives
      if (useMockData) {
        // Ajout du log pour vérifier le contenu de mockEvents
        console.log(
          "[eventService.getEvents] mockEvents count:",
          mockEvents.length
        );
        let filteredEvents = [...mockEvents];

        // Appliquer les filtres si nécessaire
        if (filters) {
          if (filters.minPrice !== undefined) {
            filteredEvents = filteredEvents.filter(
              (event) => event.price >= filters.minPrice!
            );
          }
          if (filters.maxPrice !== undefined) {
            filteredEvents = filteredEvents.filter(
              (event) => event.price <= filters.maxPrice!
            );
          }
          if (filters.startDate) {
            filteredEvents = filteredEvents.filter(
              (event) => new Date(event.date) >= new Date(filters.startDate!)
            );
          }
          if (filters.endDate) {
            filteredEvents = filteredEvents.filter(
              (event) => new Date(event.date) <= new Date(filters.endDate!)
            );
          }
          if (filters.cityName) {
            filteredEvents = filteredEvents.filter((event) =>
              event.address
                .toLowerCase()
                .includes(filters.cityName!.toLowerCase())
            );
          }
          if (filters.placeName) {
            filteredEvents = filteredEvents.filter((event) =>
              event.address
                .toLowerCase()
                .includes(filters.placeName!.toLowerCase())
            );
          }
          if (filters.categories && filters.categories.length > 0) {
            filteredEvents = filteredEvents.filter((event) =>
              event.categories.some((cat) =>
                filters.categories!.includes(cat.key)
              )
            );
          }
        }

        const mappedEvents = filteredEvents.map(mapMockEventToEvent);
        // Ajout du log pour vérifier le contenu de mappedEvents
        console.log(
          "[eventService.getEvents] mappedEvents count:",
          mappedEvents.length
        );

        // Simuler la pagination pour les données mock
        const page = filters?.page || 0;
        const size = filters?.size || 10;
        const startIndex = page * size;
        const endIndex = startIndex + size;
        const paginatedEvents = mappedEvents.slice(startIndex, endIndex);
        const totalElements = mappedEvents.length;
        const totalPages = Math.ceil(totalElements / size);

        return {
          _embedded: {
            eventSummaryResponses: paginatedEvents,
          },
          _links: {
            first: { href: `/events?page=0&size=${size}` },
            self: { href: `/events?page=${page}&size=${size}` },
            next:
              page < totalPages - 1
                ? { href: `/events?page=${page + 1}&size=${size}` }
                : undefined,
            last: { href: `/events?page=${totalPages - 1}&size=${size}` },
          },
          page: {
            size,
            totalElements,
            totalPages,
            number: page,
          },
        };
      }

      // Code API existant...
      const searchParams = new URLSearchParams();
      if (filters?.minPrice)
        searchParams.append("minPrice", filters.minPrice.toString());
      if (filters?.maxPrice)
        searchParams.append("maxPrice", filters.maxPrice.toString());
      if (filters?.startDate)
        searchParams.append("startDate", filters.startDate);
      if (filters?.endDate) searchParams.append("endDate", filters.endDate);
      if (filters?.cityName) searchParams.append("cities", filters.cityName);
      if (filters?.placeName) searchParams.append("places", filters.placeName);
      if (filters?.categories && filters.categories.length > 0)
        searchParams.append("categories", filters.categories.join(","));
      if (filters?.sortBy) searchParams.append("sortBy", filters.sortBy);
      if (filters?.sortOrder)
        searchParams.append("sortOrder", filters.sortOrder);
      if (filters?.page !== undefined)
        searchParams.append("page", filters.page.toString());
      if (filters?.size !== undefined)
        searchParams.append("size", filters.size.toString());

      const queryString = searchParams.toString();
      const url = `${apiUrl}/events${queryString ? `?${queryString}` : ""}&sort=date`;

      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      const result = await response.json();

      return {
        _embedded: {
          eventSummaryResponses: result._embedded?.eventSummaryResponses || [],
        },
        _links: result._links,
        page: result.page,
      };
    } catch (error) {
      console.error("❌ Error in getEvents:", error);
      throw error;
    }
  },
  async getPopularEvents(): Promise<Event[]> {
    try {
      if (useMockData) {
        const trendingEvents = mockEvents.filter((event) => event.isTrending);
        return trendingEvents.map(mapMockEventToEvent);
      }
      // Code API existant...
      const response = await fetch(`${apiUrl}/events?categories=trending&sort=date`, {
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      const result = await response.json();
      const apiEvents = result._embedded?.eventSummaryResponses || [];
      const mappedEvents: Event[] = apiEvents.map((apiEvent: any) => ({
        date: formatEventDate(apiEvent.date),
        description: apiEvent.description,
        name: apiEvent.name,
        address: apiEvent.address,
        maxCustomers: apiEvent.maxCustomers,
        isTrending: apiEvent.isTrending,
        price: apiEvent.price,
        status: apiEvent.status,
        categories: apiEvent.categories,
        organizer: apiEvent.organizer,
        currentParticipants: apiEvent.currentParticipants,
        _links: {
          self: {
            href: apiEvent._links.self.href,
          },
        },
      }));
      return mappedEvents;
    } catch (error) {
      console.error("❌ Error in getPopularEvents:", error);
      throw error;
    }
  },

  async getEventById(id: number): Promise<SingleEvent> {
    try {
      if (useMockData) {
        const mockEvent = mockEvents.find((event) => event.id === id);
        if (!mockEvent) {
          throw new Error("Événement non trouvé");
        }

        const fullOrganizer = getOrganizerByPseudo(mockEvent.organizer.pseudo);
        if (!fullOrganizer) {
          throw new Error(
            `Organisateur non trouvé: ${mockEvent.organizer.pseudo}`
          );
        }

        const mappedOrganizer: SingleUser = {
          id: fullOrganizer.id,
          firstName: fullOrganizer.firstName,
          lastName: fullOrganizer.lastName,
          pseudo: fullOrganizer.pseudo,
          email: fullOrganizer.email,
          phone: fullOrganizer.phone,
          description: fullOrganizer.description,
          imageUrl: fullOrganizer.imageUrl,
          bannerUrl: fullOrganizer.bannerUrl,
          note: fullOrganizer.note,
          eventPastCount: fullOrganizer.eventPastCount,
          eventsCount: fullOrganizer.eventsCount,
          organizer: true,
          socials: fullOrganizer.socials,
          categories: fullOrganizer.categories,
          _links: {
            self: fullOrganizer._links?.self || {
              href: `/users/${fullOrganizer.pseudo}`,
            },
            users: { href: "/users" },
            events: fullOrganizer._links?.events || {
              href: `/users/${fullOrganizer.pseudo}/events`,
            },
            categories: { href: "/categories" },
            invitations: { href: `/users/${fullOrganizer.pseudo}/invitations` },
          },
        };

        return {
          ...mockEvent,
          date: formatEventDate(mockEvent.date),
          status: mockEvent.status as EventStatus,
          imageUrl: "",
          organizer: mappedOrganizer,
          _links: {
            self: {
              href: `/events/${mockEvent.id}`,
            },
            events: {
              href: "/events",
            },
            places: {
              href: `/events/${mockEvent.id}/places`,
            },
            invitations: {
              href: `/events/${mockEvent.id}/invitations`,
            },
            city: {
              href: `/cities/${mockEvent.address}`,
            },
            organizer: {
              href: `/users/${fullOrganizer.pseudo}`,
            },
            participants: {
              href: `/events/${mockEvent.id}/participants`,
            },
            categories: mockEvent.categories.map((category: BaseCategory) => ({
              href: `/categories/${category.key}`,
            })),
          },
        };
      }

      // Code API existant...
      const response = await fetch(`${apiUrl}/events/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Événement non trouvé");
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const apiEvent = await response.json();

      const mappedEvent: SingleEvent = {
        id: apiEvent.id,
        date: formatEventDate(apiEvent.date),
        description: apiEvent.description,
        name: apiEvent.name,
        address: apiEvent.address,
        maxCustomers: apiEvent.maxCustomers,
        isTrending: apiEvent.isTrending,
        isInvitationOnly: apiEvent.isInvitationOnly,
        price: apiEvent.price,
        status: apiEvent.status,
        imageUrl: apiEvent.imageUrl,
        categories: apiEvent.categories || [],
        organizer: apiEvent.organizer,
        currentParticipants: apiEvent.currentParticipants || 0,
        contentHtml: apiEvent.contentHtml,
        _links: apiEvent._links,
      };

      return mappedEvent;
    } catch (error) {
      console.error("❌ Error in getEventById:", error);
      throw error;
    }
  },

  async getEventsByOrganizer(
    organizerPseudo: string,
    organizerId?: number,
    currentEventId?: string,
    limit: number = 3
  ): Promise<Event[]> {
    try {
      if (useMockData) {
        const organizerEvents = mockEvents
          .filter((event) => {
            const isFromOrganizer =
              event.organizer.pseudo.toLowerCase() ===
              organizerPseudo.toLowerCase();

            const isNotCurrentEvent =
              !currentEventId || event.id.toString() !== currentEventId;

            const isActive =
              event.status === "NOT_STARTED" || event.status === "IN_PROGRESS";

            const eventDate = new Date(event.date);
            const now = new Date();
            const isNotPast = eventDate > now;

            return (
              isFromOrganizer && isNotCurrentEvent && isActive && isNotPast
            );
          })
          .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          )
          .slice(0, limit);

        const mappedEvents = organizerEvents.map(mapMockEventToEvent);

        return mappedEvents;
      }

      const response = await fetch(`${apiUrl}/users/${organizerId}/events&sort=date`, {
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      console.log("response", response);

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result = await response.json();
      const apiEvents = result._embedded?.eventSummaryResponses || [];

      const mappedEvents: Event[] = apiEvents
        .map((apiEvent: any) => ({
          date: apiEvent.date, // Garder la date originale pour le tri
          description: apiEvent.description,
          name: apiEvent.name,
          address: apiEvent.address,
          maxCustomers: apiEvent.maxCustomers,
          isTrending: apiEvent.isTrending,
          price: apiEvent.price,
          status: apiEvent.status,
          categories: apiEvent.categories,
          organizer: apiEvent.organizer,
          currentParticipants: apiEvent.currentParticipants,
          _links: {
            self: {
              href: apiEvent._links.self.href,
            },
          },
        }))
        .filter((event: Event) => {
          const isFromOrganizer =
            !!event.organizer &&
            event.organizer.pseudo?.toLowerCase() ===
              organizerPseudo.toLowerCase();

          const eventId = event._links.self.href.split("/").pop();
          const isNotCurrentEvent =
            !currentEventId || eventId !== currentEventId;

          const isActive =
            event.status === "NOT_STARTED" || event.status === "IN_PROGRESS";

          const eventDate = new Date(event.date);
          const now = new Date();
          const isNotPast = eventDate > now;

          return isFromOrganizer && isNotCurrentEvent && isActive && isNotPast;
        })
        .sort((a: Event, b: Event) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        })
        .slice(0, limit)
        .map((event: Event) => ({
          ...event,
          date: formatEventDate(event.date),
        }));

      return mappedEvents;
    } catch (error) {
      console.error("❌ Error in getEventsByOrganizer:", error);
      throw error;
    }
  },

  async getDealEvents(): Promise<Event[]> {
    const eventsResponse = await this.getEvents();
    const dealEvents = eventsResponse._embedded.eventSummaryResponses.filter(
      (event: Event) => event.price > 0 && event.price < 30
    );
    return dealEvents;
  },

  async getFreeEvents(): Promise<Event[]> {
    const eventsResponse = await this.getEvents();
    const freeEvents = eventsResponse._embedded.eventSummaryResponses.filter(
      (event: Event) => event.price === 0
    );
    return freeEvents;
  },

  async getOrganizerByEvent(organizerHref: string): Promise<SingleUser> {
    try {
      if (useMockData) {
        const organizerPseudo = organizerHref.split("/").pop() || "";
        const organizer = getOrganizerByPseudo(organizerPseudo);
        if (!organizer) {
          throw new Error("Organisateur non trouvé");
        }

        const mappedOrganizer: SingleUser = {
          id: organizer.id,
          pseudo: organizer.pseudo,
          firstName: organizer.firstName,
          lastName: organizer.lastName,
          note: organizer.note || 0,
          eventPastCount: organizer.eventPastCount || 0,
          eventsCount: organizer.eventsCount || 0,
          description: organizer.description || null,
          imageUrl: organizer.imageUrl || null,
          bannerUrl: organizer.bannerUrl || null,
          email: organizer.email,
          phone: organizer.phone,
          socials: organizer.socials || [],
          categories: organizer.categories || [],
          organizer: true,
          _links: {
            self: organizer._links?.self || {
              href: `/users/${organizer.pseudo}`,
            },
            users: { href: "/users" },
            events: organizer._links?.events || {
              href: `/users/${organizer.pseudo}/events`,
            },
            categories: { href: "/categories" },
            invitations: { href: `/users/${organizer.pseudo}/invitations` },
          },
        };

        return mappedOrganizer;
      }
      const response = await fetch(organizerHref, {
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const organizerData = await response.json();

      const mappedOrganizer: SingleUser = {
        id: organizerData.id,
        pseudo: organizerData.pseudo,
        note: organizerData.note || 0,
        firstName: organizerData.firstName || "",
        lastName: organizerData.lastName || "",
        description: organizerData.description || null,
        imageUrl: organizerData.imageUrl || null,
        bannerUrl: organizerData.bannerUrl || null,
        email: organizerData.email,
        phone: organizerData.phone,
        socials: organizerData.socials || [],
        categories: organizerData.categories || [],
        organizer: true,
        eventPastCount: organizerData.eventPastCount || 0,
        eventsCount: organizerData.eventsCount || 0,
        _links: organizerData._links,
      };

      return mappedOrganizer;
    } catch (error) {
      console.error("❌ Error in getOrganizerByEvent:", error);
      throw error;
    }
  },

  async getFirstEvents(
    city?: string,
    place?: string,
    limit: number = 10
  ): Promise<Event[]> {
    try {
      if (useMockData) {
        // Pour les données mock, on peut filtrer par ville ou lieu
        let filteredEvents = mockEvents.filter((event) => {
          if (
            city &&
            event.address.toLowerCase().includes(city.toLowerCase())
          ) {
            return true;
          }
          if (
            place &&
            event.address.toLowerCase().includes(place.toLowerCase())
          ) {
            return true;
          }
          return false;
        });

        // Limiter le nombre d'événements
        filteredEvents = filteredEvents.slice(0, limit);

        return filteredEvents.map(mapMockEventToEvent);
      }

      // Construction de l'URL avec les paramètres
      const searchParams = new URLSearchParams();
      if (city) searchParams.append("city", city);
      if (place) searchParams.append("place", place);
      if (limit) searchParams.append("limit", limit.toString());

      const queryString = searchParams.toString();
      const url = `${apiUrl}/events/first-editions${
        queryString ? `?${queryString}` : ""
      }&sort=date`;

      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result = await response.json();
      const apiEvents = result._embedded?.eventSummaryResponses || [];

      const mappedEvents: Event[] = apiEvents.map((apiEvent: any) => ({
        date: formatEventDate(apiEvent.date),
        description: apiEvent.description,
        name: apiEvent.name,
        address: apiEvent.address,
        maxCustomers: apiEvent.maxCustomers,
        isTrending: apiEvent.isTrending,
        price: apiEvent.price,
        status: apiEvent.status,
        categories: apiEvent.categories,
        organizer: apiEvent.organizer,
        currentParticipants: apiEvent.currentParticipants,
        _links: {
          self: {
            href: apiEvent._links.self.href,
          },
        },
      }));

      return mappedEvents;
    } catch (error) {
      console.error("❌ Error in getFirstEvents:", error);
      throw error;
    }
  },

  async getEventsByOrganizerHref(
    organizerEventsHref: string,
    currentEventId?: string,
    limit: number = 3
  ): Promise<Event[]> {
    try {
      if (useMockData) {
        // Pour les données mock, on extrait le pseudo de l'URL
        const organizerPseudo = organizerEventsHref.split("/").pop() || "";
        const organizer = getOrganizerByPseudo(organizerPseudo);

        if (!organizer) {
          return [];
        }

        const organizerEvents = mockEvents
          .filter((event) => {
            const isFromOrganizer =
              event.organizer.pseudo.toLowerCase() ===
              organizerPseudo.toLowerCase();

            const isNotCurrentEvent =
              !currentEventId || event.id.toString() !== currentEventId;

            const isActive =
              event.status === "NOT_STARTED" || event.status === "IN_PROGRESS";

            const eventDate = new Date(event.date);
            const now = new Date();
            const isNotPast = eventDate > now;

            return (
              isFromOrganizer && isNotCurrentEvent && isActive && isNotPast
            );
          })
          .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          )
          .slice(0, limit);

        const mappedEvents = organizerEvents.map(mapMockEventToEvent);

        return mappedEvents;
      }

      // Construire l'URL avec les paramètres de filtrage
      const url = new URL(organizerEventsHref);
      if (currentEventId) {
        url.searchParams.set("excludeEventId", currentEventId);
      }
      url.searchParams.set("limit", limit.toString());
      url.searchParams.set("status", "NOT_STARTED,IN_PROGRESS");
      url.searchParams.set("sort", "date,asc");

      const response = await fetch(url.toString(), {
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result = await response.json();
      const apiEvents = result._embedded?.eventSummaryResponses || [];

      const mappedEvents: Event[] = apiEvents
        .map((apiEvent: any) => ({
          date: apiEvent.date,
          description: apiEvent.description,
          name: apiEvent.name,
          address: apiEvent.address,
          maxCustomers: apiEvent.maxCustomers,
          isTrending: apiEvent.isTrending,
          price: apiEvent.price,
          status: apiEvent.status,
          categories: apiEvent.categories,
          organizer: apiEvent.organizer,
          currentParticipants: apiEvent.currentParticipants,
          _links: {
            self: {
              href: apiEvent._links.self.href,
            },
          },
        }))
        .filter((event: Event) => {
          const eventId = event._links.self.href.split("/").pop();
          const isNotCurrentEvent =
            !currentEventId || eventId !== currentEventId;

          const isActive =
            event.status === "NOT_STARTED" || event.status === "IN_PROGRESS";

          const eventDate = new Date(event.date);
          const now = new Date();
          const isNotPast = eventDate > now;

          return isNotCurrentEvent && isActive && isNotPast;
        })
        .sort((a: Event, b: Event) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        })
        .slice(0, limit)
        .map((event: Event) => ({
          ...event,
          date: formatEventDate(event.date),
        }));

      return mappedEvents;
    } catch (error) {
      console.error("❌ Error in getEventsByOrganizerHref:", error);
      throw error;
    }
  },

  async getTrendingEvents(): Promise<Event[]> {
    try {
      if (useMockData) {
        return mockEvents
          .filter((event) => event.isTrending)
          .map(mapMockEventToEvent);
      }
      // Appel API pour récupérer tous les événements puis filtrer côté front
      const response = await fetch(`${apiUrl}/events/trending`, {
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      const result = await response.json();
      return result._embedded?.eventSummaryResponses || [];
    } catch (error) {
      throw error;
    }
  },

  async getEventsByCities(cities: string[], limit: number = 10): Promise<Event[]> {
    try {
      if (useMockData) {
        // Filtrer les événements par villes dans les données mock
        const cityEvents = mockEvents.filter((event) =>
          cities.some(city => 
            event.address.toLowerCase().includes(city.toLowerCase())
          )
        );
        return cityEvents.slice(0, limit).map(mapMockEventToEvent);
      }

      // Construire le paramètre cities pour l'API
      const citiesParam = cities.join(',');
      const response = await fetch(
        `${apiUrl}/events?cities=${citiesParam}&size=${limit}&sort=date,asc`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: EventsResponse = await response.json();
      return data._embedded.eventSummaryResponses || [];
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des événements par villes:", error);
      return [];
    }
  },

  async getEventsByCategories(categories: string[], limit: number = 10): Promise<Event[]> {
    try {
      if (useMockData) {
        // Filtrer les événements par catégories dans les données mock
        const categoryEvents = mockEvents.filter((event) =>
          event.categories.some(cat => 
            categories.includes(cat.key)
          )
        );
        return categoryEvents.slice(0, limit).map(mapMockEventToEvent);
      }

      // Construire le paramètre categories pour l'API
      const categoriesParam = categories.join(',');
      const response = await fetch(
        `${apiUrl}/events?categories=${categoriesParam}&size=${limit}&sort=date,asc`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: EventsResponse = await response.json();
      return data._embedded.eventSummaryResponses || [];
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des événements par catégories:", error);
      return [];
    }
  },

  async getInvitationStatus(
    eventId: number,
    userId: number,
    token?: string
  ): Promise<Invitation | null> {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const response = await fetch(
        `${apiUrl}/invitations/search?eventId=${eventId}&userId=${userId}`,
        {
          headers,
          cache: "no-store",
        }
      );
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error("Erreur lors de la récupération de l'invitation");
      }
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) return data[0];
      if (data && data.status) return data;
      return null;
    } catch (e) {
      return null;
    }
  },

  async requestInvitation(
    eventId: number,
    userId: number,
    description: string,
    token?: string
  ): Promise<Invitation> {
    const body = JSON.stringify({ eventId, userId, description });
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const response = await fetch(`${apiUrl}/invitations`, {
      method: "POST",
      headers,
      body,
    });
    if (!response.ok) {
      throw new Error("Erreur lors de la demande d'invitation");
    }
    return await response.json();
  },

  async reportEvent(
    senderUserId: number,
    reportedUserId: number,
    description: string,
    reportType: string,
    token?: string
  ): Promise<any> {
    const body = JSON.stringify({
      reportType,
      description,
      senderUserId,
      reportedUserId,
    });
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const response = await fetch(`${apiUrl}/reports`, {
      method: "POST",
      headers,
      body,
    });
    if (!response.ok) {
      throw new Error("Erreur lors du signalement de l'événement");
    }
    return await response.json();
  },

  async createOrder(
    totalPrice: number,
    eventId: number,
    userId: number,
    ticketToBeCreated: number,
    token?: string
  ): Promise<any> {
    const body = JSON.stringify({ totalPrice, eventId, userId, ticketToBeCreated });
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const response = await fetch(`${apiUrl}/orders`, {
      method: "POST",
      headers,
      body,
    });
    if (!response.ok) {
      throw new Error("Erreur lors de la création de la commande");
    }
    return await response.json();
  },

  async addTicketToOrder(
    orderId: number,
    ticket: {
      name: string;
      lastName: string;
      description: string;
      unitPrice: number;
    },
    token?: string
  ): Promise<any> {
    const body = JSON.stringify({ ...ticket, orderId });
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const response = await fetch(`${apiUrl}/orders/${orderId}/tickets`, {
      method: "POST",
      headers,
      body,
    });
    if (!response.ok) {
      throw new Error("Erreur lors de l'ajout du billet à la commande");
    }
    return await response.json();
  },

  getFavoriteEventIds,

  addFavoriteEvent(id: number) {
    const ids = getFavoriteEventIds();
    if (!ids.includes(id)) {
      setFavoriteEventIds([...ids, id]);
    }
  },

  removeFavoriteEvent(id: number) {
    const ids = getFavoriteEventIds();
    setFavoriteEventIds(ids.filter((eid) => eid !== id));
  },

  toggleFavoriteEvent(id: number) {
    const ids = getFavoriteEventIds();
    if (ids.includes(id)) {
      setFavoriteEventIds(ids.filter((eid) => eid !== id));
    } else {
      setFavoriteEventIds([...ids, id]);
    }
  },

  async getFavoriteEvents(): Promise<Event[]> {
    const ids = getFavoriteEventIds();
    
      const events: Event[] = [];
      for (const id of ids) {
        try {
          const event = await eventService.getEventById(id);
          events.push(event as Event);
        } catch {}
      }
      return events;
    
  },
};
