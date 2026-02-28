"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { Star, MessageSquare, Send, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function ReviewForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [hoverRating, setHoverRating] = useState(0);

  const studentId = searchParams.get("studentId");
  const tutorId = searchParams.get("tutorId");
  const bookingId = searchParams.get("bookingId");

  const form = useForm({
    defaultValues: {
      rating: 5,
      comment: "",
    },
    onSubmit: async ({ value }) => {
      if (!studentId || !tutorId || !bookingId) {
        toast.error("Missing session metadata. Please return to dashboard.");
        return;
      }

      const toastId = toast.loading("Publishing review...");
      try {
        const response = await fetch("http://localhost:5000/api/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...value,
            studentId,
            tutorId,
            bookingId,
          }),
        });

        if (!response.ok) throw new Error("Failed to submit");

        toast.success("Review posted successfully!", { id: toastId });
        router.push("/student/"); 
      } catch (error) {
        toast.error("Error submitting review", { id: toastId });
      }
    },
  });

  return (
    <div className="max-w-2xl mx-auto">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-500 hover:text-white mb-8 transition-colors group"
      >
        <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-[10px] font-black uppercase tracking-widest">Back to Sessions</span>
      </button>

      <div className="bg-[#0A0A0B] border border-white/10 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/5 blur-[100px] -z-10" />
        
        <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-2">
          Rate your <span className="text-purple-500">Mentor</span>
        </h2>
        <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest mb-10">
          Booking Ref: {bookingId?.slice(-8).toUpperCase() || "N/A"}
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-8"
        >
          <form.Field name="rating">
            {(field) => (
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Overall Score</label>
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => field.handleChange(star)}
                      className="transition-all duration-200 active:scale-90"
                    >
                      <Star
                        size={36}
                        className={`${
                          star <= (hoverRating || field.state.value)
                            ? "fill-yellow-500 text-yellow-500"
                            : "text-zinc-800"
                        } transition-colors`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </form.Field>

          <form.Field name="comment">
            {(field) => (
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Your Feedback</label>
                <div className="relative">
                  <MessageSquare className="absolute top-4 left-4 size-5 text-gray-600" />
                  <textarea
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Tell us about your learning experience..."
                    className="w-full bg-white/[0.03] border border-white/10 rounded-3xl p-4 pl-12 text-white placeholder:text-gray-700 focus:border-purple-500/50 focus:ring-0 min-h-[150px] transition-all"
                  />
                </div>
              </div>
            )}
          </form.Field>

          <Button 
            type="submit"
            className="w-full rounded-2xl bg-purple-600 hover:bg-white hover:text-black h-16 font-black uppercase tracking-[0.2em] text-xs transition-all shadow-xl shadow-purple-500/10"
          >
            Submit Review <Send className="ml-2 size-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}