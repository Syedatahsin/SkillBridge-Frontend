"use client";

import React, { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client"; 
import { 
  User as UserIcon, Mail, ShieldCheck, GraduationCap, 
  Star, DollarSign, BookOpen, Loader2 
} from "lucide-react";

// 1. Define the Extended User to solve the 'role' property error
interface ExtendedUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: "student" | "tutor" | "admin"; 
}

interface TutorProfile {
  id: string;
  bio: string;
  pricePerHour: number;
  experience: number;
  categories: { name: string }[];
  reviews: { rating: number; comment?: string }[];
  bookings: any[];
}

export default function UnifiedProfile() {
  const { data: session, isPending } = authClient.useSession();
  const [tutorData, setTutorData] = useState<TutorProfile | null>(null);
  const [loadingExtra, setLoadingExtra] = useState(false);

  // Cast the user to our ExtendedUser type
  const user = session?.user as ExtendedUser | undefined;

  // 2. Extract primitive values to keep the dependency array stable
  const userId = user?.id;
  const userRole = user?.role;

  useEffect(() => {
    const fetchTutorSequence = async () => {
      // Logic: Only proceed if session is loaded and user is a tutor
      if (!isPending && userRole === "tutor" && userId) {
        try {
          setLoadingExtra(true);
          
          // STEP 1: Bridge UserID to TutorID
          const idRes = await fetch(`http://localhost:5000/api/tutor/tutorid/${userId}`);
          if (!idRes.ok) throw new Error("Could not find Tutor ID mapping");
          
          const idData = await idRes.json();
          const tutorId = idData.id || idData.tutorId || idData;

          if (!tutorId || typeof tutorId !== "string") {
            console.error("Extraction failed: tutorId is not a string", idData);
            return;
          }

          // STEP 2: Fetch the full profile using the Tutor UUID
          const profileRes = await fetch(`http://localhost:5000/api/tutor/public/${tutorId}`);
          if (!profileRes.ok) throw new Error(`Profile fetch failed with status: ${profileRes.status}`);
          
          const profileData = await profileRes.json();
          setTutorData(profileData);

        } catch (err) {
          console.error("Tutor Sync Error:", err);
        } finally {
          setLoadingExtra(false);
        }
      }
    };

    fetchTutorSequence();

    // 3. Dependency array uses stable strings/booleans to prevent "size change" errors
  }, [userId, userRole, isPending]);

  // Helper: Average Rating calculation
  const getAvgRating = () => {
    if (!tutorData?.reviews || tutorData.reviews.length === 0) return "5.0";
    const sum = tutorData.reviews.reduce((acc, rev) => acc + rev.rating, 0);
    return (sum / tutorData.reviews.length).toFixed(1);
  };

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center py-40 bg-[#050505]">
        <Loader2 className="animate-spin text-purple-600 size-12 mb-4" />
        <p className="text-zinc-500 font-black uppercase tracking-widest text-[10px]">Accessing Database...</p>
      </div>
    );
  }

  if (!user) return <div className="text-white text-center py-20 font-black uppercase tracking-widest">Unauthorized Access</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-4">
      
      {/* SECTION 1: HEADER */}
      <div className="bg-[#0A0A0B] border border-white/10 rounded-[3rem] p-8 md:p-14 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 blur-[120px] -z-10" />
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="size-40 md:size-52 rounded-[3.5rem] bg-zinc-900 border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl">
            {user.image ? (
              <img src={user.image} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="size-24 text-zinc-800" />
            )}
          </div>

          <div className="text-center md:text-left flex-1">
             <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 text-purple-500 px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">
               <ShieldCheck size={12} /> {user.role} Identity Verified
             </div>
             <h1 className="text-5xl md:text-8xl font-black text-white italic uppercase tracking-tighter leading-none mb-6">
               {user.name}
             </h1>
             <p className="flex items-center justify-center md:justify-start gap-3 text-zinc-500 font-bold text-sm tracking-widest uppercase">
               <Mail size={16} className="text-purple-600" /> {user.email}
             </p>
          </div>
        </div>
      </div>

      {/* SECTION 2: TUTOR PROFILE DATA */}
      {user.role === "tutor" && (
        loadingExtra ? (
            <div className="flex justify-center p-20"><Loader2 className="animate-spin text-purple-500" /></div>
        ) : tutorData ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
              <div className="bg-[#0A0A0B] border border-white/10 p-10 rounded-[2.5rem] hover:border-purple-500/40 transition-all">
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-4">Market Rate</p>
                <div className="flex items-center gap-2 text-4xl font-black text-white italic">
                  <DollarSign className="text-purple-500" /> {tutorData.pricePerHour}<span className="text-sm text-zinc-500 not-italic">/hr</span>
                </div>
              </div>

              <div className="bg-[#0A0A0B] border border-white/10 p-10 rounded-[2.5rem] hover:border-purple-500/40 transition-all">
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-4">Core Focus</p>
                <div className="flex items-center gap-3 text-3xl font-black text-white italic uppercase tracking-tighter leading-none">
                  <BookOpen className="text-purple-500" /> {tutorData.categories?.[0]?.name || "Expert"}
                </div>
              </div>

              <div className="bg-[#0A0A0B] border border-white/10 p-10 rounded-[2.5rem] hover:border-purple-500/40 transition-all">
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-4">Rating</p>
                <div className="flex items-center gap-3 text-4xl font-black text-white italic leading-none">
                  <Star className="text-yellow-500 fill-yellow-500" size={28} /> {getAvgRating()}
                </div>
              </div>

              <div className="md:col-span-3 bg-[#0A0A0B] border border-white/10 p-12 rounded-[3.5rem] relative overflow-hidden">
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-6 flex items-center gap-4">
                  <GraduationCap className="text-purple-500 size-8" /> Mentor Biography
                </h3>
                <p className="text-zinc-400 font-medium leading-relaxed text-xl max-w-4xl">
                  {tutorData.bio || "No biography provided."}
                </p>
                <div className="mt-8 pt-8 border-t border-white/5 flex gap-6 text-[10px] font-black uppercase text-zinc-600 tracking-widest">
                    <span>Experience: {tutorData.experience} Years</span>
                    <span>Total Bookings: {tutorData.bookings?.length || 0}</span>
                </div>
              </div>
            </div>
        ) : (
            <div className="bg-zinc-900/50 border border-white/5 p-10 rounded-[2.5rem] text-zinc-500 font-bold uppercase text-center text-xs tracking-widest">
                Profile details synchronized but not yet populated.
            </div>
        )
      )}
    </div>
  );
}