"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Brain, Check, ChevronRight, User } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";

const DEMO_QUERY = "Find Senior Backend Engineers with FastAPI, PostgreSQL, and AWS experience.";

const PIPELINE_STEPS = [
  "Understanding role parameters...",
  "Extracting semantic skills...",
  "Generating candidate embeddings...",
  "Querying vector database...",
  "Running multi-agent evaluation...",
  "Ranking candidates...",
];

export function InteractiveDemo() {
  const [hasStarted, setHasStarted] = useState(false);
  const [typedQuery, setTypedQuery] = useState("");
  const [pipelineIndex, setPipelineIndex] = useState(-1);
  const [showResults, setShowResults] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const startDemo = () => {
    if (hasStarted) return;
    setHasStarted(true);
    let i = 0;
    
    // Typing effect
    const typeInterval = setInterval(() => {
      setTypedQuery(DEMO_QUERY.substring(0, i + 1));
      i++;
      if (i >= DEMO_QUERY.length) {
        clearInterval(typeInterval);
        setTimeout(startPipeline, 500);
      }
    }, 50);
  };

  const startPipeline = () => {
    let step = 0;
    setPipelineIndex(0);
    
    const stepInterval = setInterval(() => {
      step++;
      setPipelineIndex(step);
      if (step >= PIPELINE_STEPS.length) {
        clearInterval(stepInterval);
        setTimeout(() => setShowResults(true), 600);
      }
    }, 800);
  };

  return (
    <section className="py-24 relative z-10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-4 text-white"
          >
            Command Center Demo
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white/60 max-w-2xl mx-auto"
          >
            Experience the speed and intelligence of natural language semantic search.
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto" ref={containerRef}>
          <GlassPanel className="p-1 min-h-[500px] flex flex-col bg-[#030712]/90">
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5 rounded-t-xl">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="ml-4 text-xs text-white/40 font-mono flex items-center gap-2">
                <Terminal className="w-3 h-3" />
                recruitgpt-cli
              </div>
            </div>

            {/* Terminal Body */}
            <div className="p-6 flex-1 flex flex-col gap-6 font-mono text-sm overflow-hidden relative">
              
              {!hasStarted ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <button 
                    onClick={startDemo}
                    className="px-6 py-3 rounded-full bg-electric-blue/10 border border-electric-blue/50 text-electric-blue font-medium hover:bg-electric-blue hover:text-white transition-colors flex items-center gap-2"
                  >
                    Run Demo <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  {/* User Input */}
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded bg-white/10 flex flex-shrink-0 items-center justify-center mt-1">
                      <User className="w-4 h-4 text-white/70" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white/80 leading-relaxed text-base font-sans">
                        {typedQuery}
                        {typedQuery.length < DEMO_QUERY.length && (
                          <span className="inline-block w-2 h-5 bg-white/50 ml-1 animate-pulse align-middle" />
                        )}
                      </p>
                    </div>
                  </div>

                  {/* AI Pipeline Steps */}
                  <div className="flex gap-4">
                    {typedQuery.length === DEMO_QUERY.length && (
                      <div className="w-8 h-8 rounded bg-gradient-to-br from-electric-blue to-neon-purple flex flex-shrink-0 items-center justify-center mt-1">
                        <Brain className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div className="flex-1 flex flex-col gap-3">
                      {PIPELINE_STEPS.map((step, idx) => (
                        <AnimatePresence key={step}>
                          {pipelineIndex >= idx && (
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex items-center gap-3 text-white/60 font-mono"
                            >
                              {pipelineIndex > idx ? (
                                <Check className="w-4 h-4 text-cyan" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-electric-blue animate-spin" />
                              )}
                              <span>{step}</span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      ))}

                      {/* Results */}
                      <AnimatePresence>
                        {showResults && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-6 font-sans border border-white/10 rounded-xl bg-white/5 p-4"
                          >
                            <div className="text-white font-medium mb-4 flex items-center justify-between">
                              <span>Top Candidates Found</span>
                              <span className="text-xs text-electric-blue bg-electric-blue/10 px-2 py-1 rounded">1.2ms latency</span>
                            </div>
                            
                            <div className="flex flex-col gap-3">
                              {[
                                { name: "Sarah J.", score: 98, role: "Senior Backend (FastAPI, AWS)" },
                                { name: "Michael R.", score: 95, role: "Backend Engineer (Python, PostgreSQL)" }
                              ].map((candidate, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                                  <div>
                                    <div className="text-white text-sm font-medium">{candidate.name}</div>
                                    <div className="text-white/50 text-xs">{candidate.role}</div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <div className="text-cyan text-sm font-medium">{candidate.score}% Match</div>
                                    <ChevronRight className="w-4 h-4 text-white/40" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </>
              )}
            </div>
          </GlassPanel>
        </div>
      </div>
    </section>
  );
}
