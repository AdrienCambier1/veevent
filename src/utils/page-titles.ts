// Utilitaires pour gérer les titres de pages de manière centralisée

export const PAGE_TITLES = {
  // Page d'accueil
  home: {
    title: 'Veevent - Découvrez les événements locaux',
    description: 'Trouvez et réservez les meilleurs événements locaux. Concerts, spectacles, festivals et plus encore.',
  },
  
  // Pages d'événements
  events: {
    title: 'Événements - Veevent',
    description: 'Découvrez tous les événements disponibles. Concerts, spectacles, festivals et plus encore.',
  },
  
  // Page d'événement individuel
  event: (eventName: string, description?: string) => ({
    title: `${eventName} - Veevent`,
    description: description || `Découvrez ${eventName}, un événement exceptionnel à ne pas manquer.`,
  }),
  
  // Pages de villes
  city: (cityName: string, eventsCount?: number) => ({
    title: `Événements à ${cityName} - Veevent`,
    description: `Découvrez tous les événements à ${cityName}${eventsCount ? `. ${eventsCount} événements disponibles` : ''}.`,
  }),
  
  // Pages de lieux
  place: (placeName: string, cityName?: string) => ({
    title: `${placeName}${cityName ? ` - ${cityName}` : ''} - Veevent`,
    description: `Découvrez ${placeName}${cityName ? ` à ${cityName}` : ''} et ses événements.`,
  }),
  
  // Pages d'organisateurs
  organizer: (firstName: string, lastName: string) => ({
    title: `${firstName} ${lastName} - Organisateur - Veevent`,
    description: `Découvrez les événements organisés par ${firstName} ${lastName}.`,
  }),
  
  // Pages de recherche
  search: (query: string) => ({
    title: `Résultats pour "${query}" - Veevent`,
    description: `Résultats de recherche pour "${query}". Trouvez les événements qui vous intéressent.`,
  }),
  
  // Pages de catégories
  category: (categoryName: string) => ({
    title: `Événements ${categoryName} - Veevent`,
    description: `Découvrez tous les événements de la catégorie ${categoryName}.`,
  }),
  
  // Pages d'authentification
  auth: {
    login: {
      title: 'Connexion - Veevent',
      description: 'Connectez-vous à votre compte Veevent pour accéder à vos événements.',
    },
    register: {
      title: 'Inscription - Veevent',
      description: 'Créez votre compte Veevent pour découvrir et réserver des événements.',
    },
  },
  
  // Pages de compte
  account: {
    tickets: {
      title: 'Mes Tickets - Veevent',
      description: 'Consultez et gérez vos tickets d\'événements sur Veevent.',
    },
    favorites: {
      title: 'Mes Événements Favoris - Veevent',
      description: 'Consultez et gérez vos événements favoris sur Veevent.',
    },
    profile: {
      title: 'Mon Profil - Veevent',
      description: 'Gérez votre profil et vos préférences sur Veevent.',
    },
  },
  
  // Pages de profil
  profile: {
    title: 'Mon Profil - Veevent',
    description: 'Gérez votre profil et vos préférences sur Veevent.',
  },
  
  // Pages d'erreur
  error: {
    notFound: {
      title: 'Page non trouvée - Veevent',
      description: 'La page que vous recherchez n\'existe pas.',
    },
    serverError: {
      title: 'Erreur serveur - Veevent',
      description: 'Une erreur est survenue. Veuillez réessayer plus tard.',
    },
  },
};

// Fonction utilitaire pour formater les titres
export function formatPageTitle(title: string, siteName: string = 'Veevent'): string {
  return title.includes(siteName) ? title : `${title} - ${siteName}`;
}

// Fonction utilitaire pour tronquer les descriptions
export function truncateDescription(description: string, maxLength: number = 160): string {
  if (description.length <= maxLength) return description;
  return description.substring(0, maxLength - 3) + '...';
}

// Fonction pour générer les métadonnées OpenGraph
export function generateOpenGraphData(title: string, description: string, imageUrl?: string) {
  return {
    title,
    description: truncateDescription(description),
    images: imageUrl ? [imageUrl] : undefined,
    type: 'website' as const,
  };
}

// Fonction pour générer les métadonnées Twitter
export function generateTwitterData(title: string, description: string, imageUrl?: string) {
  return {
    card: 'summary_large_image' as const,
    title,
    description: truncateDescription(description),
    images: imageUrl ? [imageUrl] : undefined,
  };
} 