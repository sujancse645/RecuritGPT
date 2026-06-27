"use client";
import { useEffect, useState, useRef } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { motion } from "framer-motion";
import { Send, Bot } from "lucide-react";

export function AICopilot() {
  const [messages, setMessages] = useState<{ role: "ai" | "user", content: string }[]>([
    { role: "ai", content: "I've analyzed 1,842 candidates. Elena Rostova is the strongest match due to her FastAPI expertise and rapid promotion velocity. Would you like me to generate her interview guide?" }
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: "user", content: input }]);
    setInput("");
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "ai", content: "I'm analyzing the differences in their system design experience now. I will update the comparison panel shortly." }]);
    }, 1500);
  };

  return (
    <GlassPanel className="flex flex-col h-[500px] border-white/5 bg-[#030712]/40 backdrop-blur-md mb-6">
      <div className="p-4 border-b border-white/5 flex items-center gap-3">
        <Bot className="w-5 h-5 text-neon-purple" />
        <span className="font-semibold text-white">RecruitGPT Copilot</span>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={i} 
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${
              msg.role === "user" 
                ? "bg-electric-blue/20 text-white border border-electric-blue/30 rounded-tr-sm" 
                : "bg-white/5 text-white/80 border border-white/10 rounded-tl-sm"
            }`}>
              {msg.content}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-4 border-t border-white/5">
        <div className="relative flex items-center">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about candidates..."
            className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2 pr-12 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-electric-blue/50"
          />
          <button onClick={handleSend} className="absolute right-2 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </GlassPanel>
  );
}
