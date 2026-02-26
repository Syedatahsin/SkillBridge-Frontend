"use client";

import React, { useState } from "react";
import { 
  CheckCircle2, Calendar, Clock, 
  ChevronRight, Zap, Lock, Loader2, Star 
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { log } from "console";

// 1. Define the TypeScript Interface for your Props
interface TutorClientProps {
  tutorData: any;
  initialSession: any; // This matches the prop passed from your Server Page
}

export default function TutorClient({ tutorData, initialSession }: TutorClientProps) {
  const router = useRouter();
  const [loadingSlotId, setLoadingSlotId] = useState<string | null>(null);

  // Calculate average rating safely
  const avgRating = tutorData.reviews?.length > 0 
    ? (tutorData.reviews.reduce((a: any, b: any) => a + b.rating, 0) / tutorData.reviews.length).toFixed(1)
    : "New";

  // 2. The Booking Handler
  const handleBooking = async (availabilityId: string) => {
    // Check session from props immediately
    console.log("Initial Session in Booking Handler:", initialSession); // Debug log to verify session valueS
    if (!initialSession) {
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
          studentId: initialSession, // Use the session ID passed as a prop 
          tutorId: tutorData.id,
          availabilityId: availabilityId,
          meetingLink: "https://meet.google.com/new",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Booking failed");
      }

      toast.success("Session Confirmed!", { id: toastId });
      
      // Refresh the page data so the slot shows as "Booked"
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
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* --- TUTOR HERO SECTION --- */}
        <div className="relative p-8 rounded-[3rem] bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 flex flex-col md:flex-row gap-8 items-center">
          <div className="relative">
            <Avatar className="w-32 h-32 border-2 border-purple-500/20 rounded-[2rem]">
              <AvatarImage src={tutorData.user?.image} className="object-cover" />
              <AvatarFallback className="text-2xl bg-neutral-900">
                {tutorData.user?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2 bg-purple-600 p-2 rounded-xl shadow-lg border border-white/10">
              <Zap className="size-4 fill-white" />
            </div>
          </div>
          
          <div className="flex-1 space-y-3 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <h1 className="text-5xl font-black tracking-tighter">{tutorData.user?.name}</h1>
              <CheckCircle2 className="text-blue-500 size-6" />
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
             <div className="flex items-center gap-2 mt-2 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
                <Star className="size-3 text-yellow-500 fill-yellow-500" />
                <span className="text-yellow-500 text-xs font-bold">{avgRating} Rating</span>
             </div>
          </div>
        </div>

        {/* --- AVAILABILITY CARDS GRID --- */}
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <Calendar className="text-purple-500 size-6" />
            <h2 className="text-2xl font-bold tracking-tight">Available Sessions</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutorData.availability?.map((slot: any) => {
              const isTaken = slot.isBooked;
              const isProcessing = loadingSlotId === slot.id;

              return (
                <div 
                  key={slot.id}
                  className={cn(
                    "group relative p-8 rounded-[2.5rem] border transition-all duration-500 flex flex-col justify-between h-[240px]",
                    isTaken 
                      ? "bg-neutral-900/40 border-white/5 opacity-50" 
                      : "bg-[#0A0A0B] border-white/10 hover:border-purple-500/40 shadow-xl"
                  )}
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 group-hover:text-purple-400 transition-colors">
                          {format(new Date(slot.startTime), "EEEE")}
                        </p>
                        <h3 className="text-2xl font-bold tracking-tight">
                          {format(new Date(slot.startTime), "MMM do")}
                        </h3>
                      </div>
                      {isTaken && <Lock className="size-4 text-red-500" />}
                    </div>

                    <div className="flex items-center gap-2 text-gray-400 text-sm font-medium">
                      <Clock className="size-4 text-purple-500" />
                      <span>{format(new Date(slot.startTime), "hh:mm a")}</span>
                    </div>
                  </div>

                  {/* 3. Inline Booking Button for Every Card */}
                  <Button
                    onClick={() => handleBooking(slot.id)}
                    disabled={isTaken || !!loadingSlotId}
                    className={cn(
                      "w-full h-14 rounded-2xl font-black uppercase text-xs tracking-widest transition-all",
                      isTaken 
                        ? "bg-transparent border border-white/10 text-gray-600 cursor-not-allowed" 
                        : "bg-white text-black hover:bg-purple-600 hover:text-white"
                    )}
                  >
                    {isProcessing ? (
                      <Loader2 className="animate-spin size-4" />
                    ) : isTaken ? (
                      "Reserved"
                    ) : (
                      <span className="flex items-center gap-2">
                        Book Now <ChevronRight className="size-4" />
                      </span>
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}