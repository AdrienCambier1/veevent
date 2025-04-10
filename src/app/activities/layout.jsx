"use client";
import MainTitle from "@/components/titles/main-title";
import Image from "next/image";
import nice4k from "@/assets/images/nice4k.jpg";
import CustomNav from "@/components/custom-nav";
import { useCity } from "@/contexts/city-context";

export default function ActivitiesLayout({ children }) {
  const { selectedCity } = useCity();
  const navigation = [
    { name: "Evenements", href: "/activities/events" },
    { name: "Organisateurs", href: "/activities/organisers" },
  ];

  return (
    <main>
      <section className="container items-center">
        <MainTitle title={`Les activités de ${selectedCity.name}`} />
        <p className="text-center">
          Découvrez les activités et les organisateurs à proximité de{" "}
          {selectedCity.name}.
        </p>
        <Image src={nice4k} alt="City image" className="banner" />
        <CustomNav navigation={navigation} />
      </section>
      {children}
    </main>
  );
}
