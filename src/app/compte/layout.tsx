"use client";
import { ReactNode } from "react";
import BarMenu from "@/components/menu/bar-menu/bar-menu";
import BannerHead from "@/components/heads/banner-head/banner-head";
import banner from "@/assets/images/banner_profile.png";
import ProfileHead from "@/components/heads/profile-head/profile-head";

interface CompteLayoutProps {
  children: ReactNode;
}

export default function CompteLayout({ children }: CompteLayoutProps) {
  const navigation = [
    { label: "Tickets", href: "/compte/tickets" },
    { label: "Enregistrés", href: "/compte/enregistres" },
    { label: "Mes événements", href: "/compte/mes-evenements" },
    { label: "My Veevent", href: "/compte/my-veevent" },
  ];

  return (
    <main>
      <BannerHead bannerImage={banner} />
      <section className="wrapper">
        <ProfileHead isMe={true} />
      </section>
      <section className="wrapper">
        <BarMenu navigation={navigation} />
      </section>
      {children}
    </main>
  );
}
