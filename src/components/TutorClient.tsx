"use client";

import React, { useState } from "react";
import { 
  CheckCircle2, Calendar, Clock, 
  Zap, Lock, Loader2, Star, 
  Quote, ShieldAlert, ShieldCheck,
  ArrowRight
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TutorClientProps {
  tutorData: any;
  initialSession: any | null; 
}

export default function TutorClient({ tutorData, initialSession }: TutorClientProps) {
  const router = useRouter();
  const [loadingSlotId, setLoadingSlotId] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Check if current user is Admin (Role 3 or "ADMIN")
  const isAdmin = initialSession?.user?.role === "ADMIN" || initialSession?.user?.role === 3; 

  const avgRating = tutorData.reviews?.length > 0 
    ? (tutorData.reviews.reduce((a: any, b: any) => a + b.rating, 0) / tutorData.reviews.length).toFixed(1)
    : "New";

  // --- ADMIN ACTION: BAN/UNBAN ---
  const handleToggleBan = async () => {
    const action = tutorData.isBanned ? "unban" : "ban";
    if (!confirm(`Are you sure you want to ${action} this tutor?`)) return;

    setIsUpdatingStatus(true);
    const toastId = toast.loading(`${action === 'ban' ? 'Banning' : 'Restoring'} tutor...`);

    try {
      const res = await fetch(`http://localhost:5000/api/tutor/update-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tutorId: tutorData.id, 
          isBanned: !tutorData.isBanned 
        })
      });

      if (!res.ok) throw new Error("Failed to update status");

      toast.success(`Tutor ${action}ned successfully`, { id: toastId });
      router.refresh();
    } catch (error) {
      toast.error("Action failed", { id: toastId });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // --- BOOKING LOGIC ---
  const handleBooking = async (availabilityId: string) => {
    // Guest safety check
    if (!initialSession?.user) {
      toast.error("Please login to book a session");
      return router.push("/login");
    }

    setLoadingSlotId(availabilityId);
    const toastId = toast.loading("Securing your spot...");

    try {
      const response = await fetch("http://localhost:5000/api/bookings/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: initialSession.user.id, 
          tutorId: tutorData.id,
          availabilityId: availabilityId,
          meetingLink: "https://meet.google.com/new",
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Booking failed");

      toast.success("Session Confirmed!", { id: toastId });
      router.refresh(); 
      router.push("/student-dashboard");
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
    } finally {
      setLoadingSlotId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* --- ADMIN PANEL (ONLY VISIBLE TO ADMINS) --- */}
        {isAdmin && (
          <div className="w-full p-6 bg-red-500/5 border border-red-500/20 rounded-[2rem] flex items-center justify-between mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-500/10 rounded-2xl">
                <ShieldAlert className="text-red-500 size-6" />
              </div>
              <div>
                <p className="font-bold text-red-500 uppercase text-[10px] tracking-[0.2em]">Security Management</p>
                <p className="text-zinc-400 text-sm">Control instructor visibility and access.</p>
              </div>
            </div>
            <Button 
              onClick={handleToggleBan}
              disabled={isUpdatingStatus}
              className={cn(
                "rounded-xl font-bold px-8 h-12 transition-all duration-300",
                tutorData.isBanned 
                  ? "bg-emerald-500 hover:bg-emerald-600 text-white" 
                  : "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/20"
              )}
            >
              {isUpdatingStatus ? (
                <Loader2 className="animate-spin size-4" />
              ) : tutorData.isBanned ? (
                <><ShieldCheck className="mr-2 size-4" /> Unban Instructor</>
              ) : (
                <><ShieldAlert className="mr-2 size-4" /> Ban Instructor</>
              )}
            </Button>
          </div>
        )}

        {/* --- TUTOR HERO SECTION --- */}
        <div className={cn(
          "relative p-8 rounded-[3rem] border flex flex-col md:flex-row gap-8 items-center transition-all duration-500",
          tutorData.isBanned 
            ? "bg-zinc-900/50 border-red-900/20 grayscale opacity-80" 
            : "bg-gradient-to-b from-white/[0.03] to-transparent border-white/5"
        )}>
          {tutorData.isBanned && (
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-1 rounded-full uppercase font-black tracking-widest text-[10px] shadow-xl">
              Account Suspended
            </Badge>
          )}
          
          <div className="relative">
            <Avatar className="w-32 h-32 border-2 border-purple-500/20 rounded-[2rem]">
              <AvatarImage src={tutorData.user?.image} className="object-cover" />
              <AvatarFallback className="text-2xl bg-neutral-900">{tutorData.user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            {!tutorData.isBanned && (
              <div className="absolute -bottom-2 -right-2 bg-purple-600 p-2 rounded-xl shadow-lg border border-white/10">
                <Zap className="size-4 fill-white" />
              </div>
            )}
          </div>
          
          <div className="flex-1 space-y-3 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <h1 className="text-5xl font-black tracking-tighter">{tutorData.user?.name}</h1>
              {!tutorData.isBanned && <CheckCircle2 className="text-blue-500 size-6" />}
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              {tutorData.categories?.map((cat: any) => (
                <Badge key={cat.categoryId} variant="secondary" className="bg-white/5 border-white/10 text-indigo-300 px-4 py-1">
                  {cat.category?.name}
                </Badge>
              ))}
            </div>
          </div>

          <div className="text-center md:text-right">
             <p className="text-5xl font-black text-purple-400">
               ${tutorData.pricePerHour}<span className="text-sm text-gray-500">/hr</span>
             </p>
             <div className="flex items-center gap-2 mt-2 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20 justify-center md:justify-end">
                <Star className="size-3 text-yellow-500 fill-yellow-500" />
                <span className="text-yellow-500 text-xs font-bold">{avgRating} Rating</span>
             </div>
          </div>
        </div>

        {/* --- AVAILABILITY CARDS GRID --- */}
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <Calendar className="text-purple-500 size-6" />
            <h2 className="text-3xl font-bold tracking-tight">Available Sessions</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutorData.availability?.map((slot: any) => {
              const isTaken = slot.isBooked || tutorData.isBanned; // Disable if banned
              const isProcessing = loadingSlotId === slot.id;

              return (
                <div key={slot.id} className={cn(
                  "group relative p-8 rounded-[2.5rem] border transition-all duration-500 flex flex-col justify-between h-[240px]",
                  isTaken ? "bg-neutral-900/40 border-white/5 opacity-50" : "bg-[#0A0A0B] border-white/10 hover:border-purple-500/40 shadow-xl"
                )}>
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 group-hover:text-purple-400 transition-colors">
                          {format(new Date(slot.startTime), "EEEE")}
                        </p>
                        <h3 className="text-2xl font-bold tracking-tight">{format(new Date(slot.startTime), "MMM do")}</h3>
                      </div>
                      {(slot.isBooked || tutorData.isBanned) && <Lock className="size-4 text-red-500" />}
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm font-medium">
                      <Clock className="size-4 text-purple-500" />
                      <span>{format(new Date(slot.startTime), "hh:mm a")}</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleBooking(slot.id)}
                    disabled={isTaken || !!loadingSlotId}
                    className={cn(
                      "w-full h-14 rounded-2xl font-black uppercase text-xs tracking-widest transition-all",
                      isTaken ? "bg-transparent border border-white/10 text-gray-600 cursor-not-allowed" : "bg-white text-black hover:bg-purple-600 hover:text-white"
                    )}
                  >
                    {isProcessing ? <Loader2 className="animate-spin size-4" /> : tutorData.isBanned ? "Disabled" : isTaken ? "Reserved" : "Book Now"}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        {/* --- REVIEWS SECTION --- */}
        <div className="space-y-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Star className="text-yellow-500 size-6" />
              <h2 className="text-3xl font-bold tracking-tight">Student Feedback</h2>
            </div>
            <div className="text-gray-500 text-sm font-medium">
              {tutorData.reviews?.length || 0} Total Reviews
            </div>
          </div>

          {tutorData.reviews?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {tutorData.reviews.map((review: any) => (
                <div key={review.id} className="relative p-8 rounded-[2.5rem] bg-[#0A0A0B] border border-white/5 hover:border-white/10 transition-all">
                  <Quote className="absolute top-6 right-8 size-10 text-white/5 rotate-180" />
                  
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar className="size-12 border border-white/10">
                      <AvatarImage src={review.student?.image} />
                      <AvatarFallback className="bg-neutral-800 text-xs">
                        {review.student?.name?.charAt(0) || "S"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-lg">{review.student?.name || "Student"}</p>
                      <div className="flex gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={cn("size-3", i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-neutral-700")} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-400 leading-relaxed italic">
                    "{review.comment || "No written feedback provided."}"
                  </p>
                  
                  <div className="mt-6 pt-6 border-t border-white/5 text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                    Verified Booking • {format(new Date(review.createdAt), "MMMM yyyy")}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 rounded-[3rem] border border-dashed border-white/10 bg-white/[0.01]">
              <div className="p-4 bg-white/5 rounded-full mb-4">
                <Star className="size-8 text-neutral-700" />
              </div>
              <p className="text-gray-500 font-medium text-center">No reviews yet. Be the first to learn with {tutorData.user?.name}!</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}