"use server";

export async function getSingleTutorAction(id: string) {
  try {
    // 1. Double check the port and the "s" in "tutors"
    const response = await fetch(`http://127.0.0.1:5000/api/tutor/public/${id}`, {
      cache: 'no-store', // Always fetch fresh data
    });

    if (!response.ok) {
        console.error(`Backend returned ${response.status} for ID: ${id}`);
        return null;
    }

    const result = await response.json();
    
    // 2. Ensure we are returning the correct part of the response
    // If your backend returns { data: {...} }, return result.data
    return result.data || result; 
  } catch (error) {
    console.error("Server Action Error:", error);
    return null;
  }
}