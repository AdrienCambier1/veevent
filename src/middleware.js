import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

const protectedRoutes = ["/compte"];

export default function middleware(request) {
  const path = request.nextUrl.pathname;
  const authCookie = request.cookies.get("auth_token");

  const isValidToken = () => {
    if (!authCookie?.value) return false;

    try {
      const decodedToken = jwtDecode(authCookie.value);
      const currentTime = Date.now() / 1000;
      return decodedToken.exp > currentTime;
    } catch (error) {
      return false;
    }
  };

  const hasValidToken = isValidToken();

  const isProtectedRoute = protectedRoutes.some(
    (route) => path === route || path.startsWith(`${route}/`)
  );

  if (isProtectedRoute && !hasValidToken) {
    const encodedRedirectPath = encodeURIComponent(path);
    return NextResponse.redirect(
      new URL(`/connexion?redirect=${encodedRedirectPath}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
