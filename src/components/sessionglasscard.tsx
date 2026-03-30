"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, Clock, Video, UserCheck, 
  CheckCircle2, Loader2, User, Star, Inbox, AlertCircle, Mail,
  DollarSign, Landmark 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface SessionProps {
  role: "teacher" | "student";
  userId: string;
}

const SessionManagement = ({ role, userId }: SessionProps) => {
  const router = useRouter();
  const [sessions, setSessions] = useState<any[]>([]);
  const [totalEarnings, setTotalEarnings] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      const endpoint = role === "student" 
        ? `${BASE_URL}/api/bookings/studentbookings?userId=${userId}`
        : `${BASE_URL}/api/bookings/tutorbookings?userId=${userId}`;

      const response = await fetch(endpoint);
      if (!response.ok) throw new Error("Failed to load sessions");
      
      const data = await response.json();
      
      // Update logic to handle the Object response for teachers
      if (role === "teacher" && data.bookings) {
        setSessions(data.bookings);
        setTotalEarnings(data.totalEarnings || 0);
      } else {
        // Fallback for students or plain array responses
        setSessions(Array.isArray(data) ? data : data.bookings || []);
      }
    } catch (err) {
      console.error("Sync Error:", err);
      toast.error("Could not sync schedule");
    } finally {
      setLoading(false);
    }
  }, [userId, role, BASE_URL]);

  useEffect(() => {
    if (userId) fetchSessions();
  }, [fetchSessions, userId]);

  const completeForm = useForm({
    defaultValues: { bookingId: "" },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Finalizing session...");
      try {
        const res = await fetch(`${BASE_URL}/api/bookings/tutorbookings/complete/${value.bookingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" }
        });
        if (!res.ok) throw new Error("Update failed");
        toast.success("Session completed!", { id: toastId });
        fetchSessions();
      } catch (err) {
        toast.error("Error updating status", { id: toastId });
      }
    },
  });

  const statuses = ["upcoming", "completed"];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 bg-[#050505]">
        <Loader2 className="animate-spin text-purple-600 size-12 mb-4" />
        <p className="text-gray-500 font-black uppercase tracking-[0.3em] text-[10px]">
          Loading {role} Dashboard...
        </p>
      </div>
    );
  }

  return (
    <section className="mt-10">
      {/* Teacher Revenue Card with Professional Payout Message */}
      {role === "teacher" && (
        <div className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-purple-600/10 border border-purple-500/20 rounded-[2.5rem] p-8 relative overflow-hidden group col-span-1 md:col-span-2">
            <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <DollarSign size={160} className="text-purple-500 rotate-12" />
            </div>
            
            <div className="relative z-10">
              <p className="text-purple-400 font-black text-[10px] uppercase tracking-[0.2em] mb-2">
                Total Revenue
              </p>
              <h3 className="text-6xl font-black text-white italic tracking-tighter mb-6">
                ${totalEarnings.toFixed(2)}
              </h3>
              
              {/* Option 1 Message */}
              <div className="flex items-start gap-3 py-3 px-5 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl w-fit">
                <Landmark size={16} className="text-emerald-500 mt-0.5" />
                <p className="text-[10px] font-bold text-emerald-500/90 uppercase tracking-widest leading-relaxed">
                  Payouts are processed monthly and will be transferred <br/> 
                  directly to your registered bank account.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Tabs defaultValue="upcoming" className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">
              {role === "teacher" ? "Session" : "My"} <span className="text-purple-600">Control</span>
            </h2>
            <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest mt-2">
              Viewing as {role}
            </p>
          </div>
          
          <div className="bg-white/5 border border-white/10 p-1 rounded-full">
            <TabsList className="bg-transparent border-none gap-1">
              {statuses.map((status) => (
                <TabsTrigger 
                  key={status}
                  value={status} 
                  className="rounded-full px-6 py-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-500 font-black text-[10px] uppercase tracking-widest transition-all"
                >
                  {status}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>

        {statuses.map((status) => {
          const filteredSessions = sessions.filter((s: any) => {
            const sStatus = s.status.toLowerCase();
            if (status === "upcoming") return sStatus === "upcoming" || sStatus === "confirmed";
            return sStatus === status;
          });

          return (
            <TabsContent key={status} value={status} className="outline-none space-y-6">
              
              {status === "upcoming" && role === "student" && filteredSessions.length > 0 && (
                <Alert className="bg-zinc-900/50 border-white/10 rounded-[2rem] p-6 mb-8">
                  <AlertCircle className="h-5 w-5 text-purple-500" />
                  <AlertTitle className="text-white font-black text-xs uppercase tracking-widest ml-2">Important Notice</AlertTitle>
                  <AlertDescription className="text-zinc-500 text-xs mt-1 leading-relaxed">
                    Bookings are final. <span className="text-white">Refunds or cancellations are not supported.</span> If you need to adjust your time, please contact your instructor via email.
                  </AlertDescription>
                </Alert>
              )}

              {filteredSessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white/[0.02] border border-dashed border-white/10 rounded-[2.5rem]">
                  <Inbox className="text-zinc-700 size-12 mb-4" />
                  <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">No {status} sessions found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSessions.map((session: any) => (
                    <div 
                      key={session.id} 
                      className="bg-[#0A0A0B] border border-white/10 rounded-[2.5rem] p-8 hover:border-purple-500/50 transition-all duration-300 relative overflow-hidden group"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className="size-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                          {session.status === "COMPLETED" ? (
                            <CheckCircle2 className="text-emerald-500" size={20} />
                          ) : (
                            <UserCheck className="text-purple-500" size={20} />
                          )}
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-widest ${
                          session.status === "COMPLETED" ? "text-emerald-500" : "text-gray-600"
                        }`}>
                          {session.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-1">
                        <User size={14} className="text-zinc-600" />
                        <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">
                          {role === "teacher" 
                            ? (session.student?.name || "Private Session")
                            : (session.tutor?.user?.name || "Instructor")
                          }
                        </h3>
                      </div>
                      
                      <div className="flex items-center gap-4 py-4 border-y border-white/5 mb-6">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-300 uppercase">
                          <Calendar size={14} className="text-purple-600" /> 
                          {format(new Date(session.availability.startTime), "MMM dd")}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-300 uppercase">
                          <Clock size={14} className="text-purple-600" /> 
                          {format(new Date(session.availability.startTime), "p")}
                        </div>
                      </div>

                      {role === "student" && status === "upcoming" && session.tutor?.user?.email && (
                        <div className="mb-6 flex items-center gap-2 p-3 bg-white/5 rounded-xl border border-white/5">
                          <Mail size={12} className="text-purple-400" />
                          <span className="text-[10px] text-zinc-400 truncate">{session.tutor.user.email}</span>
                        </div>
                      )}

                      <div className="flex gap-2">
                        {(session.status === "CONFIRMED" || session.status === "UPCOMING") && (
                          <>
                            <Button 
                              onClick={() => session.meetingLink && window.open(session.meetingLink, "_blank")}
                              className="flex-1 rounded-xl bg-purple-600 hover:bg-white hover:text-black font-black uppercase text-[10px] tracking-widest h-12 transition-all"
                            >
                              <Video size={16} className="mr-2" /> Join
                            </Button>
                            
                            {role === "teacher" && (
                              <Button 
                                onClick={(e) => {
                                  e.preventDefault();
                                  completeForm.setFieldValue("bookingId", session.id);
                                  completeForm.handleSubmit();
                                }}
                                variant="outline" 
                                className="px-4 rounded-xl border-white/10 bg-white/5 text-emerald-500 hover:bg-emerald-500/10 font-black uppercase text-[10px] h-12"
                              >
                                Done
                              </Button>
                            )}
                          </>
                        )}

                        {session.status === "COMPLETED" && role === "student" && (
                            <Button 
                              onClick={() => router.push(`/student/addreview?studentId=${session.studentId}&tutorId=${session.tutorId}&bookingId=${session.id}`)}
                              className="w-full rounded-xl bg-white text-black hover:bg-purple-600 hover:text-white font-black uppercase text-[10px] tracking-widest h-12 transition-all shadow-lg"
                            >
                              <Star size={14} className="mr-2 fill-current text-yellow-500" /> Rate Experience
                            </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </section>
  );
};

export default SessionManagement;