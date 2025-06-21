export const mockOrganizers = [
  {
    id: 10,
    lastName: "Martin",
    firstName: "Sophie",
    pseudo: "sophie_events",
    email: "sophie.martin@veevent.com",
    phone: "+33 6 12 34 56 78",
    eventPastCount: 15,
    eventsCount: 8,
    role: "Organizer",
    description:
      "Organisatrice passionnée d'événements culturels et artistiques. Spécialisée dans les concerts et expositions.",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108755-2616b612b105?w=400",
    bannerUrl:
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1200",
    socials: ["@sophie_events", "sophie.martin.events"],
    categories: ["Musique", "Art", "Culture"],
    note: 5,
    _links: {
      self: {
        href: "http://localhost:8090/users/10",
      },
      events: {
        href: "http://localhost:8090/users/10/events",
      },
    },
  },
  {
    id: 11,
    lastName: "Dubois",
    firstName: "Alexandre",
    pseudo: "alex_sports",
    email: "a.dubois@sportevent.fr",
    phone: "+33 7 98 76 54 32",
    eventPastCount: 22,
    eventsCount: 12,
    role: "Organizer",
    description:
      "Coach sportif et organisateur d'événements sportifs. Marathons, tournois et challenges fitness.",
    imageUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    bannerUrl:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200",
    socials: ["@alexsports", "alexandre.dubois.sport"],
    categories: ["Sport", "Fitness", "Course"],
    note: 1,
    _links: {
      self: {
        href: "http://localhost:8090/users/11",
      },
      events: {
        href: "http://localhost:8090/users/11/events",
      },
    },
  },
  {
    id: 12,
    lastName: "Chen",
    firstName: "Li",
    pseudo: "li_tech",
    email: "li.chen@techevents.io",
    phone: "+33 6 55 44 33 22",
    eventPastCount: 30,
    eventsCount: 18,
    role: "Organizer",
    description:
      "Experte en technologie et innovation. J'organise des meetups, hackathons et conférences tech.",
    imageUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    bannerUrl:
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200",
    socials: ["@li_tech_events", "li.chen.dev"],
    categories: ["Technologie", "Innovation", "Développement"],
    note: 4,
    _links: {
      self: {
        href: "http://localhost:8090/users/12",
      },
      events: {
        href: "http://localhost:8090/users/12/events",
      },
    },
  },
  {
    id: 13,
    lastName: "Rodriguez",
    firstName: "Maria",
    pseudo: "maria_gastro",
    email: "maria.rodriguez@foodevents.com",
    phone: "+33 6 11 22 33 44",
    eventPastCount: 18,
    eventsCount: 9,
    role: "Organizer",
    description:
      "Cheffe cuisinière et organisatrice d'événements culinaires. Ateliers de cuisine, dégustations et festivals gastronomiques.",
    imageUrl:
      "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=400",
    bannerUrl:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200",
    socials: ["@maria_gastro", "maria.rodriguez.chef"],
    categories: ["Gastronomie", "Cuisine", "Dégustation"],
    note: 3,
    _links: {
      self: {
        href: "http://localhost:8090/users/13",
      },
      events: {
        href: "http://localhost:8090/users/13/events",
      },
    },
  },
  {
    id: 14,
    lastName: "Johnson",
    firstName: "Thomas",
    pseudo: "tom_nature",
    email: "t.johnson@natureevents.org",
    phone: "+33 7 66 55 44 33",
    eventPastCount: 25,
    eventsCount: 14,
    role: "Organizer",
    description:
      "Guide nature et organisateur d'activités en plein air. Randonnées, camping et événements écologiques.",
    imageUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    bannerUrl:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200",
    socials: ["@tom_nature_guide", "thomas.johnson.nature"],
    categories: ["Nature", "Randonnée", "Écologie"],
    note: 2,
    _links: {
      self: {
        href: "http://localhost:8090/users/14",
      },
      events: {
        href: "http://localhost:8090/users/14/events",
      },
    },
  },
];
