"use client";

import React, { useEffect, useState } from "react";
import { Search, BookOpen, Zap, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { authClient } from "@/lib/auth-client"; 

export default function StudentWelcome() {
  // 1. Get Session from your existing auth client
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  
  const [studentStats, setStudentStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentProfile = async () => {
      if (!session?.user?.id) return;

      try {
        setLoading(true);
        // 2. Fetch data based on the ID from session
        const res = await fetch(`${process.env.BACKEND_URL}/api/users/${session.user.id}`);
        const json = await res.json();
        
        if (json.success) {
          setStudentStats(json.data);
        }
      } catch (error) {
        console.error("Error retrieving student data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!sessionLoading) {
      fetchStudentProfile();
    }
  }, [session, sessionLoading]);

  // Loading state (Skeleton) to keep the UI smooth
  if (sessionLoading || loading) {
    return (
      <div className="h-[400px] w-full bg-slate-900/40 animate-pulse rounded-[2.5rem] border border-white/5 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-purple-500" size={40} />
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Personalizing your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 border border-white/10 p-8 md:p-12 shadow-2xl">
      {/* Decorative Background Glows */}
      <div className="absolute -top-24 -right-24 size-64 bg-purple-600/20 blur-[100px]" />
      <div className="absolute -bottom-24 -left-24 size-64 bg-indigo-600/10 blur-[100px]" />

      <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-10">
        <div className="space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold uppercase tracking-widest">
            <Zap size={12} className="fill-purple-400" /> Student Dashboard
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight">
            Keep Pushing, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
              {/* Extracts first name from session name */}
              {session?.user?.name?.split(" ")[0] || "Learner"}!
            </span>
          </h1>
          
          <p className="text-gray-400 max-w-md text-lg font-medium leading-relaxed">
             You&apos;re making great progress!
          </p>

          
        </div>
        
        <div className="w-full lg:w-auto">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-[2.5rem] flex flex-col gap-4">
            <p className="text-sm font-bold text-center text-gray-300 uppercase tracking-widest">Quick Start</p>
            <Link href="/TeacherFullList">
                <Button size="lg" className="w-full rounded-[1.5rem] bg-white text-black hover:bg-gray-200 h-20 px-10 text-xl font-black shadow-xl transition-transform hover:scale-105 active:scale-95 group">
                <Search className="mr-3 size-6 group-hover:rotate-12 transition-transform" />
                Find a Tutor
                </Button>
            </Link>
            <p className="text-[10px] text-center text-gray-500 font-medium">Connect with verified mentors instantly</p>
          </div>
        </div>
      </div>
    </section>
  );
}