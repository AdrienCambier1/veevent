import { Metadata } from 'next';

// Exemple de fonction generateMetadata pour une page Server Component
export async function generateMetadata({ 
  params 
}: { 
  params: { id: string; slug: string } 
}): Promise<Metadata> {
  // Récupérer les données de l'événement depuis l'API
  const event = await fetch(`/api/events/${params.id}`).then(res => res.json());
  
  return {
    title: `${event.name} - Veevent`,
    description: event.description || 'Découvrez cet événement exceptionnel',
    openGraph: {
      title: event.name,
      description: event.description,
      images: [event.imageUrl],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: event.name,
      description: event.description,
      images: [event.imageUrl],
    },
  };
}

// Exemple pour une page de ville
export async function generateCityMetadata({ 
  params 
}: { 
  params: { city: string } 
}): Promise<Metadata> {
  const cityName = decodeURIComponent(params.city);
  const city = await fetch(`/api/cities/${cityName}`).then(res => res.json());
  
  return {
    title: `Événements à ${city.name} - Veevent`,
    description: `Découvrez tous les événements à ${city.name}. ${city.eventsCount} événements disponibles.`,
    openGraph: {
      title: `Événements à ${city.name}`,
      description: `Découvrez tous les événements à ${city.name}`,
      images: [city.imageUrl],
      type: 'website',
    },
  };
}

// Exemple pour une page d'organisateur
export async function generateOrganizerMetadata({ 
  params 
}: { 
  params: { user: string } 
}): Promise<Metadata> {
  const organizer = await fetch(`/api/organizers/${params.user}`).then(res => res.json());
  
  return {
    title: `${organizer.firstName} ${organizer.lastName} - Organisateur - Veevent`,
    description: `Découvrez les événements organisés par ${organizer.firstName} ${organizer.lastName}`,
    openGraph: {
      title: `${organizer.firstName} ${organizer.lastName} - Organisateur`,
      description: `Découvrez les événements organisés par ${organizer.firstName} ${organizer.lastName}`,
      images: [organizer.imageUrl],
      type: 'profile',
    },
  };
} 