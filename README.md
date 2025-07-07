# 🎫 Veevent - Frontend - Plateforme de Gestion d'Événements

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.2.2-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.17-38B2AC.svg)](https://tailwindcss.com/)
[![Jest](https://img.shields.io/badge/Jest-29.7.0-C21325.svg)](https://jestjs.io/)

Next.js 15 React 19 TypeScript Tailwind CSS

## 📋 Table des matières

* [Description du projet](#-description-du-projet)
* [Fonctionnalités principales](#-fonctionnalités-principales)
* [Architecture technique](#️-architecture-technique)
* [Prérequis](#-prérequis)
* [Installation et configuration](#-installation-et-configuration)
* [Démarrage rapide](#-démarrage-rapide)
* [Configuration avancée](#-configuration-avancée)
* [Structure du projet](#-structure-du-projet)
* [Authentification et sécurité](#-authentification-et-sécurité)
* [Tests](#-tests)
* [Déploiement](#-déploiement)
* [Contribution](#-contribution)
* [Support](#-support)

## 🎯 Description du projet

**Veevent Frontend** est l'interface utilisateur moderne de la plateforme Veevent, développée avec Next.js 15 et React 19. Elle offre une expérience utilisateur fluide et responsive pour découvrir, réserver et gérer des événements culturels, sportifs et de loisirs.

### 🎪 Cas d'usage

* **Utilisateurs** : Découverte d'événements, réservation de billets, gestion de profil
* **Organisateurs** : Gestion d'événements, suivi des participants, création de contenu
* **Administrateurs** : Modération, gestion des utilisateurs, statistiques
* **Recherche** : Système de recherche avancée avec filtres multiples et géolocalisation

## ✨ Fonctionnalités principales

### 🔐 Authentification et autorisation

* **Authentification JWT** avec tokens sécurisés
* **OAuth2** avec support **Google** et **GitHub**
* **Gestion des rôles** : User, Organizer, Admin
* **Protection des routes** avec middleware Next.js
* **Refresh automatique** des tokens
* **Gestion des sessions** côté client

### 👥 Gestion des utilisateurs

* **Profils utilisateurs** complets avec avatars et bannières
* **Système de préférences** par catégories d'événements
* **Gestion des réseaux sociaux** et informations personnelles
* **Profils d'organisateurs** avec évaluations et avis
* **Complétion de profil** guidée

### 🎫 Système de réservation

* **Réservation de billets** avec sélecteur de quantité
* **Génération de codes QR** pour l'accès aux événements
* **Gestion des commandes** et historique des achats
* **Système d'invitations** pour événements privés
* **Validation des billets** à l'entrée
* **Notifications** de réservation

### 🎪 Gestion des événements

* **Catalogue d'événements** avec filtres avancés
* **Recherche globale** et par catégories
* **Système de favoris** et recommandations
* **Événements tendance** et populaires
* **Géolocalisation** et événements à proximité
* **Événements "première édition"** et spéciaux

### 🏢 Gestion des organisateurs

* **Profils d'organisateurs** avec avis et évaluations
* **Gestion des événements** par organisateur
* **Système de notation** et commentaires
* **Demande de rôle organisateur**
* **Statistiques** et analytics

### 📍 Gestion géographique

* **Villes** : Gestion complète avec régions
* **Lieux** : Salles, espaces, types de lieux
* **Cartes interactives** Google Maps
* **Recherche géographique** intégrée
* **Géolocalisation IP** automatique

### 🔍 Recherche avancée

* **Recherche globale** multi-entités
* **Recherche typée** par catégorie
* **Filtres combinés** (ville, lieu, prix, dates, catégories)
* **Pagination** et tri intelligent
* **Suggestions** et autocomplétion

### 📱 Interface utilisateur

* **Design responsive** mobile-first
* **Animations fluides** avec Framer Motion et GSAP
* **Accessibilité** complète (WCAG 2.1)
* **Mode sombre** (préparé)
* **PWA** ready

## 🏗️ Architecture technique

### Stack technologique

| Composant             | Version | Description                  |
| --------------------- | ------- | ---------------------------- |
| **Node.js**           | 18+     | Runtime JavaScript           |
| **Next.js**           | 15.2.2  | Framework React full-stack   |
| **React**             | 19.0.0  | Bibliothèque UI             |
| **TypeScript**        | 5.8.3   | Typage statique             |
| **Tailwind CSS**      | 3.4.17  | Framework CSS utilitaire    |
| **Sass**              | 1.89.1  | Préprocesseur CSS           |

### Bibliothèques principales

| Catégorie             | Bibliothèques                                    | Description                  |
| --------------------- | ------------------------------------------------ | ---------------------------- |
| **UI/UX**             | Framer Motion, GSAP, Iconoir, FontAwesome       | Animations et icônes         |
| **Cartes**            | Google Maps API, @vis.gl/react-google-maps      | Géolocalisation             |
| **Authentification**  | JWT, jwt-decode, OAuth2                          | Sécurité et auth             |
| **Carrousels**        | Embla Carousel, Swiper                           | Composants interactifs       |
| **Utilitaires**       | QRCode, Request-IP, React Focus Lock            | Fonctionnalités diverses     |
| **Tests**             | Jest, Testing Library, Coverage                  | Tests et qualité             |

### Architecture Next.js 15

* **App Router** : Nouveau système de routage basé sur les dossiers
* **Server Components** : Rendu côté serveur pour les performances
* **Client Components** : Interactivité côté client
* **Middleware** : Protection des routes et authentification
* **API Routes** : Endpoints API intégrés
* **Image Optimization** : Optimisation automatique des images

## 📦 Prérequis

### Système
* **Node.js** 18.0.0 ou supérieur
* **npm** 9.0.0 ou supérieur (ou yarn/pnpm)
* **Git** pour la gestion de version

### Services externes
* **Compte Google Cloud** pour l'API Maps
* **API Backend** Veevent (voir [apifilrouge](https://github.com/Quantix06/apifilrouge/))

## 🚀 Installation et configuration

### 1. Cloner le repository

```bash
git clone <repository-url>
cd veevent
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration des variables d'environnement

Créer un fichier `.env.local` à la racine du projet :

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8090/api/v1
NEXT_PUBLIC_USE_MOCK_DATA=false

# Google Maps API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# OAuth2 Configuration (optionnel)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id

# Environment
NODE_ENV=development
```

### Variables d'environnement

| Variable | Description | Défaut | Requis |
|----------|-------------|---------|---------|
| `NEXT_PUBLIC_API_URL` | URL de l'API backend | `http://localhost:8090/api/v1` | ✅ |
| `NEXT_PUBLIC_USE_MOCK_DATA` | Utiliser les données de test | `false` | ❌ |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Clé API Google Maps | - | ✅ |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Client ID Google OAuth2 | - | ❌ |
| `NEXT_PUBLIC_GITHUB_CLIENT_ID` | Client ID GitHub OAuth2 | - | ❌ |
| `NODE_ENV` | Environnement d'exécution | `development` | ❌ |

## ⚡ Démarrage rapide

### Développement

```bash
# Démarrer le serveur de développement
npm run dev

# Démarrer avec Turbopack (plus rapide)
npm run dev:turbo

# Démarrer avec nettoyage du cache
npm run dev:fast
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

### Production

```bash
# Construire l'application
npm run build

# Démarrer en production
npm run start
```

## 🔧 Configuration avancée

### Google Maps

Pour utiliser les cartes interactives :

1. **Créer un projet Google Cloud**
   - Aller sur [Google Cloud Console](https://console.cloud.google.com/)
   - Créer un nouveau projet ou sélectionner un existant

2. **Activer l'API Maps JavaScript**
   - Dans la console, aller dans "APIs & Services" > "Library"
   - Rechercher "Maps JavaScript API"
   - Cliquer sur "Enable"

3. **Créer une clé API**
   - Aller dans "APIs & Services" > "Credentials"
   - Cliquer sur "Create Credentials" > "API Key"
   - Copier la clé générée

4. **Configurer les restrictions** (recommandé)
   - Cliquer sur la clé créée
   - Ajouter des restrictions HTTP (domaines autorisés)
   - Ajouter des restrictions d'API (Maps JavaScript API uniquement)

5. **Ajouter la clé dans `.env.local`**
   ```env
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```

### OAuth2 Configuration

#### Google OAuth2

1. **Créer un projet OAuth2**
   - Aller sur [Google Cloud Console](https://console.cloud.google.com/)
   - Activer l'API Google+ API
   - Créer des identifiants OAuth2

2. **Configurer les URIs de redirection**
   - `http://localhost:3000/auth/callback` (développement)
   - `https://yourdomain.com/auth/callback` (production)

#### GitHub OAuth2

1. **Créer une application OAuth**
   - Aller dans [GitHub Settings > Developer settings > OAuth Apps](https://github.com/settings/developers)
   - Cliquer sur "New OAuth App"

2. **Configurer l'application**
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/auth/callback`

### API Backend

L'application nécessite une API backend compatible avec les endpoints suivants :

| Endpoint | Description | Méthodes |
|----------|-------------|----------|
| `/auth/*` | Authentification | POST, GET |
| `/events/*` | Gestion des événements | GET, POST, PUT, DELETE |
| `/users/*` | Gestion des utilisateurs | GET, POST, PUT, DELETE |
| `/cities/*` | Gestion des villes | GET |
| `/places/*` | Gestion des lieux | GET |
| `/organizers/*` | Gestion des organisateurs | GET |
| `/orders/*` | Gestion des commandes | GET, POST |
| `/tickets/*` | Gestion des billets | GET, POST |
| `/search/*` | Recherche globale | GET |

## 📁 Structure du projet

```
veevent/
├── src/
│   ├── app/                    # Pages Next.js (App Router)
│   │   ├── @sheet/            # Composants de sheet (drawer)
│   │   │   └── search/        # Recherche en sheet
│   │   ├── auth/              # Authentification
│   │   │   ├── callback/      # Callbacks OAuth2
│   │   │   └── complete-profile/ # Complétion de profil
│   │   ├── compte/            # Espace utilisateur
│   │   │   ├── enregistres/   # Événements enregistrés
│   │   │   ├── mes-evenements/ # Événements créés
│   │   │   ├── my-veevent/    # Événements participés
│   │   │   ├── parametres/    # Paramètres utilisateur
│   │   │   └── tickets/       # Gestion des billets
│   │   ├── connexion/         # Page de connexion
│   │   ├── evenements/        # Pages événements
│   │   │   └── [id]/          # Détail événement
│   │   │       ├── [slug]/    # Slug de l'événement
│   │   │       └── order/     # Page de commande
│   │   ├── inscription/       # Page d'inscription
│   │   ├── lieux/             # Pages lieux
│   │   │   └── [place]/       # Détail lieu
│   │   ├── organisateurs/     # Pages organisateurs
│   │   │   └── [user]/        # Profil organisateur
│   │   └── villes/            # Pages villes
│   │       └── [city]/        # Détail ville
│   ├── components/            # Composants React
│   │   ├── cards/             # Cartes d'affichage
│   │   │   ├── event-card/    # Carte événement
│   │   │   ├── organizer-card/ # Carte organisateur
│   │   │   ├── place-card/    # Carte lieu
│   │   │   ├── ticket-card/   # Carte billet
│   │   │   └── ...            # Autres cartes
│   │   ├── commons/           # Composants communs
│   │   │   ├── auth-guard/    # Protection d'authentification
│   │   │   ├── billet-selector/ # Sélecteur de billets
│   │   │   ├── filters/       # Filtres de recherche
│   │   │   ├── modal/         # Modales
│   │   │   ├── qr-code/       # Génération QR
│   │   │   └── ...            # Autres composants
│   │   ├── footer/            # Pied de page
│   │   ├── header/            # En-tête
│   │   ├── heads/             # En-têtes de pages
│   │   ├── images/            # Composants d'images
│   │   ├── inputs/            # Composants de saisie
│   │   ├── lists/             # Composants de listes
│   │   ├── menu/              # Menus de navigation
│   │   └── tags/              # Composants de tags
│   ├── config/                # Configuration
│   │   └── auth.config.ts     # Configuration authentification
│   ├── constants/             # Constantes
│   │   ├── places-categories.ts # Catégories de lieux
│   │   └── regions.ts         # Régions géographiques
│   ├── contexts/              # Contextes React
│   │   ├── auth-context.tsx   # Contexte d'authentification
│   │   ├── city-context.tsx   # Contexte de ville
│   │   ├── filter-context.tsx # Contexte de filtres
│   │   ├── header-context.tsx # Contexte d'en-tête
│   │   └── sidebar-context.tsx # Contexte de sidebar
│   ├── hooks/                 # Hooks personnalisés
│   │   ├── cities/            # Hooks pour les villes
│   │   ├── commons/           # Hooks communs
│   │   ├── events/            # Hooks pour les événements
│   │   ├── organizers/        # Hooks pour les organisateurs
│   │   ├── places/            # Hooks pour les lieux
│   │   └── reviews/           # Hooks pour les avis
│   ├── pages/                 # Pages API (optionnel)
│   │   └── api/               # Endpoints API
│   ├── services/              # Services API
│   │   ├── auth-service.ts    # Service d'authentification
│   │   ├── category-service.ts # Service des catégories
│   │   ├── city-service.ts    # Service des villes
│   │   ├── event-service.ts   # Service des événements
│   │   ├── place-service.ts   # Service des lieux
│   │   ├── search-service.ts  # Service de recherche
│   │   ├── user-service.ts    # Service des utilisateurs
│   │   └── data/              # Données de test
│   ├── types/                 # Types TypeScript
│   │   └── index.ts           # Définitions de types
│   └── utils/                 # Utilitaires
│       ├── deslugify.ts       # Conversion slug
│       └── security.ts        # Utilitaires de sécurité
├── public/                    # Assets statiques
│   ├── *.svg                  # Icônes et logos
│   └── *.png                  # Images
├── .next/                     # Build Next.js (généré)
├── node_modules/              # Dépendances (généré)
├── .gitignore                 # Fichiers ignorés par Git
├── .npmrc                     # Configuration npm
├── eslint.config.mjs          # Configuration ESLint
├── images.d.ts                # Types pour les images
├── jest.config.js             # Configuration Jest
├── jest.setup.js              # Setup Jest
├── next.config.mjs            # Configuration Next.js
├── next-env.d.ts              # Types Next.js
├── package.json               # Dépendances et scripts
├── postcss.config.mjs         # Configuration PostCSS
├── tailwind.config.mjs        # Configuration Tailwind
└── tsconfig.json              # Configuration TypeScript
```

## 🔐 Authentification et sécurité

### Types d'authentification

1. **JWT (JSON Web Tokens)**
   * Authentification par email/mot de passe
   * Tokens avec expiration configurable
   * Refresh automatique des tokens
   * Stockage sécurisé côté client

2. **OAuth2**
   * Authentification **Google** et **GitHub**
   * Intégration avec les réseaux sociaux
   * URLs de redirection configurées
   * Gestion des callbacks

### Rôles et permissions

| Rôle | Permissions | Description |
|------|-------------|-------------|
| **USER** | Lecture publique, gestion profil, participation | Utilisateur standard |
| **ORGANIZER** | USER + création événements, gestion participants | Organisateur d'événements |
| **ADMIN** | Toutes les permissions | Administrateur système |

### Sécurité des routes

* **Middleware Next.js** : Protection automatique des routes
* **AuthGuard** : Composant de protection d'authentification
* **ProfileCompleteGuard** : Vérification du profil complet
* **Validation** : Validation côté client et serveur
* **CSRF Protection** : Protection contre les attaques CSRF
* **XSS Protection** : Protection contre les injections XSS

## 🧪 Tests

### Exécution des tests

```bash
# Tests unitaires
npm run test

# Tests en mode watch
npm run test:watch

# Tests avec couverture
npm run test:coverage

# Interface de tests
npm run test:ui
```

### Types de tests

* **Tests unitaires** : Composants et utilitaires
* **Tests d'intégration** : Services et hooks
* **Tests de snapshot** : Rendu des composants
* **Tests d'accessibilité** : Conformité WCAG
* **Tests de performance** : Métriques de performance

### Configuration Jest

Le projet utilise Jest avec les configurations suivantes :
- **Environment** : jsdom pour les tests DOM
- **Coverage** : Rapport de couverture automatique
- **Setup** : Configuration globale des tests
- **Mocking** : Mock des modules externes

## 🚀 Déploiement

### Vercel (recommandé)

1. **Connecter le repository**
   - Aller sur [Vercel](https://vercel.com/)
   - Connecter le repository GitHub
   - Configurer le projet

2. **Configurer les variables d'environnement**
   - Ajouter toutes les variables dans l'interface Vercel
   - Configurer les variables par environnement

3. **Déployer**
   - Le déploiement se fait automatiquement à chaque push
   - Vercel optimise automatiquement l'application

### Autres plateformes

L'application peut être déployée sur n'importe quelle plateforme supportant Next.js :

#### Netlify
```bash
# Build command
npm run build

# Publish directory
.next
```

#### AWS Amplify
```bash
# Build settings
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm install
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
```

#### DigitalOcean App Platform
- Sélectionner le type "Web Service"
- Configurer le build command : `npm run build`
- Configurer le run command : `npm start`

#### Railway
- Connecter le repository
- Railway détecte automatiquement Next.js
- Configuration automatique

### Variables d'environnement de production

| Variable | Description | Exemple |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | URL de l'API backend | `https://api.veevent.com/api/v1` |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Clé API Google Maps | `AIza...` |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Client ID Google OAuth2 | `123456789.apps.googleusercontent.com` |
| `NEXT_PUBLIC_GITHUB_CLIENT_ID` | Client ID GitHub OAuth2 | `abcdef123456` |

## 🤝 Contribution

### Comment contribuer

1. **Fork** le projet
2. **Créer** une branche feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** vos changements (`git commit -m 'Add some AmazingFeature'`)
4. **Push** vers la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrir** une Pull Request

### Standards de code

* **TypeScript** : Utiliser le typage strict
* **React** : Suivre les bonnes pratiques React
* **Next.js** : Respecter les conventions Next.js 15
* **Tests** : Maintenir une couverture > 80%
* **Accessibilité** : Respecter les standards WCAG 2.1
* **Performance** : Optimiser les métriques Core Web Vitals

### Checklist avant contribution

* [ ] Code compilé sans erreurs TypeScript
* [ ] Tests unitaires passent
* [ ] Tests d'intégration passent
* [ ] Accessibilité vérifiée
* [ ] Performance testée
* [ ] Documentation mise à jour
* [ ] Code review effectuée

### Ressources utiles

* [Documentation Next.js](https://nextjs.org/docs)
* [Documentation React](https://react.dev/)
* [Documentation TypeScript](https://www.typescriptlang.org/docs/)
* [Documentation Tailwind CSS](https://tailwindcss.com/docs)
* [Guide d'accessibilité WCAG](https://www.w3.org/WAI/WCAG21/quickref/)

## 📝 Notes de développement

### Architecture

* **App Router** : Nouveau système de routage Next.js 15
* **Server Components** : Rendu côté serveur pour les performances
* **Client Components** : Interactivité côté client
* **Middleware** : Protection des routes et authentification
* **Context API** : Gestion d'état globale
* **Custom Hooks** : Logique métier réutilisable

### Performance

* **Optimisation des images** avec Next.js Image
* **Lazy loading** des composants
* **Code splitting** automatique
* **Cache intelligent** des données
* **Bundle analyzer** pour optimiser la taille
* **Core Web Vitals** optimisés

### Sécurité

* **Validation des données** côté client et serveur
* **Protection XSS** et injection
* **Tokens JWT** sécurisés
* **Headers de sécurité** configurés
* **CSP** (Content Security Policy)
* **HTTPS** obligatoire en production

### Accessibilité

* **WCAG 2.1 AA** compliance
* **Navigation au clavier** complète
* **Lecteurs d'écran** supportés
* **Contraste** des couleurs vérifié
* **Alt text** pour toutes les images
* **ARIA labels** appropriés

## 📞 Support

### Ressources d'aide

* **Documentation** : Consulter ce README et la documentation des technologies
* **Issues GitHub** : Ouvrir une issue pour les bugs ou demandes de fonctionnalités
* **Discussions** : Utiliser les discussions GitHub pour les questions générales
* **Wiki** : Consulter le wiki du projet pour les guides détaillés

### Contact

* **Équipe de développement** : [@Quantix06](https://github.com/Quantix06)
* **Backend API** : [apifilrouge](https://github.com/Quantix06/apifilrouge/)
* **Documentation API** : Consulter la documentation du backend

### Débogage

* **Logs de développement** : Vérifier la console du navigateur
* **React DevTools** : Utiliser les outils de développement React
* **Network tab** : Vérifier les requêtes API
* **Performance tab** : Analyser les performances

---

**Développé avec ❤️ par l'équipe Veevent**

*Dernière mise à jour : Juillet 2025* 
