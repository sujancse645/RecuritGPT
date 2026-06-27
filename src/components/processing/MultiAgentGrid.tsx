"use client";
import { motion } from "framer-motion";
import { BrainCircuit, Search, Briefcase, ShieldAlert, Cpu, Lightbulb } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";

const agents = [
  { name: "Recruiter Agent", icon: Briefcase },
  { name: "Semantic Search", icon: Search },
  { name: "Career AI", icon: Cpu },
  { name: "Bias AI", icon: ShieldAlert },
  { name: "Reasoning AI", icon: BrainCircuit },
  { name: "Explainability AI", icon: Lightbulb },
];

export function MultiAgentGrid() {
  return (
    <div className="absolute right-8 top-1/2 -translate-y-1/2 w-72 z-40 hidden xl:block">
      <div className="grid grid-cols-2 gap-4">
        {agents.map((agent, i) => (
          <motion.div
            key={agent.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="relative group"
          >
            <GlassPanel className="p-4 flex flex-col items-center justify-center text-center border-white/5 bg-white/5 backdrop-blur-md h-28 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-electric-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center mb-2 relative">
                <div className="absolute inset-0 rounded-full border border-white/20 animate-spin-slow" style={{ animationDuration: `${3 + i}s` }} />
                <agent.icon className="w-4 h-4 text-white/80 group-hover:text-electric-blue transition-colors" />
              </div>
              <span className="text-[10px] font-medium text-white/60 uppercase tracking-wider leading-tight">{agent.name}</span>
              <div className="mt-2 w-full h-[2px] bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-cyan"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                />
              </div>
            </GlassPanel>
          </motion.div>
        ))}
      </div>
      {/* Animated Beams connecting agents - simplified visual representation */}
      <div className="absolute inset-0 pointer-events-none z-[-1]">
         <svg className="w-full h-full opacity-30">
            <line x1="25%" y1="20%" x2="75%" y2="50%" stroke="var(--color-electric-blue)" strokeWidth="1" strokeDasharray="4 4" className="animate-pulse" />
            <line x1="75%" y1="20%" x2="25%" y2="80%" stroke="var(--color-neon-purple)" strokeWidth="1" strokeDasharray="4 4" className="animate-pulse" style={{ animationDelay: "0.5s" }} />
         </svg>
      </div>
    </div>
  );
}
