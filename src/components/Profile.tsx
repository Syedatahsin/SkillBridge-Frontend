"use client";

import React from "react";
import { 
  Mail, Calendar, Award, DollarSign, Star, 
  ShieldCheck, User, CheckCircle2, ArrowLeft, 
  MoreVertical, BookOpen, GraduationCap, 
  Briefcase, Zap, Clock, Heart, Globe, Sparkles
} from "lucide-react";

const UniversalProfileUI = ({ role = "teacher" }: { role: "student" | "teacher" }) => {
  const isTeacher = role === "teacher";

  return (
    <div className="w-full min-h-screen bg-[#050505] py-12 px-6 font-sans text-white">
      <div className="max-w-6xl mx-auto">
        
        {/* --- DYNAMIC BACKGROUND ORBS --- */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] size-[500px] bg-purple-600/20 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] size-[500px] bg-fuchsia-600/10 blur-[120px] rounded-full" />
        </div>

        {/* --- NAVIGATION --- */}
        <div className="relative z-10 flex justify-between items-center mb-10">
          <button className="group flex items-center gap-3 text-gray-400 hover:text-white transition-all">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:border-purple-500/50 group-hover:bg-purple-500/10 transition-all">
              <ArrowLeft size={20} />
            </div>
            <span className="font-bold uppercase text-[11px] tracking-[0.2em]">Return to Hub</span>
          </button>
          
          <div className="flex items-center gap-4">
            <div className="px-5 py-2 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 p-[1px]">
              <div className="px-4 py-1 bg-[#050505] rounded-[14px] text-[10px] font-black uppercase tracking-widest">
                System Mode: {role}
              </div>
            </div>
          </div>
        </div>

        {/* --- MAIN CARD --- */}
        <div className="relative z-10 bg-white/[0.03] backdrop-blur-3xl rounded-[4rem] border border-white/10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden">
          
          {/* Header Decoration */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />

          <div className="p-8 lg:p-16">
            
            {/* 1. IDENTITY HEADER */}
            <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-center pb-16 border-b border-white/5">
              
              <div className="relative group">
                {/* Rotating Gradient Ring */}
                <div className="absolute -inset-1 bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-purple-900 rounded-[3.8rem] blur-md opacity-75 group-hover:opacity-100 group-hover:rotate-180 transition-all duration-1000" />
                
                <div className="relative size-48 lg:size-56 rounded-[3.5rem] bg-[#0A0A0B] flex items-center justify-center overflow-hidden border border-white/10">
                   <User size={80} className="text-white/10 group-hover:scale-110 transition-transform duration-500" />
                   {/* Gradient Overlay on Image */}
                   <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 to-transparent opacity-60" />
                </div>

                <div className="absolute -bottom-2 -right-2 size-14 bg-white text-black rounded-2xl border-[6px] border-[#0A0A0B] flex items-center justify-center shadow-2xl">
                  {isTeacher ? <Briefcase size={22} /> : <GraduationCap size={22} />}
                </div>
              </div>

              <div className="flex-1 text-center lg:text-left space-y-6">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                    <h1 className="text-5xl lg:text-7xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
                      {isTeacher ? "Dr. Ariful Islam" : "Rahat Chowdhury"}
                    </h1>
                    <div className="bg-purple-500/20 border border-purple-500/30 text-purple-400 p-2 rounded-xl">
                      <CheckCircle2 size={24} />
                    </div>
                  </div>
                  <p className="text-xl text-purple-400/80 font-bold flex items-center justify-center lg:justify-start gap-2">
                    <Sparkles size={18} /> {isTeacher ? "Expert Senior Mentor" : "Full Stack Student"}
                  </p>
                </div>
                
                <div className="flex flex-wrap justify-center lg:justify-start gap-6">
                  <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/5 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all flex items-center gap-3 cursor-pointer group">
                    <Mail size={18} className="text-purple-500 group-hover:animate-bounce" />
                    <span className="font-bold text-sm text-gray-300">user@skillbridge.io</span>
                  </div>
                  <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
                    <Globe size={18} className="text-purple-500" />
                    <span className="font-bold text-sm text-gray-300">Sylhet, BD</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. STATS GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-16">
              
              <div className="lg:col-span-7 space-y-10">
                <div className="space-y-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-purple-500 px-1">Personal Narrative</h3>
                  <div className="relative p-10 bg-white/[0.02] border border-white/5 rounded-[3rem] hover:bg-white/[0.04] transition-all group">
                    <div className="absolute top-6 left-6 text-purple-500/20 text-6xl font-serif">“</div>
                    <p className="relative z-10 text-2xl lg:text-3xl text-gray-200 font-medium leading-relaxed">
                      {isTeacher 
                        ? "Empowering the next generation of creators through deep technical mastery and aesthetic design principles." 
                        : "Driven by curiosity and a passion for building scalable applications that solve real-world problems."}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-8 bg-gradient-to-br from-white/5 to-transparent border border-white/5 rounded-[2.5rem] group hover:scale-[1.02] transition-all">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Enrolled Since</p>
                    <div className="flex items-center gap-4">
                        <Calendar size={24} className="text-purple-500" />
                        <p className="text-xl font-black">Oct 24, 2025</p>
                    </div>
                  </div>
                  <div className="p-8 bg-gradient-to-br from-white/5 to-transparent border border-white/5 rounded-[2.5rem] group hover:scale-[1.02] transition-all">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Account Level</p>
                    <div className="flex items-center gap-4">
                        <ShieldCheck size={24} className="text-emerald-500" />
                        <p className="text-xl font-black">Verified Elite</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-8">
                <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-purple-500 px-2">Key Analytics</h3>
                
                <div className="grid grid-cols-2 gap-6">
                  {/* Highlight Card 1 */}
                  <div className="relative group overflow-hidden bg-gradient-to-br from-purple-600 to-fuchsia-700 p-8 rounded-[3rem] shadow-2xl shadow-purple-900/40 hover:-translate-y-2 transition-all duration-500">
                    <div className="absolute -bottom-4 -right-4 size-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
                    {isTeacher ? <Award className="mb-4 opacity-50" size={32} /> : <BookOpen className="mb-4 opacity-50" size={32} />}
                    <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">{isTeacher ? "Experience" : "Lessons"}</p>
                    <p className="text-4xl font-black">{isTeacher ? "12y" : "86"}</p>
                  </div>

                  {/* Highlight Card 2 */}
                  <div className="bg-white/5 border border-white/10 p-8 rounded-[3rem] hover:bg-white/10 transition-all group">
                    {isTeacher ? <DollarSign className="text-purple-500 mb-4 group-hover:scale-125 transition-transform" size={32} /> : <Heart className="text-purple-500 mb-4 group-hover:scale-125 transition-transform" size={32} />}
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{isTeacher ? "Hourly" : "Saves"}</p>
                    <p className="text-4xl font-black text-white">{isTeacher ? "$85" : "14"}</p>
                  </div>
                </div>

                <div className="p-8 bg-black/40 border border-white/5 rounded-[3rem] flex items-center justify-between group hover:border-purple-500/30 transition-all">
                  <div>
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Total Impact</p>
                    <p className="text-3xl font-black text-white">4.92 Rating</p>
                  </div>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(i => <Star key={i} size={16} className="fill-purple-500 text-purple-500" />)}
                  </div>
                </div>

                <div className="pt-4 flex flex-col gap-4">
                  <button className="w-full h-16 rounded-3xl bg-white text-black font-black uppercase text-xs tracking-[0.2em] hover:bg-purple-500 hover:text-white transition-all shadow-xl shadow-white/5">
                    Download Report
                  </button>
                  <button className="w-full h-16 rounded-3xl bg-transparent border border-white/10 text-gray-500 font-black uppercase text-xs tracking-[0.2em] hover:bg-red-600/10 hover:text-red-500 hover:border-red-500/50 transition-all">
                    Deactivate Account
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversalProfileUI;