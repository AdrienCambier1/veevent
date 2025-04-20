import { NextResponse } from "next/server";

const protectedRoutes = [
  "/account",
  "/saved",
  "/subscriptions",
  "/events/create",
];

export default function middleware(request) {
  const path = request.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.some(
    (route) => path === route || path.startsWith(`${route}/`)
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  const authCookie = request.cookies.get("auth_token");

  if (!authCookie) {
    const encodedRedirectPath = encodeURIComponent(path);
    return NextResponse.redirect(
      new URL(`/login?redirect=${encodedRedirectPath}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
