// middleware.ts
import NextAuth from "next-auth";
import { auth } from "@/auth";

// Protect all routes under /(main) and redirect unauthenticated users to /login.
// Public routes: /login, /register, /api/auth/*
export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session?.user;

  const isPublicRoute =
    nextUrl.pathname.startsWith("/login") ||
    nextUrl.pathname.startsWith("/register") ||
    nextUrl.pathname.startsWith("/api/auth");

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/login", nextUrl));
  }

  if (isLoggedIn && (nextUrl.pathname === "/login" || nextUrl.pathname === "/register")) {
    return Response.redirect(new URL("/feed", nextUrl));
  }
});

export const config = {
  matcher: [
    // Match all paths except static files, images, and favicon
    "/((?!_next/static|_next/image|favicon.ico|assets/).*)",
  ],
};