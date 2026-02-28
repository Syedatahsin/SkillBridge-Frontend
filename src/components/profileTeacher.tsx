"use client";

import React from "react";
import { 
  UserCheck, 
  Rocket, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck,
  Zap
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";

export default function TeacherOnboardingCard() {
  const router = useRouter();

  return (
    <section className="py-12 px-4">
      <Card className="max-w-4xl mx-auto overflow-hidden border-none bg-gradient-to-br from-zinc-900 via-black to-zinc-900 rounded-[2.5rem] shadow-2xl relative">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Rocket size={120} className="rotate-12 text-purple-500" />
        </div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-600/10 blur-[80px] rounded-full" />

        <CardContent className="p-8 md:p-12 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            
            {/* Left Side: Icon/Status */}
            <div className="relative">
              <div className="w-24 h-24 rounded-3xl bg-purple-600/20 flex items-center justify-center border border-purple-500/30">
                <UserCheck size={40} className="text-purple-400" />
              </div>
              <div className="absolute -top-2 -right-2 bg-emerald-500 p-1.5 rounded-full border-4 border-black">
                <Sparkles size={12} className="text-white" />
              </div>
            </div>

            {/* Middle: Content */}
            <div className="flex-1 text-center md:text-left space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-purple-400">
                <Zap size={12} /> Registration Confirmed
              </div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-white">
                Unlock Your <span className="text-purple-500">Teaching Power</span>
              </h2>
              <p className="text-zinc-400 text-lg leading-relaxed max-w-xl">
                You&apos;re officially registered! Now, complete your professional profile to become visible to thousands of students and start your journey.
              </p>
            </div>

            {/* Right Side: The "Power" Button */}
            <div className="w-full md:w-auto">
              <button 
                onClick={() => router.push("/teacher/completefullprofile")}
                className="group relative w-full md:w-auto px-8 py-5 bg-white text-black font-black rounded-2xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              >
                {/* Button Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                
                <span className="relative z-10 text-sm uppercase tracking-widest">
                  Complete Profile
                </span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>

          {/* Bottom Features List */}
          <div className="mt-10 pt-8 border-t border-white/5 flex flex-wrap justify-center md:justify-start gap-6">
            <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-widest">
              <ShieldCheck size={14} className="text-emerald-500" /> Verify Identity
            </div>
            <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-widest">
              <ShieldCheck size={14} className="text-emerald-500" /> Set Hourly Rates
            </div>
            <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-widest">
              <ShieldCheck size={14} className="text-emerald-500" /> Choose Subjects
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}