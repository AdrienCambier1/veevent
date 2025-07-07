import '@testing-library/jest-dom'
import { Event } from '@/types'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import EventCard from '../event-card'

// Mock des composants enfants
jest.mock('@/components/images/profile-img/profile-img', () => {
  return function MockProfileImg({ name, note, imageUrl }: any) {
    return <div data-testid="profile-img">{name}</div>
  }
})

jest.mock('@/components/images/profiles-img/profiles-img', () => {
  return function MockProfilesImg({ totalCount }: any) {
    return <div data-testid="profiles-img">{totalCount} participants</div>
  }
})

jest.mock('@/components/tags/theme-tag/theme-tag', () => {
  return function MockThemeTag({ category, name }: any) {
    return <span data-testid={`theme-tag-${category}`}>{name}</span>
  }
})

// Mock du hook useSlugify
jest.mock('@/hooks/commons/use-slugify', () => ({
  useSlugify: jest.fn((text) => text.toLowerCase().replace(/\s+/g, '-').replace(/[éèêë]/g, 'e').replace(/[àâä]/g, 'a').replace(/[îï]/g, 'i').replace(/[ôö]/g, 'o').replace(/[ûüù]/g, 'u').replace(/[ç]/g, 'c')),
}))

// Données de test basées sur votre API réelle
const mockEvent: Event = {
  id: 1,
  date: "2026-03-22T19:30:00",
  description: "Exposition exceptionnelle des œuvres de Matisse inspirées par la Côte d'Azur",
  name: "Nuit Matisse - Couleurs de la Méditerranée",
  address: "164 Avenue des Arènes de Cimiez, 06000 Nice",
  maxCustomers: 200,
  isTrending: false,
  price: 25.0,
  status: "NOT_STARTED",
  imageUrl: "https://res.cloudinary.com/dtepwacbx/image/upload/v1751890500/danny-howe-bn-D2bCvpik-unsplash_adelrk.jpg",
  currentParticipants: 0,
  cityName: "Nice",
  placeName: "Musée Matisse",
  isInvitationOnly: false,
  categories: [
    {
      name: "Culture",
      key: "culture"
    }
  ],
  organizer: {
    id: 1,
    pseudo: "le tueur de flamme",
    lastName: "Marchal",
    firstName: "Quentin",
    imageUrl: null,
    note: null,
    eventPastCount: 0,
    eventsCount: 0
  },
  _links: {
    self: {
      href: "http://localhost:8090/api/v1/events/1"
    }
  }
}

const mockFreeEvent: Event = {
  id: 10,
  date: "2026-05-18T11:00:00",
  description: "Hackathon de 48h dédié aux solutions durables pour le tourisme",
  name: "Green Tourism Hackathon",
  address: "2405 Route des Dolines, 06560 Sophia Antipolis",
  maxCustomers: 100,
  isTrending: false,
  price: 0.0,
  status: "NOT_STARTED",
  imageUrl: "https://res.cloudinary.com/dtepwacbx/image/upload/v1751890500/danny-howe-bn-D2bCvpik-unsplash_adelrk.jpg",
  currentParticipants: 0,
  cityName: "Monaco",
  placeName: "Casino de Monte-Carlo",
  isInvitationOnly: false,
  categories: [
    {
      name: "Bien-être",
      key: "wellness"
    },
    {
      name: "Technologie",
      key: "technology"
    }
  ],
  organizer: {
    id: 1,
    pseudo: "le tueur de flamme",
    lastName: "Marchal",
    firstName: "Quentin",
    imageUrl: null,
    note: null,
    eventPastCount: 0,
    eventsCount: 0
  },
  _links: {
    self: {
      href: "http://localhost:8090/api/v1/events/10"
    }
  }
}

const mockEventWithMultipleCategories: Event = {
  id: 2,
  date: "2026-04-10T21:00:00",
  description: "Soirée glamour sur la Croisette avec projection de films et cocktails",
  name: "Cannes Film Preview Night",
  address: "1 Boulevard de la Croisette, 06400 Cannes",
  maxCustomers: 300,
  isTrending: false,
  price: 85.0,
  status: "NOT_STARTED",
  imageUrl: "https://res.cloudinary.com/dtepwacbx/image/upload/v1751890500/danny-howe-bn-D2bCvpik-unsplash_adelrk.jpg",
  currentParticipants: 0,
  cityName: "Cannes",
  placeName: "Palais des Festivals et des Congrès",
  isInvitationOnly: false,
  categories: [
    {
      name: "Nourriture",
      key: "food"
    },
    {
      name: "Culture",
      key: "culture"
    }
  ],
  organizer: {
    id: 1,
    pseudo: "le tueur de flamme",
    lastName: "Marchal",
    firstName: "Quentin",
    imageUrl: null,
    note: null,
    eventPastCount: 0,
    eventsCount: 0
  },
  _links: {
    self: {
      href: "http://localhost:8090/api/v1/events/2"
    }
  }
}

describe('EventCard', () => {
  const user = userEvent.setup()

  describe('Rendu de base', () => {
    it('affiche correctement les informations de l\'événement Matisse', () => {
      render(<EventCard id="1" event={mockEvent} />)
      
      expect(screen.getByText('Nuit Matisse - Couleurs de la Méditerranée')).toBeInTheDocument()
      expect(screen.getByText('Exposition exceptionnelle des œuvres de Matisse inspirées par la Côte d\'Azur')).toBeInTheDocument()
      expect(screen.getByText('164 Avenue des Arènes de Cimiez, 06000 Nice')).toBeInTheDocument()
      expect(screen.getByText(/À partir de/)).toBeInTheDocument()
      expect(screen.getByText(/25/)).toBeInTheDocument()
      expect(screen.getByText(/€/)).toBeInTheDocument()
      expect(screen.getByText('0 participants')).toBeInTheDocument()
    })

    it('affiche "Gratuit" pour l\'événement Green Tourism Hackathon', () => {
      render(<EventCard id="10" event={mockFreeEvent} />)
      
      expect(screen.getByText('Gratuit')).toBeInTheDocument()
    })

    it('affiche les tags de catégories pour l\'événement Matisse', () => {
      render(<EventCard id="1" event={mockEvent} />)
      
      expect(screen.getByTestId('theme-tag-culture')).toBeInTheDocument()
      expect(screen.getByText('Culture')).toBeInTheDocument()
    })

    it('affiche les informations de l\'organisateur Quentin Marchal', () => {
      render(<EventCard id="1" event={mockEvent} />)
      
      expect(screen.getByTestId('profile-img')).toHaveTextContent('Quentin Marchal')
    })

    it('formate correctement la date du 22 mars 2026', () => {
      render(<EventCard id="1" event={mockEvent} />)
      
      // La date devrait être formatée en français
      expect(screen.getByText(/Le 22 mars 2026 à 19:30/)).toBeInTheDocument()
    })

    it('affiche plusieurs catégories pour l\'événement Cannes', () => {
      render(<EventCard id="2" event={mockEventWithMultipleCategories} />)
      
      expect(screen.getByTestId('theme-tag-food')).toBeInTheDocument()
      expect(screen.getByTestId('theme-tag-culture')).toBeInTheDocument()
      expect(screen.getByText('Nourriture')).toBeInTheDocument()
      expect(screen.getByText('Culture')).toBeInTheDocument()
    })
  })

  describe('Mode minify', () => {
    it('applique la classe CSS minify', () => {
      render(<EventCard id="1" event={mockEvent} minify={true} />)
      
      const link = screen.getByRole('link')
      expect(link).toHaveClass('minify')
    })

    it('masque la description en mode minify', () => {
      render(<EventCard id="1" event={mockEvent} minify={true} />)
      
      expect(screen.queryByText('Exposition exceptionnelle des œuvres de Matisse inspirées par la Côte d\'Azur')).not.toBeInTheDocument()
    })

    it('masque le nombre de participants en mode minify', () => {
      render(<EventCard id="1" event={mockEvent} minify={true} />)
      
      expect(screen.queryByTestId('profiles-img')).not.toBeInTheDocument()
    })

    it('affiche l\'icône ArrowUpRight en mode minify', () => {
      render(<EventCard id="1" event={mockEvent} minify={true} />)
      
      // Vérifier que l'icône est présente (via la classe CSS)
      const arrowIcon = document.querySelector('.text-lg')
      expect(arrowIcon).toBeInTheDocument()
    })
  })

  describe('Mode grid', () => {
    it('applique la classe CSS grid', () => {
      render(<EventCard id="1" event={mockEvent} grid={true} />)
      
      const link = screen.getByRole('link')
      expect(link).toHaveClass('grid')
    })
  })

  describe('Navigation', () => {
    it('génère le bon lien vers l\'événement Matisse', () => {
      render(<EventCard id="1" event={mockEvent} />)
      
      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', '/evenements/1/nuit-matisse---couleurs-de-la-mediterranee')
    })

    it('génère le bon lien vers l\'événement Cannes', () => {
      render(<EventCard id="2" event={mockEventWithMultipleCategories} />)
      
      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', '/evenements/2/cannes-film-preview-night')
    })

    it('utilise l\'image par défaut si aucune image n\'est fournie', () => {
      const eventWithoutImage = { ...mockEvent, imageUrl: "" }
      render(<EventCard id="1" event={eventWithoutImage} />)
      
      const image = screen.getByAltText('Event image')
      expect(image).toHaveAttribute('src')
    })
  })

  describe('Accessibilité', () => {
    it('a une image avec un alt text approprié', () => {
      render(<EventCard id="1" event={mockEvent} />)
      
      const image = screen.getByAltText('Event image')
      expect(image).toBeInTheDocument()
    })

    it('est navigable au clavier', () => {
      render(<EventCard id="1" event={mockEvent} />)
      
      const link = screen.getByRole('link')
      expect(link).toBeInTheDocument()
    })
  })

  describe('Gestion des cas limites', () => {
    it('gère un événement sans organisateur', () => {
      const eventWithoutOrganizer = { ...mockEvent, organizer: undefined }
      render(<EventCard id="1" event={eventWithoutOrganizer} />)
      
      // Le composant ProfileImg gère les cas undefined en affichant une chaîne vide
      expect(screen.getByTestId('profile-img')).toBeInTheDocument()
    })

    it('gère un événement sans catégories', () => {
      const eventWithoutCategories = { ...mockEvent, categories: [] }
      render(<EventCard id="1" event={eventWithoutCategories} />)
      
      expect(screen.queryByTestId('theme-tag-culture')).not.toBeInTheDocument()
    })

    it('gère un événement sans description', () => {
      const eventWithoutDescription = { ...mockEvent, description: "" }
      render(<EventCard id="1" event={eventWithoutDescription} />)
      
      expect(screen.queryByText('Exposition exceptionnelle des œuvres de Matisse inspirées par la Côte d\'Azur')).not.toBeInTheDocument()
    })

    it('gère un organisateur avec un pseudo', () => {
      render(<EventCard id="1" event={mockEvent} />)
      
      // Le composant utilise firstName + lastName, pas le pseudo
      expect(screen.getByTestId('profile-img')).toHaveTextContent('Quentin Marchal')
    })

    it('affiche "Annulé" pour un événement annulé', () => {
      const cancelledEvent = { ...mockEvent, status: "CANCELLED" as const }
      render(<EventCard id="1" event={cancelledEvent} />)
      
      expect(screen.getByText('Annulé')).toBeInTheDocument()
      expect(screen.getByText('Annulé')).toHaveClass('text-red-600', 'font-medium')
    })

    it('affiche "Terminé" pour un événement terminé', () => {
      const completedEvent = { ...mockEvent, status: "COMPLETED" as const }
      render(<EventCard id="1" event={completedEvent} />)
      
      expect(screen.getByText('Terminé')).toBeInTheDocument()
      expect(screen.getByText('Terminé')).toHaveClass('text-green-600', 'font-medium')
    })

    it('affiche le prix normal pour un événement en cours', () => {
      const inProgressEvent = { ...mockEvent, status: "IN_PROGRESS" as const }
      render(<EventCard id="1" event={inProgressEvent} />)
      
      expect(screen.getByText(/À partir de/)).toBeInTheDocument()
      expect(screen.getByText(/25/)).toBeInTheDocument()
      expect(screen.getByText(/€/)).toBeInTheDocument()
    })
  })

  describe('Tests avec données réelles de l\'API', () => {
    it('affiche correctement l\'événement TechTourism Summit', () => {
      const techEvent: Event = {
        id: 3,
        date: "2026-03-28T18:00:00",
        description: "Conférence sur les innovations technologiques dans le secteur du tourisme",
        name: "TechTourism Summit Sophia",
        address: "2405 Route des Dolines, 06560 Sophia Antipolis",
        maxCustomers: 150,
        isTrending: false,
        price: 45.0,
        status: "NOT_STARTED",
        imageUrl: "https://res.cloudinary.com/dtepwacbx/image/upload/v1751890500/danny-howe-bn-D2bCvpik-unsplash_adelrk.jpg",
        currentParticipants: 0,
        cityName: "Monaco",
        placeName: "Casino de Monte-Carlo",
        isInvitationOnly: false,
        categories: [
          {
            name: "Technologie",
            key: "technology"
          }
        ],
        organizer: {
          id: 1,
          pseudo: "le tueur de flamme",
          lastName: "Marchal",
          firstName: "Quentin",
          imageUrl: null,
          note: null,
          eventPastCount: 0,
          eventsCount: 0
        },
        _links: {
          self: {
            href: "http://localhost:8090/api/v1/events/3"
          }
        }
      }

      render(<EventCard id="3" event={techEvent} />)
      
      expect(screen.getByText('TechTourism Summit Sophia')).toBeInTheDocument()
      expect(screen.getByText('Conférence sur les innovations technologiques dans le secteur du tourisme')).toBeInTheDocument()
      expect(screen.getByText('2405 Route des Dolines, 06560 Sophia Antipolis')).toBeInTheDocument()
      expect(screen.getByText(/À partir de/)).toBeInTheDocument()
      expect(screen.getByText(/45/)).toBeInTheDocument()
      expect(screen.getByText(/€/)).toBeInTheDocument()
      expect(screen.getByTestId('theme-tag-technology')).toBeInTheDocument()
      expect(screen.getByText('Technologie')).toBeInTheDocument()
    })

    it('affiche correctement l\'événement sportif Monaco Tennis Masters', () => {
      const sportEvent: Event = {
        id: 4,
        date: "2026-04-15T10:00:00",
        description: "Compétition de tennis sur terre battue avec les meilleurs joueurs régionaux",
        name: "Monaco Tennis Masters",
        address: "Place du Casino, 98000 Monaco",
        maxCustomers: 500,
        isTrending: false,
        price: 120.0,
        status: "NOT_STARTED",
        imageUrl: "https://res.cloudinary.com/dtepwacbx/image/upload/v1751890500/danny-howe-bn-D2bCvpik-unsplash_adelrk.jpg",
        currentParticipants: 0,
        cityName: "Menton",
        placeName: "Jardin Botanique Val Rahmeh",
        isInvitationOnly: false,
        categories: [
          {
            name: "Sport",
            key: "sport"
          }
        ],
        organizer: {
          id: 1,
          pseudo: "le tueur de flamme",
          lastName: "Marchal",
          firstName: "Quentin",
          imageUrl: null,
          note: null,
          eventPastCount: 0,
          eventsCount: 0
        },
        _links: {
          self: {
            href: "http://localhost:8090/api/v1/events/4"
          }
        }
      }

      render(<EventCard id="4" event={sportEvent} />)
      
      expect(screen.getByText('Monaco Tennis Masters')).toBeInTheDocument()
      expect(screen.getByText('Compétition de tennis sur terre battue avec les meilleurs joueurs régionaux')).toBeInTheDocument()
      expect(screen.getByText('Place du Casino, 98000 Monaco')).toBeInTheDocument()
      expect(screen.getByText(/À partir de/)).toBeInTheDocument()
      expect(screen.getByText(/120/)).toBeInTheDocument()
      expect(screen.getByText(/€/)).toBeInTheDocument()
      expect(screen.getByTestId('theme-tag-sport')).toBeInTheDocument()
      expect(screen.getByText('Sport')).toBeInTheDocument()
    })
  })
}) 