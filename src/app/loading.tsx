"use client";

import { motion } from "framer-motion";
import { Loader2, Zap } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[70vh] w-full flex flex-col items-center justify-center bg-transparent">
      <div className="relative flex items-center justify-center">
        {/* Animated Background Pulse */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0, 0.15, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute size-32 bg-purple-600 rounded-full blur-3xl"
        />

        {/* The Main Spinner Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="size-16 rounded-full border-2 border-purple-600/20 border-t-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.2)]"
        />

        {/* Center Icon */}
        <div className="absolute">
          <Zap className="text-purple-500 size-5 animate-pulse" />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 text-center"
      >
        <h2 className="text-white font-black uppercase tracking-[0.5em] text-[10px] italic">
          IdeaForge <span className="text-purple-600">Admin</span>
        </h2>
        <p className="text-zinc-600 text-[9px] font-bold uppercase mt-2 tracking-widest">
          Fetching Student Profile Data...
        </p>
      </motion.div>
      
      {/* Decorative Loading Bar */}
      <div className="mt-6 w-48 h-[1px] bg-white/5 relative overflow-hidden">
        <motion.div 
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-600 to-transparent"
        />
      </div>
    </div>
  );
}