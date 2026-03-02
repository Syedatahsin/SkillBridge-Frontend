// @/Serveraction/getallteacheraction.ts
export async function getTutorsAction(page: number) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tutor/tutor?page=${page}&limit=6`, {
      cache: 'no-store'
    });

    if (!response.ok) throw new Error("Failed to fetch");

    const result = await response.json();

    // LOG THIS to see what your Express API is actually sending!
    console.log("API Response:", result);

    return {
      // If result is already an array, use it. If it has a .data property, use that.
      data: Array.isArray(result) ? result : (result.data || []),
      meta: result.meta || { lastPage: 1 }
    };
  } catch (error) {
    console.error("Action Error:", error);
    return { data: [], meta: { lastPage: 0 } };
  }
}