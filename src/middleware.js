import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  try {
    const token = await getToken({ req: request });
    const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
    const isUserRoute = request.nextUrl.pathname.startsWith("/user");

    // If no token, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    // Check if user is trying to access admin routes
    if (isAdminRoute) {
      // Check if user has admin role
      if (token.role !== "admin" && token.role !== "owner") {
        // Redirect to user dashboard if not admin
        return NextResponse.redirect(new URL("/user/dashboard", request.url));
      }
    }

    // Check if user is trying to access user routes
    if (isUserRoute) {
      // Check if user has admin role trying to access user routes
      if (token.role === "admin" || token.role === "owner") {
        // Redirect to admin dashboard if admin
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    // If there's any error, redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

// Configure which routes to run middleware on
export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};
