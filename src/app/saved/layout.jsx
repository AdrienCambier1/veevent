import MainTitle from "@/components/titles/main-title";
import CustomNav from "@/components/custom-nav";

export default function SavedLayout({ children }) {
  const navigation = [
    { name: "Mes inscriptions", href: "/saved/inscriptions" },
    { name: "Marqués", href: "/saved/marked" },
  ];

  return (
    <main>
      <section className="container items-center">
        <MainTitle title="Mes enregistrés" />
        <p className="text-center">
          Accédez facilement à vos inscriptions et retrouvez les événements que
          vous avez marqués.
        </p>
        <CustomNav navigation={navigation} />
      </section>
      {children}
    </main>
  );
}
