"use client";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";

export default function ParametresPage() {
  const { logout } = useAuth();

  return (
    <main>
      <section className="wrapper">
        <h1 className="text-2xl font-bold mb-6">Paramètres</h1>
        
        <div className="space-y-4">
          <div className="bg-white rounded-lg border p-4">
            <h2 className="text-lg font-semibold mb-3">Profil</h2>
            <Link 
              href="/auth/complete-profile" 
              className="text-primary-600 hover:text-primary-700 underline"
            >
              Compléter mon profil
            </Link>
          </div>
          
          <div className="bg-white rounded-lg border p-4">
            <h2 className="text-lg font-semibold mb-3">Compte</h2>
            <button 
              onClick={logout}
              className="secondary-btn"
            >
              <span>Se déconnecter</span>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
