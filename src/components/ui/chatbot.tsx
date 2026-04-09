"use client";
import React, { useState, useRef, useEffect } from "react";
import { X, Send, Bot, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { role: "bot", text: "Beep boop! 🤖 Hi! I'm SkillBot. How can I help you learn today?" }
  ]);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isLoading]);

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMsg = { role: "user", text: message };
    setChatHistory((prev) => [...prev, userMsg]);
    const messageToSend = message;
    setMessage("");
    setIsLoading(true);

    try {
      // Replace with your actual Express URL
      const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageToSend,
          userRole: "guest",
          userName: "Friend"
        }),
      });

      const data = await response.json();
      setChatHistory((prev) => [...prev, { role: "bot", text: data.text }]);
    } catch (error) {
      setChatHistory((prev) => [...prev, { role: "bot", text: "Oops! My signal dropped. 🔌" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans text-foreground">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="bg-card border border-border/50 rounded-[2rem] shadow-2xl w-80 sm:w-96 mb-5 flex flex-col overflow-hidden origin-bottom-right transition-colors duration-300"
          >
            {/* Gradient Header */}
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-5 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                   <Bot size={24} />
                </div>
                <div>
                  <span className="font-bold text-lg block leading-none">SkillBot</span>
                  <span className="text-[10px] text-indigo-50 uppercase tracking-widest">Active Now</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full">
                <X size={20}/>
              </button>
            </div>

            {/* Chat Body */}
            <div ref={scrollRef} className="h-80 p-5 overflow-y-auto bg-muted/10 space-y-4 scroll-smooth">
              {chatHistory.map((chat, index) => (
                <motion.div
                  initial={{ opacity: 0, x: chat.role === "user" ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={index}
                  className={`flex ${chat.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`p-3 rounded-2xl max-w-[85%] text-sm ${
                    chat.role === "user" ? "bg-indigo-600 text-white rounded-tr-none shadow-md" 
                    : "bg-background border border-border/50 text-foreground rounded-tl-none shadow-sm"
                  }`}>
                    {chat.text}
                  </div>
                </motion.div>
              ))}
              
              {/* Animated Typing Indicator */}
              {isLoading && (
                <div className="flex gap-1 p-2 bg-background w-fit rounded-xl border border-border/50 shadow-sm">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              )}
            </div>

            {/* Input Footer */}
            <div className="p-4 border-t border-border/50 flex gap-2 bg-card">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask SkillBot..."
                className="flex-1 bg-background border border-border rounded-2xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400 text-foreground transition-colors"
              />
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={handleSendMessage}
                disabled={isLoading}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-2.5 rounded-2xl disabled:opacity-50 shadow-lg"
              >
                <Send size={18} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Gradient Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 2 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white w-16 h-16 rounded-[1.5rem] shadow-2xl flex items-center justify-center relative"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="c" initial={{rotate:-90}} animate={{rotate:0}} exit={{rotate:90}}><X size={30} /></motion.div>
          ) : (
            <motion.div key="o" initial={{scale:0}} animate={{scale:1}} className="flex items-center justify-center">
              <Bot size={32} />
              <motion.div animate={{opacity:[0,1,0]}} transition={{duration:2, repeat:Infinity}} className="absolute -top-1 -right-1">
                <Sparkles size={16} className="text-yellow-300 fill-yellow-300" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default AIChatbot;