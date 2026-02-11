"use client";

import React, { useState } from "react";
import { 
  Calendar as CalendarIcon, Clock, Video, 
  Trash2, Sparkles, ChevronRight, ChevronLeft,
  Check, Save, AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

const SmartSlotCreator = () => {
  // Get current date for "Min" constraints
  const today = new Date().toISOString().split("T")[0];
  const currentTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="w-full min-h-screen bg-[#050505] text-white p-4 md:p-10 lg:p-16">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-purple-500 font-black text-[10px] uppercase tracking-[0.4em]">
              <Sparkles size={14} className="fill-purple-500" /> Smart Scheduling
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter">
              Create <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-500">Live Slots</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl">
            <div className="size-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Timezone: UTC +06:00</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: Date & Details (40%) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0A0A0B] border border-white/10 rounded-[2.5rem] p-8 space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-500 flex items-center gap-2">
                   <CalendarIcon size={14} /> 1. Select Date
                </label>
                <input 
                  type="date" 
                  min={today}
                  defaultValue={today}
                  className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 focus:border-purple-500 transition-all font-bold text-white appearance-none cursor-pointer scheme-dark"
                />
                <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest flex items-center gap-1">
                  <AlertCircle size={10} /> Past dates are automatically disabled.
                </p>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-500 flex items-center gap-2">
                   <Video size={14} /> 2. Meeting Link
                </label>
                <input 
                  placeholder="https://meet.google.com/..."
                  className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 focus:border-purple-500 transition-all font-bold text-sm"
                />
              </div>
            </div>
          </div>

          {/* RIGHT: Time Windows (60%) */}
          <div className="lg:col-span-7">
            <div className="bg-[#0A0A0B] border border-white/10 rounded-[2.5rem] p-8 md:p-12 space-y-10 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 blur-3xl pointer-events-none" />
               
               <div className="space-y-8">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-500 flex items-center gap-2">
                     <Clock size={14} /> 3. Set Time Duration
                  </label>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest ml-1">From</span>
                      <input 
                        type="time" 
                        className="w-full h-20 bg-white/5 border border-white/10 rounded-3xl px-8 focus:border-purple-500 transition-all font-black text-2xl scheme-dark cursor-pointer"
                      />
                    </div>
                    <div className="space-y-3">
                      <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest ml-1">To</span>
                      <input 
                        type="time" 
                        className="w-full h-20 bg-white/5 border border-white/10 rounded-3xl px-8 focus:border-purple-500 transition-all font-black text-2xl scheme-dark cursor-pointer"
                      />
                    </div>
                  </div>
               </div>

               <div className="pt-8 flex gap-4">
                  <button className="flex-1 h-20 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:scale-[1.02] active:scale-[0.98] rounded-3xl flex items-center justify-center gap-3 font-black uppercase text-xs tracking-[0.2em] transition-all shadow-xl shadow-purple-900/20">
                    <Save size={20} /> Publish Slot
                  </button>
               </div>
            </div>
          </div>
        </div>

        {/* --- PREVIEW FOOTER --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60 hover:opacity-100 transition-opacity">
           <div className="p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 font-black">12</div>
                <div>
                  <p className="font-bold text-sm">Today's Sessions</p>
                  <p className="text-[10px] text-purple-500 font-black uppercase tracking-widest">3 Remaining</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-700 group-hover:text-purple-500 transition-colors" />
           </div>
        </div>

      </div>
    </div>
  );
};

export default SmartSlotCreator;