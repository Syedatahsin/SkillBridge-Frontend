"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, CalendarDays, Zap, Lock, Search, MousePointer2 } from "lucide-react";

const features = [
  {
    title: "Verified Tutors",
    desc: "Every tutor undergoes a rigorous background check and credential verification before joining.",
    icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
    bg: "bg-emerald-500/10",
  },
  {
    title: "Smart Scheduling",
    desc: "Book 1-on-1 sessions instantly with our real-time availability sync. No more back-and-forth emails.",
    icon: <CalendarDays className="w-6 h-6 text-blue-500" />,
    bg: "bg-blue-500/10",
  },
  {
    title: "Role-Based Access",
    desc: "Dedicated dashboards for students and teachers to manage sessions, materials, and progress.",
    icon: <Lock className="w-6 h-6 text-purple-500" />,
    bg: "bg-purple-500/10",
  },
  {
    title: "Instant Matching",
    desc: "Our advanced filters help you find the exact skill set you need in seconds.",
    icon: <Search className="w-6 h-6 text-orange-500" />,
    bg: "bg-orange-500/10",
  },
];

export default function WhySkillBridge() {
  return (
    <section id="why-skillbridge" className="py-24 bg-background relative overflow-hidden scroll-mt-24">
      {/* Background Decorative "Skill" Blobs */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/5 blur-[100px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/5 blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          {/* Left Side: Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/3 space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight">
              Why Choose <br />
              <span className="text-primary italic">SkillBridge?</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              We built SkillBridge to solve the two biggest problems in online learning: **Trust** and **Time**.
            </p>
            <ul className="space-y-4">
              {['Strict Verification', 'Live Scheduling', 'Secure Payments'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 font-bold text-sm">
                  <Zap className="w-4 h-4 text-primary fill-current" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right Side: Feature Grid */}
          <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
                className="group p-8 rounded-[2rem] bg-card border border-border shadow-sm hover:shadow-xl hover:border-primary/50 transition-all relative overflow-hidden"
              >
                {/* Subtle Hover Gradient */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${feature.bg} -z-10`} />
                
                <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform`}>
                  {feature.icon}
                </div>
                
                <h3 className="text-xl font-black mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {feature.desc}
                </p>

                <div className="mt-6 flex items-center gap-2 text-primary font-bold text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <MousePointer2 className="w-3 h-3" />
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
