"use client";

import React from "react";
import { 
  ArrowLeft, Edit3, Trash2, Layers, 
  Zap, Save, X, Sparkles
} from "lucide-react";

const SingleCategoryUI = () => {
  return (
    <div className="w-full min-h-screen bg-[#050505] text-white p-4 md:p-8 lg:p-12 selection:bg-purple-500/30">
      
      {/* --- TOP NAV: Responsive Bar --- */}
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6 mb-8 lg:mb-16">
        <button className="group flex items-center gap-3 text-gray-500 hover:text-white transition-all w-full sm:w-auto">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:border-purple-500/50 group-hover:bg-purple-500/10 transition-all">
            <ArrowLeft size={20} />
          </div>
          <span className="font-bold uppercase text-[10px] tracking-[0.3em]">Back to Hub</span>
        </button>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/50 text-gray-400 hover:text-purple-400 transition-all font-bold text-xs uppercase tracking-widest">
            <Edit3 size={16} /> Edit
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all font-bold text-xs uppercase tracking-widest">
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>

      {/* --- MAIN CARD --- */}
      <div className="max-w-5xl mx-auto relative">
        {/* Background Glows (Hidden on small mobile for performance) */}
        <div className="absolute -top-20 -left-20 size-64 bg-purple-600/20 blur-[100px] rounded-full hidden md:block" />
        <div className="absolute -bottom-20 -right-20 size-64 bg-fuchsia-600/10 blur-[100px] rounded-full hidden md:block" />

        <div className="relative overflow-hidden rounded-[2.5rem] md:rounded-[4rem] border border-white/10 bg-[#0A0A0B] backdrop-blur-3xl shadow-2xl">
          
          {/* Top Gradient Stripe */}
          <div className="h-2 w-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-900" />

          <div className="p-8 md:p-16 lg:p-20 space-y-12">
            
            {/* 1. NAME SECTION */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-purple-600 shadow-[0_0_20px_rgba(147,51,234,0.3)]">
                  <Layers size={20} className="text-white" />
                </div>
                <span className="text-purple-500 font-black uppercase text-[10px] tracking-[0.4em]">Category Name</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] text-white break-words">
                Web <span className="bg-clip-text text-transparent bg-gradient-to-b from-purple-400 to-purple-700">Development</span>
              </h1>
            </div>

            {/* 2. DESCRIPTION SECTION */}
            <div className="space-y-6 pt-12 border-t border-white/5">
              <div className="flex items-center gap-3">
                <Sparkles size={18} className="text-purple-500" />
                <span className="text-gray-500 font-black uppercase text-[10px] tracking-[0.4em]">Description</span>
              </div>
              
              <div className="relative group">
                <p className="text-xl md:text-2xl lg:text-3xl text-gray-300 font-medium leading-relaxed md:leading-snug italic">
                  Master the art of building scalable, modern web applications. This category covers everything from frontend architecture to backend systems, ensuring a complete learning path for modern developers.
                </p>
                {/* Decorative Quote Mark */}
                <div className="absolute -top-8 -left-8 text-white/5 text-9xl font-serif pointer-events-none select-none">“</div>
              </div>
            </div>

            {/* 3. QUICK FOOTER INFO */}
            <div className="pt-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-t border-white/5">
                <div className="flex items-center gap-4 text-gray-500">
                    <Zap size={16} className="text-purple-500" />
                    <span className="font-bold text-xs uppercase tracking-widest">System Record: #CAT-001</span>
                </div>
                <button className="w-full md:w-auto px-10 h-14 bg-purple-600 hover:bg-purple-500 rounded-2xl text-white font-black uppercase text-[11px] tracking-widest transition-all shadow-xl shadow-purple-900/20">
                    View Associated Members
                </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleCategoryUI;