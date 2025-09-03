"use client";
import { ReactNode } from "react";
import BarMenu from "@/components/menu/bar-menu/bar-menu";
import BannerHead from "@/components/heads/banner-head/banner-head";
import banner from "@/assets/images/banner_profile.png";
import ProfileHead from "@/components/heads/profile-head/profile-head";
import { useAuth } from "@/contexts/auth-context";
import { useUser } from "@/hooks/commons/use-user";
import { AuthGuard } from "@/components/commons/auth-guard/auth-guard";
import { useAuthError } from "@/hooks/commons/use-auth-error";
import { usePathname } from "next/navigation";
import React, { Suspense } from "react";

interface CompteLayoutProps {
  children: ReactNode;
}

function AuthErrorBanner() {
  const { errorMessage } = useAuthError();
  const { isAuthenticated } = useAuth();
  if (!errorMessage || isAuthenticated) return null;
  return (
    <div className="bg-red-50 border-b border-red-200">
      <div className="wrapper py-3">
        <div className="text-red-700 text-sm">
          ⚠️ {errorMessage}
        </div>
      </div>
    </div>
  );
}

export default function CompteLayout({ children }: CompteLayoutProps) {
  const { user } = useUser();
  const pathname = usePathname();

  // Détection du rôle organisateur
  const isOrganizer = user?.role === "Organizer" || user?.role === "Admin" || user?.role === "AuthService";

  // Vérifier si on est sur une page de paramètres
  const isParametresPage = pathname?.startsWith("/compte/parametres");

  const navigation = [
    { label: "Tickets", href: "/compte/tickets" },
    { label: "Enregistrés", href: "/compte/enregistres" },
    ...(isOrganizer ? [{ label: "Mes événements", href: "/compte/mes-evenements" }] : []),
    { label: "MyVeevent", href: "/compte/my-veevent" },
  ];

  return (
    <AuthGuard>
      <Suspense fallback={<div>Chargement...</div>}>
        <main>
          <Suspense fallback={null}>
            <AuthErrorBanner />
          </Suspense>
          {!isParametresPage && (
            <>
              <BannerHead bannerImage={user?.bannerUrl || banner} />
              <section className="wrapper">
                <ProfileHead isMe={true} user={user} />
              </section>
            </>
          )}
          {!isParametresPage && (
            <section className="wrapper">
              <BarMenu navigation={navigation} />
            </section>
          )}
          {children}
        </main>
      </Suspense>
    </AuthGuard>
  );
}
