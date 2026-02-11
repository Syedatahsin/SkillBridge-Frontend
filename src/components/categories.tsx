"use client";

import React from "react";
import { Search, Grid2X2, Zap, ChevronLeft, ChevronRight, Plus, Filter, MoreHorizontal } from "lucide-react";

const CategoryManagerUI = () => {
  // Static Dummy Data for UI Display (Exactly 10 Items)
  const categories = [
    { name: "Web Development", count: "142 Courses", color: "from-blue-500" },
    { name: "UI/UX Design", count: "89 Courses", color: "from-purple-500" },
    { name: "Data Science", count: "112 Courses", color: "from-emerald-500" },
    { name: "Digital Marketing", count: "64 Courses", color: "from-rose-500" },
    { name: "Mobile Apps", count: "73 Courses", color: "from-amber-500" },
    { name: "Cyber Security", count: "45 Courses", color: "from-cyan-500" },
    { name: "AI & Machine Learning", count: "98 Courses", color: "from-indigo-500" },
    { name: "Cloud Computing", count: "52 Courses", color: "from-orange-500" },
    { name: "Graphic Design", count: "120 Courses", color: "from-pink-500" },
    { name: "Business Management", count: "33 Courses", color: "from-teal-500" },
  ];

  return (
    <div className="w-full min-h-screen bg-[#050505] p-6 lg:p-12 text-white selection:bg-purple-500/30">
      
      {/* --- TOP HEADER SECTION --- */}
      <div className="max-w-7xl mx-auto mb-16 space-y-10">
        <div className="flex flex-col lg:flex-row justify-between items-end gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-purple-500 font-black text-[10px] uppercase tracking-[0.5em]">
              <Zap size={14} className="fill-purple-500" /> Administrative Portal
            </div>
            <h1 className="text-6xl lg:text-7xl font-black tracking-tighter leading-none">
              Explore <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-fuchsia-500">Categories</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-96 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-500 transition-all" size={20} />
              <input 
                placeholder="Search all categories..."
                className="w-full h-16 bg-white/[0.03] border border-white/10 rounded-2xl pl-14 pr-6 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition-all font-bold text-sm"
              />
            </div>
            <button className="h-16 w-16 flex items-center justify-center bg-purple-600 rounded-2xl hover:bg-purple-500 hover:rotate-90 transition-all duration-500 shadow-xl shadow-purple-900/20">
              <Plus size={24} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* --- 10-ITEM CATEGORY GRID --- */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {categories.map((cat, index) => (
          <div 
            key={index}
            className="group relative p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] hover:bg-white/[0.05] hover:border-purple-500/30 transition-all duration-500 cursor-pointer overflow-hidden"
          >
            {/* Hover Gradient Glow */}
            <div className={`absolute -right-8 -top-8 size-32 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500`} />
            
            <div className="relative z-10">
              <div className="size-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:bg-purple-600 group-hover:shadow-[0_0_20px_rgba(147,51,234,0.4)] transition-all duration-500">
                <Grid2X2 className="text-purple-500 group-hover:text-white transition-colors" size={24} />
              </div>
              
              <h3 className="text-xl font-black mb-1 tracking-tight group-hover:text-purple-400 transition-colors leading-tight">
                {cat.name}
              </h3>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
                {cat.count}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                <span className="text-[9px] font-black uppercase tracking-widest text-purple-500">View Details</span>
                <ChevronRight size={14} className="text-purple-500" />
            </div>
          </div>
        ))}
      </div>

      {/* --- PREMIUM PAGINATION BAR --- */}
      <div className="max-w-7xl mx-auto mt-20">
        <div className="flex flex-col md:flex-row items-center justify-between p-8 bg-white/[0.02] border border-white/5 rounded-[3rem]">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em]">
              Showing <span className="text-white">10</span> of <span className="text-white">45</span> Entries
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-4 rounded-2xl bg-white/5 border border-white/5 text-gray-600 hover:text-white transition-all">
              <ChevronLeft size={20} />
            </button>
            
            {/* Active Page */}
            <button className="size-14 rounded-2xl bg-purple-600 font-black text-sm text-white shadow-xl shadow-purple-900/40 border border-white/10 scale-110">
              01
            </button>
            
            {/* Inactive Page */}
            <button className="size-14 rounded-2xl bg-white/5 border border-white/5 font-black text-sm text-gray-500 hover:text-purple-400 hover:border-purple-500/20 transition-all">
              02
            </button>

            {/* Inactive Page */}
            <button className="size-14 rounded-2xl bg-white/5 border border-white/5 font-black text-sm text-gray-500 hover:text-purple-400 hover:border-purple-500/20 transition-all">
              03
            </button>

            <button className="p-4 rounded-2xl bg-white/5 border border-white/5 text-gray-600 hover:text-white transition-all">
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="hidden lg:block">
             <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
               <Filter size={14} /> Jump to Page
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryManagerUI;