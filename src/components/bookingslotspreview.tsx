"use client";

import React, { useState } from "react";
import { 
  Clock, Lock, CheckCircle2, Star, 
  Calendar, ShieldCheck, ArrowRight,
  X, Sparkles, HandCoins
} from "lucide-react";

export default function StudentBookingPage() {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const slots = [
    { id: "1", startTime: "2026-02-12T10:00:00", isBooked: false },
    { id: "2", startTime: "2026-02-12T14:00:00", isBooked: true },
    { id: "3", startTime: "2026-02-13T09:00:00", isBooked: false },
    { id: "4", startTime: "2026-02-13T11:00:00", isBooked: true },
    { id: "5", startTime: "2026-02-14T16:00:00", isBooked: false },
    { id: "6", startTime: "2026-02-15T10:00:00", isBooked: false },
  ];

  const handleSlotClick = (id: string, isBooked: boolean) => {
    if (isBooked) return;
    setSelectedSlot(id);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30 overflow-x-hidden">
      
      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] w-full min-h-screen">
        
        {/* --- SIDEBAR --- */}
        <aside className="bg-[#080809] border-b lg:border-b-0 lg:border-r border-white/10 p-8 lg:p-10 lg:sticky lg:top-0 lg:h-screen flex flex-col gap-8 overflow-y-auto">
          <div className="flex flex-col items-center lg:items-start gap-6">
            <div className="relative group">
              <div className="size-32 lg:size-40 rounded-[2.5rem] bg-gradient-to-tr from-purple-600 to-fuchsia-600 p-[3px] shadow-2xl">
                <div className="size-full bg-[#050505] rounded-[2.4rem] overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=256&h=256&auto=format&fit=crop" 
                    alt="Teacher" 
                    className="size-full object-cover opacity-90"
                  />
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-2 rounded-xl border-4 border-[#080809]">
                <ShieldCheck size={20} className="text-white" />
              </div>
            </div>

            <div className="text-center lg:text-left space-y-1">
              <h1 className="text-3xl lg:text-4xl font-black italic tracking-tighter">
                Dr. Ariful <span className="text-purple-500 font-bold">Islam</span>
              </h1>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Computer Science Mentor</p>
            </div>
          </div>

          <div className="space-y-3">
             <div className="flex items-center gap-2 text-purple-500">
                <Star size={14} className="fill-purple-500" />
                <span className="text-[10px] font-black uppercase tracking-widest">About the Mentor</span>
             </div>
             <p className="text-gray-400 text-sm leading-relaxed italic border-l-2 border-purple-500/30 pl-4">
                "I specialize in high-performance web architecture and React. I help students bridge the gap between junior and senior roles."
             </p>
          </div>

          <div className="mt-auto p-5 bg-white/[0.03] border border-white/10 rounded-3xl">
             <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Session Fee</span>
                <span className="text-2xl font-black">$45.00</span>
             </div>
             <div className="flex items-center gap-3 text-emerald-400">
                <HandCoins size={18} />
                <span className="text-[10px] font-black uppercase tracking-[0.1em]">Cash on Delivery</span>
             </div>
          </div>
        </aside>

        {/* --- MAIN CONTENT --- */}
        <main className="p-6 lg:p-16 w-full min-w-0">
          <div className="max-w-[1100px] mx-auto space-y-12 pb-32">
            
            <header className="space-y-4">
              <div className="flex items-center gap-2 text-purple-500 font-black text-[10px] uppercase tracking-[0.4em]">
                <Sparkles size={14} className="fill-purple-500" /> Live Schedule
              </div>
              <h2 className="text-5xl lg:text-7xl font-black tracking-tighter italic leading-none">
                Select <span className="text-purple-600 font-bold">Slot.</span>
              </h2>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {slots.map((slot) => {
                const isSelected = selectedSlot === slot.id;
                
                return (
                  <button
                    key={slot.id}
                    onClick={() => handleSlotClick(slot.id, !!slot.isBooked)}
                    className={`relative p-8 rounded-[2.5rem] border transition-all duration-500 flex flex-col items-start text-left group overflow-hidden min-w-0 ${
                      slot.isBooked 
                        ? "bg-white/[0.01] border-white/5 opacity-40 cursor-not-allowed" 
                        : isSelected
                          ? "bg-purple-600 border-purple-400 scale-[1.02] shadow-[0_20px_50px_rgba(147,51,234,0.3)]"
                          : "bg-[#0A0A0B] border-white/10 hover:border-purple-600/50"
                    }`}
                  >
                    <div className={`mb-6 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest border ${
                      isSelected ? "bg-white/20 border-white/30 text-white" : "bg-purple-600/10 border-purple-500/20 text-purple-400"
                    }`}>
                      {new Date(slot.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>

                    <div className="space-y-1 mb-8">
                      <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${isSelected ? "text-purple-200" : "text-gray-500"}`}>Start Time</p>
                      <div className="flex items-center gap-3">
                        <Clock size={20} className={isSelected ? "text-white" : "text-purple-500"} />
                        <span className="text-3xl font-black tracking-tight leading-none truncate">
                          {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    <div className={`w-full pt-6 border-t flex items-center justify-between ${isSelected ? "border-white/20" : "border-white/5"}`}>
                       <span className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${
                         slot.isBooked ? "text-gray-600" : isSelected ? "text-white" : "text-emerald-500"
                       }`}>
                        {slot.isBooked ? (
                          <><Lock size={12} /> Already Booked</>
                        ) : isSelected ? (
                          <><CheckCircle2 size={14} /> Confirmed</>
                        ) : (
                          // THE UPDATED TEXT HERE
                          <><div className="size-2 rounded-full bg-emerald-500 animate-pulse" /> Available - Click to Book</>
                        )}
                       </span>
                       {!slot.isBooked && (
                         <ArrowRight size={16} className={`transition-transform duration-300 ${isSelected ? "translate-x-0" : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"}`} />
                       )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </main>

        {/* --- FLOATING CONFIRMATION BAR --- */}
        {selectedSlot && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-[800px] z-[100] animate-in slide-in-from-bottom-10 duration-500">
            <div className="bg-white text-black p-4 lg:p-6 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="size-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <HandCoins size={28} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Cash on Delivery Booking</p>
                  <p className="text-xl font-black tracking-tight leading-none">
                    {new Date(slots.find(s => s.id === selectedSlot)?.startTime || "").toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <button 
                  onClick={() => setSelectedSlot(null)}
                  className="size-14 rounded-2xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X size={20} />
                </button>
                <button className="flex-1 md:flex-none h-14 px-10 bg-black text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 hover:bg-purple-600 transition-all">
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}