"use client";

import { motion } from "framer-motion";
import { XCircle, RefreshCcw, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function PaymentFailedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-[#0A0A0B] border border-red-500/20 rounded-[3rem] p-12 text-center"
      >
        <div className="size-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-red-500/20">
          <XCircle className="text-red-500 size-10" />
        </div>

        <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">
          Session <span className="text-red-500">Aborted</span>
        </h1>
        
        <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest mb-10 leading-relaxed">
          The transaction was not completed. <br /> Your account has not been charged.
        </p>

        <div className="flex flex-col gap-3">
          <Button
            onClick={() => router.back()}
            className="h-14 bg-white text-black hover:bg-red-500 hover:text-white font-black uppercase tracking-widest rounded-2xl transition-all"
          >
            <RefreshCcw className="mr-2 size-4" />
            Try Payment Again
          </Button>
          
          
        </div>
      </motion.div>
    </div>
  );
}