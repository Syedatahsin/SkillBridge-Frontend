import { NextRequest, NextResponse } from "next/server";
import { userService } from "./Serveraction/cookiesaction"; // Adjust path as needed

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Fetch Session using your manual service
  const { data: session } = await userService.getSession();
  const user = session?.user;

  // 2. AUTH CHECK: Redirect to login if no session exists
  if (!user) {
    // Prevent redirect loops if already on login/registration
    if (pathname.startsWith("/login") || pathname.startsWith("/registration")) {
      return NextResponse.next();
    }
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. ROLE EXTRACTION (Using your UPPERCASE roles)
  const role = user.role; // e.g., "TUTOR", "STUDENT", "ADMIN"

  // 4. ROLE PROTECTION LOGIC
  
  // Case: STUDENT trying to access TEACHER routes
  if (role === "STUDENT" && pathname.startsWith("/teacher")) {
    return NextResponse.redirect(new URL("/student/", request.url));
  }

  // Case: TUTOR trying to access STUDENT routes
  if (role === "TUTOR" && pathname.startsWith("/student")) {
    return NextResponse.redirect(new URL("/teacher/", request.url));
  }

  // Case: ADMIN PROTECTION
  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    const fallback = role === "TUTOR" ? "/teacher/" : "/student/";
    return NextResponse.redirect(new URL(fallback, request.url));
  }

  // 5. SMART REDIRECT FOR GENERIC DASHBOARD
  // If a user hits "/dashboard", send them to the right place based on role
  if (pathname === "/dashboard") {
    const target = role === "TUTOR" || role === "ADMIN" ? "/teacher/" : "/student/";
    return NextResponse.redirect(new URL(target, request.url));
  }

  return NextResponse.next();
}

// 6. MATCHER CONFIGURATION
export const config = {
  matcher: [
    "/teacher/:path*",
    "/student/:path*",
    "/admin/:path*",
    "/dashboard",
  ],
};