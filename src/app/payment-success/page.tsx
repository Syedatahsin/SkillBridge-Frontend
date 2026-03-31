"use client";

import React, { Suspense } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Download, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md w-full bg-[#0A0A0B] border border-emerald-500/20 rounded-[3rem] p-12 text-center relative overflow-hidden shadow-2xl"
    >
      {/* Background Ambient Glow */}
      <div className="absolute -top-24 -left-24 size-48 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Animated Success Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ 
          scale: 1,
          boxShadow: [
            "0 0 20px rgba(16, 185, 129, 0.1)", 
            "0 0 40px rgba(16, 185, 129, 0.4)", 
            "0 0 20px rgba(16, 185, 129, 0.1)"
          ]
        }}
        transition={{ 
          scale: { type: "spring", stiffness: 200, damping: 20 },
          boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
        className="size-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/20"
      >
        <CheckCircle2 className="text-emerald-500 size-12" />
      </motion.div>

      <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-4">
        Payment <span className="text-emerald-500">Confirmed</span>
      </h1>
      
      <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest mb-10 leading-relaxed px-4">
        Your session has been successfully forged. <br /> Check your dashboard for the meeting link.
      </p>

      <div className="space-y-3 relative z-10">
        <Button
          onClick={() => router.push("/student")}
          className="w-full h-14 bg-white text-black hover:bg-emerald-500 hover:text-white font-black uppercase tracking-widest rounded-2xl transition-all group"
        >
          Go to Dashboard
          <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
        </Button>

        
      </div>

      {sessionId && (
        <div className="mt-10 pt-6 border-t border-white/5">
          <div className="flex items-center justify-center gap-2 text-zinc-800">
            <Landmark size={10} />
            <p className="text-[8px] font-mono uppercase tracking-tighter">
              TXN_ID: {sessionId.slice(0, 24)}...
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
      <Suspense fallback={<div className="text-white font-black uppercase text-xs tracking-widest animate-pulse">Verifying Transaction...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}