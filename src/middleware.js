import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

// Configuration des routes
const ROUTES = {
  PROTECTED: ["/compte", "/parametres"],
  AUTH: ["/connexion", "/inscription"],
  PUBLIC: ["/", "/evenements", "/lieux", "/villes", "/organisateurs"],
};

// Configuration des redirections par défaut
const REDIRECTS = {
  AFTER_LOGIN: "/compte",
  AFTER_LOGOUT: "/",
  LOGIN_PAGE: "/connexion",
};

export default function middleware(request) {
  const path = request.nextUrl.pathname;
  const authCookie = request.cookies.get("auth_token");

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

  // Vérifier si c'est une route protégée
  const isProtectedRoute = ROUTES.PROTECTED.some(
    (route) => path === route || path.startsWith(`${route}/`)
  );

  // Redirection si utilisateur connecté accède aux pages d'auth
  if (isAuthRoute && hasValidToken) {
    const redirectParam = request.nextUrl.searchParams.get("redirect");
    const redirectUrl = redirectParam || REDIRECTS.AFTER_LOGIN;
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // Redirection si utilisateur non connecté accède aux pages protégées
  if (isProtectedRoute && !hasValidToken) {
    const encodedRedirectPath = encodeURIComponent(path);
    return NextResponse.redirect(
      new URL(`${REDIRECTS.LOGIN_PAGE}?redirect=${encodedRedirectPath}`, request.url)
    );
  }

  // Ajout de la Content-Security-Policy pour toutes les autres réponses
  const response = NextResponse.next();
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self' https://maps.googleapis.com https://maps.gstatic.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com https://maps.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' data: http://localhost:8090 https://maps.googleapis.com https://maps.gstatic.com https://mapsresources-pa.googleapis.com; worker-src 'self' blob:;"
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
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
