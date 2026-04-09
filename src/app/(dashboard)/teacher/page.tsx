"use client";

import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Plus } from "lucide-react";

import Footer from "@/components/Footer";
import TeacherOnboardingCard from "@/components/profileTeacher";
import { ReviewSection } from "@/components/review";
import SessionManagement from "@/components/sessionglasscard";
import DashboardOverview from "@/components/DashboardOverview";
import TeacherRevenueCard from "@/components/TeacherRevenueCard";

export default function TeacherDashboardPage() {
  const { data: session, isPending } = authClient.useSession();
  const [tutorId, setTutorId] = useState<string | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const fetchTutorId = async () => {
      if (!session?.user?.id) return;
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tutor/tutorid/${session.user.id}`
        );
        if (res.ok) {
          const data = await res.json();
          setTutorId(data.tutorId || null);
        } else {
          setTutorId(null);
        }
      } catch {
        setTutorId(null);
      } finally {
        setLoadingProfile(false);
      }
    };

    if (!isPending && session?.user?.id) {
      fetchTutorId();
    } else if (!isPending) {
      setLoadingProfile(false);
    }
  }, [session, isPending]);

  // Loading state
  if (isPending || loadingProfile) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-500" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-5">
      <div className="max-w-7xl mx-auto">
        {!tutorId ? (
          /* Show Onboarding if no tutorId found */
          <div className="py-20 flex justify-center">
            <TeacherOnboardingCard />
          </div>
        ) : (
          /* Show Dashboard if tutorId exists */
          <div className="space-y-10">
            <header className="py-6 border-b border-white/5 flex justify-between items-center">
              <h1 className="text-3xl font-black italic text-purple-500 uppercase">
                Teacher Console
              </h1>

              <Link
                href="/teacher/slotcreation"
                className="group relative inline-flex items-center gap-2 px-6 py-3 font-bold text-white transition-all duration-300 bg-purple-600 rounded-xl hover:bg-purple-500 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] active:scale-95"
              >
                <Plus className="w-5 h-5" />
                <span>Add Schedule</span>
                <div className="absolute inset-0 rounded-xl border-2 border-white/20 group-hover:border-white/40 transition-colors" />
              </Link>
            </header>

            <section id="revenue">
              <TeacherRevenueCard tutorId={tutorId} />
            </section>

            <section id="overview">
              <DashboardOverview userId={tutorId} role="TUTOR" />
            </section>

            <section id="sessions">
              <SessionManagement role="teacher" userId={tutorId} />
            </section>

            <section id="reviews">
              <ReviewSection userId={tutorId} />
            </section>
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
}