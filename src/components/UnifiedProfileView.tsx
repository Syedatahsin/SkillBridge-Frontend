"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client"; 
import { 
  User as UserIcon, Mail, ShieldCheck, GraduationCap, 
  Star, DollarSign, BookOpen, Loader2, MessageSquare, 
  Clock, CalendarCheck, CalendarDays
} from "lucide-react";
import { format } from "date-fns"; // Recommended for date formatting

interface Availability {
  id: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

interface TutorProfile {
  id: string;
  bio: string;
  pricePerHour: number;
  experience: number;
  categories: { name: string }[];
  reviews: { rating: number; comment?: string; student?: { name: string } }[];
  bookings: any[];
  availability: Availability[]; // Added based on your Prisma Schema
}

export default function UnifiedProfile() {
  const { data: session, isPending } = authClient.useSession();
  const [tutorData, setTutorData] = useState<TutorProfile | null>(null);
  const [loadingExtra, setLoadingExtra] = useState(false);

  const user = session?.user as any; 
  const userId = user?.id;

  useEffect(() => {
    const fetchTutorSequence = async () => {
      if (!isPending && user?.role === "TUTOR" && userId) {
        try {
          setLoadingExtra(true);
          const idRes = await fetch(`${process.env.BACKEND_URL}/api/tutor/tutorid/${userId}`);
          const idData = await idRes.json();
          const tutorId = idData.id || idData.tutorId || idData;

          const profileRes = await fetch(`${process.env.BACKEND_URL}/api/tutor/public/${tutorId}`);
          const profileData = await profileRes.json();
          setTutorData(profileData);
        } catch (err) {
          console.error("Fetch Error:", err);
        } finally {
          setLoadingExtra(false);
        }
      }
    };
    fetchTutorSequence();
  }, [userId, user?.role, isPending]);

  const hasReviews = tutorData?.reviews && tutorData.reviews.length > 0;
  const getAvgRating = () => {
    if (!hasReviews) return "N/A";
    const sum = tutorData!.reviews.reduce((acc, rev) => acc + rev.rating, 0);
    return (sum / tutorData!.reviews.length).toFixed(1);
  };

  if (isPending) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-purple-600 size-12" /></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6 pb-20">
      
      {/* HEADER SECTION (Same as before) */}
      <div className="bg-[#0A0A0B] border border-white/10 rounded-[3.5rem] p-8 md:p-14 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 blur-[130px] -z-10" />
        <div className="flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
           <div className="size-44 md:size-56 rounded-[3.5rem] bg-zinc-900 border border-white/10 overflow-hidden shadow-2xl">
              {user.image ? <img src={user.image} className="w-full h-full object-cover" alt="User" /> : <UserIcon className="size-24 text-zinc-800 m-auto mt-12" />}
           </div>
           <div className="flex-1">
             <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 text-purple-500 px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4">
               <ShieldCheck size={14} /> Professional {user.role} Verified
             </div>
             <h1 className="text-6xl md:text-9xl font-black text-white italic uppercase tracking-tighter leading-none mb-4">{user.name}</h1>
             <p className="text-zinc-500 font-bold text-sm tracking-widest uppercase flex items-center justify-center md:justify-start gap-2"><Mail size={16} /> {user.email}</p>
           </div>
        </div>
      </div>

      {user.role === "TUTOR" && tutorData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: BIO & STATS (Span 2) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-[#0A0A0B] border border-white/10 p-10 rounded-[3rem]">
              <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-6 flex items-center gap-3">
                <GraduationCap className="text-purple-500" /> Biography
              </h3>
              <p className="text-zinc-400 text-lg leading-relaxed">{tutorData.bio}</p>
            </div>

            {/* REVIEWS (Same as before) */}
            <div className="bg-[#0A0A0B] border border-white/10 p-10 rounded-[3rem]">
              <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-6 flex items-center gap-3">
                <MessageSquare className="text-purple-500" /> Testimonials
              </h3>
              {/* ... reviews mapping ... */}
              {!hasReviews ? <p className="text-zinc-600 text-xs italic">No reviews yet.</p> : null}
            </div>
          </div>

          {/* RIGHT: AVAILABILITY & QUICK STATS */}
          <div className="space-y-8">
            {/* PRICE CARD */}
            <div className="bg-purple-600 p-8 rounded-[2.5rem] shadow-xl shadow-purple-900/20">
               <p className="text-[10px] font-black text-purple-200 uppercase tracking-[0.2em] mb-2">Hourly Rate</p>
               <h2 className="text-5xl font-black text-white italic">${tutorData.pricePerHour}<span className="text-sm not-italic opacity-70">/hr</span></h2>
            </div>

            {/* AVAILABILITY SLOTS */}
            <div className="bg-[#0A0A0B] border border-white/10 p-8 rounded-[3rem]">
              <h3 className="text-lg font-black text-white uppercase tracking-widest mb-6 flex items-center gap-3">
                <CalendarDays className="text-purple-500" size={20} /> Time Slots
              </h3>
              
              <div className="space-y-3">
                {!tutorData.availability || tutorData.availability.length === 0 ? (
                  <div className="p-6 border-2 border-dashed border-white/5 rounded-2xl text-center">
                    <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">No slots defined</p>
                  </div>
                ) : (
                  tutorData.availability.map((slot) => (
                    <div 
                      key={slot.id}
                      className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                        slot.isBooked 
                        ? "bg-zinc-900/50 border-white/5 opacity-50 cursor-not-allowed" 
                        : "bg-white/5 border-white/10 hover:border-purple-500/50"
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-tighter">
                          {format(new Date(slot.startTime), "EEE, MMM do")}
                        </span>
                        <span className="text-sm font-bold text-white uppercase italic">
                          {format(new Date(slot.startTime), "hh:mm a")} - {format(new Date(slot.endTime), "hh:mm a")}
                        </span>
                      </div>
                      
                      {slot.isBooked ? (
                        <span className="text-[9px] font-black bg-zinc-800 text-zinc-500 px-2 py-1 rounded-md uppercase">Booked</span>
                      ) : (
                        <div className="size-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                      )}
                    </div>
                  ))
                )}
              </div>
              
       <Link href="/teacher/slotcreation" className="block w-full mt-6">
  <button className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black text-white uppercase tracking-widest transition-all hover:border-purple-500/50 hover:text-purple-400">
    Manage Schedule
  </button>
</Link>
            </div>

            {/* QUICK STATS */}
            <div className="bg-[#0A0A0B] border border-white/10 p-8 rounded-[2.5rem] grid grid-cols-2 gap-4">
               <div>
                  <p className="text-[9px] font-black text-zinc-600 uppercase mb-1">Experience</p>
                  <p className="text-white font-bold italic">{tutorData.experience}Y</p>
               </div>
               <div>
                  <p className="text-[9px] font-black text-zinc-600 uppercase mb-1">Rating</p>
                  <p className="text-white font-bold italic">{getAvgRating()}</p>
               </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}