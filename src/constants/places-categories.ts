// Dictionnaire de correspondance entre les types de lieux et les labels de catégories
export const PLACE_TYPE_LABELS: Record<string, string> = {
  "theatre": "Théâtres et salles de spectacle",
  "museum": "Musées et centres d'art",
  "stadium": "Stades et arènes",
  "conference": "Salles de conférence et congrès",
  "cinema": "Cinémas",
  "gallery": "Galeries d'art",
  "club": "Clubs et discothèques",
  "park": "Parcs et espaces extérieurs",
  "auditorium": "Auditoriums",
  "exhibition": "Centres d'exposition",
  "default": "Autres lieux",
};

// Liste ordonnée des clés pour l'affichage
export const PLACE_TYPE_ORDER: string[] = [
  "theatre",
  "museum",
  "stadium",
  "conference",
  "cinema",
  "gallery",
  "club",
  "park",
  "auditorium",
  "exhibition",
  "default",
]; 