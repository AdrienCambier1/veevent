"use client";
import React, { Suspense } from "react";
import { useUserEvents } from "@/hooks/commons/use-user-events";
import { useUser } from "@/hooks/commons/use-user";
import PaginatedList from "@/components/commons/paginated-list/paginated-list";
import EventCard from "@/components/cards/event-card/event-card";

function MesEvenementsPageContent() {
  const { user, loading: userLoading, error: userError } = useUser();
  const { events, loading: eventsLoading, error: eventsError, pagination, hasNextPage, hasPreviousPage } = useUserEvents();

  const loading = userLoading || eventsLoading;
  const error = userError || eventsError;

  if (loading) {
    return (
      <div className="wrapper py-8">
        <div className="text-center">Chargement de vos événements...</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="wrapper py-8">
        <div className="text-center text-red-600">
          Erreur: {error?.message || "Impossible de charger vos événements"}
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
      title={`Mes événements`}
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
          <p>Vous n'avez pas encore créé d'événements</p>
          <p className="text-sm mt-2">
            <a href="/evenements" className="text-blue-600 hover:text-blue-800 underline">
              Découvrir les événements
            </a>
          </p>
        </div>
      )}
      renderLoading={() => (
        <div className="text-center py-8">
          <p>Chargement de vos événements...</p>
        </div>
      )}
      renderError={(error) => (
        <div className="text-center text-red-500 py-8">
          <p>Erreur lors du chargement de vos événements : {error.message}</p>
        </div>
      )}
      gridClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      showPagination={true}
      showFilters={false}
    />
  );
}

export default function MesEvenementsPage() {
  return (
    <Suspense fallback={null}>
      <MesEvenementsPageContent />
    </Suspense>
  );
}
