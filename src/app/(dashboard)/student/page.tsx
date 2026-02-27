"use client";

import React from "react";
import { authClient } from "@/lib/auth-client"; // Adjust path to your auth client
import { Loader2 } from "lucide-react";
import Footer from "@/components/Footer";
import StudentWelcome from "@/components/StudentgreetingSection";
import SessionManagement from "@/components/sessionglasscard";
import CategorySection from "@/components/CategoriesCard";

const StudentDashboardPage = () => {
  // 1. Get the session at the page level
  const { data: session, isPending } = authClient.useSession();

  // 2. Handle the loading state while session is being retrieved
  if (isPending) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-500" size={40} />
      </div>
    );
  }

  // 3. Optional: Handle cases where there is no session (user logged out)
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-zinc-500 uppercase tracking-widest font-bold">Please login to continue</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-5 space-y-10">
      {/* 4. Pass the session/ID to the components */}
      
      {/* StudentWelcome will use the session internally or you can pass name if needed */}
      <StudentWelcome />

      {/* Pass the actual user ID from the session to SessionManagement */}
      <SessionManagement role="student" userId={session.user.id} />

      <CategorySection role="student" /> 

      <Footer />
    </div>
  );
};

export default StudentDashboardPage;