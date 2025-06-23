"use client";
import SearchInput from "@/components/inputs/search-input/search-input";
import { useState, useEffect, Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import EventCard from "@/components/cards/event-card/event-card";
import HorizontalList from "@/components/lists/horizontal-list/horizontal-list";
import { useEvents } from "@/hooks/events/use-events";
import { Event } from "@/types";

// Fonction utilitaire pour extraire l'ID depuis les liens HATEOAS
const extractIdFromSelfLink = (event: Event): string => {
  const href = event._links.self.href;
  const id = href.split("/").pop();
  return id || "";
};

function EvenementsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const {
    events: popularEvents,
    loading: popularLoading,
    error: popularError,
  } = useEvents("popular");
  const {
    events: dealEvents,
    loading: dealLoading,
    error: dealError,
  } = useEvents("deals");
  const {
    events: freeEvents,
    loading: freeLoading,
    error: freeError,
  } = useEvents("free");

  // Filtrage des événements selon la recherche
  const filteredEvents = useMemo(() => {
    if (!searchTerm) return popularEvents;
    return popularEvents.filter(
      (event: Event) =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.address?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [popularEvents, searchTerm]);

  useEffect(() => {
    const urlSearch = searchParams?.get("search");
    if (urlSearch) {
      setSearchTerm(urlSearch);
    }
  }, [searchParams]);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/evenements?search=${encodeURIComponent(searchTerm)}`);
    } else {
      router.push("/evenements");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const renderEventCards = (
    events: Event[],
    loading: boolean,
    error: Error | null
  ) => {
    if (loading) {
      return (
        <div className="loading-skeleton">
          <div className="animate-pulse bg-gray-200 h-32 rounded"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-message text-red-500 p-4">
          Erreur lors du chargement des événements: {error.message}
        </div>
      );
    }

    if (!events || events.length === 0) {
      return (
        <div className="no-events text-gray-500 p-4">
          Aucun événement trouvé
        </div>
      );
    }

    return events.map((event: Event) => {
      const eventId = extractIdFromSelfLink(event);

      return (
        <EventCard key={eventId} id={eventId} event={event} minify={false} />
      );
    });
  };

  return (
    <main>
      <section className="wrapper">
        <h1>Explorez les évènements sur veevent</h1>
        <h3>Rechercher un évènement</h3>
        <SearchInput
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Concert, Festival, Conférence..."
        />
        <button className="primary-btn" onClick={handleSearch}>
          <span>Rechercher</span>
        </button>
      </section>

      <HorizontalList title="Les évènements populaires cette semaine">
        {renderEventCards(filteredEvents, popularLoading, popularError)}
      </HorizontalList>

      <HorizontalList title="Les bonnes affaires de la semaine">
        {renderEventCards(dealEvents, dealLoading, dealError)}
      </HorizontalList>

      <HorizontalList title="Sortez gratuitement ce week end">
        {renderEventCards(freeEvents, freeLoading, freeError)}
      </HorizontalList>
    </main>
  );
}

export default function EvenementsPage() {
  return (
    <Suspense fallback={<div>Chargement de la page...</div>}>
      <EvenementsPageContent />
    </Suspense>
  );
}
