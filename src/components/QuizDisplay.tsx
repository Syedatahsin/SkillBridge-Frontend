"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, AlertCircle, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Question {
  question: string;
  options: string[];
  answer: number;
}

interface QuizData {
  questions: Question[];
}

interface QuizDisplayProps {
  isOpen: boolean;
  onClose: () => void;
  quizData: QuizData;
  onRetake?: () => void;
}

const QuizDisplay = ({ isOpen, onClose, quizData, onRetake }: QuizDisplayProps) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleOptionSelect = (questionIndex: number, optionIndex: number) => {
    if (showResults) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  };

  const handleSubmit = () => {
    if (Object.keys(selectedAnswers).length < quizData.questions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }
    setShowResults(true);
  };

  const calculateScore = () => {
    let score = 0;
    quizData.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) {
        score++;
      }
    });
    return score;
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setShowResults(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] bg-[#0A0A0B] border-white/10 text-white rounded-[2rem] sm:rounded-[2.5rem] max-h-[90vh] overflow-y-auto custom-scrollbar mx-4">
        <DialogHeader>
          <DialogTitle className="text-2xl sm:text-3xl font-black italic uppercase tracking-tighter">
            Session <span className="text-purple-500">Quiz</span>
          </DialogTitle>
          <DialogDescription className="text-zinc-500 font-bold text-[10px] uppercase tracking-widest mt-2">
            Test your knowledge from the session contents.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 sm:py-8 space-y-8 sm:space-y-10">
          {quizData.questions.map((q, qIdx) => (
            <motion.div
              key={qIdx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: qIdx * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="space-y-4"
            >
              <div className="flex gap-3 sm:gap-4">
                <span className="text-purple-500 font-black italic text-xl sm:text-2xl shrink-0">0{qIdx + 1}</span>
                <h4 className="text-base sm:text-lg font-bold text-zinc-100 leading-tight">{q.question}</h4>
              </div>
              
              <div className="grid grid-cols-1 gap-3 ml-8 sm:ml-12">
                {q.options.map((option, oIdx) => {
                  const isSelected = selectedAnswers[qIdx] === oIdx;
                  const isCorrect = q.answer === oIdx;
                  const isWrong = isSelected && !isCorrect;
                  
                  return (
                    <motion.button
                      key={oIdx}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleOptionSelect(qIdx, oIdx)}
                      disabled={showResults}
                      className={cn(
                        "flex items-center justify-between p-3 sm:p-4 rounded-2xl border transition-all text-left group",
                        !showResults && "border-white/5 bg-white/5 hover:border-purple-500/50 hover:bg-purple-500/5",
                        !showResults && isSelected && "border-purple-500 bg-purple-500/10",
                        showResults && isCorrect && "border-emerald-500 bg-emerald-500/10 text-emerald-500",
                        showResults && isWrong && "border-red-500 bg-red-500/10 text-red-500",
                        showResults && !isCorrect && !isWrong && "border-white/5 opacity-50"
                      )}
                    >
                      <span className="text-sm font-medium">{option}</span>
                      {showResults ? (
                        isCorrect ? <CheckCircle2 size={18} /> : isWrong ? <AlertCircle size={18} /> : null
                      ) : (
                        isSelected ? <CheckCircle2 size={18} className="text-purple-500" /> : <Circle size={18} className="text-white/10 group-hover:text-white/20" />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {showResults ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="bg-white/5 rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col items-center text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
                className="size-20 rounded-full bg-purple-600/20 flex items-center justify-center mb-4"
              >
                <span className="text-4xl font-black italic text-purple-500">
                  {calculateScore()}/{quizData.questions.length}
                </span>
              </motion.div>
              <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-2">Quiz Complete!</h3>
              <p className="text-zinc-500 text-sm font-medium mb-8">
                {calculateScore() === quizData.questions.length 
                  ? "Perfect! You've mastered the session content." 
                  : "Good effort! Review the transcript to improve your score."}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Button 
                  onClick={handleReset}
                  variant="outline"
                  className="flex-1 rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10 font-black uppercase text-[10px] tracking-widest h-12"
                >
                  <RefreshCcw size={16} className="mr-2" /> Try Again
                </Button>
                <Button 
                  onClick={onClose}
                  className="flex-1 rounded-xl bg-purple-600 hover:bg-white hover:text-black font-black uppercase text-[10px] tracking-widest h-12 transition-all"
                >
                  Close
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="actions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-white/5"
            >
              <Button
                variant="ghost"
                onClick={onClose}
                className="rounded-xl border border-white/5 text-zinc-500 hover:text-white hover:bg-white/5 font-black uppercase text-[10px] tracking-widest px-8"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="rounded-xl bg-purple-600 hover:bg-white hover:text-black font-black uppercase text-[10px] tracking-widest px-12 transition-all h-12"
              >
                Submit Quiz
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default QuizDisplay;
