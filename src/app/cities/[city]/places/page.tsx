"use client";
import CustomTitle from "@/components/common/custom-title/custom-title";
import { useParams } from "next/navigation";

export default function PlacesPage() {
  const { city } = useParams() as { city: string };

  return (
    <section className="wrapper">
      <CustomTitle
        title={`Les lieux populaires à ${city}`}
        description="Lieux"
      />
    </section>
  );
}
