"use client";

import React, { useState } from "react";
import { 
  Star, Send, MessageSquare, 
  ShieldCheck, Zap, Loader2 
} from "lucide-react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface SubmitReviewFormProps {
  tutorId: string | null;
  bookingId: string | null;
  studentId: string | null;
}

export default function SubmitReviewForm({ tutorId, bookingId, studentId }: SubmitReviewFormProps) {
  const router = useRouter();
  const [hover, setHover] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- TANSTACK FORM LOGIC ---
  const form = useForm({
    defaultValues: {
      rating: 0,
      comment: "",
    },
    onSubmit: async ({ value }) => {
      if (value.rating === 0) {
        toast.error("Please select a rating vibe!");
        return;
      }

      setIsSubmitting(true);
      const toastId = toast.loading("Syncing your feedback...");

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reviews/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tutorId,
            bookingId,
            studentId,
            rating: value.rating,
            comment: value.comment,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to post review");
        }

        toast.success("Vibe check complete!", { id: toastId });
        router.push("/student-dashboard");
        router.refresh();

      } catch (err: any) {
        toast.error(err.message, { id: toastId });
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className="w-full bg-[#050505] p-6 lg:p-16 flex justify-center items-center font-sans">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-12 bg-[#0A0A0B] border border-white/10 rounded-[3.5rem] overflow-hidden shadow-2xl">
        
        {/* --- LEFT SIDE: THE VIBE --- */}
        <div className="p-8 lg:p-12 bg-gradient-to-br from-purple-900/20 to-transparent flex flex-col justify-between space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-500 font-black text-[10px] uppercase tracking-[0.3em]">
              <Zap size={12} className="fill-purple-500" /> Session Complete
            </div>
            <h2 className="text-5xl lg:text-7xl font-black italic tracking-tighter leading-none text-white">
              How was the <span className="text-purple-600">Vibe?</span>
            </h2>
            <p className="text-gray-400 text-sm lg:text-base italic leading-relaxed max-w-xs">
              Be honest, be bold. Help the community grow.
            </p>
          </div>

          <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
            <div className="size-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <ShieldCheck size={20} className="text-emerald-500" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-tight">
              Verified Review <br /> <span className="text-white">Ref: {bookingId?.slice(0, 8)}</span>
            </p>
          </div>
        </div>

        {/* --- RIGHT SIDE: FORM --- */}
        <div className="p-8 lg:p-12 bg-white/[0.02] border-l border-white/5">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-8"
          >
            {/* RATING FIELD */}
            <form.Field name="rating">
              {(field) => (
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Select Rating</label>
                  <div className="flex gap-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => field.handleChange(star)}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                        className="transition-all duration-200 hover:scale-125"
                      >
                        <Star 
                          size={32} 
                          className={`${
                            star <= (hover || field.state.value) 
                              ? "fill-purple-500 text-purple-500 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" 
                              : "text-gray-800"
                          } transition-colors`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </form.Field>

            {/* COMMENT FIELD */}
            <form.Field name="comment">
              {(field) => (
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Your Comment</label>
                    <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">
                      {field.state.value.length} / 500
                    </span>
                  </div>
                  <div className="relative">
                    <textarea 
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="The session was amazing because..."
                      className="w-full bg-[#050505] border border-white/10 rounded-3xl p-6 text-sm italic text-gray-300 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all min-h-[150px] resize-none"
                    />
                    <div className="absolute top-4 right-4 text-white/5">
                      <MessageSquare size={24} />
                    </div>
                  </div>
                </div>
              )}
            </form.Field>

            {/* SUBMIT ACTION */}
            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
              {([canSubmit]) => (
                <Button 
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
                  className="w-full h-16 rounded-2xl flex items-center justify-center gap-3 font-black uppercase text-xs tracking-[0.3em] bg-purple-600 text-white hover:bg-white hover:text-black transition-all duration-500 shadow-[0_15px_30px_rgba(147,51,234,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : <>Post Review <Send size={16} /></>}
                </Button>
              )}
            </form.Subscribe>

            <p className="text-[9px] text-center text-gray-600 font-bold uppercase tracking-widest">
              By posting, you agree to our Community Guidelines
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}