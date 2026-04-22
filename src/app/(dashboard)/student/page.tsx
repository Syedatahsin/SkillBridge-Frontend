"use client";

import React from "react";
import { authClient } from "@/lib/auth-client"; 
import { Loader2, Ban } from "lucide-react";
import Footer from "@/components/Footer";
import StudentWelcome from "@/components/StudentgreetingSection";
import SessionManagement from "@/components/sessionglasscard";
import DashboardOverview from "@/components/DashboardOverview";
import CategorySection from "@/components/CategoriesCard";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const StudentDashboardPage = () => {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-500" size={40} />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-zinc-500 uppercase tracking-widest font-bold">Please login to continue</p>
      </div>
    );
  }

  // Use type assertion (any) to bypass the TS error while checking the status
  const userStatus = (session.user as any).status;
  const isBanned = userStatus === "BANNED";

  return (
    <div className="min-h-screen bg-gray-900 text-white p-5 space-y-10 relative">
      
      {/* 1. LOCK MESSAGE: Shows only if banned */}
      {isBanned && (
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 mb-5">
           <Ban className="text-red-500 size-5" />
           <p className="text-sm font-bold uppercase tracking-tight text-red-500">
             Your account is suspended. All features are currently disabled.
           </p>
        </div>
      )}

      {/* 2. DASHBOARD CONTENT */}
      {/* If banned, we add pointer-events-none so NO buttons work, and grayscale to look "off" */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "space-y-10 transition-all duration-300",
          isBanned && "pointer-events-none select-none grayscale opacity-40"
        )}
      >
        <section id="welcome">
          <StudentWelcome />
        </section>

        <section id="sessions">
          <SessionManagement role="student" userId={session.user.id} />
        </section>

        <section id="overview">
          <DashboardOverview userId={session.user.id} role="STUDENT" />
        </section>

        <section id="categories">
          <CategorySection role="student" /> 
        </section>
        <Footer />
      </motion.div>
    </div>
  );
};

export default StudentDashboardPage;