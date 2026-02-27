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

  // 1. Get current viewer's session
  const { data: session } = await userService.getSession();

  try {
    // 2. Fetch User data directly (using the users endpoint)
    const userRes = await fetch(
      `http://127.0.0.1:5000/api/users/${id}`, 
      {
        method: 'GET',
        cache: 'no-store',
      }
    );

    if (!userRes.ok) return notFound();

    const userData = await userRes.json();

    // Pass data to the Client Component
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