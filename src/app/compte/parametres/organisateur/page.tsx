"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useUser } from "@/hooks/commons/use-user";
import { useHeader } from "@/contexts/header-context";
import { ArrowLeft, CheckCircle, ArrowUpRight } from "iconoir-react";
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
  const [justBecameOrganizer, setJustBecameOrganizer] = useState(false);

  const isOrganizer = user?.role === "Organizer" || user?.role === "Admin" || user?.role === "AuthService";

  // Détecter si l'utilisateur vient de devenir organisateur
  useEffect(() => {
    const wasOrganizer = sessionStorage.getItem("wasOrganizer") === "true";
    const isCurrentlyOrganizer = isOrganizer;
    
    if (!wasOrganizer && isCurrentlyOrganizer) {
      setJustBecameOrganizer(true);
      sessionStorage.setItem("wasOrganizer", "true");
    } else if (isCurrentlyOrganizer) {
      sessionStorage.setItem("wasOrganizer", "true");
    } else {
      sessionStorage.setItem("wasOrganizer", "false");
    }
  }, [isOrganizer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const success = await requestOrganizerRole();
      
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
            {justBecameOrganizer ? (
              /* Message spécial pour nouvel organisateur */
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div>
                    <h2 className="text-xl font-semibold text-green-800">Félicitations ! Vous êtes maintenant organisateur !</h2>
                    <p className="text-green-700">Votre demande a été acceptée. Vous pouvez maintenant créer et gérer vos événements.</p>
                  </div>
                </div>
                
                <div className="bg-white border border-green-200 rounded-lg p-4 mb-4">
                  <h3 className="font-medium text-green-800 mb-3">Prochaines étapes :</h3>
                  <ul className="text-green-700 space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Accédez à votre espace organisateur pour créer votre premier événement
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Personnalisez votre profil organisateur
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Découvrez les outils de gestion et de promotion
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="https://veevent-admin.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    <span>Accéder au backoffice</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/compte/mes-evenements"
                    className="inline-flex items-center justify-center gap-2 bg-white border border-green-600 text-green-600 hover:bg-green-50 px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Mes événements
                  </Link>
                </div>
              </div>
            ) : (
              /* Statut organisateur existant */
              <div className="flex items-center gap-4">
                <CheckCircle className="w-8 h-8 text-secondary-600" />
                <div>
                  <h2 className="text-xl font-semibold text-secondary-800">Vous êtes déjà organisateur !</h2>
                  <p className="text-secondary-700">Profitez de tous les avantages du statut organisateur.</p>
                </div>
              </div>
            )}
              
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

            {/* Lien vers le backoffice pour tous les organisateurs */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-800 mb-2">Espace organisateur :</h3>
              <p className="text-blue-700 mb-3">
                Accédez à votre espace de gestion complet pour créer et gérer vos événements.
              </p>
              <Link
                href="https://veevent-admin.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                                 <span>Accéder au backoffice</span>
                 <ArrowUpRight className="w-4 h-4" />
               </Link>
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