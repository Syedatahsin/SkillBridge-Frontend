"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, GraduationCap, Users, Clock, Zap, Infinity, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function SkillBridgeFinalCTA() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const ACCESS_KEY = "ca99496a-c08e-4068-aac3-5c0d101e82aa";

  const onSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    formData.append("access_key", ACCESS_KEY);
    formData.append("subject", "Newsletter Subscription");
    formData.append("from_name", "SkillBridge Newsletter");

    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: json
      }).then((res) => res.json());

      if (res.success) {
        toast.success("Subscribed successfully! Welcome to SkillBridge.");
        (e.target as HTMLFormElement).reset();
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (err) {
      toast.error("Network error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="final-cta" className="py-24 px-6 md:px-12 relative overflow-hidden bg-background scroll-mt-24">
      {/* Energetic Background Gradient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* NEWSLETTER BOX (Left - 5 columns) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 p-8 md:p-10 rounded-[2.5rem] bg-card border border-border shadow-2xl relative overflow-hidden group"
          >
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform">
                <Mail className="text-primary w-6 h-6" />
              </div>
              <h3 className="text-2xl md:text-3xl font-black mb-4 tracking-tight">Stay in the Loop</h3>
              <p className="text-muted-foreground mb-8 leading-relaxed text-sm md:text-base">
                Get the latest educational tips and 1-on-1 session insights delivered to your inbox.
              </p>
              
              <form onSubmit={onSubscribe} className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  name="email"
                  required
                  placeholder="Enter your email" 
                  className="flex-1 px-5 py-4 rounded-2xl bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-foreground"
                />
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-2xl hover:brightness-110 transition-all shadow-lg shadow-purple-500/20 active:scale-95 whitespace-nowrap flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Subscribe"}
                </button>
              </form>
            </div>
          </motion.div>

          {/* DUAL CTA & FEATURES (Right - 7 columns) */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 flex flex-col gap-8"
          >
            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Flexible Time</h4>
                  <p className="text-xs text-muted-foreground">Learn at your own pace</p>
                </div>
              </div>
              <div className="p-6 rounded-3xl bg-blue-500/5 border border-blue-500/20 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
                  <Infinity className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Unlimited Sessions</h4>
                  <p className="text-xs text-muted-foreground">No learning restrictions</p>
                </div>
              </div>
            </div>

            {/* The Main Buttons Box */}
            <div className="p-8 md:p-10 rounded-[2.5rem] bg-slate-900 text-white dark:bg-primary/10 dark:text-foreground border border-white/10 relative overflow-hidden flex-1 group">
              <Zap className="absolute top-[-20px] right-[-20px] w-40 h-40 text-white/5 dark:text-primary/5 -rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
              
              <h3 className="text-3xl font-black mb-6 relative z-10">Ready to Bridge Your Skills?</h3>
              
              <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                <Link href="/registration" className="flex-1">
                  <button className="w-full flex items-center justify-center gap-2 px-8 py-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black rounded-2xl hover:scale-[1.02] transition-transform shadow-xl shadow-purple-500/20">
                    <GraduationCap className="w-5 h-5" />
                    Start Your Journey
                  </button>
                </Link>
                <Link href="/registration" className="flex-1">
                  <button className="w-full flex items-center justify-center gap-2 px-8 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black rounded-2xl hover:scale-[1.02] transition-transform shadow-xl shadow-indigo-500/20">
                    <Users className="w-5 h-5" />
                    Join as a Tutor
                  </button>
                </Link>
              </div>
              
              <p className="mt-6 text-sm text-center opacity-60 font-medium">
                No hidden fees. Pay only for the sessions you attend.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
