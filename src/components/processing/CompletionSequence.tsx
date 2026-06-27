"use client";
import { motion } from "framer-motion";
import { CheckCircle2, ChevronRight, Brain } from "lucide-react";

export function CompletionSequence({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-[#030712]/80 backdrop-blur-md"
    >
      <div className="text-center flex flex-col items-center">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="w-24 h-24 rounded-full bg-gradient-to-br from-electric-blue to-cyan flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(0,112,243,0.5)]"
        >
          <Brain className="w-12 h-12 text-white" />
        </motion.div>
        
        <h2 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
          <CheckCircle2 className="w-8 h-8 text-cyan" />
          Hiring Intelligence Ready
        </h2>
        <p className="text-xl text-white/60 mb-12">RecruitGPT has established a consensus.</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-4xl">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-2xl font-bold text-white mb-1">98.7%</div>
            <div className="text-xs text-white/50 uppercase">Confidence</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-2xl font-bold text-white mb-1">1,842</div>
            <div className="text-xs text-white/50 uppercase">Candidates Processed</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-2xl font-bold text-white mb-1">42</div>
            <div className="text-xs text-white/50 uppercase">Hidden Gems</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-2xl font-bold text-cyan mb-1">Ready</div>
            <div className="text-xs text-white/50 uppercase">Semantic Graph</div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onComplete}
          className="group relative flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-semibold shadow-[0_0_20px_rgba(255,255,255,0.2)]"
        >
          View Dashboard
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </div>
    </motion.div>
  );
}
