"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface SectionConnectorProps {
  label?: string;
}

export default function SectionConnector({ label }: SectionConnectorProps) {
  return (
    <div className="relative flex flex-col items-center justify-center -my-6 z-20 pointer-events-none">
      {/* Label and Symbols Container */}
      <div className="flex flex-col items-center gap-1 group">
        {/* Small Pulsing Circle */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-2 h-2 rounded-full bg-primary"
        />
        
        {/* Tiny Animated Arrow & Label */}
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="w-4 h-4 text-primary opacity-50" />
          </motion.div>
          
          {label && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 0.4, x: 0 }}
              className="text-[10px] uppercase tracking-[0.2em] font-black text-primary whitespace-nowrap"
            >
              Next: {label}
            </motion.span>
          )}
        </div>
      </div>
    </div>
  );
}
