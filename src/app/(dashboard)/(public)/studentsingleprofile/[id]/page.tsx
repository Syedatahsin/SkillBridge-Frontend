import { userService } from "@/Serveraction/cookiesaction";
import StudentClient from '@/components/StudentClient';
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id?.trim();

  if (!id) return notFound();

  // 1. Get current viewer's session (to check if Admin)
  const { data: session } = await userService.getSession();

  try {
    // 2. Fetch User data with a timestamp to prevent stale cache
    const userRes = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${id}?t=${Date.now()}`, 
      {
        method: 'GET',
        cache: 'no-store', // Ensures fresh data on every request
      }
    );

    if (!userRes.ok) return notFound();

    const userData = await userRes.json();

    return <StudentClient userData={userData} initialSession={session || null} />;

  } catch (error) {
    console.error("Fetch Error:", error);
    return (
      <div className="bg-black min-h-screen text-white flex items-center justify-center font-mono">
        Backend Connection Failed.
      </div>
    );
  }
}