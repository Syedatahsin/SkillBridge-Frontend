import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  /**
   * 1. The baseURL must point to your BACKEND service on Render.
   * We use the environment variable, but keep the hardcoded URL 
   * as a fallback just in case the env var isn't picked up.
   */
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "https://skillbridge-backend-kyg4.onrender.com",

  /**
   * 2. THE CRITICAL FIX:
   * This is what tells the browser to save and send cookies 
   * across the different Render URLs (frontend vs backend).
   */
  fetchOptions: {
    credentials: "include", 
  },
});