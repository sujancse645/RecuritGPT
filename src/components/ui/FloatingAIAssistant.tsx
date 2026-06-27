"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, X, MessageSquare, Send } from "lucide-react";

export function FloatingAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "ai" | "user", text: string }[]>([
    { role: "ai", text: "Hello. I am the RecruitGPT AI Engine. How can I assist you with your hiring intelligence today?" }
  ]);
  const [input, setInput] = useState("");

  // Simulated live events
  const [liveEvent, setLiveEvent] = useState("");
  const events = [
    "Semantic index updated",
    "Career timeline analyzed",
    "Hidden talent discovered",
    "Skill graph expanded",
    "AI confidence recalculated"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isOpen) {
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        setLiveEvent(randomEvent);
        setTimeout(() => setLiveEvent(""), 3000);
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: "user", text: input }]);
    const currentInput = input;
    setInput("");
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: "ai", 
        text: `I have analyzed your request regarding "${currentInput}". Our vector database is currently indexing candidates matching these parameters.` 
      }]);
    }, 1000);
  };

  return (
    <>
      <AnimatePresence>
        {liveEvent && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -10, x: 20 }}
            className="fixed bottom-24 right-8 z-40 bg-white/10 backdrop-blur-md border border-white/20 text-white/80 text-xs px-4 py-2 rounded-full shadow-lg"
          >
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
              {liveEvent}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-80 sm:w-96 h-[450px] z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_40px_rgba(0,112,243,0.15)] flex flex-col overflow-hidden"
          >
            <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-electric-blue to-neon-purple flex items-center justify-center relative">
                  <div className="absolute inset-0 rounded-full border border-white/20 animate-ping opacity-20" />
                  <BrainCircuit className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-medium text-sm">RecruitGPT Engine</h4>
                  <p className="text-cyan text-xs">Online</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === "user" 
                      ? "bg-electric-blue text-white rounded-tr-sm" 
                      : "bg-white/10 text-white/90 rounded-tl-sm"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-white/10 bg-white/5">
              <div className="relative flex items-center">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask the engine..."
                  className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-electric-blue/50 pr-10"
                />
                <button 
                  onClick={handleSend}
                  className="absolute right-2 p-1.5 bg-electric-blue rounded-full text-white hover:bg-electric-blue/80 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-electric-blue via-neon-purple to-cyan p-[1px] shadow-[0_0_30px_rgba(0,112,243,0.4)] group"
      >
        <div className="w-full h-full bg-[#030712] rounded-full flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/20 to-neon-purple/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <MessageSquare className="w-6 h-6 text-white relative z-10" />
        </div>
      </motion.button>
    </>
  );
}
