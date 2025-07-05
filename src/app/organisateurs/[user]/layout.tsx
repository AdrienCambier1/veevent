"use client";
import banner from "@/assets/images/banner_profile.png";
import BannerHead from "@/components/heads/banner-head/banner-head";
import ProfileHead from "@/components/heads/profile-head/profile-head";
import BarMenu from "@/components/menu/bar-menu/bar-menu";
import { useAuth } from "@/contexts/auth-context";
import { useAuthError } from "@/hooks/commons/use-auth-error";
import { useOrganizerBySlug } from "@/hooks/organizers";
import { useParams } from "next/navigation";
import { ReactNode, Suspense } from "react";

interface OrganisateurLayoutProps {
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

export default function OrganisateurLayout({ children }: OrganisateurLayoutProps) {
  const params = useParams();
  const userSlug = params?.user as string;
  const { organizer, loading, error } = useOrganizerBySlug(userSlug);

  const navigation = [
    { label: "Événements", href: `/organisateurs/${userSlug}/evenements` },
    { label: "Avis", href: `/organisateurs/${userSlug}/avis` },
  ];

  if (loading) {
    return (
      <Suspense fallback={<div>Chargement...</div>}>
        <main>
          <div className="wrapper py-8">
            <div className="text-center">Chargement de l'organisateur...</div>
          </div>
        </main>
      </Suspense>
    );
  }

  if (error || !organizer) {
    return (
      <Suspense fallback={<div>Chargement...</div>}>
        <main>
          <div className="wrapper py-8">
            <div className="text-center text-red-600">
              Erreur lors du chargement de l'organisateur: {error?.message || "Organisateur non trouvé"}
            </div>
          </div>
        </main>
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <main>
        <Suspense fallback={null}>
          <AuthErrorBanner />
        </Suspense>
        <BannerHead bannerImage={banner} />
        <section className="wrapper">
          <ProfileHead user={organizer} />
        </section>
        <section className="wrapper">
          <BarMenu navigation={navigation} />
        </section>
        {children}
      </main>
    </Suspense>
  );
}
