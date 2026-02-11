"use client";

import React from "react";
import { 
  Star, Quote, User, Sparkles, 
  CheckCircle2, Calendar, 
  MessageSquareOff, TrendingUp
} from "lucide-react";

// Mock data reflecting your Prisma Model attributes
const allReviews = [
  {
    id: "rev-1",
    rating: 5,
    comment: "The session was legendary. Ariful has a way of making complex system design feel like playing with Legos. My brain literally leveled up.",
    student: { name: "Tanvir Hossain" },
    createdAt: "2026-02-10",
  },
  {
    id: "rev-2",
    rating: 5,
    comment: null, // Student forgot/skipped comment
    student: { name: "Anika J." },
    createdAt: "2026-02-08",
  },
  {
    id: "rev-3",
    rating: 4,
    comment: "Great tips on Next.js 15 performance. Super helpful for my current project.",
    student: { name: "Rahat Ahmed" },
    createdAt: "2026-02-05",
  },
  {
    id: "rev-4",
    rating: 5,
    comment: null, // Another quick rating
    student: { name: "Zayan Khan" },
    createdAt: "2026-02-01",
  },
  {
    id: "rev-5",
    rating: 5,
    comment: "Finally understood how to structure a large scale React app. This man is a genius!",
    student: { name: "Sifat Ara" },
    createdAt: "2026-01-25",
  },
];

export default function AllReviewsPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 lg:p-20 selection:bg-purple-500/30">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* --- DYNAMIC HEADER --- */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 border-b border-white/10 pb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-purple-500 font-black text-[10px] uppercase tracking-[0.5em]">
              <TrendingUp size={16} /> Tutor Momentum
            </div>
            <h1 className="text-6xl lg:text-9xl font-black italic tracking-tighter leading-none uppercase">
              The <span className="text-purple-600">Feed.</span>
            </h1>
          </div>

          <div className="flex items-center gap-8">
            <div className="text-right">
              <div className="flex gap-1 justify-end mb-2">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} className="fill-purple-500 text-purple-500" />)}
              </div>
              <p className="text-3xl font-black tracking-tight leading-none">4.9 / 5.0</p>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Based on {allReviews.length} Sessions</p>
            </div>
          </div>
        </header>

        {/* --- REVIEWS MASONRY/BENTO GRID --- */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {allReviews.map((review) => {
            const hasComment = review.comment && review.comment.length > 0;

            return (
              <div 
                key={review.id} 
                className={`break-inside-avoid relative group rounded-[2.5rem] border transition-all duration-500 overflow-hidden ${
                  hasComment 
                  ? "bg-[#0A0A0B] border-white/10 p-8" 
                  : "bg-gradient-to-br from-purple-900/20 to-[#0A0A0B] border-purple-500/20 p-6"
                }`}
              >
                {/* Header: Student Identity */}
                <div className="flex items-center gap-3 mb-6">
                  <div className={`size-10 rounded-xl flex items-center justify-center border ${
                    hasComment ? "bg-white/5 border-white/10" : "bg-purple-500/20 border-purple-500/30"
                  }`}>
                    <User size={18} className={hasComment ? "text-gray-500" : "text-purple-400"} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black italic tracking-tight flex items-center gap-1">
                      {review.student.name}
                      <CheckCircle2 size={12} className="text-emerald-500" />
                    </h4>
                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">Verified Booking</p>
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={12} 
                      className={`${i < review.rating ? "fill-purple-500 text-purple-500" : "text-gray-800"}`} 
                    />
                  ))}
                </div>

                {/* Conditional Content: Comment or Placeholder */}
                {hasComment ? (
                  <div className="relative">
                    <Quote size={24} className="absolute -top-2 -left-2 text-white/5" />
                    <p className="text-gray-300 italic text-sm leading-relaxed relative z-10">
                      "{review.comment}"
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-purple-400/60 italic text-[11px] font-bold uppercase tracking-widest">
                    <Sparkles size={14} /> High Rating Given
                  </div>
                )}

                {/* Footer Meta */}
                <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[9px] font-black text-gray-600 uppercase tracking-widest">
                    <Calendar size={10} />
                    {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </div>
                  {hasComment && (
                    <div className="text-[14px] text-white/5 group-hover:text-purple-500/20 transition-colors">
                      <MessageSquareOff size={18} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* --- BOTTOM CTA --- */}
        <div className="pt-20 text-center">
            <div className="inline-block p-1 rounded-[2rem] bg-white/5 border border-white/10">
                <button className="px-12 py-4 bg-purple-600 hover:bg-white hover:text-black text-white rounded-[1.8rem] font-black uppercase text-xs tracking-[0.4em] transition-all duration-300">
                    Load More Reviews
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}