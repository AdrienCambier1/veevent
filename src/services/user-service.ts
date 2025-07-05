const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8090/api/v1";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("veevent_token"); // Remplace par la clé exacte si différente
}

// Fonction pour convertir SingleUser vers UserData
function convertSingleUserToUserData(singleUser: any): any {
  return {
    id: singleUser.id,
    firstName: singleUser.firstName,
    lastName: singleUser.lastName,
    pseudo: singleUser.pseudo,
    email: singleUser.email,
    phone: singleUser.phone,
    description: singleUser.description,
    imageUrl: singleUser.imageUrl,
    bannerUrl: singleUser.bannerUrl,
    note: singleUser.note,
    role: singleUser.role,
    eventsCount: singleUser.eventsCount,
    eventPastCount: singleUser.eventPastCount,
    socials: singleUser.socials,
    categories: singleUser.categories?.map((cat: string) => ({
      key: cat,
      name: cat,
      description: "",
      trending: false
    })) || [],
    isOrganizer: singleUser.role === "Organizer" || singleUser.role === "Admin" || singleUser.role === "AuthService",
    // Préserver les liens HATEOAS
    _links: singleUser._links
  };
}

export const userService = {
  async getMe(token?: string) {
    if (!token) throw new Error("Utilisateur non authentifié");
    const res = await fetch(`${API_BASE_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include"
    });
    if (!res.ok) throw new Error("Erreur lors de la récupération de l'utilisateur");
    return res.json();
  },

  async getUserBySlug(slug: string, token?: string) {
    const res = await fetch(`${API_BASE_URL}/users/slug/${slug}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      credentials: "include"
    });
    if (!res.ok) throw new Error("Erreur lors de la récupération de l'utilisateur");
    const data = await res.json();
    return convertSingleUserToUserData(data);
  },

  async getUserEvents(eventsLink: string) {
    const res = await fetch(eventsLink, {
      credentials: "include"
    });
    if (!res.ok) throw new Error("Erreur lors de la récupération des événements");
    return res.json();
  },

  async getUserEventsById(userId: number) {
    const res = await fetch(`${API_BASE_URL}/users/${userId}/events`, {
      credentials: "include"
    });
    if (!res.ok) throw new Error("Erreur lors de la récupération des événements");
    return res.json();
  },

  async getUserEventsByUserId(userId: number, token?: string) {
    if (!token) throw new Error("Utilisateur non authentifié");
    const res = await fetch(`${API_BASE_URL}/users/${userId}/events`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include"
    });
    if (!res.ok) throw new Error("Erreur lors de la récupération des événements");
    return res.json();
  },

  async getOrdersByUserLink(token?: string) {
    if (!token) throw new Error("Utilisateur non authentifié");
    const res = await fetch(`${API_BASE_URL}/users/me/orders`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include"
    });
    if (!res.ok) throw new Error("Erreur lors de la récupération des commandes utilisateur");
    return res.json();
  },
};

export default userService; 