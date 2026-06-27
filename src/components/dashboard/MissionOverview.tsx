"use client";
import { motion } from "framer-motion";
import { GlassPanel } from "@/components/ui/GlassPanel";

export function MissionOverview() {
  return (
    <GlassPanel className="p-6 border-white/5 bg-[#030712]/40 backdrop-blur-md mb-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Senior Python Backend Engineer</h2>
          <p className="text-sm text-white/50">San Francisco, CA • Hybrid • $150k - $200k</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-mono text-electric-blue uppercase tracking-wider mb-1">Mission Confidence</div>
          <div className="text-3xl font-bold text-white tabular-nums drop-shadow-[0_0_10px_rgba(0,112,243,0.5)]">97%</div>
        </div>
      </div>
      
      <div className="space-y-4 mt-6">
        <div>
          <div className="text-xs text-white/40 uppercase mb-2">Core Competencies</div>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/80">Python 3.10+</span>
            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/80">FastAPI</span>
            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/80">AWS Architecture</span>
            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/80">Distributed Systems</span>
          </div>
        </div>
        <div>
          <div className="text-xs text-white/40 uppercase mb-2">Behavioral Profile</div>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/80">Technical Leadership</span>
            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/80">Mentorship</span>
            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/80">High Velocity Learning</span>
          </div>
        </div>
      </div>
    </GlassPanel>
  );
}
