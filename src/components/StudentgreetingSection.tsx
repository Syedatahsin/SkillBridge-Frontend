"use client";

import React from "react";
import { Search, BookOpen, Clock, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
 const StudentWelcome = () => (
  <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 border border-white/10 p-8 md:p-12 shadow-2xl">
    {/* Decorative Background Glows */}
    <div className="absolute -top-24 -right-24 size-64 bg-purple-600/20 blur-[100px]" />
    <div className="absolute -bottom-24 -left-24 size-64 bg-indigo-600/10 blur-[100px]" />

    <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-10">
      <div className="space-y-6 text-center lg:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold uppercase tracking-widest">
          <Zap size={12} className="fill-purple-400" /> Student Dashboard
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight">
          Keep Pushing, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Anika!</span>
        </h1>
        
        <p className="text-gray-400 max-w-md text-lg font-medium leading-relaxed">
          You&apos;ve spent <span className="text-white">12 hours</span> learning this week. You&apos;re in the top 10% of active students!
        </p>

        <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-sm font-semibold text-gray-300">
            <BookOpen size={16} className="text-purple-400" /> 8 Courses
          </div>
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-sm font-semibold text-gray-300">
            <Star size={16} className="text-yellow-500 fill-yellow-500" /> 4.9 Avg Progress
          </div>
        </div>
      </div>
      
      <div className="w-full lg:w-auto">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-[2.5rem] flex flex-col gap-4">
          <p className="text-sm font-bold text-center text-gray-300 uppercase tracking-widest">Quick Start</p>
          <Button size="lg" className="rounded-[1.5rem] bg-white text-black hover:bg-gray-200 h-20 px-10 text-xl font-black shadow-xl transition-transform hover:scale-105 active:scale-95 group">
            <Search className="mr-3 size-6 group-hover:rotate-12 transition-transform" />
            Find a Tutor
          </Button>
          <p className="text-[10px] text-center text-gray-500 font-medium">Over 500+ verified mentors available today</p>
        </div>
      </div>
    </div>
  </section>
);
export default StudentWelcome;