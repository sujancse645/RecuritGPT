"use client";

import { motion } from "framer-motion";
import { Cpu, Briefcase, Zap, ShieldCheck, Map, Clock, ArrowRight } from "lucide-react";

interface JobUnderstandingEngineProps {
  onComplete: () => void;
}

export function JobUnderstandingEngine({ onComplete }: JobUnderstandingEngineProps) {
  // Mocking the API response structure from Phase 5 for demo visualization
  const hiringProfile = {
    ideal_candidate_summary: "A seasoned AI engineer capable of owning the architecture from zero to one. Deep understanding of ML scaling and MLOps.",
    ideal_tech_stack: "Python, FastAPI, React, PostgreSQL, Docker, K8s, AWS",
    ideal_team_size: "2-5 members",
    ideal_leadership_level: "Senior / Lead",
  };

  const insights = [
    "High Market Scarcity: Senior engineers with both FastAPI and Deep Learning expertise are rare.",
    "Critical Skill: Kubernetes experience is non-negotiable for the deployment strategy."
  ];

  const complexityScores = [
    { label: "Technical Complexity", value: 95 },
    { label: "Leadership Requirement", value: 70 },
    { label: "Cloud Maturity", value: 85 },
    { label: "Hiring Difficulty", value: 90 },
  ];

  return (
    <div className="relative w-full h-screen bg-[#030712] text-white overflow-hidden font-inter p-8">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-electric-blue/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto h-full flex flex-col">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-between mb-12"
        >
          <div>
            <h1 className="text-4xl font-bold mb-2">Executive Hiring Intelligence</h1>
            <p className="text-white/50 text-lg">AI Job Understanding Engine • Phase 5 Complete</p>
          </div>
          <button 
            onClick={onComplete}
            className="flex items-center gap-2 px-6 py-3 bg-electric-blue hover:bg-electric-blue/80 text-white rounded-full font-medium transition-all"
          >
            Launch Command Center <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 pb-8">
          
          {/* Left Column - Hiring Profile */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="col-span-1 lg:col-span-2 space-y-8 flex flex-col"
          >
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <Briefcase className="w-6 h-6 text-electric-blue" />
                <h2 className="text-xl font-semibold">Ideal Candidate Summary</h2>
              </div>
              <p className="text-xl text-white/80 leading-relaxed font-light">
                "{hiringProfile.ideal_candidate_summary}"
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
                <p className="text-white/50 text-sm mb-2">Core Tech Stack</p>
                <p className="font-semibold text-lg">{hiringProfile.ideal_tech_stack}</p>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
                <p className="text-white/50 text-sm mb-2">Leadership Level</p>
                <p className="font-semibold text-lg">{hiringProfile.ideal_leadership_level}</p>
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl flex-1">
              <div className="flex items-center gap-3 mb-6">
                <Zap className="w-6 h-6 text-yellow-400" />
                <h2 className="text-xl font-semibold">Executive Insights</h2>
              </div>
              <ul className="space-y-4">
                {insights.map((insight, idx) => (
                  <li key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-white/5">
                    <ShieldCheck className="w-5 h-5 text-electric-blue shrink-0 mt-0.5" />
                    <span className="text-white/80">{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Right Column - Complexity Scores */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="col-span-1 flex flex-col"
          >
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl h-full flex flex-col">
              <div className="flex items-center gap-3 mb-8">
                <Cpu className="w-6 h-6 text-electric-blue" />
                <h2 className="text-xl font-semibold">Role Complexity</h2>
              </div>
              
              <div className="space-y-8 flex-1 justify-center flex flex-col">
                {complexityScores.map((score, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between mb-2">
                      <span className="text-white/70">{score.label}</span>
                      <span className="font-mono text-electric-blue">{score.value}%</span>
                    </div>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${score.value}%` }}
                        transition={{ duration: 1.5, delay: 0.5 + (idx * 0.2), ease: "easeOut" }}
                        className="h-full bg-electric-blue rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 rounded-xl bg-electric-blue/10 border border-electric-blue/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-electric-blue animate-pulse" />
                  <span className="text-sm font-medium text-electric-blue">AI Confidence: 92%</span>
                </div>
                <p className="text-xs text-white/50">Based on cross-referencing 18M market data points.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
