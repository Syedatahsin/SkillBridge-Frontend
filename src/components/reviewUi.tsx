"use client";

import React, { useState } from "react";
import { 
  Star, Send, Sparkles, MessageSquare, 
  User, CheckCircle2, ShieldCheck, Zap
} from "lucide-react";

export default function SubmitReviewForm() {
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [comment, setComment] = useState("");

  return (
    <div className="w-full bg-[#050505] p-6 lg:p-16 flex justify-center items-center">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-12 bg-[#0A0A0B] border border-white/10 rounded-[3.5rem] overflow-hidden shadow-2xl">
        
        {/* --- LEFT SIDE: THE VIBE --- */}
        <div className="p-8 lg:p-12 bg-gradient-to-br from-purple-900/20 to-transparent flex flex-col justify-between space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-500 font-black text-[10px] uppercase tracking-[0.3em]">
              <Zap size={12} className="fill-purple-500" /> Session Complete
            </div>
            <h2 className="text-5xl lg:text-7xl font-black italic tracking-tighter leading-none">
              How was the <span className="text-purple-600">Vibe?</span>
            </h2>
            <p className="text-gray-400 text-sm lg:text-base italic leading-relaxed max-w-xs">
              Your feedback helps Dr. Ariful optimize the learning path for everyone. Be honest, be bold.
            </p>
          </div>

          <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
            <div className="size-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <ShieldCheck size={20} className="text-emerald-500" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-tight">
              Verified Review <br /> <span className="text-white">Linked to Booking #8821</span>
            </p>
          </div>
        </div>

        {/* --- RIGHT SIDE: THE ACTUAL FORM --- */}
        <div className="p-8 lg:p-12 bg-white/[0.02] border-l border-white/5">
          <form className="space-y-8">
            
            {/* RATING FIELD (Int) */}
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Select Rating</label>
              <div className="flex gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    className="transition-all duration-200 hover:scale-125"
                  >
                    <Star 
                      size={32} 
                      className={`${
                        star <= (hover || rating) 
                          ? "fill-purple-500 text-purple-500 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" 
                          : "text-gray-800"
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* COMMENT FIELD (String?) */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Your Comment</label>
                <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">{comment.length} / 500</span>
              </div>
              <div className="relative">
                <textarea 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="The session was amazing because..."
                  className="w-full bg-[#050505] border border-white/10 rounded-3xl p-6 text-sm italic text-gray-300 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all min-h-[150px] resize-none"
                />
                <div className="absolute top-4 right-4 text-white/5">
                  <MessageSquare size={24} />
                </div>
              </div>
            </div>

            {/* SUBMIT ACTION */}
            <button 
              type="submit"
              disabled={rating === 0}
              className={`w-full h-16 rounded-2xl flex items-center justify-center gap-3 font-black uppercase text-xs tracking-[0.3em] transition-all duration-500 ${
                rating > 0 
                ? "bg-purple-600 text-white hover:bg-white hover:text-black shadow-[0_15px_30px_rgba(147,51,234,0.3)]" 
                : "bg-gray-800 text-gray-500 cursor-not-allowed"
              }`}
            >
              Post Review <Send size={16} />
            </button>

            <p className="text-[9px] text-center text-gray-600 font-bold uppercase tracking-widest">
              By posting, you agree to our Community Guidelines
            </p>
          </form>
        </div>

      </div>
    </div>
  );
}