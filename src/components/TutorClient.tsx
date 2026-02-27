"use client";

import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, ShieldCheck, Loader2, CheckCircle2, 
  Star, Calendar, Clock, Lock, Quote 
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
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [loadingSlotId, setLoadingSlotId] = useState<string | null>(null);
  
  // LOCAL STATE: This ensures the UI updates instantly even if Next.js cache is stubborn
  const [localStatus, setLocalStatus] = useState(tutorData.user?.status);

  // Sync local state if tutorData changes from server
  useEffect(() => {
    setLocalStatus(tutorData.user?.status);
  }, [tutorData.user?.status]);

  const isAdmin = initialSession?.user?.role === "ADMIN";
  const isCurrentlyBanned = localStatus === "BANNED";

  // --- ADMIN ACTION: BAN/UNBAN ---
  const handleToggleBan = async () => {
    const targetUserId = tutorData.user?.id; 
    const nextBanValue = !isCurrentlyBanned; 
    const nextStatusString = nextBanValue ? "BANNED" : "ACTIVE";

    if (!targetUserId) return toast.error("User ID not found");

    setIsUpdatingStatus(true);
    const toastId = toast.loading(`Setting status to ${nextStatusString}...`);

    try {
      const res = await fetch(`http://localhost:5000/api/users/update-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: targetUserId, 
          isBanned: nextBanValue 
        })
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Update failed");

      // SUCCESS: 1. Update Local UI immediately
      setLocalStatus(nextStatusString);
      
      // 2. Notify User
      toast.success(`User is now ${nextStatusString}`, { id: toastId });
      
      // 3. Trigger background refresh to keep server in sync
      router.refresh(); 
    } catch (error: any) {
      toast.error(error.message || "Connection failed", { id: toastId });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // --- STUDENT ACTION: BOOKING ---
  const handleBooking = async (availabilityId: string) => {
    if (!initialSession?.user?.id) {
      toast.error("Please login to book a session");
      return router.push("/login");
    }

    setLoadingSlotId(availabilityId);
    const toastId = toast.loading("Processing booking...");

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

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Booking failed");
      }

      toast.success("Booking confirmed!", { id: toastId });
      router.refresh(); 
      router.push("/student-dashboard");
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
    } finally {
      setLoadingSlotId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white py-16 px-4">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* --- ADMIN DASHBOARD --- */}
        {isAdmin && (
          <div className="w-full p-6 bg-zinc-900/80 border border-white/10 rounded-[2.5rem] flex items-center justify-between backdrop-blur-md shadow-2xl">
            <div className="flex items-center gap-4">
              <div className={cn("p-4 rounded-2xl transition-colors", isCurrentlyBanned ? "bg-red-500/20" : "bg-emerald-500/20")}>
                {isCurrentlyBanned ? <ShieldAlert className="text-red-500 size-6" /> : <ShieldCheck className="text-emerald-500 size-6" />}
              </div>
              <div>
                <p className="font-bold uppercase text-[10px] tracking-[0.3em] text-zinc-500">Security Override</p>
                <p className="text-lg font-bold">
                  Status: <span className={isCurrentlyBanned ? "text-red-500" : "text-emerald-500"}>{localStatus}</span>
                </p>
              </div>
            </div>
            <Button 
              onClick={handleToggleBan}
              disabled={isUpdatingStatus}
              className={cn(
                "rounded-2xl font-black px-10 h-14 text-xs uppercase tracking-widest transition-all duration-300",
                isCurrentlyBanned ? "bg-emerald-600 hover:bg-emerald-500 text-white" : "bg-red-600 hover:bg-red-500 text-white"
              )}
            >
              {isUpdatingStatus ? <Loader2 className="animate-spin size-5" /> : isCurrentlyBanned ? "Unban Account" : "Ban Account"}
            </Button>
          </div>
        )}

        {/* --- HERO PROFILE --- */}
        <div className={cn(
          "relative p-12 rounded-[4rem] border flex flex-col md:flex-row gap-12 items-center transition-all duration-700",
          isCurrentlyBanned ? "bg-red-950/10 border-red-900/30 grayscale" : "bg-gradient-to-br from-white/[0.05] to-transparent border-white/10"
        )}>
          <Avatar className="w-48 h-48 border-4 border-white/5 rounded-[3.5rem] shadow-2xl">
            <AvatarImage src={tutorData.user?.image} className="object-cover" />
            <AvatarFallback className="text-5xl bg-zinc-800">{tutorData.user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 text-center md:text-left space-y-6">
            <div className="flex items-center justify-center md:justify-start gap-5">
              <h1 className="text-7xl font-black tracking-tighter uppercase">{tutorData.user?.name}</h1>
              {!isCurrentlyBanned && <CheckCircle2 className="text-blue-500 size-10 fill-blue-500/10" />}
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              {tutorData.categories?.map((cat: any) => (
                <Badge key={cat.categoryId} className="bg-white/5 hover:bg-white/10 text-purple-300 border-none px-6 py-2 rounded-xl text-sm font-bold">
                  {cat.category?.name}
                </Badge>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900/90 p-10 rounded-[3.5rem] border border-white/5 text-center min-w-[240px] backdrop-blur-xl">
             <p className="text-6xl font-black text-white tracking-tighter">${tutorData.pricePerHour}</p>
             <p className="text-zinc-500 text-xs font-black uppercase tracking-[0.2em] mt-2">Hourly Rate</p>
          </div>
        </div>

        {/* --- SCHEDULE GRID --- */}
        <div className="space-y-10 pt-10">
          <div className="flex items-center gap-5">
            <div className="h-10 w-2 bg-purple-600 rounded-full" />
            <h2 className="text-5xl font-black tracking-tight">Select a Session</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tutorData.availability?.length > 0 ? (
              tutorData.availability.map((slot: any) => {
                const isUnavailable = slot.isBooked || isCurrentlyBanned;
                return (
                  <div key={slot.id} className={cn(
                    "p-10 rounded-[3.5rem] border flex flex-col justify-between h-[280px] transition-all duration-500",
                    isUnavailable ? "bg-zinc-900/20 border-white/5 opacity-30" : "bg-zinc-900/40 border-white/10 hover:border-purple-500/40"
                  )}>
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs font-black text-zinc-500 uppercase tracking-widest">{format(new Date(slot.startTime), "EEEE")}</p>
                          <h3 className="text-3xl font-bold mt-1 tracking-tight">{format(new Date(slot.startTime), "MMM dd")}</h3>
                        </div>
                        {isUnavailable && <Lock className="size-6 text-zinc-700" />}
                      </div>
                      <div className="flex items-center gap-2 text-purple-400 font-bold">
                        <Clock className="size-5" />
                        <span>{format(new Date(slot.startTime), "hh:mm a")}</span>
                      </div>
                    </div>

                    <Button 
                      onClick={() => handleBooking(slot.id)}
                      disabled={isUnavailable || !!loadingSlotId}
                      className={cn(
                        "w-full h-16 rounded-[1.5rem] font-black uppercase text-xs tracking-[0.2em] transition-all",
                        isUnavailable 
                          ? "bg-zinc-800 text-zinc-600 cursor-not-allowed" 
                          : "bg-white text-black hover:bg-purple-600 hover:text-white shadow-2xl"
                      )}
                    >
                      {loadingSlotId === slot.id ? (
                        <Loader2 className="animate-spin size-5" />
                      ) : isCurrentlyBanned ? (
                        "Suspended"
                      ) : slot.isBooked ? (
                        "Already Reserved"
                      ) : (
                        "Book Now"
                      )}
                    </Button>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-24 text-center border-2 border-dashed border-white/5 rounded-[4rem]">
                <p className="text-zinc-500 text-lg font-medium italic">No availability found for this tutor.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}