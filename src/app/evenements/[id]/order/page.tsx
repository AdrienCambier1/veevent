"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { eventService } from "@/services/event-service";
import { useSingleEvent } from "@/hooks/events/use-single-event";
import { useSlugify } from "@/hooks/commons/use-slugify";

export default function OrderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id } = useParams() as { id: string };
  const eventId = Number(id);
  const { event, loading: eventLoading, error: eventError } = useSingleEvent(eventId);
  const { user, isAuthenticated, token } = useAuth();

  // Récupérer la quantité depuis les query params (ex: ?qty=2)
  const qty = Number(searchParams?.get("qty")) || 1;
  const [tickets, setTickets] = useState(
    Array.from({ length: qty }, () => ({ name: "", lastName: "" }))
  );
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // Supprimer les caractères spéciaux
      .replace(/\s+/g, "-") // Remplacer les espaces par des tirets
      .replace(/-+/g, "-") // Remplacer les tirets multiples par un seul
      .trim(); // Supprimer les espaces au début et à la fin
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(`/connexion?redirect=/evenements/${id}/order?qty=${qty}`);
    }
  }, [isAuthenticated, id, qty, router]);

  if (eventLoading) return <div className="wrapper py-12">Chargement...</div>;
  if (eventError || !event) return <div className="wrapper py-12 text-red-600">Erreur lors du chargement de l'événement.</div>;

  const totalPrice = event.price * qty;

  const handleChange = (i: number, field: "name" | "lastName", value: string) => {
    setTickets((prev) => prev.map((t, idx) => idx === i ? { ...t, [field]: value } : t));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!user?.id) return;
    if (tickets.some(t => !t.name.trim() || !t.lastName.trim())) {
      setFormError("Merci de renseigner le nom et prénom pour chaque billet.");
      return;
    }
    setSubmitting(true);
    try {
      // 1. Créer la commande
      const order = await eventService.createOrder(totalPrice, event.id, Number(user.id), token || undefined);
      console.log("Order response", order);
      const orderId = order._links?.self?.href?.split("/").pop();
      if (!orderId) {
        setFormError("Erreur lors de la création de la commande (id manquant).");
        setSubmitting(false);
        return;
      }
      // 2. Ajouter les tickets
      for (let i = 0; i < qty; i++) {
        await eventService.addTicketToOrder(orderId, {
          name: tickets[i].name,
          lastName: tickets[i].lastName,
          description: "Place standard",
          unitPrice: event.price,
        }, token || undefined);
      }
      // 3. Rediriger avec confirmation
      router.replace(`/evenements/${event.id}/${slugify(event.name)}?order=success`);
    } catch (e: any) {
      setFormError(e.message || "Erreur lors de la commande.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main >
        <section className="wrapper">
      <h1 className="text-2xl font-bold mb-6">Réserver mes billets</h1>
      <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
        <div className="font-semibold">{event.name}</div>
        <div className="text-sm text-slate-600">{event.address}</div>
        <div className="mt-2">Prix unitaire : <span className="font-semibold">{event.price.toFixed(2)}€</span></div>
        <div>Nombre de billets : <span className="font-semibold">{qty}</span></div>
        <div className="mt-2 text-lg">Total : <span className="font-bold">{totalPrice.toFixed(2)}€</span></div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {tickets.map((ticket, i) => (
          <div key={i} className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Prénom</label>
              <input
                type="text"
                className="w-full border rounded p-2"
                value={ticket.name}
                onChange={e => handleChange(i, "name", e.target.value)}
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Nom</label>
              <input
                type="text"
                className="w-full border rounded p-2"
                value={ticket.lastName}
                onChange={e => handleChange(i, "lastName", e.target.value)}
                required
              />
            </div>
          </div>
        ))}
        {formError && <div className="text-red-600 text-sm">{formError}</div>}
        <button type="submit" className="primary-btn w-full mt-4" disabled={submitting}>
          <span className="flex items-center gap-2">{submitting ? <span className="loader loader-xs" /> : null}{submitting ? "Réservation en cours..." : `Confirmer et payer ${totalPrice.toFixed(2)}€`}</span>
        </button>
      </form>
      </section>
    </main>
  );
} 