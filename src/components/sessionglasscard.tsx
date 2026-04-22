
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, Clock, Video, UserCheck, 
  CheckCircle2, Loader2, User, Star, Inbox, AlertCircle, Mail,
  DollarSign, Landmark, ChevronLeft, ChevronRight, FileText, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import TranscriptModal from "./TranscriptModal";
import QuizDisplay from "./QuizDisplay";
import SummaryDisplay from "./SummaryDisplay";

interface SessionProps {
  role: "teacher" | "student";
  userId: string;
}

const SessionManagement = ({ role, userId }: SessionProps) => {
  const router = useRouter();
  const [sessions, setSessions] = useState<any[]>([]);
  const [totalEarnings, setTotalEarnings] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("upcoming");
  const [page, setPage] = useState<number>(1);
  const [meta, setMeta] = useState<any>(null);
  
  // Post-session resource state
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [isTranscriptModalOpen, setIsTranscriptModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [sessionResources, setSessionResources] = useState<Record<string, any>>({});
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  
  // Note/Summary state
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [summaryData, setSummaryData] = useState<any>(null);

  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      const endpoint = role === "student" 
        ? `${BASE_URL}/api/bookings/studentbookings?userId=${userId}&status=${activeTab}&page=${page}&limit=4`
        : `${BASE_URL}/api/bookings/tutorbookings?userId=${userId}&status=${activeTab}&page=${page}&limit=4`;

      const response = await fetch(endpoint);
      if (!response.ok) throw new Error("Failed to load sessions");
      
      const data = await response.json();
      
      if (data.bookings) {
        setSessions(data.bookings);
        if (data.meta) setMeta(data.meta);
        if (role === "teacher") {
          setTotalEarnings(data.totalEarnings || 0);
        }
      } else {
        setSessions(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Sync Error:", err);
      toast.error("Could not sync schedule");
    } finally {
      setLoading(false);
    }
  }, [userId, role, BASE_URL, activeTab, page]);

  const fetchResource = useCallback(async (bookingId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/session-resources/${bookingId}`);
      if (response.ok) {
        const data = await response.json();
        setSessionResources(prev => ({ ...prev, [bookingId]: data }));
      }
    } catch (err) {
      console.error("Resource Fetch Error:", err);
    }
  }, [BASE_URL]);

  useEffect(() => {
    if (userId) fetchSessions();
  }, [fetchSessions, userId]);

  useEffect(() => {
    if (activeTab === "completed" && sessions.length > 0) {
      sessions.forEach(s => {
        if (!sessionResources[s.id]) {
          fetchResource(s.id);
        }
      });
    }
  }, [activeTab, sessions, fetchResource, sessionResources]);

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

        // Automatically prompt for transcript after completion
        setSelectedBookingId(value.bookingId);
        setIsTranscriptModalOpen(true);
      } catch (err) {
        toast.error("Error updating status", { id: toastId });
      }
    },
  });

  const generateQuiz = async (bookingId: string) => {
    setIsGeneratingQuiz(true);
    const toastId = toast.loading("AI is generating your quiz...");
    try {
      const response = await fetch(`${BASE_URL}/api/session-resources/generate-quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });

      if (!response.ok) throw new Error("Quiz generation failed");

      const data = await response.json();
      setSessionResources(prev => ({ ...prev, [bookingId]: data }));
      toast.success("Quiz generated! Get ready...", { id: toastId });
      setIsQuizModalOpen(true);
    } catch (err) {
      toast.error("Error generating quiz", { id: toastId });
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const generateSummary = async (bookingId: string) => {
    setIsGeneratingSummary(true);
    const toastId = toast.loading("AI is preparing your study notes...");
    try {
      const response = await fetch(`${BASE_URL}/api/session-resources/generate-summary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });

      if (!response.ok) throw new Error("Summary generation failed");

      const data = await response.json();
      setSummaryData(data);
      toast.success("Notes ready!", { id: toastId });
      setIsSummaryModalOpen(true);
    } catch (err) {
      toast.error("Error generating notes", { id: toastId });
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const statuses = ["upcoming", "completed"];

  const handleNext = () => {
    if (meta && page < meta.lastPage) setPage(p => p + 1);
  };

  const handlePrev = () => {
    if (page > 1) setPage(p => p - 1);
  };

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



      <Tabs value={activeTab} onValueChange={(val) => {
        setActiveTab(val);
        setPage(1);
      }} className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <h2 className="text-2xl sm:text-4xl font-black text-white italic uppercase tracking-tighter">
              {role === "teacher" ? "Session" : "My"} <span className="text-purple-600">Control</span>
            </h2>
            <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest mt-2">
              Viewing as {role}
            </p>
          </div>
          
          <div className="bg-white/5 border border-white/10 p-1 rounded-full overflow-x-auto">
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
            if (status === "upcoming") return ["upcoming", "confirmed", "pending"].includes(sStatus);
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
                  {filteredSessions.map((session: any, index: number) => (
                    <motion.div 
                      key={session.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.21, 0.47, 0.32, 0.98] }}
                      className="bg-[#0A0A0B] border border-white/10 rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-8 hover:border-purple-500/50 transition-all duration-300 relative overflow-hidden group"
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

                        {session.status === "COMPLETED" && (
                          <div className="flex flex-col gap-2 w-full">
                            {role === "teacher" && (
                              <Button 
                                onClick={() => {
                                  setSelectedBookingId(session.id);
                                  setIsTranscriptModalOpen(true);
                                }}
                                className="w-full rounded-xl border-white/10 bg-white/5 text-purple-400 hover:bg-purple-500 hover:text-white font-black uppercase text-[10px] tracking-widest h-12 transition-all"
                              >
                                {sessionResources[session.id]?.transcriptText ? "Edit Transcript" : "Upload Transcript"}
                              </Button>
                            )}

                            {role === "student" && (
                              <>
                                <Button 
                                  onClick={() => router.push(`/student/addreview?studentId=${session.studentId}&tutorId=${session.tutorId}&bookingId=${session.id}`)}
                                  className="w-full rounded-xl bg-white text-black hover:bg-purple-600 hover:text-white font-black uppercase text-[10px] tracking-widest h-12 transition-all shadow-lg"
                                >
                                  <Star size={14} className="mr-2 fill-current text-yellow-500" /> Rate Experience
                                </Button>

                                {sessionResources[session.id]?.transcriptText ? (
                                  <>
                                    <Button 
                                    onClick={() => {
                                      setSelectedBookingId(session.id);
                                      if (sessionResources[session.id]?.quizData) {
                                        setIsQuizModalOpen(true);
                                      } else {
                                        generateQuiz(session.id);
                                      }
                                    }}
                                    disabled={isGeneratingQuiz}
                                    className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-white hover:to-white hover:text-black font-black uppercase text-[10px] tracking-widest h-12 transition-all animate-glow active:scale-[0.98]"
                                  >
                                    {isGeneratingQuiz ? <Loader2 className="animate-spin" size={16} /> : (
                                      <div className="flex items-center gap-2">
                                        <div className="size-2 rounded-full bg-white animate-pulse" />
                                        Take AI Quiz
                                      </div>
                                    )}
                                  </Button>

                                  <Button 
                                    onClick={() => {
                                      setSelectedBookingId(session.id);
                                      generateSummary(session.id);
                                    }}
                                    disabled={isGeneratingSummary}
                                    variant="outline"
                                    className="w-full rounded-xl border-purple-500/30 bg-purple-500/5 text-zinc-300 hover:bg-white hover:text-black hover:border-white font-black uppercase text-[10px] tracking-widest h-12 transition-all"
                                  >
                                    {isGeneratingSummary ? <Loader2 className="animate-spin" size={16} /> : (
                                      <div className="flex items-center gap-2">
                                        <div className="relative">
                                          <FileText size={14} className="text-purple-500" />
                                          <Sparkles size={8} className="absolute -top-1 -right-1 text-yellow-400 animate-pulse fill-current" />
                                        </div>
                                        AI Smart Notes
                                      </div>
                                    )}
                                  </Button>
                                </>
                              ) : (
                                  <Button 
                                    disabled
                                    className="w-full rounded-xl bg-white/5 border border-white/5 text-zinc-600 font-black uppercase text-[10px] tracking-widest h-12 opacity-50 cursor-not-allowed"
                                  >
                                    Quiz (Waiting for Teacher)
                                  </Button>
                                )}
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {filteredSessions.length > 0 && (
                <div className="flex justify-between items-center mt-8 p-6 bg-[#0A0A0B] border border-white/10 rounded-3xl">
                  {meta && meta.lastPage > 0 ? (
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handlePrev}
                        disabled={page === 1}
                        className="bg-zinc-900 border-white/10 hover:bg-white/10 hover:text-white"
                      >
                        <ChevronLeft size={16} />
                      </Button>
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                        Page <span className="text-white">{page}</span> of {meta.lastPage}
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleNext}
                        disabled={page === meta.lastPage}
                        className="bg-zinc-900 border-white/10 hover:bg-white/10 hover:text-white"
                      >
                        <ChevronRight size={16} />
                      </Button>
                    </div>
                  ) : (
                    <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                      End of Directory
                    </span>
                  )}
                  <span className="text-zinc-400 text-xs font-medium">
                    Total Records: <span className="text-purple-500">{meta ? meta.total : sessions.length}</span>
                  </span>
                </div>
              )}

            </TabsContent>
          );
        })}
      </Tabs>

      {selectedBookingId && (
        <>
          <TranscriptModal 
            isOpen={isTranscriptModalOpen}
            onClose={() => setIsTranscriptModalOpen(false)}
            bookingId={selectedBookingId}
            existingTranscript={sessionResources[selectedBookingId]?.transcriptText}
            onSuccess={() => fetchResource(selectedBookingId)}
          />

          {sessionResources[selectedBookingId]?.quizData && (
            <QuizDisplay 
              isOpen={isQuizModalOpen}
              onClose={() => setIsQuizModalOpen(false)}
              quizData={sessionResources[selectedBookingId].quizData}
            />
          )}

          {summaryData && (
            <SummaryDisplay 
              isOpen={isSummaryModalOpen}
              onClose={() => setIsSummaryModalOpen(false)}
              summaryData={summaryData}
            />
          )}
        </>
      )}
    </section>
  );
};

export default SessionManagement;
