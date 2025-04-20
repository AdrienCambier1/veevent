"use client";
import Link from "next/link";
import { NavArrowRight } from "iconoir-react";
import CustomNav from "@/components/custom-nav";
import { usePathname } from "next/navigation";

export default function ProfilHeader() {
  const pathname = usePathname();
  const isProfilRoute = pathname?.includes("/account/profil/");

  const navigation = [
    { name: "Evenements", href: "/account/profil/events" },
    { name: "Participations", href: "/account/profil/participations" },
    { name: "Avis", href: "/account/profil/reviews" },
  ];

  return (
    <section className="profil-header">
      <div className="flex flex-col-reverse md:flex-row gap-6 items-center justify-between w-full">
        <div className="flex flex-wrap justify-center md:justify-start gap-6">
          <div>
            <p>Abonnements</p>
            <p className="heavy">28</p>
          </div>
          <div>
            <p>Abonnés</p>
            <p className="heavy">12</p>
          </div>
          <div>
            <p>Veevent organisés</p>
            <p className="heavy">3</p>
          </div>
          <div>
            <p className="truncate">Veevent participés</p>
            <p className="heavy">3</p>
          </div>
        </div>
        {isProfilRoute ? (
          <Link href="/account/settings" className="primary-btn">
            <span>Paramètres du compte</span>
            <NavArrowRight />
          </Link>
        ) : (
          <Link href="/account/profil/events" className="primary-btn">
            <span>Mon activité</span>
            <NavArrowRight />
          </Link>
        )}
      </div>
      {isProfilRoute && (
        <CustomNav navigation={navigation} disabledHome={true} />
      )}
    </section>
  );
}
