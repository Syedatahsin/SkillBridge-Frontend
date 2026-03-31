"use client";

import { useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { Loader2, Sparkles, Calendar as CalendarIcon, Clock, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getTutorSessionAction } from "@/Serveraction/slot";
import { motion, AnimatePresence } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } }
};

export default function SmartSlotCreator() {
  const [tutorId, setTutorId] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const today = new Date().toISOString().split("T")[0];

  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    async function verifyTutor() {
      try {
        const res = await getTutorSessionAction();
        if (res.success && res.tutorId) {
          setTutorId(res.tutorId);
        } else {
          toast.error(res.error || "Tutor profile not found");
        }
      } catch (err) {
        toast.error("Connection failed");
      } finally {
        setIsVerifying(false);
      }
    }
    verifyTutor();
  }, []);

  const form = useForm({
    defaultValues: { date: today, start: "09:00", end: "10:00" },
    onSubmit: async ({ value }) => {
      const createSlotPromise = async () => {
        const response = await fetch(`${BASE_URL}/api/availability/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tutorId: tutorId,
            startTime: new Date(`${value.date}T${value.start}`).toISOString(),
            endTime: new Date(`${value.date}T${value.end}`).toISOString(),
          }),
        });

        const contentType = response.headers.get("content-type");

        if (!response.ok) {
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to create slot");
          } else {
            throw new Error(`Server Error: Received HTML instead of JSON.`);
          }
        }
        return response.json();
      };

      toast.promise(createSlotPromise(), {
        loading: 'Syncing with database...',
        success: () => {
          form.reset();
          return 'Slot created successfully!';
        },
        error: (err) => `${err.message}`,
      });
    },
  });

  if (isVerifying) return (
    <div className="h-screen flex flex-col items-center justify-center bg-black">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      >
        <Loader2 className="text-purple-500 mb-4" size={40} />
      </motion.div>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-[10px] font-black uppercase text-zinc-500 tracking-widest"
      >
        Verifying Identity
      </motion.p>
    </div>
  );

  if (!tutorId) return (
    <div className="h-screen flex items-center justify-center bg-black px-6">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center space-y-4 p-10 border border-white/5 bg-zinc-950 rounded-[3rem] w-full max-w-md"
      >
        <AlertCircle className="mx-auto text-red-500" size={40} />
        <h2 className="text-white font-black text-xl">Access Denied</h2>
        <p className="text-zinc-500 text-sm">No Tutor Profile associated with this account.</p>
      </motion.div>
    </div>
  );

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      className="min-h-screen bg-black text-white p-6 md:p-20 selection:bg-purple-500/30"
    >
      <motion.div variants={stagger} className="max-w-4xl mx-auto space-y-12">
        <motion.header variants={fadeInUp} className="space-y-2">
          <div className="flex items-center gap-2 text-purple-500 font-black text-[10px] uppercase tracking-[0.3em]">
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
              <Sparkles size={14} />
            </motion.div> 
            Tutor Verified
          </div>
          <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase leading-tight">
            New <span className="text-purple-500">Availability</span>
          </h1>
        </motion.header>

        <form 
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }} 
          className="space-y-8"
        >
          <motion.div 
            variants={fadeInUp}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-zinc-900/30 p-8 rounded-[2.5rem] md:rounded-[3rem] border border-white/5"
          >
            <form.Field name="date">
              {(field) => (
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-zinc-500 ml-2">Date</label>
                  <motion.div whileFocus={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Input 
                      type="date" 
                      min={today} 
                      value={field.state.value} 
                      onChange={(e) => field.handleChange(e.target.value)} 
                      className="h-16 bg-black/40 border-zinc-800 rounded-2xl font-bold focus:border-purple-500/50 transition-colors" 
                    />
                  </motion.div>
                </div>
              )}
            </form.Field>

            <form.Field name="start">
              {(field) => (
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-zinc-500 ml-2">Start Time</label>
                  <motion.div whileFocus={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Input 
                      type="time" 
                      value={field.state.value} 
                      onChange={(e) => field.handleChange(e.target.value)} 
                      className="h-16 bg-black/40 border-zinc-800 rounded-2xl font-bold focus:border-purple-500/50 transition-colors" 
                    />
                  </motion.div>
                </div>
              )}
            </form.Field>

            <form.Field name="end">
              {(field) => (
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-zinc-500 ml-2">End Time</label>
                  <motion.div whileFocus={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Input 
                      type="time" 
                      value={field.state.value} 
                      onChange={(e) => field.handleChange(e.target.value)} 
                      className="h-16 bg-black/40 border-zinc-800 rounded-2xl font-bold focus:border-purple-500/50 transition-colors" 
                    />
                  </motion.div>
                </div>
              )}
            </form.Field>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <Button 
                  asChild
                  type="submit" 
                  disabled={!canSubmit || isSubmitting}
                >
                  <motion.button
                    whileHover={{ scale: 1.01, backgroundColor: "#9333ea" }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full h-20 md:h-24 bg-purple-600 rounded-[2rem] md:rounded-[2.5rem] text-xl md:text-2xl font-black uppercase tracking-widest transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                        <Loader2 size={32} />
                      </motion.div>
                    ) : "Publish Slot"}
                  </motion.button>
                </Button>
              )}
            </form.Subscribe>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
}