import { Event } from '@/types'
import { render } from '@testing-library/react'
import EventCard from '../event-card'

describe('EventCard Snapshot', () => {
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

  it('correspond au snapshot en mode normal', () => {
    const { container } = render(<EventCard id="1" event={mockEvent} />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('correspond au snapshot en mode minify', () => {
    const { container } = render(<EventCard id="1" event={mockEvent} minify={true} />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('correspond au snapshot en mode grid', () => {
    const { container } = render(<EventCard id="1" event={mockEvent} grid={true} />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('correspond au snapshot pour un événement gratuit', () => {
    const freeEvent: Event = {
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
    
    const { container } = render(<EventCard id="10" event={freeEvent} />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('correspond au snapshot sans organisateur', () => {
    const eventWithoutOrganizer = { ...mockEvent, organizer: undefined }
    const { container } = render(<EventCard id="1" event={eventWithoutOrganizer} />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('correspond au snapshot avec plusieurs catégories', () => {
    const eventWithMultipleCategories: Event = {
      ...mockEvent,
      categories: [
        {
          name: "Nourriture",
          key: "food"
        },
        {
          name: "Culture",
          key: "culture"
        },
        {
          name: "Sport",
          key: "sport"
        }
      ]
    }
    
    const { container } = render(<EventCard id="1" event={eventWithMultipleCategories} />)
    expect(container.firstChild).toMatchSnapshot()
  })
}) 