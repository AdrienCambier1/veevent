"use client";
import { useState, ReactNode } from "react";
import SearchInput from "@/components/inputs/search-input/search-input";
import BarMenu from "@/components/menu/bar-menu/bar-menu";
import BannerHead from "@/components/heads/banner-head/banner-head";
import CustomTitle from "@/components/common/custom-title/custom-title";
import FaqCard from "@/components/cards/faq-card/faq-card";
import ReviewCard from "@/components/cards/review-card/review-card";
import Link from "next/link";
import { useParams } from "next/navigation";
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
