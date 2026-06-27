"use client";
import { motion } from "framer-motion";
import { AppState } from "@/app/page";

const timelineSteps = [
  { state: "MISSION_READY", label: "Mission Started" },
  { state: "AI_INITIALIZING", label: "AI Core Initialized" },
  { state: "UNDERSTANDING_ROLE", label: "Mission Understood" },
  { state: "BUILDING_INTELLIGENCE", label: "Knowledge Acquired" },
  { state: "GENERATING_RESULTS", label: "Reasoning Complete" },
];

export function AIMissionTimeline({ appState }: { appState: AppState }) {
  const currentIndex = timelineSteps.findIndex(s => s.state === appState);
  
  return (
    <div className="absolute left-8 top-1/2 -translate-y-1/2 w-64 z-40 hidden lg:block">
      <div className="relative">
        <div className="absolute left-[7px] top-4 bottom-4 w-px bg-white/10" />
        <div className="flex flex-col gap-8">
          {timelineSteps.map((step, index) => {
            const isActive = index === currentIndex;
            const isComplete = index < currentIndex;
            
            return (
              <div key={step.state} className="flex items-center gap-4 relative">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center bg-[#030712] z-10 transition-colors duration-500
                  ${isActive ? "border-electric-blue" : isComplete ? "border-cyan bg-cyan/20" : "border-white/20"}
                `}>
                  {isActive && <motion.div layoutId="active-indicator" className="w-1.5 h-1.5 rounded-full bg-electric-blue animate-ping" />}
                  {isComplete && <div className="w-1.5 h-1.5 rounded-full bg-cyan" />}
                </div>
                <div className={`text-sm font-medium transition-colors duration-500
                  ${isActive ? "text-white drop-shadow-[0_0_8px_rgba(0,112,243,0.8)]" : isComplete ? "text-white/80" : "text-white/30"}
                `}>
                  {step.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
