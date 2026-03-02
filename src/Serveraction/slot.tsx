"use server";
import { userService } from "@/Serveraction/cookiesaction";

export async function getTutorSessionAction() {
  const { data: session, error } = await userService.getSession();
  if (error || !session) return { success: false, error: "No session" };

  const userId = session.user.id;
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
  const TARGET_URL = `${BASE_URL}/api/tutor/tutorid/${userId}`;

  try {
    const res = await fetch(TARGET_URL);
    
    if (!res.ok) {
      const errorText = await res.text();
      
      // ONLY log the error if it is NOT a "profile not found" message
      // This keeps your console clean when users simply haven't made a profile yet
      if (!errorText.includes("No tutor profile found")) {
        console.error("Backend Error Response:", errorText);
      }

      return { success: false, error: "Tutor profile not found. Please create one." };
    }

    const data = await res.json();
    return { success: true, tutorId: data.tutorId };
  } catch (err) {
    // Keep this error log as it indicates a network/server crash
    console.error("Connection Error:", err);
    return { success: false, error: "Backend connection failed" };
  }
}