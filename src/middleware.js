import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

// Configuration des routes
const ROUTES = {
  PROTECTED: ["/compte", "/parametres"],
  AUTH: ["/connexion", "/inscription"],
  COMPLETE_PROFILE: ["/auth/complete-profile"],
  PUBLIC: ["/", "/evenements", "/lieux", "/villes", "/organisateurs"],
};

// Configuration des redirections par défaut
const REDIRECTS = {
  AFTER_LOGIN: "/compte/tickets",
  AFTER_LOGOUT: "/",
  LOGIN_PAGE: "/connexion",
  COMPLETE_PROFILE: "/auth/complete-profile",
};

export default function middleware(request) {
  const path = request.nextUrl.pathname;
  const authCookie = request.cookies.get("auth_token");
  
  // Log pour le débogage (à retirer en production)
  console.log(`🔍 Middleware - Path: ${path}, HasToken: ${!!authCookie?.value}`);

  // Ignorer explicitement les routes d'auth sauf la complétion de profil
  if (path.startsWith("/auth/") && !path.startsWith("/auth/complete-profile")) {
    return NextResponse.next();
  }

  // Ignorer les ressources statiques et les fichiers
  if (path.includes(".") || path.startsWith("/_next/") || path.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Validation du token
  const isValidToken = () => {
    if (!authCookie?.value) return false;

    try {
      const decodedToken = jwtDecode(authCookie.value);
      const currentTime = Date.now() / 1000;
      return decodedToken.exp > currentTime;
    } catch (error) {
      console.error("Erreur validation token middleware:", error);
      return false;
    }
  };

  const hasValidToken = isValidToken();

  // Vérifier si c'est une route d'authentification
  const isAuthRoute = ROUTES.AUTH.some(
    (route) => path === route || path.startsWith(`${route}/`)
  );

  // Vérifier si c'est une route de complétion de profil
  const isCompleteProfileRoute = ROUTES.COMPLETE_PROFILE.some(
    (route) => path === route || path.startsWith(`${route}/`)
  );

  // Vérifier si c'est une route protégée
  const isProtectedRoute = ROUTES.PROTECTED.some(
    (route) => path === route || path.startsWith(`${route}/`)
  );

  // Redirection si utilisateur connecté accède aux pages d'auth (mais pas la complétion de profil)
  if (isAuthRoute && hasValidToken) {
    const redirectParam = request.nextUrl.searchParams.get("redirect");
    const redirectUrl = redirectParam || REDIRECTS.AFTER_LOGIN;
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // Redirection si utilisateur non connecté accède à la page de complétion de profil
  if (isCompleteProfileRoute && !hasValidToken) {
    return NextResponse.redirect(new URL(REDIRECTS.LOGIN_PAGE, request.url));
  }

  // Redirection si utilisateur non connecté accède aux pages protégées
  if (isProtectedRoute && !hasValidToken) {
    const encodedRedirectPath = encodeURIComponent(path);
    return NextResponse.redirect(
      new URL(`${REDIRECTS.LOGIN_PAGE}?redirect=${encodedRedirectPath}`, request.url)
    );
  }

  // Redirection si utilisateur connecté avec profil incomplet
  if (hasValidToken && !isCompleteProfileRoute && !isAuthRoute) {
    const profileCompleteCookie = request.cookies.get("profile_complete");
    const isProfileComplete = profileCompleteCookie?.value === "true";
    
    console.log(`🔍 Middleware - ProfileComplete: ${isProfileComplete}, Path: ${path}`);
    
    // Si l'utilisateur n'a pas de profil complet, vérifier les restrictions
    if (!isProfileComplete) {
      // Routes publiques autorisées sans profil complet
      const publicRoutes = [
        "/",
        "/evenements",
        "/lieux", 
        "/villes",
        "/organisateurs",
        "/connexion",
        "/inscription",
        "/auth/callback",
        "/test-profile-complete", // Page de test temporaire
        "/test-event-order" // Page de test événements temporaire
      ];
      
      // Routes qui nécessitent un profil complet (même si elles commencent par une route publique)
      const requiresCompleteProfileRoutes = [
        "/evenements/*/order", // Pages d'inscription aux événements
        "/evenements/*/order/*", // Sous-pages d'inscription
      ];
      
      // Vérifier si la route actuelle nécessite un profil complet
      const requiresCompleteProfile = requiresCompleteProfileRoutes.some(route => {
        const routePattern = route.replace(/\*/g, '[^/]+');
        const regex = new RegExp(`^${routePattern}$`);
        return regex.test(path);
      });
      
      const isPublicRoute = publicRoutes.some(route => 
        path === route || path.startsWith(`${route}/`)
      );
      
      console.log(`🔍 Middleware - IsPublicRoute: ${isPublicRoute}, RequiresCompleteProfile: ${requiresCompleteProfile}, Path: ${path}`);
      
      // Si ce n'est pas une route publique OU si c'est une route qui nécessite un profil complet, rediriger
      if (!isPublicRoute || requiresCompleteProfile) {
        console.log(`🔄 Middleware - Redirection vers /auth/complete-profile depuis ${path}`);
        return NextResponse.redirect(new URL(REDIRECTS.COMPLETE_PROFILE, request.url));
      } else {
        console.log(`✅ Middleware - Route publique autorisée: ${path}`);
      }
    }
  }

  // Ajout de la Content-Security-Policy pour toutes les autres réponses
  const response = NextResponse.next();
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self' https://maps.googleapis.com https://maps.gstatic.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com https://maps.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' data: http://localhost:* https://localhost:* ws://localhost:* wss://localhost:* https://maps.googleapis.com https://maps.gstatic.com https://mapsresources-pa.googleapis.com https://dominant-skylark-civil.ngrok-free.app; worker-src 'self' blob:;"
  );
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth/callback (OAuth callback)
     * - auth/complete-profile (profile completion)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
