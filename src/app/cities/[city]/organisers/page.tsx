"use client";
import CustomTitle from "@/components/common/custom-title/custom-title";
import { useParams } from "next/navigation";

export default function OrganisersPage() {
  const { city } = useParams() as { city: string };

  return (
    <section className="wrapper">
      <CustomTitle
        title={`Découvrez leurs derniers évènements sur ${city}`}
        description="Organisateurs populaires"
      />
    </section>
  );
}
