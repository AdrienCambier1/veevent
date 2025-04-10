import MainTitle from "@/components/main-title";
import Image from "next/image";
import nice4k from "@/assets/images/nice4k.jpg";
import CustomNav from "@/components/custom-nav";

export default function ActivitiesLayout({ children }) {
  const navigation = [
    { name: "Evenements", href: "/activities/events" },
    { name: "Organisateurs", href: "/activities/organisers" },
  ];

  return (
    <main>
      <section className="container items-center">
        <MainTitle title="Les activités de Nice" />
        <p className="text-center">
          Découvrez les activités et les organisateurs à proximité de la ville
          de Nice.
        </p>
        <Image src={nice4k} alt="City image" className="banner" />
        <CustomNav navigation={navigation} />
      </section>
      {children}
    </main>
  );
}
