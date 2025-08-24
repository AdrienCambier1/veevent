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

export default function OrganisateurLayout({
  children,
}: OrganisateurLayoutProps) {
  const params = useParams();
  const userSlug = params?.user as string;
  const { organizer, loading, error } = useOrganizerBySlug(userSlug);

  if (typeof window === "undefined" || loading) {
    return (
      <div
        style={{
          minHeight: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Chargement...
      </div>
    );
  }

  if (error || !organizer) {
    return (
      <div className="wrapper py-8">
        <div className="text-center text-red-600">
          Erreur lors du chargement de l'organisateur:{" "}
          {error?.message || "Organisateur non trouvé"}
        </div>
      </div>
    );
  }

  const navigation = [
    { label: "Événements", href: `/organisateurs/${userSlug}/evenements` },
    { label: "Avis", href: `/organisateurs/${userSlug}/avis` },
  ];

  return (
    <main>
      <BannerHead bannerImage={banner} />
      <section className="wrapper">
        <ProfileHead user={organizer} />
      </section>
      <section className="wrapper">
        <BarMenu navigation={navigation} />
      </section>
      {children}
    </main>
  );
}
