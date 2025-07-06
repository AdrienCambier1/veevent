"use client";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useHeader } from "@/contexts/header-context";
import { ArrowLeft, ShieldAlert } from "iconoir-react";
import Link from "next/link";
import "../parametres.scss";

interface ValidationErrors {
  [key: string]: string;
}

export default function SupprimerPage() {
  const { setHideCitySelector } = useHeader();
  const { deleteAccount, loading, error, clearError } = useAuth();
  const [showFinalConfirm, setShowFinalConfirm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setShowFinalConfirm(true);
  };

  const handleFinalDelete = async () => {
    try {
      const success = await deleteAccount();
      
      if (success) {
        // La redirection sera gérée par le contexte d'authentification
        console.log("Compte supprimé avec succès");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du compte:", error);
    }
  };

  return (
    <section className="wrapper">
      <div className="flex flex-col gap-4">
        {/* Header avec navigation */}
        <div className="">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href="/compte/parametres"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Retour</span>
            </Link>
          </div>
          <h1 className="text-3xl font-bold mb-2 text-red-600">Supprimer le compte</h1>
          <p className="text-gray-600">Action irréversible</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Avertissements */}
        <div className="flex flex-col gap-4">
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-medium text-red-800 mb-2">Cette action est irréversible</h3>
              <p className="text-red-700 text-sm mb-3">
                La suppression de votre compte entraînera la perte définitive de :
              </p>
              <ul className="text-red-700 text-sm space-y-1">
                <li>• Toutes vos données personnelles</li>
                <li>• Vos réservations et tickets</li>
                <li>• Vos événements créés (si organisateur)</li>
                <li>• Votre historique d'activité</li>
                <li>• Vos préférences et paramètres</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-medium text-yellow-800 mb-2">Recommandations</h3>
              <ul className="text-yellow-700 text-sm space-y-1">
                <li>• Sauvegardez vos données importantes avant la suppression</li>
                <li>• Annulez vos réservations en cours si nécessaire</li>
                <li>• Contactez le support si vous avez des questions</li>
              </ul>
            </div>

        </div>

        {/* Formulaire de confirmation */}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <h2 >Confirmation de suppression</h2>

            {/* Bouton de suppression */}
            <div className="flex">
              <button
                type="submit"
                disabled={loading}
                className="primary-btn"
              >
                <span>{loading ? "Vérification..." : "Supprimer le compte"}</span>
              </button>
            </div>
          </form>


        {/* Lien vers le support */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-2">
            Besoin d'aide ? Contactez notre support
          </p>
          <Link 
            href="/support"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Contacter le support
          </Link>
        </div>
      </div>

      {/* Modal de confirmation finale */}
      {showFinalConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <div className="flex items-center gap-3 mb-4">
              <ShieldAlert className="text-sm text-red-600" />
              <h3 className="text-lg font-semibold text-red-600">Dernière confirmation</h3>
            </div>
            
            <p className="text-gray-700 mb-6">
              Êtes-vous absolument sûr de vouloir supprimer votre compte ? 
              Cette action ne peut pas être annulée.
            </p>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowFinalConfirm(false)}
                className="secondary-btn"
              >
                Annuler
              </button>
              <button
                onClick={handleFinalDelete}
                disabled={loading}
                className="primary-btn"
              >
                <span>{loading ? "Suppression..." : "Supprimer"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
} 