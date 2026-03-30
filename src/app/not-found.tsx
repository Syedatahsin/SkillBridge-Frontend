"use client";

import { motion } from "framer-motion";
import { Ghost, MoveLeft, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#050505] p-6">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 size-96 bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 size-96 bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-lg w-full text-center">
        {/* Animated Icon Container */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: [0, -20, 0], opacity: 1 }}
          transition={{ 
            y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 0.8 } 
          }}
          className="size-32 bg-white/5 border border-white/10 rounded-[3rem] flex items-center justify-center mx-auto mb-10 shadow-2xl backdrop-blur-xl"
        >
          <Search className="text-purple-500 size-12" strokeWidth={1.5} />
          {/* Small decorative "404" tag */}
          <div className="absolute -bottom-2 -right-2 bg-purple-600 text-white text-[10px] font-black px-3 py-1 rounded-full italic tracking-tighter">
            404
          </div>
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter mb-4">
            Void <span className="text-purple-600">Reached</span>
          </h1>
          
          <p className="text-gray-500 font-medium text-sm leading-relaxed mb-10 px-8">
            The innovation you're looking for hasn't been forged yet, or the coordinate link is broken.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="h-14 w-full sm:w-48 border-white/10 bg-white/5 hover:bg-white/10 text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl group transition-all"
          >
            <MoveLeft className="mr-2 size-4 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </Button>

          <Button
            onClick={() => router.push("/")}
            className="h-14 w-full sm:w-48 bg-purple-600 hover:bg-white text-white hover:text-black font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all"
          >
            <Home className="mr-2 size-4" />
            Command Center
          </Button>
        </motion.div>

        {/* Footer Detail */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 1 }}
          className="mt-16 text-[9px] text-zinc-600 font-black uppercase tracking-[0.5em]"
        >
          IdeaForge // Error Protocol 404
        </motion.p>
      </div>
    </div>
  );
}