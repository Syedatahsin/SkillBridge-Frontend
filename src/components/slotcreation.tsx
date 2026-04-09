"use client";

import { useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { Loader2, Sparkles, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function SmartSlotCreator() {
  const { data: session, isPending } = authClient.useSession();
  const [tutorId, setTutorId] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const today = new Date().toISOString().split("T")[0];

  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    async function verifyTutor() {
      if (!session?.user?.id) return;
      try {
        const res = await fetch(`${BASE_URL}/api/tutor/tutorid/${session.user.id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.tutorId) {
            setTutorId(data.tutorId);
          } else {
            toast.error("No tutor profile found for this account");
          }
        } else {
          toast.error("No tutor profile found for this account");
        }
      } catch (err) {
        toast.error("Connection failed");
      } finally {
        setIsVerifying(false);
      }
    }

    if (!isPending && session?.user?.id) {
      verifyTutor();
    } else if (!isPending) {
      setIsVerifying(false);
    }
  }, [session, isPending]);

  const form = useForm({
    defaultValues: { date: today, start: "09:00", end: "10:00" },
    onSubmit: async ({ value }) => {
      
  console.log("Submitting Tutor ID:", tutorId); // check your browser console!
  // ... rest of the code
      const createSlotPromise = async () => {
        const response = await fetch(`${BASE_URL}/api/availability/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tutorId: tutorId,
            // REQUIRED TWO LINES CHANGED BELOW:
            startTime: new Date(`${value.date}T${value.start}`).toISOString(),
            endTime: new Date(`${value.date}T${value.end}`).toISOString(),
          }),
        });

        const contentType = response.headers.get("content-type");

        if (!response.ok) {
          // If the backend sent JSON error (like overlap error)
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to create slot");
          } else {
            // If the backend sent an HTML error page (404/500)
            throw new Error(`Server Error: Received HTML instead of JSON. Check if ${BASE_URL} is correct.`);
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
      <Loader2 className="animate-spin text-purple-500 mb-4" size={40} />
      <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Verifying Identity</p>
    </div>
  );

  if (!tutorId) return (
    <div className="h-screen flex items-center justify-center bg-black">
      <div className="text-center space-y-4 p-10 border border-white/5 bg-zinc-950 rounded-[3rem]">
        <AlertCircle className="mx-auto text-red-500" size={40} />
        <h2 className="text-white font-black text-xl">Access Denied</h2>
        <p className="text-zinc-500 text-sm">No Tutor Profile associated with this account.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-20">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="space-y-2">
          <div className="flex items-center gap-2 text-purple-500 font-black text-[10px] uppercase tracking-[0.3em]">
            <Sparkles size={14} /> Tutor Verified
          </div>
          <h1 className="text-6xl font-black italic tracking-tighter uppercase">
            New <span className="text-purple-500">Availability</span>
          </h1>
        </header>

        <form 
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }} 
          className="space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-zinc-900/30 p-8 rounded-[3rem] border border-white/5">
            <form.Field name="date">
              {(field) => (
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-zinc-500 ml-2">Date</label>
                  <Input type="date" min={today} value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} className="h-16 bg-black/40 border-zinc-800 rounded-2xl font-bold" />
                </div>
              )}
            </form.Field>

            <form.Field name="start">
              {(field) => (
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-zinc-500 ml-2">Start Time</label>
                  <Input type="time" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} className="h-16 bg-black/40 border-zinc-800 rounded-2xl font-bold" />
                </div>
              )}
            </form.Field>

            <form.Field name="end">
              {(field) => (
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-zinc-500 ml-2">End Time</label>
                  <Input type="time" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} className="h-16 bg-black/40 border-zinc-800 rounded-2xl font-bold" />
                </div>
              )}
            </form.Field>
          </div>

          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <Button 
                type="submit" 
                disabled={!canSubmit || isSubmitting}
                className="w-full h-24 bg-purple-600 hover:bg-purple-500 rounded-[2.5rem] text-2xl font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={32} /> : "Publish Slot"}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </div>
    </div>
  );
}