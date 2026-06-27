"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppState } from "@/app/page";
import { AICommandRibbon } from "./AICommandRibbon";
import { AIMissionTimeline } from "./AIMissionTimeline";
import { ReasoningConsole } from "./ReasoningConsole";
import { ConfidenceMeter } from "./ConfidenceMeter";
import { PerformanceMonitor } from "./PerformanceMonitor";
import { MultiAgentGrid } from "./MultiAgentGrid";
import { CompletionSequence } from "./CompletionSequence";
import { KnowledgeGraph } from "@/components/3d/KnowledgeGraph";

interface ProcessingOrchestratorProps {
  appState: AppState;
  setAppState: (state: AppState) => void;
}

export function ProcessingOrchestrator({ appState, setAppState }: ProcessingOrchestratorProps) {
  const [showCompletion, setShowCompletion] = useState(false);

  useEffect(() => {
    // Automated timeline progression
    const timings: Record<string, number> = {
      MISSION_READY: 2000,
      AI_INITIALIZING: 3000,
      UNDERSTANDING_ROLE: 4000,
      BUILDING_INTELLIGENCE: 5000,
      GENERATING_RESULTS: 4000,
    };

    let timeoutId: NodeJS.Timeout;

    if (appState !== "COMMAND_CENTER") {
      const delay = timings[appState];
      if (delay) {
        timeoutId = setTimeout(() => {
          switch (appState) {
            case "MISSION_READY": setAppState("AI_INITIALIZING"); break;
            case "AI_INITIALIZING": setAppState("UNDERSTANDING_ROLE"); break;
            case "UNDERSTANDING_ROLE": setAppState("BUILDING_INTELLIGENCE"); break;
            case "BUILDING_INTELLIGENCE": setAppState("GENERATING_RESULTS"); break;
            case "GENERATING_RESULTS": setShowCompletion(true); break;
          }
        }, delay);
      }
    }

    return () => clearTimeout(timeoutId);
  }, [appState, setAppState]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#030712]">
      {/* 3D Background */}
      <KnowledgeGraph appState={appState} />

      {/* Orchestrated UI Layers */}
      <AICommandRibbon appState={appState} />
      
      <div className="absolute inset-0 pt-20 pointer-events-none">
        <div className="container mx-auto h-full relative">
          {/* Header Title */}
          <div className="absolute top-0 inset-x-0 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl md:text-3xl font-bold text-white mb-2"
            >
              RecruitGPT is understanding your hiring request
              <motion.span 
                animate={{ opacity: [1, 0] }} 
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block w-3 h-6 bg-electric-blue ml-2 align-middle"
              />
            </motion.h1>
            <p className="text-white/50 text-sm max-w-xl mx-auto">
              Analyzing thousands of data points using Large Language Models, Semantic Search, Vector Intelligence, and Multi-Agent AI.
            </p>
          </div>

          <AIMissionTimeline appState={appState} />
          <ReasoningConsole appState={appState} />
          <ConfidenceMeter appState={appState} />
          <MultiAgentGrid />
          <PerformanceMonitor />
        </div>
      </div>

      {/* Climax Sequence */}
      <AnimatePresence>
        {showCompletion && (
          <CompletionSequence onComplete={() => setAppState("JOB_UNDERSTANDING")} />
        )}
      </AnimatePresence>
    </div>
  );
}
