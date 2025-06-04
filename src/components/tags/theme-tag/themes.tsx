import {
  Basketball,
  Football,
  Golf,
  Swimming,
  Gym,
  Running,
  Walking,
  Cycling,
  Archery,
  Palette,
  Book,
  Calendar,
  Gift,
  BirthdayCake,
  Bonfire,
  Headset,
  Megaphone,
  Microphone,
  BowlingBall,
  BoxingGlove,
  CinemaOld,
  FireFlame,
  Fishing,
  Flower,
  FootballBall,
  GraphUp,
  Medal,
  SeaWaves,
  Skateboarding,
  SoccerBall,
  TennisBall,
  Trekking,
  Trophy,
  Yoga,
  Fish,
  Jellyfish,
  Wolf,
  Cellar,
  Church,
  Hospital,
  Shop,
  Garage,
  Shirt,
  Bag,
  Suitcase,
  Umbrella,
  AtSign,
  Bell,
  ChatBubble,
  Mail,
  HeadsetHelp,
  Globe,
  Internet,
  Bug,
  Laptop,
  Tv,
  Apple,
  CoffeeCup,
  Cutlery,
  PizzaSlice,
  IceCream,
  Arcade,
  Crown,
  PeaceHand,
  Heart,
  Donate,
  Stroller,
  SleeperChair,
  SmallLamp,
  LightBulbOn,
  Map,
  CompactDisc,
  MusicDoubleNote,
  Leaf,
  PineTree,
  Vegan,
  Binocular,
  Clock,
  HalfMoon,
  Language,
  Timer,
  VideoCamera,
  Flask,
  Planet,
  Wrench,
  Airplane,
  Bicycle,
  Car,
  Train,
} from "iconoir-react";
import { ReactNode } from "react";

interface ThemeIcon {
  icon: ReactNode;
  name: string;
}

interface ThemeIcons {
  [key: string]: ThemeIcon;
}

const themeIcons: ThemeIcons = {
  default: { icon: <Calendar className="icon-small" />, name: "Événement" },

  // Sports & Fitness
  sport: { icon: <Basketball className="icon-small" />, name: "Sport" },
  basketball: {
    icon: <Basketball className="icon-small" />,
    name: "Basketball",
  },
  football: { icon: <Football className="icon-small" />, name: "Football" },
  golf: { icon: <Golf className="icon-small" />, name: "Golf" },
  swimming: { icon: <Swimming className="icon-small" />, name: "Natation" },
  gym: { icon: <Gym className="icon-small" />, name: "Musculation" },
  running: { icon: <Running className="icon-small" />, name: "Course" },
  walking: { icon: <Walking className="icon-small" />, name: "Marche" },
  cycling: { icon: <Cycling className="icon-small" />, name: "Vélo" },
  archery: { icon: <Archery className="icon-small" />, name: "Tir à l'arc" },
  bowling: { icon: <BowlingBall className="icon-small" />, name: "Bowling" },
  boxing: { icon: <BoxingGlove className="icon-small" />, name: "Boxe" },
  fishing: { icon: <Fishing className="icon-small" />, name: "Pêche" },
  skateboarding: {
    icon: <Skateboarding className="icon-small" />,
    name: "Skate",
  },
  soccer: { icon: <SoccerBall className="icon-small" />, name: "Football" },
  tennis: { icon: <TennisBall className="icon-small" />, name: "Tennis" },
  trekking: { icon: <Trekking className="icon-small" />, name: "Randonnée" },
  yoga: { icon: <Yoga className="icon-small" />, name: "Yoga" },

  // Arts & Culture
  art: { icon: <Palette className="icon-small" />, name: "Art" },
  cinema: { icon: <CinemaOld className="icon-small" />, name: "Cinéma" },
  music: { icon: <Headset className="icon-small" />, name: "Musique" },
  live_music: {
    icon: <MusicDoubleNote className="icon-small" />,
    name: "Concert",
  },
  concert: { icon: <Microphone className="icon-small" />, name: "Spectacle" },
  theater: { icon: <CompactDisc className="icon-small" />, name: "Théâtre" },

  // Education & Learning
  education: { icon: <Book className="icon-small" />, name: "Éducation" },
  workshop: { icon: <LightBulbOn className="icon-small" />, name: "Atelier" },
  conference: {
    icon: <Megaphone className="icon-small" />,
    name: "Conférence",
  },
  seminar: { icon: <GraphUp className="icon-small" />, name: "Séminaire" },
  language: { icon: <Language className="icon-small" />, name: "Langue" },

  // Technology & Gaming
  gaming: { icon: <Arcade className="icon-small" />, name: "Gaming" },
  tech: { icon: <Laptop className="icon-small" />, name: "Tech" },
  digital: { icon: <Internet className="icon-small" />, name: "Numérique" },
  coding: { icon: <Bug className="icon-small" />, name: "Code" },

  // Food & Dining
  food: { icon: <Apple className="icon-small" />, name: "Nourriture" },
  coffee: { icon: <CoffeeCup className="icon-small" />, name: "Café" },
  dining: { icon: <Cutlery className="icon-small" />, name: "Restaurant" },
  pizza: { icon: <PizzaSlice className="icon-small" />, name: "Pizza" },
  dessert: { icon: <IceCream className="icon-small" />, name: "Dessert" },

  // Celebrations & Social
  birthday: {
    icon: <BirthdayCake className="icon-small" />,
    name: "Anniversaire",
  },
  party: { icon: <Bonfire className="icon-small" />, name: "Fête" },
  wedding: { icon: <Heart className="icon-small" />, name: "Mariage" },
  gift: { icon: <Gift className="icon-small" />, name: "Cadeau" },
  celebration: { icon: <Crown className="icon-small" />, name: "Célébration" },
  peace: { icon: <PeaceHand className="icon-small" />, name: "Paix" },

  // Business & Professional
  business: { icon: <Suitcase className="icon-small" />, name: "Business" },
  networking: { icon: <ChatBubble className="icon-small" />, name: "Réseau" },
  presentation: { icon: <Tv className="icon-small" />, name: "Présentation" },
  meeting: { icon: <Calendar className="icon-small" />, name: "Réunion" },
  sponsored: { icon: <Megaphone className="icon-small" />, name: "Sponsorisé" },

  // Charity & Community
  charity: { icon: <Donate className="icon-small" />, name: "Charité" },
  community: { icon: <Globe className="icon-small" />, name: "Communauté" },
  volunteering: {
    icon: <HeadsetHelp className="icon-small" />,
    name: "Bénévolat",
  },

  // Family & Kids
  family: { icon: <Stroller className="icon-small" />, name: "Famille" },
  kids: { icon: <Jellyfish className="icon-small" />, name: "Enfants" },

  // Nature & Environment
  nature: { icon: <Leaf className="icon-small" />, name: "Nature" },
  environment: { icon: <PineTree className="icon-small" />, name: "Écologie" },
  outdoor: { icon: <Flower className="icon-small" />, name: "Extérieur" },
  water: { icon: <SeaWaves className="icon-small" />, name: "Eau" },
  wildlife: { icon: <Wolf className="icon-small" />, name: "Faune" },
  vegan: { icon: <Vegan className="icon-small" />, name: "Végan" },

  // Travel & Adventure
  travel: { icon: <Airplane className="icon-small" />, name: "Voyage" },
  adventure: { icon: <Map className="icon-small" />, name: "Aventure" },
  exploration: {
    icon: <Binocular className="icon-small" />,
    name: "Exploration",
  },
  transport: { icon: <Train className="icon-small" />, name: "Transport" },
  bike: { icon: <Bicycle className="icon-small" />, name: "Vélo" },
  car: { icon: <Car className="icon-small" />, name: "Voiture" },

  // Venues & Locations
  church: { icon: <Church className="icon-small" />, name: "Église" },
  hospital: { icon: <Hospital className="icon-small" />, name: "Hôpital" },
  shop: { icon: <Shop className="icon-small" />, name: "Boutique" },
  garage: { icon: <Garage className="icon-small" />, name: "Garage" },
  cellar: { icon: <Cellar className="icon-small" />, name: "Cave" },

  // Fashion & Style
  fashion: { icon: <Shirt className="icon-small" />, name: "Mode" },
  shopping: { icon: <Bag className="icon-small" />, name: "Shopping" },

  // Science & Research
  science: { icon: <Flask className="icon-small" />, name: "Science" },
  astronomy: { icon: <Planet className="icon-small" />, name: "Astronomie" },

  // Home & Lifestyle
  home: { icon: <SmallLamp className="icon-small" />, name: "Maison" },
  relaxation: {
    icon: <SleeperChair className="icon-small" />,
    name: "Détente",
  },

  // Time & Schedule
  evening: { icon: <HalfMoon className="icon-small" />, name: "Soirée" },
  timed: { icon: <Timer className="icon-small" />, name: "Chronométré" },
  scheduled: { icon: <Clock className="icon-small" />, name: "Programmé" },

  // Media & Communication
  video: { icon: <VideoCamera className="icon-small" />, name: "Vidéo" },
  mail: { icon: <Mail className="icon-small" />, name: "Courrier" },
  notification: { icon: <Bell className="icon-small" />, name: "Notification" },
  contact: { icon: <AtSign className="icon-small" />, name: "Contact" },

  // Weather & Seasonal
  weather: { icon: <Umbrella className="icon-small" />, name: "Météo" },
  fire: { icon: <FireFlame className="icon-small" />, name: "Feu" },

  // Awards & Recognition
  award: { icon: <Medal className="icon-small" />, name: "Récompense" },
  trophy: { icon: <Trophy className="icon-small" />, name: "Trophée" },

  // Tools & Equipment
  tools: { icon: <Wrench className="icon-small" />, name: "Outils" },
  marine: { icon: <Fish className="icon-small" />, name: "Marin" },
};

export default themeIcons;
