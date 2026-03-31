"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, MessageSquare, Clock, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BookingCardProps {
  booking: any;
  userRole: "STUDENT" | "TUTOR";
}

export default function BookingCard({ booking, userRole }: BookingCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "CANCELED":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "COMPLETED":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    }
  };

  const updateStatus = async (newStatus: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bookings/${booking.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Update failed");
      
      toast.success(`Booking ${newStatus.toLowerCase()}`);
      router.refresh();
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, borderColor: "rgba(255,255,255,0.2)" }}
      className="bg-[#0A0A0A] border border-white/10 p-6 rounded-[2rem] space-y-5 transition-colors relative overflow-hidden group"
    >
      {/* Background subtle glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-transparent to-transparent group-hover:from-purple-500/[0.03] transition-colors pointer-events-none" />

      <div className="flex justify-between items-start relative z-10">
        <div className="space-y-1">
          <Badge className={`rounded-lg px-3 py-1 font-bold text-[10px] uppercase tracking-wider ${getStatusStyles(booking.status)}`}>
            {booking.status}
          </Badge>
          <div className="flex items-center gap-2 text-gray-500 text-xs mt-2">
            <Clock className="size-3" />
            {new Date(booking.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric"
            })}
          </div>
        </div>
      </div>

      <div className="relative z-10">
        <h4 className="font-black text-xl tracking-tight text-white uppercase italic">
          {userRole === "STUDENT" ? "Tutor Session" : "Student Booking"}
        </h4>
        <p className="text-sm text-gray-400 mt-1 font-medium">
          {userRole === "STUDENT" 
            ? `Mentor: ${booking.tutor?.user?.name || 'Tutor'}` 
            : `Learner: ${booking.student?.name || 'Student'}`}
        </p>
      </div>

      <div className="flex flex-wrap gap-3 pt-4 border-t border-white/5 relative z-10">
        <AnimatePresence mode="wait">
          {/* TEACHER ACTIONS */}
          {userRole === "TUTOR" && booking.status === "PENDING" && (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                disabled={loading}
                onClick={() => updateStatus("CONFIRMED")}
                className="bg-white text-black hover:bg-green-500 hover:text-white rounded-xl font-black uppercase text-[10px] tracking-widest transition-colors h-11"
              >
                {loading ? <Loader2 className="animate-spin size-4" /> : <><CheckCircle className="mr-2 size-4" /> Confirm Booking</>}
              </Button>
            </motion.div>
          )}

          {/* STUDENT ACTIONS */}
          {userRole === "STUDENT" && !["CANCELED", "COMPLETED"].includes(booking.status) && (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                variant="outline"
                disabled={loading}
                onClick={() => updateStatus("CANCELED")}
                className="border-white/10 text-white hover:bg-red-500/10 hover:text-red-500 rounded-xl font-black uppercase text-[10px] tracking-widest h-11"
              >
                {loading ? <Loader2 className="animate-spin size-4" /> : <><XCircle className="mr-2 size-4" /> Cancel Session</>}
              </Button>
            </motion.div>
          )}

          {/* REVIEW BUTTON */}
          {userRole === "STUDENT" && booking.status === "COMPLETED" && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                onClick={() => router.push(`/review-slot?tutorId=${booking.tutorId}&bookingId=${booking.id}`)}
                className="bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-purple-500/20 h-11"
              >
                <MessageSquare className="mr-2 size-4" /> Share Feedback
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}