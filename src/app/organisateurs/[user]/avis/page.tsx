"use client";
import { useParams } from "next/navigation";
import { useOrganizerBySlug } from "@/hooks/organizers";
import CustomTitle from "@/components/commons/custom-title/custom-title";

export default function OrganisateurAvisPage() {
  const params = useParams();
  const userSlug = params?.user as string;
  const { organizer, loading, error } = useOrganizerBySlug(userSlug);

  if (loading) {
    return (
      <div className="wrapper py-8">
        <div className="text-center">Chargement des avis...</div>
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

  return (
    <section className="wrapper">
        <CustomTitle title={`Ce qu'en disent les utilisateurs de ${organizer.firstName} ${organizer.lastName}`} description={`Avis`} />
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center text-gray-500">
            <p>Aucun avis trouvé pour le moment</p>
          </div>
        </div>
    </section>
  );
} 