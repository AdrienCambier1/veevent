"use client";
import { useParams } from "next/navigation";
import { useOrganizerBySlug, useOrganizerEvents } from "@/hooks/organizers";
import PaginatedList from "@/components/commons/paginated-list/paginated-list";
import EventCard from "@/components/cards/event-card/event-card";
import { SingleEvent } from "@/types";

export default function OrganisateurEvenementsPage() {
  const params = useParams();
  const userSlug = params?.user as string;
  const { organizer, loading: organizerLoading, error: organizerError } = useOrganizerBySlug(userSlug);
  const userId = organizer?.id ? Number(organizer.id) : null;
  const { events, loading: eventsLoading, error: eventsError, pagination, hasNextPage, hasPreviousPage } = useOrganizerEvents(userId);

  const loading = organizerLoading || eventsLoading;
  const error = organizerError || eventsError;

  if (loading) {
    return (
      <div className="wrapper py-8">
        <div className="text-center">Chargement des événements...</div>
      </div>
    );
  }

  if (error || !organizer) {
    return (
      <div className="wrapper py-8">
        <div className="text-center text-red-600">
          Erreur: {error?.message || "Organisateur non trouvé"}
        </div>
      </div>
    );
  }

  const handlePageChange = (page: number) => {
    // TODO: Implémenter la pagination avec les liens HATEOAS
    console.log("Changement de page:", page);
  };

  const handlePreviousPage = () => {
    // TODO: Implémenter la pagination précédente
    console.log("Page précédente");
  };

  const handleNextPage = () => {
    // TODO: Implémenter la pagination suivante
    console.log("Page suivante");
  };

  return (
        <PaginatedList
          items={events}
          title={`Événements organisés par ${organizer.firstName} ${organizer.lastName}`}
          loading={eventsLoading}
          error={eventsError}
          pagination={pagination}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
          onPageChange={handlePageChange}
          onPreviousPage={handlePreviousPage}
          onNextPage={handleNextPage}
          hasActiveFilters={false}
          onOpenFilters={() => {}} // Fonction vide car pas de filtres sur cette page
          renderItem={(event) => (
            <EventCard 
              minify={true}
              key={event.id} 
              id={event.id?.toString() || ""} 
              event={event} 
            />
          )}
          renderEmpty={() => (
            <div className="text-center text-gray-500 py-8">
              <p>Aucun événement trouvé pour cet organisateur</p>
            </div>
          )}
          renderLoading={() => (
            <div className="text-center py-8">
              <p>Chargement des événements...</p>
            </div>
          )}
          renderError={(error) => (
            <div className="text-center text-red-500 py-8">
              <p>Erreur lors du chargement des événements : {error.message}</p>
            </div>
          )}
           gridClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          showPagination={true}
          showFilters={false}
        />
  );
} 