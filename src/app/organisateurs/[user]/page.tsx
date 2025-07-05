"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useOrganizerBySlug } from "@/hooks/organizers";

export default function OrganisateurPage() {
  const params = useParams();
  const router = useRouter();
  const userSlug = params?.user as string;
  const { organizer, loading, error } = useOrganizerBySlug(userSlug);

  useEffect(() => {
    if (!loading && !error && organizer) {
      // Redirection vers la page des événements
      router.replace(`/organisateurs/${userSlug}/evenements`);
    }
  }, [loading, error, organizer, userSlug, router]);

  if (loading) {
    return (
      <div className="wrapper py-8">
        <div className="text-center">Redirection vers les événements...</div>
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

  // Cette partie ne devrait jamais s'afficher car la redirection se fait dans le useEffect
  return (
    <div className="wrapper py-8">
      <div className="text-center">Redirection...</div>
    </div>
  );
}
