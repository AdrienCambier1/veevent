import MainTitle from "@/components/titles/main-title";
import CustomNav from "@/components/custom-nav";
import ProtectedRoute from "@/components/protected-route";

export default function SubscriptionsLayout({ children }) {
  const navigation = [
    { name: "Evenements", href: "/subscriptions/events" },
    { name: "Profils", href: "/subscriptions/profils" },
  ];

  return (
    <ProtectedRoute>
      <main>
        <section className="container items-center">
          <MainTitle title="Mes abonnements" />
          <p className="text-center">
            Retrouvez l’intégralité des événements des organisateurs auxquels
            vous êtes abonné.
          </p>
          <CustomNav navigation={navigation} />
        </section>
        {children}
      </main>
    </ProtectedRoute>
  );
}
