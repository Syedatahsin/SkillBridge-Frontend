import { cookies, headers } from "next/headers";

const AUTH_URL = process.env.AUTH_URL || "http://localhost:5000/api/auth";

export const userService = {
  getSession: async function () {
    try {
      // 1. Get the cookie store (awaiting for Next.js 15 compatibility)
      const cookieStore = await cookies();
      
      // 2. Get all headers to ensure we pass things like User-Agent or IP if needed
      const headerStore = await headers();

      // 3. Forward the cookies to the backend
      const res = await fetch(`${AUTH_URL}/get-session`, {
        method: "GET",
        headers: {
          // It's critical to send the raw cookie string
          "Cookie": cookieStore.toString(),
          // Often helpful to pass the original user-agent for session validation
          "User-Agent": headerStore.get("user-agent") || "",
        },
        cache: "no-store", // Ensure we don't cache session data
      });

      if (!res.ok) {
        // Handle 401 Unauthorized or 500 errors from backend
        return { data: null, error: { message: "Unauthorized or Backend Error" } };
      }

      const session = await res.json();

      if (!session || Object.keys(session).length === 0) {
        return { data: null, error: { message: "Session is missing." } };
      }

      return { data: session, error: null };
    } catch (err) {
      console.error("Session Fetch Error:", err);
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },
};