import {
  EventsResponse,
  Event,
  EventFilters,
  SingleEvent,
  BaseCategory,
  SingleUser,
  EventStatus,
} from "@/types";
import mockEvents from "@/services/data/events";
import { mockOrganizers } from "@/services/data/organizers";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8090";
const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true" || false;

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
    throw new Error(`Organisateur non trouvé: ${mockEvent.organizer.pseudo}`);
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
    date: formatEventDate(mockEvent.date),
    description: mockEvent.description,
    name: mockEvent.name,
    address: mockEvent.address,
    maxCustomers: mockEvent.maxCustomers,
    isTrending: mockEvent.isTrending,
    price: mockEvent.price,
    status: mockEvent.status,
    categories: mockEvent.categories,
    organizer: mappedOrganizer,
    currentParticipants: mockEvent.currentParticipants,
    _links: mockEvent._links,
  };
};

export const eventService = {
  async getEvents(filters?: EventFilters): Promise<Event[]> {
    try {
      // Si on utilise les données fictives
      if (useMockData) {
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
        }

        return filteredEvents.map(mapMockEventToEvent);
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

      const queryString = searchParams.toString();
      const url = `${apiUrl}/events${queryString ? `?${queryString}` : ""}`;

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
      const response = await fetch(`${apiUrl}/events?categories=trending`, {
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
        price: apiEvent.price,
        status: apiEvent.status,
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

      const response = await fetch(`${apiUrl}/events`, {
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
    const events = await this.getEvents();
    const dealEvents = events.filter(
      (event: Event) => event.price > 0 && event.price < 30
    );
    return dealEvents;
  },

  async getFreeEvents(): Promise<Event[]> {
    const events = await this.getEvents();
    const freeEvents = events.filter((event: Event) => event.price === 0);
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
};
