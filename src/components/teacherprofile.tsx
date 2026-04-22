"use client";

import React, { useState } from "react";
import { 
  Star, Clock, ShieldCheck, User, Sparkles, 
  HandCoins, X, Zap, Target, ChevronLeft, ChevronRight
} from "lucide-react";

export default function TeacherProfileClient({ tutor }: { tutor: any }) {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 3;

  // Use real data from Prisma relations
  const slots = tutor.availability || [];
  const allReviews = tutor.reviews || [];
  const maxPage = Math.ceil(allReviews.length / ITEMS_PER_PAGE) || 1;
  const currentReviews = allReviews.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30 overflow-x-hidden">
      
      {/* 1. HERO & IDENTITY SECTION */}
      <section className="relative w-full border-b border-white/10 bg-[#080809] pt-20 pb-12 lg:pt-32 lg:pb-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-12 items-center">
          
          {/* Teacher Image */}
          <div className="relative mx-auto lg:mx-0">
            <div className="size-40 lg:size-64 rounded-[3rem] bg-gradient-to-tr from-purple-600 to-fuchsia-600 p-[4px] shadow-2xl shadow-purple-500/20">
              <div className="size-full bg-[#050505] rounded-[2.8rem] overflow-hidden">
                <img 
                  src={tutor.user?.image || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop"} 
                  alt={tutor.user?.name} 
                  className="size-full object-cover"
                />
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-3 rounded-2xl border-4 border-[#080809]">
              <ShieldCheck size={24} className="text-white" />
            </div>
          </div>

          {/* Teacher Info */}
          <div className="text-center lg:text-left space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-purple-500 font-black text-[10px] uppercase tracking-[0.5em]">
                <Zap size={14} className="fill-purple-500" /> Professional Mentor
              </div>
              <h1 className="text-5xl lg:text-8xl font-black italic tracking-tighter leading-none">
                {tutor.user?.name?.split(' ')[0]} <span className="text-purple-600">{tutor.user?.name?.split(' ').slice(1).join(' ')}</span>
              </h1>
              <p className="text-gray-400 text-lg lg:text-xl font-medium italic max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                "{tutor.bio || 'Bridging the gap between knowledge and expertise.'}"
              </p>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
               <div className="px-6 py-3 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3">
                  <Star size={18} className="fill-purple-500 text-purple-500" />
                  <span className="font-black italic">4.9 Rating</span>
               </div>
               <div className="px-6 py-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex items-center gap-3 text-emerald-400">
                  <HandCoins size={18} />
                  <span className="font-black italic text-xs uppercase tracking-widest">Pay at Session</span>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BOOKING GRID SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-purple-500 font-black text-[10px] uppercase tracking-[0.4em]">
              <Target size={14} /> Direct Access
            </div>
            <h2 className="text-4xl lg:text-6xl font-black italic tracking-tighter">Available <span className="text-purple-600">Slots.</span></h2>
          </div>
          <p className="text-gray-500 italic text-sm font-medium">Click an available slot. No pre-payment required.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {slots.length > 0 ? slots.map((slot: any) => {
            const isSelected = selectedSlot === slot.id;
            return (
              <button
                key={slot.id}
                disabled={slot.isBooked}
                onClick={() => setSelectedSlot(slot.id)}
                className={`p-8 rounded-[2.5rem] border transition-all duration-500 flex flex-col items-start text-left group ${
                  slot.isBooked 
                  ? "bg-white/[0.01] border-white/5 opacity-30 cursor-not-allowed" 
                  : isSelected
                    ? "bg-purple-600 border-purple-400 scale-[1.05] shadow-[0_20px_50px_rgba(147,51,234,0.3)]"
                    : "bg-[#0A0A0B] border-white/10 hover:border-purple-600/50"
                }`}
              >
                <div className={`mb-6 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                  isSelected ? "bg-white/20 border-white/30" : "bg-white/5 border-white/10 text-gray-500"
                }`}>
                  {new Date(slot.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>

                <div className="mb-8">
                  <div className="flex items-center gap-2">
                    <Clock size={20} className={isSelected ? "text-white" : "text-purple-500"} />
                    <span className="text-3xl font-black tracking-tight leading-none">
                      {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                <div className={`w-full pt-4 border-t ${isSelected ? "border-white/20" : "border-white/5"}`}>
                   <span className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${
                     slot.isBooked ? "text-gray-700" : isSelected ? "text-white" : "text-emerald-500"
                   }`}>
                    {slot.isBooked ? "Already Booked" : isSelected ? "Selected" : "Available - Click to Book"}
                   </span>
                </div>
              </button>
            );
          }) : (
            <div className="col-span-full py-10 text-center text-gray-500 italic border border-dashed border-white/10 rounded-3xl">
              No sessions available for booking right now.
            </div>
          )}
        </div>
      </section>

      {/* 3. REVIEWS SECTION */}
      <section className="bg-[#080809] py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl lg:text-7xl font-black italic tracking-tighter uppercase">Student <span className="text-purple-600">Feed.</span></h2>
            <div className="flex items-center justify-center gap-2">
              {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-purple-500 text-purple-500" />)}
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Verified Reviews</span>
            </div>
          </div>

          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {currentReviews.length > 0 ? currentReviews.map((rev: any) => (
              <div key={rev.id} className="break-inside-avoid p-8 bg-[#0A0A0B] border border-white/10 rounded-[2.5rem] hover:border-purple-500/30 transition-all">
                <div className="flex items-center gap-3 mb-6">
                  <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500">
                    <User size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black italic tracking-tight">{rev.student?.name || "Verified Student"}</h4>
                    <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-tighter">Verified Review</p>
                  </div>
                </div>
                {rev.comment ? (
                  <p className="text-gray-300 italic text-sm leading-relaxed">"{rev.comment}"</p>
                ) : (
                  <div className="text-purple-400 font-black text-[10px] uppercase tracking-widest">
                    <Sparkles size={14} className="inline mr-2" /> High Rating Given
                  </div>
                )}
              </div>
            )) : (
                <p className="col-span-full text-center text-gray-600">No reviews yet.</p>
            )}
          </div>

          {allReviews.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center mt-12 p-6 bg-[#0A0A0B] border border-white/10 rounded-3xl gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="size-10 flex items-center justify-center rounded-xl bg-zinc-900 border border-white/10 hover:bg-white/10 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  Page <span className="text-white">{page}</span> of {maxPage}
                </div>
                <button
                  onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
                  disabled={page === maxPage}
                  className="size-10 flex items-center justify-center rounded-xl bg-zinc-900 border border-white/10 hover:bg-white/10 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
              <span className="text-zinc-400 text-xs font-medium uppercase tracking-widest">
                Total Reviews: <span className="text-purple-500">{allReviews.length}</span>
              </span>
            </div>
          )}

        </div>
      </section>

      {/* FLOATING CONFIRMATION (COD STYLE) */}
      {selectedSlot && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-[600px] z-[100] animate-in slide-in-from-bottom-5">
          <div className="bg-white text-black p-6 rounded-[2.5rem] shadow-2xl flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <HandCoins size={24} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Confirm Booking</p>
                <p className="text-lg font-black truncate leading-none">
                  {new Date(slots.find((s: any) => s.id === selectedSlot)?.startTime || "").toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setSelectedSlot(null)} className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200"><X size={20}/></button>
              <button className="px-8 py-3 bg-black text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-purple-600 transition-colors">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}