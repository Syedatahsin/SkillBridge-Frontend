"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldAlert, ShieldCheck, Loader2, CheckCircle2,
  Star, Calendar, Clock, Lock, MessageSquare, UserCircle
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import { AlertCircle } from "lucide-react";

// Import removed

interface TutorClientProps {
  tutorData: any;
  initialSession: any | null;
}

export default function TutorClient({ tutorData, initialSession }: TutorClientProps) {
  const router = useRouter();

  // --- HARDENED ROLE LOGIC ---
  // Use client-side session to bypass server-cookie dropouts
  const { data: session } = authClient.useSession() as any;
  // Explicit role resolution — never rely on a truthy/falsy undefined
  const rawRole =
    session?.user?.role ??
    initialSession?.user?.role ??
    initialSession?.role ??
    null;
  // isAdmin is always a strict boolean — never undefined
  const isAdmin: boolean = !!(rawRole && String(rawRole).toUpperCase() === "ADMIN");

  // Debugger: Watch your browser console (F12)
  useEffect(() => {
    console.log("🛠️ SKILLBRIDGE DEBUGGER");
    console.log("Logged Role:", rawRole);
    console.log("Is Admin Access Granted?:", isAdmin);
  }, [rawRole, isAdmin]);

  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isUpdatingFeature, setIsUpdatingFeature] = useState(false);
  const [loadingSlotId, setLoadingSlotId] = useState<string | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [localStatus, setLocalStatus] = useState(tutorData.user?.status || "ACTIVE");
  const [isFeatured, setIsFeatured] = useState(tutorData.isFeatured || false);

  const isCurrentlyBanned = localStatus === "BANNED";

  useEffect(() => {
    const fetchAllReviews = async () => {
      try {
        setLoadingReviews(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reviews/${tutorData.id}`);
        const data = await res.json();
        setReviews(Array.isArray(data) ? data : data.reviews || []);
      } catch (err) {
        console.error("Reviews failed to load");
      } finally {
        setLoadingReviews(false);
      }
    };
    if (tutorData.id) fetchAllReviews();
  }, [tutorData.id]);

  useEffect(() => {
    if (tutorData.isFeatured !== undefined) setIsFeatured(tutorData.isFeatured);
  }, [tutorData.isFeatured]);

  const handleToggleFeatured = async () => {
    if (!isAdmin) return toast.error("Critical: Unauthorized Action Detected");
    setIsUpdatingFeature(true);
    const nextFeatureValue = !isFeatured;
    const toastId = toast.loading("Updating featured status...");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tutor/feature/${tutorData.id}`, {
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

  const handleToggleBan = async () => {
    // FINAL FRONTEND SHIELD: If they somehow click a hidden button
    if (!isAdmin) {
      toast.error("Critical: Unauthorized Action Detected");
      return;
    }

    const targetUserId = tutorData.user?.id;
    const nextStatusString = isCurrentlyBanned ? "ACTIVE" : "BANNED";

    setIsUpdatingStatus(true);
    const toastId = toast.loading(`Updating database...`);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/update-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: targetUserId, status: nextStatusString })
      });

      if (!res.ok) throw new Error("Server rejected the request");

      setLocalStatus(nextStatusString);
      toast.success(`User is now ${nextStatusString}`, { id: toastId });
      router.refresh();
    } catch (error: any) {
      toast.error("Action Failed: Check backend logs", { id: toastId });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleBooking = async (availabilityId: string) => {
    // 1. USE REACTIVE SESSION: This ensures we have the latest ID even if they just logged in
    const activeUserId = session?.user?.id || initialSession?.user?.id;
    
    if (!activeUserId) {
      toast.error("Please log in to reserve a spot");
      return router.push("/login");
    }

    setLoadingSlotId(availabilityId);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bookings/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: activeUserId,
          tutorId: tutorData.id,
          availabilityId: availabilityId
        }),
      });

      const result = await response.json();

      // 2. CHECK FOR RESPONSE SUCCESS
      if (!response.ok) {
        throw new Error(result.message || "Booking failed");
      }

      // 3. HANDLE REDIRECT OR SUCCESS
      if (result.url) {
        window.location.href = result.url;
      } else {
        toast.success("Spot Reserved!");
        router.refresh();
      }
    } catch (err: any) {
      console.error("Booking Error:", err);
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoadingSlotId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white py-16 px-4">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* --- HARD SHIELD: ONLY RENDERS IF ADMIN IS EXACTLY TRUE --- */}
        {isAdmin === true && (
          <div className="w-full p-6 bg-zinc-900 border border-red-500/20 rounded-[2.5rem] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className={cn("p-4 rounded-2xl", isCurrentlyBanned ? "bg-red-500/20" : "bg-emerald-500/20")}>
                {isCurrentlyBanned ? <ShieldAlert className="text-red-500" /> : <ShieldCheck className="text-emerald-500" />}
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-zinc-500">Security Override</p>
                <p className="text-lg font-bold">Role Verified: <span className="text-emerald-500">ADMIN</span></p>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handleToggleFeatured}
                disabled={!isAdmin || isUpdatingFeature}
                className={cn(
                  "rounded-2xl font-black px-8 h-14 uppercase tracking-widest transition-all",
                  isFeatured 
                    ? "bg-yellow-500/10 border border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/20" 
                    : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                )}
              >
                {isUpdatingFeature ? <Loader2 className="animate-spin" /> : (
                  <span className="flex items-center">
                    <Star className={cn("mr-2 size-4", isFeatured && "fill-current")} /> 
                    {isFeatured ? "Featured" : "Feature User"}
                  </span>
                )}
              </Button>

              <Button
                onClick={handleToggleBan}
                disabled={!isAdmin || isUpdatingStatus}
                className={cn(
                  "rounded-2xl font-black px-10 h-14 uppercase tracking-widest",
                  isCurrentlyBanned ? "bg-emerald-600 hover:bg-emerald-500" : "bg-red-600 hover:bg-red-500"
                )}
              >
                {isUpdatingStatus ? <Loader2 className="animate-spin" /> : (isCurrentlyBanned ? "Unban User" : "Ban User")}
              </Button>
            </div>
          </div>
        )}

        {/* --- TUTOR PROFILE SECTION --- */}
        <div className={cn(
          "relative p-8 md:p-12 rounded-[3rem] border flex flex-col md:flex-row gap-12 items-center transition-all",
          isCurrentlyBanned ? "bg-red-950/10 border-red-900/30 grayscale" : "bg-zinc-900/50 border-white/10"
        )}>
          <div className="relative">
            <Avatar className="w-40 h-40 md:w-48 md:h-48 rounded-[3.5rem] border-4 border-white/5">
              <AvatarImage src={tutorData.user?.image} className="object-cover" />
              <AvatarFallback className="text-5xl font-black">{tutorData.user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            {isFeatured && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-4 -right-4 bg-yellow-500 text-black p-3 rounded-2xl shadow-xl animate-bounce"
              >
                <Star size={20} fill="black" />
              </motion.div>
            )}
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase">{tutorData.user?.name}</h1>
            <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
              {tutorData.categories?.map((cat: any) => (
                <Badge key={cat.categoryId} className="bg-white/5 text-purple-300 border-none px-4 py-2 uppercase font-bold text-xs tracking-widest">
                  {cat.category?.name}
                </Badge>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900 p-8 rounded-[2.5rem] border border-white/5 text-center min-w-[200px]">
            <p className="text-5xl font-black">${tutorData.pricePerHour}</p>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-1">Hourly Rate</p>
          </div>
        </div>

        {/* --- AVAILABILITY SLOTS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
          {tutorData.availability?.map((slot: any) => (
            <div key={slot.id} className="p-8 bg-zinc-900/40 border border-white/10 rounded-[3rem] flex flex-col justify-between h-64">
              <div>
                <p className="text-[10px] font-black text-zinc-500 uppercase">{format(new Date(slot.startTime), "EEEE")}</p>
                <h3 className="text-2xl font-bold">{format(new Date(slot.startTime), "MMM dd")}</h3>
                <p className="text-purple-400 font-bold mt-2">{format(new Date(slot.startTime), "hh:mm a")}</p>
              </div>
              <Button
                onClick={() => handleBooking(slot.id)}
                disabled={slot.isBooked || isCurrentlyBanned || loadingSlotId === slot.id}
                className="w-full h-14 rounded-2xl font-black uppercase tracking-widest bg-white text-black hover:bg-purple-600 hover:text-white"
              >
                {loadingSlotId === slot.id ? (
                  <Loader2 className="animate-spin" />
                ) : slot.isBooked ? (
                  "Booked"
                ) : isCurrentlyBanned ? (
                  "Suspended"
                ) : (
                  "Reserve Spot"
                )}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}