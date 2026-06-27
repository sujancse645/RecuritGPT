"use client";
import { motion } from "framer-motion";
import { CandidateIntelligence } from "@/lib/data/types";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { BrainCircuit, Star, Zap, ChevronRight, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import Image from "next/image";

interface CandidateCardProps {
  candidate: CandidateIntelligence;
  onExplainClick: (candidate: CandidateIntelligence) => void;
}

export function CandidateCard({ candidate, onExplainClick }: CandidateCardProps) {
  
  const StatusIcon = 
    candidate.status === "Highly Recommended" ? Star : 
    candidate.status === "Recommended" ? CheckCircle2 : 
    candidate.status === "Potential Fit" ? Info : AlertTriangle;

  const statusColor = 
    candidate.status === "Highly Recommended" ? "text-cyan bg-cyan/10 border-cyan/30" : 
    candidate.status === "Recommended" ? "text-electric-blue bg-electric-blue/10 border-electric-blue/30" : 
    candidate.status === "Potential Fit" ? "text-neon-purple bg-neon-purple/10 border-neon-purple/30" : 
    "text-yellow-500 bg-yellow-500/10 border-yellow-500/30";

  return (
    <motion.div
      layoutId={`card-${candidate.id}`}
      whileHover={{ scale: 1.02, y: -5 }}
      className="relative group cursor-pointer"
    >
      <GlassPanel className="p-0 border-white/10 bg-[#030712]/60 backdrop-blur-xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.5)] group-hover:shadow-[0_8px_40px_rgba(0,112,243,0.3)] transition-all duration-500">
        
        {/* Top Header Section */}
        <div className="p-5 flex gap-4 items-start border-b border-white/5 relative">
          {candidate.hiddenGemReason && (
            <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-r from-neon-purple/20 to-transparent border-b border-l border-neon-purple/20 rounded-bl-lg flex items-center gap-1">
              <Zap className="w-3 h-3 text-neon-purple" />
              <span className="text-[10px] font-bold text-neon-purple uppercase tracking-widest">Hidden Gem</span>
            </div>
          )}
          
          <img 
            src={candidate.photoUrl} 
            alt={candidate.name} 
            className="w-14 h-14 rounded-full border border-white/20 object-cover"
          />
          <div className="flex-1 pt-1">
            <h3 className="text-lg font-bold text-white leading-none mb-1">{candidate.name}</h3>
            <p className="text-sm text-white/50">{candidate.currentRole} • {candidate.experienceYears}y exp</p>
          </div>
          
          <div className="text-right pt-1 pr-2">
            <div className="text-[10px] font-mono uppercase text-white/40 mb-1 tracking-wider">Match Score</div>
            <div className="text-2xl font-bold text-white tabular-nums drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
              {candidate.matchScore}<span className="text-sm text-white/40">%</span>
            </div>
          </div>
        </div>

        {/* Intelligence Metrics */}
        <div className="p-5 bg-white/[0.02]">
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div>
              <div className="text-[10px] uppercase text-white/40 mb-1">Tech Match</div>
              <div className="text-sm font-semibold text-white">{candidate.technicalMatch}%</div>
            </div>
            <div>
              <div className="text-[10px] uppercase text-white/40 mb-1">Culture</div>
              <div className="text-sm font-semibold text-white">{candidate.cultureFit}%</div>
            </div>
            <div>
              <div className="text-[10px] uppercase text-white/40 mb-1">Leadership</div>
              <div className="text-sm font-semibold text-white">{candidate.leadership}%</div>
            </div>
            <div>
              <div className="text-[10px] uppercase text-white/40 mb-1">Learning</div>
              <div className="text-sm font-semibold text-white">{candidate.learningAbility}%</div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-6">
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${statusColor}`}>
              <StatusIcon className="w-3.5 h-3.5" />
              <span className="text-[11px] font-semibold uppercase tracking-wider">{candidate.status}</span>
            </div>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onExplainClick(candidate)}
              className="group/btn flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-colors text-xs font-semibold text-white"
            >
              <BrainCircuit className="w-4 h-4 text-electric-blue" />
              Explain AI
              <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </div>
      </GlassPanel>
    </motion.div>
  );
}
