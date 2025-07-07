"use client";
import React, { Suspense } from "react";
import { useFavoriteEvents } from "@/hooks/commons/use-favorite-events";
import PaginatedList from "@/components/commons/paginated-list/paginated-list";
import EventCard from "@/components/cards/event-card/event-card";
import { Event } from "@/types";
import { usePageTitle } from "@/hooks/commons/use-page-title";
import { PAGE_TITLES } from "@/utils/page-titles";

function EnregistresPageContent() {
  const { events, loading, error, refetch } = useFavoriteEvents();
  
  // Gestion dynamique du titre de la page
  usePageTitle(PAGE_TITLES.account.favorites);

  // Pagination locale (optionnel, ici tout d'un coup)
  // Pour une vraie pagination, il faudrait découper events en pages

  return (

      <PaginatedList
        items={events}
        loading={loading}
        error={error}
        hasNextPage={false}
        hasPreviousPage={false}
        onPageChange={() => {}}
        onPreviousPage={() => {}}
        onNextPage={() => {}}
        onOpenFilters={() => {}}
        hasActiveFilters={false}
        renderItem={(event, idx) => (
          <EventCard key={event.id} id={event.id?.toString() || ""} event={event} minify={true} />
        )}
        title="Vos événements favoris"
        showFilters={false}
        showPagination={false}
      />

  );
}

export default function EnregistresPage() {
  return (
    <Suspense fallback={null}>
      <EnregistresPageContent />
    </Suspense>
  );
}
