import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "https://additionalfeaturesskillbridge.vercel.app", // Your Backend URL
  fetchOptions: {
    credentials: "include", // Essential for sending the state cookie
  },
});