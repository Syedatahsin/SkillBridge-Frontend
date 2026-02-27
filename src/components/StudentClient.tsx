"use client";

import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, ShieldCheck, Loader2, CheckCircle2, 
  User, Mail, Calendar, Shield
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface StudentClientProps {
  userData: any; // This is now the direct User object
  initialSession: any | null; 
}

export default function StudentClient({ userData, initialSession }: StudentClientProps) {
  const router = useRouter();
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  
  // Use the user status directly from userData
  const [localStatus, setLocalStatus] = useState(userData?.status);

  useEffect(() => {
    setLocalStatus(userData?.status);
  }, [userData?.status]);

  const isAdmin = initialSession?.user?.role === "ADMIN";
  const isCurrentlyBanned = localStatus === "BANNED";

  const handleToggleBan = async () => {
    const targetUserId = userData?.id; 
    const nextBanValue = !isCurrentlyBanned; 
    const nextStatusString = nextBanValue ? "BANNED" : "ACTIVE";

    if (!targetUserId) return toast.error("User ID not found");

    setIsUpdatingStatus(true);
    const toastId = toast.loading(`Updating to ${nextStatusString}...`);

    try {
      const res = await fetch(`http://localhost:5000/api/users/update-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: targetUserId, 
          isBanned: nextBanValue 
        })
      });

      if (!res.ok) throw new Error("Update failed");

      setLocalStatus(nextStatusString);
      toast.success(`Student is now ${nextStatusString}`, { id: toastId });
      router.refresh(); 
    } catch (error: any) {
      toast.error(error.message || "Connection failed", { id: toastId });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white py-16 px-4">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* --- ADMIN OVERRIDE --- */}
        {isAdmin && (
          <div className="w-full p-6 bg-zinc-900/80 border border-white/10 rounded-[2.5rem] flex items-center justify-between backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className={cn("p-4 rounded-2xl", isCurrentlyBanned ? "bg-red-500/20" : "bg-emerald-500/20")}>
                {isCurrentlyBanned ? <ShieldAlert className="text-red-500 size-6" /> : <ShieldCheck className="text-emerald-500 size-6" />}
              </div>
              <div>
                <p className="font-bold uppercase text-[10px] tracking-widest text-zinc-500">Admin Control</p>
                <p className="text-lg font-bold">Status: <span className={isCurrentlyBanned ? "text-red-500" : "text-emerald-500"}>{localStatus}</span></p>
              </div>
            </div>
            <Button 
              onClick={handleToggleBan}
              disabled={isUpdatingStatus}
              className={cn(
                "rounded-2xl font-black px-10 h-14 text-xs uppercase tracking-widest transition-all",
                isCurrentlyBanned ? "bg-emerald-600 hover:bg-emerald-500" : "bg-red-600 hover:bg-red-500"
              )}
            >
              {isUpdatingStatus ? <Loader2 className="animate-spin size-5" /> : isCurrentlyBanned ? "Unban Student" : "Ban Student"}
            </Button>
          </div>
        )}

        {/* --- MAIN PROFILE CARD --- */}
        <div className={cn(
          "relative p-12 rounded-[4rem] border flex flex-col items-center text-center transition-all duration-700",
          isCurrentlyBanned ? "bg-red-950/10 border-red-900/30 grayscale" : "bg-zinc-900/20 border-white/10"
        )}>
          <Avatar className="w-48 h-48 border-4 border-white/5 rounded-[3.5rem] shadow-2xl mb-8">
            <AvatarImage src={userData?.image} className="object-cover" />
            <AvatarFallback className="text-5xl bg-zinc-800">{userData?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center justify-center gap-4">
              <h1 className="text-6xl font-black tracking-tighter uppercase">{userData?.name}</h1>
              {!isCurrentlyBanned && <CheckCircle2 className="text-blue-500 size-8 fill-blue-500/10" />}
            </div>
            
            <div className="flex flex-col items-center gap-3 text-zinc-400">
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                    <Mail className="size-4 text-purple-400" />
                    <span className="text-sm font-medium">{userData?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-zinc-700 text-zinc-500 uppercase tracking-widest text-[10px]">
                       Account Role: {userData?.role}
                    </Badge>
                </div>
            </div>
          </div>
        </div>

        {/* --- DETAILS SECTION --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 bg-zinc-900/30 border border-white/5 rounded-[2.5rem] space-y-4">
                <div className="flex items-center gap-3 text-purple-400 font-bold uppercase text-[10px] tracking-widest">
                    <Calendar className="size-4" />
                    Member Since
                </div>
                <p className="text-2xl font-bold">
                    {userData?.createdAt ? format(new Date(userData.createdAt), "MMMM dd, yyyy") : "N/A"}
                </p>
            </div>

            <div className="p-8 bg-zinc-900/30 border border-white/5 rounded-[2.5rem] space-y-4">
                <div className="flex items-center gap-3 text-emerald-400 font-bold uppercase text-[10px] tracking-widest">
                    <Shield className="size-4" />
                    Account Security
                </div>
                <p className="text-2xl font-bold">
                    {userData?.emailVerified ? "Verified Email" : "Unverified"}
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}