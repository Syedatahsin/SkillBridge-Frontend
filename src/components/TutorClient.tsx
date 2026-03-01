"use client";

import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, ShieldCheck, Loader2, CheckCircle2, 
  Star, Calendar, Clock, Lock 
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
  
  // Loading States
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isUpdatingFeature, setIsUpdatingFeature] = useState(false); 
  const [loadingSlotId, setLoadingSlotId] = useState<string | null>(null);
  
  // Local Sync States
  const [localStatus, setLocalStatus] = useState(tutorData.user?.status || "ACTIVE");
  const [isFeatured, setIsFeatured] = useState(tutorData.isFeatured || false);

  // Sync with Server Data on page load/refresh
  useEffect(() => {
    if (tutorData.user?.status) setLocalStatus(tutorData.user.status);
    if (tutorData.isFeatured !== undefined) setIsFeatured(tutorData.isFeatured);
  }, [tutorData]);

  const isAdmin = initialSession?.user?.role === "ADMIN";
  const isCurrentlyBanned = localStatus === "BANNED";

  // --- ADMIN ACTION: FEATURE TOGGLE ---
  const handleToggleFeatured = async () => {
    setIsUpdatingFeature(true);
    const nextFeatureValue = !isFeatured;
    const toastId = toast.loading("Updating featured status...");
    
    try {
      const res = await fetch(`http://localhost:5000/api/tutor/feature/${tutorData.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: nextFeatureValue })
      });

      if (!res.ok) throw new Error("Failed to update feature status");

      setIsFeatured(nextFeatureValue);
      toast.success(nextFeatureValue ? "Tutor Featured!" : "Feature Removed", { id: toastId });
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Connection failed", { id: toastId });
    } finally {
      setIsUpdatingFeature(false);
    }
  };

  // --- ADMIN ACTION: BAN/UNBAN (FIXED PAYLOAD) ---
  const handleToggleBan = async () => {
    const targetUserId = tutorData.user?.id; 
    const nextStatusString = isCurrentlyBanned ? "ACTIVE" : "BANNED";

    if (!targetUserId) return toast.error("User ID not found");

    setIsUpdatingStatus(true);
    const toastId = toast.loading(`Updating status to ${nextStatusString}...`);

    try {
      // Endpoint:https://skillbridge-vert-six.vercel.app/api/users/update-status
      const res = await fetch(`http://localhost:5000/api/users/update-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: targetUserId,    // Matches 'userId' in your controller
          status: nextStatusString // Matches 'status' in your controller
        })
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Update failed");

      // Update Local UI State Immediately
      setLocalStatus(nextStatusString);
      
      toast.success(`User is now ${nextStatusString}`, { id: toastId });
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
    <div className="min-h-screen bg-[#050505] text-white py-16 px-4 font-sans selection:bg-purple-500/30">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* --- ADMIN DASHBOARD --- */}
        {isAdmin && (
          <div className="w-full p-6 bg-zinc-900/80 border border-white/10 rounded-[2.5rem] flex flex-col sm:flex-row items-center justify-between backdrop-blur-md shadow-2xl gap-6">
            <div className="flex items-center gap-4">
              <div className={cn(
                "p-4 rounded-2xl transition-all duration-500", 
                isCurrentlyBanned ? "bg-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.2)]" : "bg-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
              )}>
                {isCurrentlyBanned ? <ShieldAlert className="text-red-500 size-6" /> : <ShieldCheck className="text-emerald-500 size-6" />}
              </div>
              <div>
                <p className="font-bold uppercase text-[10px] tracking-[0.3em] text-zinc-500">Admin Control Panel</p>
                <p className="text-lg font-bold">
                  User Status: <span className={isCurrentlyBanned ? "text-red-500" : "text-emerald-500"}>{localStatus}</span>
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              {/* FEATURED TOGGLE */}
              <Button
                onClick={handleToggleFeatured}
                disabled={isUpdatingFeature}
                className={cn(
                  "rounded-2xl font-black px-8 h-14 text-xs uppercase tracking-widest transition-all",
                  isFeatured 
                    ? "bg-yellow-500/10 border border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/20" 
                    : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                )}
              >
                {isUpdatingFeature ? <Loader2 className="animate-spin size-5" /> : (
                  <span className="flex items-center">
                    <Star className={cn("mr-2 size-4", isFeatured && "fill-current")} /> 
                    {isFeatured ? "Featured" : "Feature User"}
                  </span>
                )}
              </Button>

              {/* BAN TOGGLE */}
              <Button 
                onClick={handleToggleBan}
                disabled={isUpdatingStatus}
                className={cn(
                  "rounded-2xl font-black px-10 h-14 text-xs uppercase tracking-widest transition-all duration-300 shadow-xl",
                  isCurrentlyBanned 
                    ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20" 
                    : "bg-red-600 hover:bg-red-500 text-white shadow-red-900/20"
                )}
              >
                {isUpdatingStatus ? <Loader2 className="animate-spin size-5" /> : isCurrentlyBanned ? "Unban User" : "Ban User"}
              </Button>
            </div>
          </div>
        )}

        {/* --- HERO PROFILE --- */}
        <div className={cn(
          "relative p-12 rounded-[4rem] border flex flex-col md:flex-row gap-12 items-center transition-all duration-700",
          isCurrentlyBanned 
            ? "bg-red-950/10 border-red-900/30 grayscale" 
            : "bg-gradient-to-br from-white/[0.07] to-transparent border-white/10"
        )}>
          <div className="relative">
            <Avatar className="w-48 h-48 border-4 border-white/5 rounded-[3.5rem] shadow-2xl">
              <AvatarImage src={tutorData.user?.image} className="object-cover" />
              <AvatarFallback className="text-5xl bg-zinc-800 font-black">{tutorData.user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            {isFeatured && (
              <div className="absolute -top-4 -right-4 bg-yellow-500 text-black p-3 rounded-2xl shadow-xl animate-bounce">
                <Star size={20} fill="black" />
              </div>
            )}
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-6">
            <div className="flex items-center justify-center md:justify-start gap-5">
              <h1 className="text-7xl font-black tracking-tighter uppercase leading-none">{tutorData.user?.name}</h1>
              {!isCurrentlyBanned && <CheckCircle2 className="text-blue-500 size-10 fill-blue-500/10" />}
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              {tutorData.categories?.map((cat: any) => (
                <Badge key={cat.categoryId} className="bg-white/5 hover:bg-white/10 text-purple-300 border-none px-6 py-2 rounded-xl text-sm font-bold uppercase tracking-wider">
                  {cat.category?.name}
                </Badge>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900/90 p-10 rounded-[3.5rem] border border-white/5 text-center min-w-[240px] backdrop-blur-xl shadow-2xl">
              <p className="text-6xl font-black text-white tracking-tighter">${tutorData.pricePerHour}</p>
              <p className="text-zinc-500 text-xs font-black uppercase tracking-[0.2em] mt-2">Hourly Rate</p>
          </div>
        </div>

        {/* --- SCHEDULE GRID --- */}
        <div className="space-y-10 pt-10">
          <div className="flex items-center gap-5">
            <div className="h-10 w-2 bg-purple-600 rounded-full shadow-[0_0_15px_rgba(147,51,234,0.5)]" />
            <h2 className="text-5xl font-black tracking-tight uppercase">Available Slots</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tutorData.availability?.length > 0 ? (
              tutorData.availability.map((slot: any) => {
                const isUnavailable = slot.isBooked || isCurrentlyBanned;
                return (
                  <div key={slot.id} className={cn(
                    "p-10 rounded-[3.5rem] border flex flex-col justify-between h-[300px] transition-all duration-500",
                    isUnavailable 
                      ? "bg-zinc-900/20 border-white/5 opacity-40 cursor-not-allowed" 
                      : "bg-zinc-900/40 border-white/10 hover:border-purple-500/40 hover:scale-[1.02] hover:bg-zinc-900/60"
                  )}>
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs font-black text-zinc-500 uppercase tracking-widest">{format(new Date(slot.startTime), "EEEE")}</p>
                          <h3 className="text-3xl font-bold mt-1 tracking-tight">{format(new Date(slot.startTime), "MMM dd, yyyy")}</h3>
                        </div>
                        {isUnavailable && <Lock className="size-6 text-zinc-700" />}
                      </div>
                      <div className="flex items-center gap-2 text-purple-400 font-bold text-lg">
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
                          ? "bg-zinc-800 text-zinc-600" 
                          : "bg-white text-black hover:bg-purple-600 hover:text-white shadow-2xl active:scale-95"
                      )}
                    >
                      {loadingSlotId === slot.id ? (
                        <Loader2 className="animate-spin size-5" />
                      ) : isCurrentlyBanned ? (
                        "Suspended"
                      ) : slot.isBooked ? (
                        "Booked"
                      ) : (
                        "Reserve Spot"
                      )}
                    </Button>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-24 text-center border-2 border-dashed border-white/5 rounded-[4rem] bg-white/[0.01]">
                <p className="text-zinc-500 text-lg font-medium italic uppercase tracking-widest">No availability posted yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}