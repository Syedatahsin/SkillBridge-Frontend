import { NextRequest, NextResponse } from "next/server";
import { userService } from "./Serveraction/cookiesaction";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // ✅ 1. ALWAYS allow auth-related routes (VERY IMPORTANT)
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/registration") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/auth")
  ) {
    return NextResponse.next();
  }

  let user: any = null;

  // ✅ 2. SAFE session fetch (never break request)
  try {
    const { data: session } = await userService.getSession();
    user = session?.user;
  } catch (err) {
    user = null;
  }

  // ❗ IMPORTANT: DO NOT BLOCK if user is null
  // (this is what was causing your Google + verify redirect loop)

  // ✅ 3. ROLE-BASED ROUTING ONLY (safe layer)

  if (user) {
    const role = user.role;

    // 🚫 STUDENT cannot access teacher routes
    if (role === "STUDENT" && pathname.startsWith("/teacher")) {
      return NextResponse.redirect(
        new URL("/student", request.url)
      );
    }

    // 🚫 TUTOR cannot access student routes
    if (role === "TUTOR" && pathname.startsWith("/student")) {
      return NextResponse.redirect(
        new URL("/teacher", request.url)
      );
    }

    // 🚫 ADMIN protection
    if (pathname.startsWith("/admin") && role !== "ADMIN") {
      const fallback =
        role === "TUTOR" ? "/teacher" : "/student";

      return NextResponse.redirect(
        new URL(fallback, request.url)
      );
    }

    // ✅ Smart dashboard redirect
    if (pathname === "/dashboard") {
      const target =
        role === "ADMIN" || role === "TUTOR"
          ? "/teacher"
          : "/student";

      return NextResponse.redirect(
        new URL(target, request.url)
      );
    }
  }

  // ✅ 4. CRITICAL: always allow request to continue
  return NextResponse.next();
}