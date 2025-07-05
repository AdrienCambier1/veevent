'use client';
import React, { Suspense } from "react";
import { useUser } from "@/hooks/commons/use-user";
import { useUserOrders } from "@/hooks/commons/use-user-orders";
import MyVeeventCard from "@/components/cards/my-veevent-card/my-veevent-card";

function MyVeeventPageContent() {
  const { user, loading: userLoading } = useUser();
  const { orders, loading: ordersLoading } = useUserOrders();

  if (userLoading || ordersLoading) return <section className="wrapper">Chargement...</section>;

  const participatedEvents = Array.from(
    new Map(
      orders
        .filter(order => order.event && order.event.date > new Date())
        .map(order => [order.event._links?.self?.href, order.event])
    ).values()
  );

  return (
    <section className="wrapper">
      <h2>Mes veevents</h2>
      <p>Vous retrouverez ici tous les événements auxquels vous avez participés</p>
      {participatedEvents.length === 0 && <div>Aucun veevent pour l'instant.</div>}
      <div className="flex flex-wrap gap-8 justify-center">
        {participatedEvents.map((event, idx) => (
          <MyVeeventCard key={event._links?.self?.href || idx} event={event} />
        ))}
      </div>
    </section>
  );
}

export default function MyVeeventPage() {
  return (
    <Suspense fallback={null}>
      <MyVeeventPageContent />
    </Suspense>
  );
}
