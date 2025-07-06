"use client";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useUser } from "@/hooks/commons/use-user";
import { useHeader } from "@/contexts/header-context";
import { ArrowLeft, CheckCircle } from "iconoir-react";
import Link from "next/link";
import "../parametres.scss";

interface ValidationErrors {
  [key: string]: string;
}

export default function OrganisateurPage() {
  const { setHideCitySelector } = useHeader();
  const { requestOrganizerRole, loading, error, clearError } = useAuth();
  const { user } = useUser();
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [organizerRequestReason, setOrganizerRequestReason] = useState("");

  const isOrganizer = user?.role === "Organizer" || user?.role === "Admin" || user?.role === "AuthService";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const success = await requestOrganizerRole(organizerRequestReason);
      
      if (success) {
        setSuccessMessage("Votre demande a été envoyée !");
        setOrganizerRequestReason("");
        setTimeout(() => setSuccessMessage(""), 5000);
      }
    } catch (error) {
      console.error("Erreur lors de la demande d'organisation:", error);
    }
  };

  return (
    <section className="wrapper">
      <div className="parametres-page">
        {/* Header avec navigation */}
        <div className="mb-4">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href="/compte/parametres"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Retour</span>
            </Link>
          </div>
          <h1 className="text-3xl font-bold mb-2">Devenir organisateur</h1>
          <p className="text-gray-600">Demandez le statut d'organisateur</p>
        </div>

        {/* Messages de succès/erreur */}
        {successMessage && (
          <div className="bg-secondary-50 border border-secondary-200 text-secondary-700 px-4 py-3 rounded-lg mb-6">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {isOrganizer ? (
          /* Statut organisateur actif */
          <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <CheckCircle className="w-8 h-8 text-secondary-600" />
                <div>
                  <h2 className="text-xl font-semibold text-secondary-800">Vous êtes déjà organisateur !</h2>
                  <p className="text-secondary-700">Profitez de tous les avantages du statut organisateur.</p>
                </div>
              </div>
              
              <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4">
                <h3 className="font-medium text-secondary-800 mb-2">Vos avantages :</h3>
                <ul className="text-secondary-700 space-y-1">
                  <li>• Créer et gérer vos événements</li>
                  <li>• Accéder aux statistiques détaillées</li>
                  <li>• Gérer les réservations et tickets</li>
                  <li>• Personnaliser votre profil organisateur</li>
                  <li>• Accéder aux outils de promotion</li>
                </ul>
              </div>
          </div>
        ) : (
          /* Formulaire de demande */
          <>
            {/* Informations sur le statut organisateur */}
            <div className="flex flex-col gap-4">

                <h2 className="text-xl font-semibold">Pourquoi devenir organisateur ?</h2>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-800 mb-2">Avantages du statut organisateur :</h3>
                  <ul className="text-blue-700 space-y-1">
                    <li>• Créer et gérer vos propres événements</li>
                    <li>• Accéder aux statistiques de vos événements</li>
                    <li>• Gérer les réservations et tickets</li>
                    <li>• Personnaliser votre profil organisateur</li>
                  </ul>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-medium text-yellow-800 mb-2">Important :</h3>
                  <p className="text-yellow-700 text-sm">
                    Le statut d'organisateur vous permet de créer des événements publics. 
                    Assurez-vous de respecter nos conditions d'utilisation et de fournir 
                    des informations exactes sur vos événements.
                  </p>
                </div>
              
            </div>

            {/* Formulaire de demande */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                
                <div className="form-group">
                  {validationErrors.organizerRequest && (
                    <span className="error-message">{validationErrors.organizerRequest}</span>
                  )}
                
                </div>

                {/* Bouton de soumission */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="primary-btn"
                  >
                    <span>{loading ? "Envoi..." : "Devenir organisateur"}</span>
                  </button>
                </div>
              </form>


            
          </>
        )}
      </div>
    </section>
  );
} 