import { userService } from "@/Serveraction/cookiesaction";
import TutorClient from '@/components/TutorClient';
import { log } from "console";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  // 1. Await and immediately trim the ID
  const resolvedParams = await params;
  const id = resolvedParams.id?.trim(); // This removes any hidden spaces or %20

  if (!id) return notFound();

  // 2. Fetch the session
  const { data: session } = await userService.getSession();
const studentId = session|| null;
  try {
    // 3. Use the sanitized ID in the fetch
    // Added a cache-busting timestamp just in case of ghost 404s
    const tutorRes = await fetch(
      `http://127.0.0.1:5000/api/tutor/public/${id}?t=${Date.now()}`, 
      {
        method: 'GET',
        cache: 'no-store',
        headers: {
          'Accept': 'application/json',
        }
      }
    );

    if (!tutorRes.ok) {
      console.error(`[BACKEND 404] Attempted ID: "${id}"`); // Quotes show spaces!
      return notFound();
    }

    const tutorData = await tutorRes.json();

    if (!tutorData || tutorData.message) {
       return notFound();
    }

    return <TutorClient tutorData={tutorData} initialSession={studentId }/>;

  } catch (error) {
    console.error("Fetch Connection Refused:", error);
    return (
      <div className="bg-black min-h-screen text-white flex items-center justify-center font-mono">
        Connection to Backend (5000) Failed.
      </div>
    );
  }
}