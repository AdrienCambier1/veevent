import ProfilHeader from "@/components/profil-header";
import CustomNav from "@/components/custom-nav";

export default function ProfilLayout({ children }) {
  const navigation = [
    { name: "Evenements", href: "/account/profil/events" },
    { name: "Participations", href: "/account/profil/participations" },
    { name: "Avis", href: "/account/profil/reviews" },
  ];

  return (
    <>
      <ProfilHeader redirect="settings" />
      <section className="container items-center">
        <CustomNav navigation={navigation} disabledHome={true} />
      </section>
      {children}
    </>
  );
}
