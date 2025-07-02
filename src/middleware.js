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

  return NextResponse.next();
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
