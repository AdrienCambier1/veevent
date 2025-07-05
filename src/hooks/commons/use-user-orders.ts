"use client";
import { useState, useEffect, useCallback } from "react";
import { userService } from "@/services/user-service";
import { useAuth } from "@/contexts/auth-context";
import { useUser } from "@/hooks/commons/use-user";
import { Order, Ticket } from "@/types";

export function useUserOrders() {
  const { token } = useAuth();
  const { user } = useUser();
  const [orders, setOrders] = useState<(Order & { event?: any })[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fonction utilitaire pour extraire l'id depuis l'URL
  function extractIdFromHref(href: string) {
    const parts = href.split("/");
    return parts[parts.length - 1];
  }

  const fetchOrders = useCallback(async () => {
    if (!user || !user._links?.orders?.href) return;
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getOrdersByUserLink(token ?? undefined);
      const ordersRaw = data._embedded?.orderResponses || [];
      // Pour chaque commande, aller chercher l'événement associé
      const ordersWithDetails = await Promise.all(
        ordersRaw.map(async (order: any) => {
          // 1. Extraire l'id de la commande
          const orderId = extractIdFromHref(order._links?.self?.href || "");

          // 2. Les tickets sont déjà présents dans la réponse API
          const tickets = order.tickets || [];

          // 3. Chercher l'événement associé
          const eventLink = order._links?.events?.href;
          
          let event = null;
          if (eventLink) {
            try {
              const res = await fetch(eventLink, {
                credentials: "include",
                headers: token ? { Authorization: `Bearer ${token}` } : {},
              });
              if (res.ok) {
                const eventData = await res.json();
                // Supporte le format _embedded.eventResponses
                if (Array.isArray(eventData._embedded?.eventResponses) && eventData._embedded.eventResponses.length > 0) {
                  event = eventData._embedded.eventResponses[0];
                } else if (Array.isArray(eventData._embedded?.events) && eventData._embedded.events.length > 0) {
                  event = eventData._embedded.events[0];
                } else if (Array.isArray(eventData.events) && eventData.events.length > 0) {
                  event = eventData.events[0];
                } else if (eventData.name) {
                  event = eventData;
                }
                if (event && event._links?.self?.href) {
                  event.id = extractIdFromHref(event._links.self.href);
                }
              }
            } catch (e) {
              // ignore
            }
          }
          return { ...order, id: orderId, tickets, event };
        })
      );
      setOrders(ordersWithDetails);
    } catch (err) {
      setError(err as Error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [user, token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const refetch = useCallback(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, loading, error, refetch };
} 