"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Topic {
  heading: string;
  notes: string[];
}

interface SummaryData {
  topics: Topic[];
}

interface SummaryDisplayProps {
  isOpen: boolean;
  onClose: () => void;
  summaryData: SummaryData;
}

const SummaryDisplay = ({ isOpen, onClose, summaryData }: SummaryDisplayProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] bg-[#0A0A0B] border-white/10 text-white rounded-[2.5rem] max-h-[85vh] overflow-hidden flex flex-col p-0 mx-4">
        <div className="p-6 sm:p-8 border-b border-white/5">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <div>
                <DialogTitle className="text-2xl sm:text-3xl font-black italic uppercase tracking-tighter">
                  Session <span className="text-purple-500">Summary</span>
                </DialogTitle>
                <DialogDescription className="text-zinc-500 font-bold text-[10px] uppercase tracking-widest mt-2">
                  Key takeaways and structured notes from your session.
                </DialogDescription>
              </div>
              <div className="size-10 sm:size-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 text-purple-500 shrink-0">
                <FileText size={22} />
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 sm:space-y-10">
          <AnimatePresence>
            {summaryData.topics.map((topic, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="space-y-4 group"
              >
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 rounded-lg bg-purple-600/20 border border-purple-500/30 text-purple-400 text-[10px] font-black uppercase tracking-widest shrink-0">
                    Topic {index + 1}
                  </div>
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-purple-500/30 to-transparent" />
                </div>
                
                <h3 className="text-lg sm:text-xl font-black text-white uppercase italic tracking-tight group-hover:text-purple-400 transition-colors">
                  {topic.heading}
                </h3>
                
                <ul className="space-y-3 ml-2">
                  {topic.notes.map((note, nIndex) => (
                    <motion.li
                      key={nIndex}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 + nIndex * 0.06 }}
                      className="flex gap-4 text-zinc-400 group/item"
                    >
                      <ChevronRight size={16} className="text-purple-600 shrink-0 mt-1 transition-transform group-hover/item:translate-x-1" />
                      <span className="text-sm font-medium leading-relaxed group-hover/item:text-zinc-200 transition-colors">
                        {note}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </AnimatePresence>

          {summaryData.topics.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <FileText className="text-zinc-800 size-16 mb-4" />
              <p className="text-zinc-500 font-bold uppercase text-xs tracking-widest">No summary content available</p>
            </div>
          )}
        </div>

        <div className="p-6 sm:p-8 border-t border-white/5 bg-white/[0.02]">
          <Button 
            onClick={onClose}
            className="w-full rounded-xl bg-purple-600 hover:bg-white hover:text-black font-black uppercase text-[10px] tracking-widest h-12 transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)]"
          >
            Close Summary
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SummaryDisplay;
