import {
  clerkMiddleware,
  createRouteMatcher,
  auth,
} from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/user(.*)", "/admin(.*)"]);

const publicRoutes = ["/sigin", "/signup", "/privacy", "/terms"];

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();

  if (isProtectedRoute(req)) await auth.protect();

  // try {
  //   const response = await fetch(`/api/getUserRole?userId=${userId}`, {
  //     method: "GET",
  //   });

  //   if (!response.ok) {
  //     return NextResponse.error();
  //   }

  //   const data = await response.json();
  //   const role = data.role;

  //   if (role === "admin" && !req.nextUrl.pathname.startsWith("/admin")) {
  //     return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  //   }

  //   if (role === "user" && req.nextUrl.pathname.startsWith("/admin")) {
  //     return NextResponse.redirect(new URL("/user/tourism", req.url));
  //   }

  //   if (publicRoutes.includes(req.nextUrl.pathname)) {
  //     return NextResponse.redirect(
  //       new URL(role === "user" ? "/user/tourism" : "/admin/dashboard", req.url)
  //     );
  //   }
  // } catch (error) {
  //   return NextResponse.error();
  // }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
