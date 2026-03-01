"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, MessageSquare, Clock } from "lucide-react";

interface BookingCardProps {
  booking: any;
  userRole: "STUDENT" | "TUTOR";
}

export default function BookingCard({ booking, userRole }: BookingCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Define status colors manually without the cn helper
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
      const res = await fetch(`${process.env.BACKEND_URL}/api/bookings/${booking.id}/status`, {
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
    <div className="bg-[#0A0A0A] border border-white/10 p-6 rounded-[2rem] space-y-5 hover:border-white/20 transition-all">
      <div className="flex justify-between items-start">
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

      <div>
        <h4 className="font-bold text-xl tracking-tight text-white">
          {userRole === "STUDENT" ? "Tutor Session" : "Student Booking"}
        </h4>
        <p className="text-sm text-gray-400 mt-1">
          {userRole === "STUDENT" 
            ? `Mentor: ${booking.tutor?.user?.name || 'Tutor'}` 
            : `Learner: ${booking.student?.name || 'Student'}`}
        </p>
      </div>

      <div className="flex flex-wrap gap-3 pt-4 border-t border-white/5">
        {/* TEACHER ACTIONS: Only PENDING can be confirmed */}
        {userRole === "TUTOR" && booking.status === "PENDING" && (
          <Button 
            disabled={loading}
            onClick={() => updateStatus("CONFIRMED")}
            className="bg-white text-black hover:bg-green-500 hover:text-white rounded-xl font-bold transition-colors"
          >
            <CheckCircle className="mr-2 size-4" /> Confirm Booking
          </Button>
        )}

        {/* STUDENT ACTIONS: Can cancel as long as it's not already finished or canceled */}
        {userRole === "STUDENT" && !["CANCELED", "COMPLETED"].includes(booking.status) && (
          <Button 
            variant="outline"
            disabled={loading}
            onClick={() => updateStatus("CANCELED")}
            className="border-white/10 text-white hover:bg-red-500/10 hover:text-red-500 rounded-xl"
          >
            <XCircle className="mr-2 size-4" /> Cancel Session
          </Button>
        )}

        {/* REVIEW BUTTON: Appears when session is COMPLETED */}
        {userRole === "STUDENT" && booking.status === "COMPLETED" && (
          <Button 
            onClick={() => router.push(`/review-slot?tutorId=${booking.tutorId}&bookingId=${booking.id}`)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20"
          >
            <MessageSquare className="mr-2 size-4" /> Share Feedback
          </Button>
        )}
      </div>
    </div>
  );
}