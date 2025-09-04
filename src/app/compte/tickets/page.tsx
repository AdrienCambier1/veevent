"use client";
import React, { Suspense, useEffect } from "react";
import { useUser } from "@/hooks/commons/use-user";
import { useUserOrders } from "@/hooks/commons/use-user-orders";
import { useAuth } from "@/contexts/auth-context";
import { ProfileCompleteGuard } from "@/components/commons/profile-complete-guard";
import TicketCard from "@/components/cards/ticket-card/ticket-card";
import { usePageTitle } from "@/hooks/commons/use-page-title";
import { PAGE_TITLES } from "@/utils/page-titles";
import HorizontalList from "@/components/lists/horizontal-list/horizontal-list";
import OrderCard from "@/components/cards/order-card/order-card";
import { Ticket } from "@/types";

function TicketsPageContent() {
  const { user, loading: userLoading, error: userError } = useUser();
  const { orders, loading: ordersLoading, error: ordersError } = useUserOrders();
  const { logout } = useAuth();

  // Gestion dynamique du titre de la page
  usePageTitle(PAGE_TITLES.account.tickets);

  // Rediriger automatiquement en cas d'erreur d'authentification
  useEffect(() => {
    if (userError && (
      userError.message.includes("Token invalide") ||
      userError.message.includes("Unauthorized") ||
      userError.message.includes("401")
    )) {
      console.warn("Erreur d'authentification détectée sur la page tickets, redirection vers la connexion");
      if (typeof window !== "undefined") {
        window.location.href = "/connexion";
      }
    }
  }, [userError]);

  if (userLoading || ordersLoading) return <div>Chargement...</div>;

  if (userError) {
    // Afficher un message d'erreur temporaire avant la redirection
    return (
      <div className="wrapper">
        <div className="text-center py-8">
          <div className="text-red-600 mb-4">
            ⚠️ Erreur d'authentification : {userError.message}
          </div>
          <p className="text-gray-600 mb-4">
            Votre session a expiré. Vous allez être redirigé vers la page de connexion.
          </p>
          <button
            onClick={() => logout()}
            className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
          >
            Se reconnecter maintenant
          </button>
        </div>
      </div>
    );
  }

  if (ordersError) return <div>Erreur commandes : {ordersError.message}</div>;

  // Rassembler tous les tickets avec leur événement associé (SEULEMENT les futurs)
  let allTickets: (Ticket & { event: any; orderId: number })[] = [];
  const now = new Date();
  orders.forEach((order) => {
    if (order.tickets && order.tickets.length > 0 && order.event && order.event.date) {
      const eventDate = new Date(order.event.date);
      // SEULEMENT les événements futurs pour les tickets
      if (eventDate > now) {
        order.tickets.forEach((ticket: Ticket) => {
          allTickets.push({
            ...ticket,
            event: order.event,
            orderId: order.id,
          });
        });
      }
    }
  });

  // Trier les tickets par date d'événement croissante
  allTickets.sort((a, b) => {
    const dateA = new Date(a.event.date).getTime();
    const dateB = new Date(b.event.date).getTime();
    return dateA - dateB;
  });

  // Commandes sans tickets
  const pastOrders = orders.filter((order) => !order.tickets || order.tickets.length === 0);

  return (
    <>
      <section className="wrapper">
        <h2>Vos tickets veevent</h2>
        {allTickets.length === 0 && <div>Aucun ticket à venir.</div>}
        {allTickets.length > 0 && (
          <HorizontalList title="" description="">
            {allTickets.map((ticket, idx) => {
              // Utiliser directement l'ID du ticket depuis la réponse API
              const ticketId = ticket.id || idx;
              const eventId = ticket.event?.id || 0;
              return (
                <TicketCard
                  key={`VV-${eventId}-${ticket.orderId}-${ticketId}`}
                  ticketId={ticketId.toString()}
                  eventId={eventId}
                  ticketKey={`VV-${eventId}-${ticket.orderId}-${ticketId}`}
                  eventName={ticket.event.name || "Événement"}
                  eventPlace={ticket.event.address || "Lieu inconnu"}
                  eventCity={ticket.event.city || ticket.event.cityName || "Ville inconnue"}
                  eventDate={ticket.event.date ? new Date(ticket.event.date).toLocaleDateString("fr-FR") : "Date inconnue"}
                  eventHour={ticket.event.date ? new Date(ticket.event.date).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "Heure inconnue"}
                  eventImage={ticket.event.imageUrl}
                />
              );
            })}
          </HorizontalList>
        )}
      </section>
      <section className="wrapper">
        <h2>Vos précédentes commandes veevent</h2>
        {pastOrders.length === 0 && <div>Aucune commande passée.</div>}
        {pastOrders.map((order, idx) => (
          <OrderCard
            key={order.id || idx}
            orderId={order.id || idx}
            eventName={order.event?.name || "Événement"}
            eventUrl={order.event?._links?.self?.href || "#"}
            eventDate={order.event?.date ? new Date(order.event.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : "Date inconnue"}
            totalPrice={order.totalPrice}
          />
        ))}
      </section>
    </>
  );
}

export default function TicketsPage() {
  return (
    <Suspense fallback={null}>
      <ProfileCompleteGuard>
        <TicketsPageContent />
      </ProfileCompleteGuard>
    </Suspense>
  );
}
