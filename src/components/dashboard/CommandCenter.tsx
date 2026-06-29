"use client";
import { motion } from "framer-motion";
import { MissionOverview } from "./MissionOverview";
import { SemanticSearchStatus } from "./SemanticSearchStatus";
import { AgentStatusMini } from "./AgentStatusMini";
import { AICopilot } from "./AICopilot";
import { LiveIntelligenceFeed } from "./LiveIntelligenceFeed";
import { CandidateDiscoveryFeed } from "./CandidateDiscoveryFeed";
import { KnowledgeGraph } from "@/components/3d/KnowledgeGraph";
import { LogOut } from "lucide-react";

export function CommandCenter() {
  return (
    <div className="relative w-full h-screen bg-[#030712] overflow-hidden flex flex-col font-sans">
      {/* Absolute Background 3D Graph */}
      <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen pointer-events-none">
        <KnowledgeGraph appState="COMMAND_CENTER" />
      </div>

      {/* Executive Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 h-20 border-b border-white/10 bg-[#030712]/80 backdrop-blur-md flex items-center justify-between px-8"
      >
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-electric-blue animate-pulse" />
            RecruitGPT Command Center
          </h1>
          <p className="text-xs text-white/50 tracking-wide mt-0.5">AI-generated hiring intelligence powered by semantic reasoning.</p>
        </div>
        <div className="flex gap-8 text-right hidden lg:flex">
          <div>
            <div className="text-[10px] uppercase text-white/40 tracking-wider">Processed</div>
            <div className="text-lg font-mono font-bold text-white tabular-nums">1,842</div>
          </div>
          <div>
            <div className="text-[10px] uppercase text-white/40 tracking-wider">Semantic Accuracy</div>
            <div className="text-lg font-mono font-bold text-cyan tabular-nums">99.2%</div>
          </div>
          <div>
            <div className="text-[10px] uppercase text-white/40 tracking-wider">Bias Removed</div>
            <div className="text-lg font-mono font-bold text-green-400 tabular-nums">100%</div>
          </div>
          <div className="flex items-center ml-4 pl-8 border-l border-white/10">
            <button 
              onClick={() => window.location.reload()} 
              className="flex items-center gap-2 text-xs font-medium text-white/50 hover:text-white transition-colors uppercase tracking-wider"
              title="Return to Landing Page"
            >
              <LogOut className="w-4 h-4" />
              Exit
            </button>
          </div>
        </div>
      </motion.header>

      {/* 3-Column Dashboard Layout */}
      <div className="relative z-10 flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
        
        {/* Left Column: Context */}
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-3 flex flex-col overflow-y-auto hidden-scrollbar"
        >
          <MissionOverview />
          <SemanticSearchStatus />
          <AgentStatusMini />
        </motion.div>

        {/* Center Column: Feed */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="lg:col-span-6 relative overflow-y-auto hidden-scrollbar pb-20"
        >
          <CandidateDiscoveryFeed />
        </motion.div>

        {/* Right Column: Copilot & Feeds */}
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="lg:col-span-3 flex flex-col overflow-y-auto hidden-scrollbar"
        >
          <AICopilot />
          <LiveIntelligenceFeed />
        </motion.div>

      </div>
    </div>
  );
}
