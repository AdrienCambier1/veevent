"use client";
import React, { Suspense } from "react";
import { useFavoriteEvents } from "@/hooks/commons/use-favorite-events";
import PaginatedList from "@/components/commons/paginated-list/paginated-list";
import EventCard from "@/components/cards/event-card/event-card";
import { Event } from "@/types";

function EnregistresPageContent() {
  const { events, loading, error, refetch } = useFavoriteEvents();

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
