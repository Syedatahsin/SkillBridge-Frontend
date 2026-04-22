"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, BookOpen, Activity, Loader2 } from "lucide-react";

interface RoleCount {
  students: number;
  teachers: number;
}

export default function SocialProofGraph() {
  const [counts, setCounts] = useState<RoleCount>({ students: 0, teachers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/count`);
        const result = await res.json();
        if (result.success) {
          setCounts({
            students: result.student || 0,
            teachers: result.teacher || 0,
          });
        }
      } catch (err) {
        console.error("Failed to fetch counts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCounts();
  }, []);

  // Calculate dynamic heights/values for the 2 bars
  const maxVal = Math.max(counts.students, counts.teachers, 1);
  
  const socialStats = [
    {
      label: "Verified Tutors",
      value: counts.teachers,
      suffix: "+",
      // If teachers is max, give it 90%, else proportional (min 40%)
      height: `${Math.max((counts.teachers / maxVal) * 90, 40)}%`,
      color: "bg-blue-500",
      glow: "shadow-blue-500/50",
      icon: <Users className="w-4 h-4" />,
    },
    {
      label: "Active Students",
      value: counts.students,
      suffix: "+",
      // If students is max, give it 90%, else proportional (min 40%)
      height: `${Math.max((counts.students / maxVal) * 90, 40)}%`,
      color: "bg-emerald-500",
      glow: "shadow-emerald-500/50",
      icon: <BookOpen className="w-4 h-4" />,
    },
  ];

  return (
    <section className="py-24 bg-background overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side: Content */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
              <Activity className="w-4 h-4" />
              <span>Platform Momentum</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-none">
              Measuring the <br />
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                SkillBridge Impact
              </span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-md leading-relaxed">
              We track our growth in real-time. From verified experts to thousands of successful sessions, our platform is built on trust and data.
            </p>
          </motion.div>

          {/* Right Side: The Energetic Graph */}
          <div className="relative h-[450px] w-full bg-card/50 backdrop-blur-xl border border-border/50 rounded-[3rem] p-10 flex items-end justify-around gap-4 md:gap-16 shadow-2xl transition-all duration-300">
            
            {/* Background Grid Lines for that "Graph" look */}
            <div className="absolute inset-0 flex flex-col justify-between p-10 opacity-[0.05] pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="border-t border-foreground w-full" />
              ))}
            </div>

            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={32} />
              </div>
            ) : (
              socialStats.map((stat, idx) => (
                <div key={idx} className="relative flex flex-col items-center flex-1 h-full justify-end group max-w-[120px]">
                  
                  {/* The Animated Bar */}
                  <motion.div
                    initial={{ height: 0 }}
                    whileInView={{ height: stat.height }} 
                    viewport={{ once: true }}
                    transition={{ 
                      duration: 1.5, 
                      delay: idx * 0.2, 
                      type: "spring", 
                      stiffness: 60,
                      damping: 10 
                    }}
                    className={`relative w-full max-w-[60px] md:max-w-[100px] rounded-2xl ${stat.color} shadow-lg ${stat.glow} transition-all duration-300 group-hover:scale-105 group-hover:brightness-110`}
                  >
                    {/* Glass Shimmer on Bar */}
                    <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Floating Number Bubble */}
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
                      <span className="text-lg md:text-2xl font-black whitespace-nowrap tracking-tighter text-foreground">
                        {stat.value}{stat.suffix}
                      </span>
                      <div className="w-1 h-2 bg-foreground/10" />
                    </div>
                  </motion.div>

                  {/* Bottom Label & Icon */}
                  <div className="mt-8 flex flex-col items-center gap-3">
                    <div className="p-3 rounded-xl bg-secondary dark:bg-slate-800 border border-border group-hover:bg-primary/20 group-hover:rotate-12 transition-all duration-300 shadow-sm">
                      {stat.icon}
                    </div>
                    <span className="text-xs md:text-sm font-black uppercase tracking-widest text-muted-foreground/70 text-center leading-tight">
                      {stat.label.split(' ')[0]} <br/> {stat.label.split(' ')[1]}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
