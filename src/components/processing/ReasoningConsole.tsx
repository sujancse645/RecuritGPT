"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppState } from "@/app/page";

const thoughtsByState: Record<string, string[]> = {
  MISSION_READY: ["Initializing command matrix...", "Loading candidate database...", "Calibrating semantic weights..."],
  AI_INITIALIZING: ["Activating neural networks...", "Connecting to Vector Search...", "Bringing LLM Core online..."],
  UNDERSTANDING_ROLE: ["I'm noticing leadership patterns...", "Extracting required hard skills...", "Building ideal candidate profile..."],
  BUILDING_INTELLIGENCE: ["Comparing project similarity...", "Searching for hidden talent...", "Removing demographic bias..."],
  GENERATING_RESULTS: ["Building explainable ranking...", "Reasoning complete...", "Finalizing executive dashboard..."],
};

export function ReasoningConsole({ appState }: { appState: AppState }) {
  const [thoughts, setThoughts] = useState<string[]>([]);

  useEffect(() => {
    const currentThoughts = thoughtsByState[appState] || [];
    if (currentThoughts.length === 0) return;

    setThoughts([]);
    let i = 0;
    const interval = setInterval(() => {
      if (i < currentThoughts.length) {
        setThoughts(prev => [...prev, currentThoughts[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [appState]);

  return (
    <div className="absolute bottom-8 left-8 w-80 z-40">
      <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/10">
          <span className="w-2 h-2 rounded-full bg-electric-blue animate-pulse" />
          <span className="text-xs font-mono text-white/50 uppercase tracking-wider">RecruitGPT Thinking...</span>
        </div>
        <div className="flex flex-col gap-2 font-mono text-xs text-white/80 h-32 overflow-hidden relative">
          <AnimatePresence>
            {thoughts.map((thought, idx) => (
              <motion.div
                key={`${thought}-${idx}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="py-1 border-b border-white/5 last:border-0"
              >
                {thought}
              </motion.div>
            ))}
          </AnimatePresence>
          <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-[#0a0a0a]/80 to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
