import EventsPage from "./events/page";
import OrganisersPage from "./organisers/page";
import PlacesPage from "./places/page";

export default function CitiesPage() {
  return (
    <>
      <EventsPage />
      <PlacesPage />
      <OrganisersPage />
    </>
  );
}
