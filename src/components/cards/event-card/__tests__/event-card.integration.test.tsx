import { Event } from '@/types'
import { screen } from '@testing-library/dom'
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import EventCard from '../event-card'

// Tests d'intégration avec les vraies données de l'API
describe('EventCard Integration', () => {
  const user = userEvent.setup()

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

  describe('Interactions utilisateur', () => {
    it('affiche correctement tous les éléments visuels de l\'événement Matisse', () => {
      render(<EventCard id="1" event={mockEvent} />)
      
      // Vérifier la présence de tous les éléments
      expect(screen.getByText('Nuit Matisse - Couleurs de la Méditerranée')).toBeInTheDocument()
      expect(screen.getByText('Exposition exceptionnelle des œuvres de Matisse inspirées par la Côte d\'Azur')).toBeInTheDocument()
      expect(screen.getByText('164 Avenue des Arènes de Cimiez, 06000 Nice')).toBeInTheDocument()
      expect(screen.getByText(/À partir de/)).toBeInTheDocument()
      expect(screen.getByText(/25/)).toBeInTheDocument()
      expect(screen.getByText(/€/)).toBeInTheDocument()
      expect(screen.getByText('Aucun participant')).toBeInTheDocument()
      expect(screen.getByText('Culture')).toBeInTheDocument()
    })
  })

  describe('Responsive et styles', () => {
    it('applique les bonnes classes CSS selon les props', () => {
      const { rerender } = render(<EventCard id="1" event={mockEvent} />)
      
      let link = screen.getByRole('link')
      expect(link).toHaveClass('event-card')
      expect(link).not.toHaveClass('minify', 'grid')

      // Test avec minify
      rerender(<EventCard id="1" event={mockEvent} minify={true} />)
      link = screen.getByRole('link')
      expect(link).toHaveClass('event-card', 'minify')

      // Test avec grid
      rerender(<EventCard id="1" event={mockEvent} grid={true} />)
      link = screen.getByRole('link')
      expect(link).toHaveClass('event-card', 'grid')

      // Test avec les deux
      rerender(<EventCard id="1" event={mockEvent} minify={true} grid={true} />)
      link = screen.getByRole('link')
      expect(link).toHaveClass('event-card', 'minify', 'grid')
    })
  })

  describe('Tests avec différents types d\'événements de l\'API', () => {
    it('affiche correctement un événement gastronomique', () => {
      const foodEvent: Event = {
        id: 5,
        date: "2026-05-03T19:00:00",
        description: "Festival gastronomique mettant en avant les spécialités provençales",
        name: "Saveurs de Provence - Antibes",
        address: "Port Vauban, 06600 Antibes",
        maxCustomers: 250,
        isTrending: false,
        price: 65.0,
        status: "NOT_STARTED",
        imageUrl: "https://res.cloudinary.com/dtepwacbx/image/upload/v1751890500/danny-howe-bn-D2bCvpik-unsplash_adelrk.jpg",
        currentParticipants: 0,
        cityName: "Villefranche-sur-Mer",
        placeName: "Citadelle Saint-Elme",
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
            href: "http://localhost:8090/api/v1/events/5"
          }
        }
      }

      render(<EventCard id="5" event={foodEvent} />)
      
      expect(screen.getByText('Saveurs de Provence - Antibes')).toBeInTheDocument()
      expect(screen.getByText('Festival gastronomique mettant en avant les spécialités provençales')).toBeInTheDocument()
      expect(screen.getByText('Port Vauban, 06600 Antibes')).toBeInTheDocument()
      expect(screen.getByText(/À partir de/)).toBeInTheDocument()
      expect(screen.getByText(/65/)).toBeInTheDocument()
      expect(screen.getByText(/€/)).toBeInTheDocument()
      expect(screen.getByText('Nourriture')).toBeInTheDocument()
      expect(screen.getByText('Culture')).toBeInTheDocument()
    })

    it('affiche correctement un événement de bien-être', () => {
      const wellnessEvent: Event = {
        id: 6,
        date: "2026-04-20T08:00:00",
        description: "Séance de yoga matinale face à la mer avec petit-déjeuner healthy",
        name: "Yoga Sunrise Menton",
        address: "Promenade du Soleil, 06500 Menton",
        maxCustomers: 40,
        isTrending: false,
        price: 30.0,
        status: "NOT_STARTED",
        imageUrl: "https://res.cloudinary.com/dtepwacbx/image/upload/v1751890500/danny-howe-bn-D2bCvpik-unsplash_adelrk.jpg",
        currentParticipants: 0,
        cityName: "Antibes",
        placeName: "Musée Picasso Antibes",
        isInvitationOnly: false,
        categories: [
          {
            name: "Bien-être",
            key: "wellness"
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
            href: "http://localhost:8090/api/v1/events/6"
          }
        }
      }

      render(<EventCard id="6" event={wellnessEvent} />)
      
      expect(screen.getByText('Yoga Sunrise Menton')).toBeInTheDocument()
      expect(screen.getByText('Séance de yoga matinale face à la mer avec petit-déjeuner healthy')).toBeInTheDocument()
      expect(screen.getByText('Promenade du Soleil, 06500 Menton')).toBeInTheDocument()
      expect(screen.getByText(/À partir de/)).toBeInTheDocument()
      expect(screen.getByText(/30/)).toBeInTheDocument()
      expect(screen.getByText(/€/)).toBeInTheDocument()
      expect(screen.getByText('Bien-être')).toBeInTheDocument()
    })
  })
}) 