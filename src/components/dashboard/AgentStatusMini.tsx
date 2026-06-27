"use client";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { motion } from "framer-motion";

const agents = [
  { name: "Semantic Search", status: "Active" },
  { name: "Reasoning Core", status: "Active" },
  { name: "Bias Auditor", status: "Monitoring" },
  { name: "Career Graph", status: "Synced" },
];

export function AgentStatusMini() {
  return (
    <GlassPanel className="p-5 border-white/5 bg-[#030712]/40 backdrop-blur-md">
      <div className="text-xs text-white/40 uppercase mb-4 tracking-wider font-mono flex items-center justify-between">
        <span>Active AI Agents</span>
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
      </div>
      <div className="space-y-3">
        {agents.map((agent, i) => (
          <div key={i} className="flex justify-between items-center text-sm">
            <span className="text-white/80">{agent.name}</span>
            <span className="text-xs font-mono text-electric-blue">{agent.status}</span>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}
