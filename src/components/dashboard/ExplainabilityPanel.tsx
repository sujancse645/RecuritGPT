"use client";
import { motion } from "framer-motion";
import { CandidateIntelligence } from "@/lib/data/types";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { X, Network, Milestone, BrainCircuit, Activity } from "lucide-react";

interface ExplainabilityPanelProps {
  candidate: CandidateIntelligence;
  onClose: () => void;
}

export function ExplainabilityPanel({ candidate, onClose }: ExplainabilityPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm"
    >
      <motion.div
        layoutId={`card-${candidate.id}`}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="w-full md:w-[600px] h-full bg-[#030712] border-l border-white/10 shadow-2xl flex flex-col"
      >
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#0a0a0a]/50 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <img src={candidate.photoUrl} alt={candidate.name} className="w-12 h-12 rounded-full border border-white/20" />
            <div>
              <h2 className="text-xl font-bold text-white">{candidate.name}</h2>
              <div className="text-xs text-white/50 uppercase tracking-widest font-mono">AI Intelligence Deep Dive</div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <X className="w-5 h-5 text-white/70" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto hidden-scrollbar p-6 space-y-8">
          
          {/* Why this candidate */}
          <section>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-electric-blue" />
              Why this candidate?
            </h3>
            <GlassPanel className="p-4 border-white/5 bg-white/5">
              <ul className="space-y-3">
                {candidate.explainabilityReasons.map((reason, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3 text-sm text-white/80"
                  >
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-cyan shrink-0" />
                    {reason}
                  </motion.li>
                ))}
              </ul>
            </GlassPanel>
          </section>

          {/* Skill DNA */}
          <section>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-neon-purple" />
              Skill DNA
            </h3>
            <div className="space-y-4">
              {candidate.skillsDNA.map((skill, i) => (
                <div key={skill.name}>
                  <div className="flex justify-between text-xs text-white/60 mb-1 font-mono">
                    <span>{skill.name}</span>
                    <span>{skill.score}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.score}%` }}
                      transition={{ duration: 1, delay: 0.2 + (i * 0.1) }}
                      className="h-full bg-gradient-to-r from-electric-blue to-neon-purple"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Career Timeline */}
          <section>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Milestone className="w-4 h-4 text-cyan" />
              Career Trajectory
            </h3>
            <div className="relative border-l border-white/10 ml-2 space-y-6">
              {candidate.careerTimeline.map((event, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + (i * 0.1) }}
                  className="relative pl-6"
                >
                  <div className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 ${event.isPromotion ? "bg-electric-blue border-white" : "bg-[#030712] border-white/30"}`} />
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-2">
                        {event.title}
                        {event.isPromotion && <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-electric-blue/20 text-electric-blue uppercase tracking-wider">Promotion</span>}
                      </div>
                      <div className="text-xs text-white/50">{event.company}</div>
                    </div>
                    <div className="text-xs font-mono text-white/30">{event.year}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

        </div>
      </motion.div>
    </motion.div>
  );
}
