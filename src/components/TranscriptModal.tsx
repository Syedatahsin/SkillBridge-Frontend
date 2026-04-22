"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { FileText, Save, Loader2 } from "lucide-react";

interface TranscriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  existingTranscript?: string;
  onSuccess: () => void;
}

const TranscriptModal = ({ isOpen, onClose, bookingId, existingTranscript = "", onSuccess }: TranscriptModalProps) => {
  const [transcript, setTranscript] = useState(existingTranscript);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!transcript.trim()) {
      toast.error("Please enter some transcript text.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/session-resources/transcript`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, transcriptText: transcript }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || "Failed to save transcript");
      }

      toast.success("Transcript saved successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Error saving transcript.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-[#0A0A0B] border-white/10 text-white rounded-[2rem]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter">
            Upload <span className="text-purple-500">Transcript</span>
          </DialogTitle>
          <DialogDescription className="text-zinc-500 font-bold text-[10px] uppercase tracking-widest mt-2">
            Paste the meeting transcript below to enable quiz generation for the student.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <div className="relative group">
            <Textarea
              placeholder="Paste transcript here..."
              className="min-h-[300px] bg-white/5 border-white/10 rounded-2xl p-6 text-sm text-zinc-300 focus:border-purple-500/50 transition-all resize-none"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
            />
            <FileText className="absolute top-4 right-4 text-white/10 group-focus-within:text-purple-500/50 transition-colors" size={24} />
          </div>
        </div>

        <DialogFooter className="flex gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            className="rounded-xl border border-white/5 text-zinc-500 hover:text-white hover:bg-white/5 font-black uppercase text-[10px] tracking-widest"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-white hover:to-white hover:text-black font-black uppercase text-[10px] tracking-widest px-8 transition-all h-12 shadow-[0_0_20px_rgba(147,51,234,0.2)]"
          >
            {loading ? <Loader2 className="animate-spin mr-2" size={16} /> : <Save className="mr-2" size={16} />}
            Save Transcript
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TranscriptModal;
