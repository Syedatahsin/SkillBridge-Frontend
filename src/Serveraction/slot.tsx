"use server";
import { userService } from "@/Serveraction/cookiesaction";

export async function getTutorSessionAction() {
  // 1. Get Session from cookies
  const { data: session, error } = await userService.getSession();

  if (error || !session) {
    return { success: false, error: "No session found" };
  }

  const userId = session.user.id;

  try {
    // 2. Fetch tutorId from your Express Backend
    // Just a simple fetch to your GET route
    const res = await fetch(`${process.env.BACKEND_URL}/api/tutor/tutorid/${userId}`);
    const data = await res.json();

    if (!res.ok) return { success: false, error: data.message };

    // 3. Return the tutorId to the client
    return { success: true, tutorId: data.tutorId };
  } catch (err) {
    return { success: false, error: "Backend connection failed" };
  }
}