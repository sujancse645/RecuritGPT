"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { UploadArea } from "@/components/sections/UploadArea";
import { ImportSection } from "@/components/sections/ImportSection";
import { Statistics } from "@/components/sections/Statistics";
import { AICapabilities } from "@/components/sections/AICapabilities";
import { InteractiveDemo } from "@/components/sections/InteractiveDemo";
import { NeuralNetworkBackground } from "@/components/3d/NeuralNetwork";
import { FloatingAIAssistant } from "@/components/ui/FloatingAIAssistant";
import { ProcessingOrchestrator } from "@/components/processing/ProcessingOrchestrator";
import { JobUnderstandingEngine } from "@/components/sections/JobUnderstandingEngine";
import { CommandCenter } from "@/components/dashboard/CommandCenter";

export type AppState = 
  | "LANDING"
  | "MISSION_READY"
  | "AI_INITIALIZING"
  | "UNDERSTANDING_ROLE"
  | "BUILDING_INTELLIGENCE"
  | "GENERATING_RESULTS"
  | "JOB_UNDERSTANDING"
  | "COMMAND_CENTER";

export default function Home() {
  const [appState, setAppState] = useState<AppState>("LANDING");

  const startMission = () => {
    setAppState("MISSION_READY");
    // Shortly after, begin AI initialization
    setTimeout(() => {
      setAppState("AI_INITIALIZING");
    }, 1000);
  };

  return (
    <main className="relative min-h-screen bg-transparent selection:bg-electric-blue/30 selection:text-white overflow-hidden">
      <AnimatePresence mode="wait">
        {appState === "LANDING" ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="relative z-10"
          >
            <NeuralNetworkBackground />
            <Navbar onSignIn={() => setAppState("COMMAND_CENTER")} />
            
            <div className="relative z-10">
              <Hero onStart={startMission} />
              <UploadArea onStart={startMission} />
              <div id="technology"><ImportSection /></div>
              <div id="features"><Statistics /></div>
              <div id="ai-engine"><AICapabilities /></div>
              <div id="architecture"><InteractiveDemo /></div>
            </div>

            <Footer />
            <FloatingAIAssistant />
          </motion.div>
        ) : appState === "JOB_UNDERSTANDING" ? (
          <motion.div
            key="job_understanding"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-[#030712]"
          >
            <JobUnderstandingEngine onComplete={() => setAppState("COMMAND_CENTER")} />
          </motion.div>
        ) : appState === "COMMAND_CENTER" ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-[#030712]"
          >
            <CommandCenter />
          </motion.div>
        ) : (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="fixed inset-0 z-50 bg-[#030712]"
          >
            <ProcessingOrchestrator appState={appState} setAppState={setAppState} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}


